using System.Text.Json;
using healthEase_backend.Exceptions.Fhir;
using healthEase_backend.Filter.Auth;
using healthEase_backend.Model;
using healthEase_backend.Model.Enum;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Fhir;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Utils;
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IAuthorizationService = healthEase_backend.Model.Interfaces.Auth.IAuthorizationService;

namespace healthEase_backend.Controllers;

/// <summary>
/// Controller for managing FHIR resources.
/// </summary>
[ServiceFilter(typeof(UserClaimsFilter))]
[ApiController]
[Route("/fhir")]
[Authorize]
public class FhirResourceController(
    IFhirResourceRepository fhirResourceRepository,
    IFhirService fhirService,
    IFhirResourceService fhirResourceService,
    IAuthorizationService authorizationService,
    IAllowedResourcesService allowedResourcesService) : ControllerBase
{
    private readonly HashSet<string> _allowedResourceTypes = allowedResourcesService.AllowedResourceTypes;

    /// <summary>
    /// Adds a new FHIR resource.
    /// </summary>
    /// <param name="resourceType">The type of the FHIR resource.</param>
    /// <param name="resourceJson">The JSON representation of the FHIR resource.</param>
    /// <returns>The added FHIR resource.</returns>
    [HttpPost("{resourceType}")]
    [ProducesResponseType(typeof(string), 200)]
    [ProducesResponseType(typeof(string), 400)]
    [ProducesResponseType(typeof(string), 401)]
    public IActionResult Add(string resourceType, [FromBody] JsonElement resourceJson)
    {
        FhirUtils.ValidateResourceType(resourceType, _allowedResourceTypes);

        if (!authorizationService.AdminAccess() && !authorizationService.ClientAccess(resourceType, Policy.Write))
        {
            return Unauthorized("You are not authorized to perform this action.");
        }

        try
        {
            var jsonString = resourceJson.GetRawText();
            var parser = new FhirJsonParser();
            var resource = parser.Parse<Resource>(jsonString);

            fhirResourceService.ValidateResourceFields(resource);

            if (resource == null || resourceType != resource.TypeName)
            {
                return BadRequest("Invalid JSON format or resource type mismatch.");
            }

            resource.Id = Guid.NewGuid().ToString();
            resource.Meta = new Meta { LastUpdated = DateTimeOffset.UtcNow };

            var fhirResource = new FhirResource(resource.Id, resourceType, resource.ToJson());

            if (resourceType == "Appointment")
            {
                fhirService.ReserveBookingSlot((Appointment)resource);
            }

            fhirResourceRepository.Add(fhirResource);

            if (resourceType == "PractitionerRole")
            {
                fhirService.CreateSchedulesAndSlots((PractitionerRole)resource);
            }

            var jsonSerializer = new FhirJsonSerializer();
            var serializedResource = jsonSerializer.SerializeToString(resource);

            return Content(serializedResource, "application/fhir+json");
        }
        catch (DuplicateTelecomException e)
        {
            return Conflict(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest($"Error parsing FHIR resource: {e.Message}");
        }
    }

    /// <summary>
    /// Updates an existing FHIR resource.
    /// </summary>
    /// <param name="resourceType">The type of the FHIR resource.</param>
    /// <param name="id">The ID of the FHIR resource.</param>
    /// <param name="resourceJson">The JSON representation of the FHIR resource.</param>
    /// <returns>The updated FHIR resource.</returns>
    [HttpPut("{resourceType}/{id}")]
    [ProducesResponseType(typeof(FhirResource), 200)]
    [ProducesResponseType(typeof(string), 400)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 404)]
    public IActionResult Update(string resourceType, string id, [FromBody] JsonElement resourceJson)
    {
        FhirUtils.ValidateResourceType(resourceType, _allowedResourceTypes);
        try
        {
            var resource = fhirResourceRepository.GetByResourceType(resourceType, id);
            if (resource == null)
            {
                return NotFound($"No resource of type {resourceType} found with id {id}");
            }

            var jsonString = resourceJson.GetRawText();
            var parser = new FhirJsonParser();
            var parsedResource = parser.Parse<Resource>(jsonString);

            fhirResourceService.ValidateResourceFields(parsedResource);

            if (parsedResource == null || parsedResource.Id != id)
            {
                return BadRequest("Invalid JSON format or ID mismatch.");
            }

            if (!authorizationService.ResourceAccess(parsedResource.Id))
            {
                return Unauthorized("You are not authorized to perform this action.");
            }

            parsedResource.Meta = new Meta { LastUpdated = DateTimeOffset.UtcNow };

            var fhirResource = new FhirResource(id, resourceType, parsedResource.ToJson());

            fhirResourceRepository.Update(fhirResource);

            var jsonSerializer = new FhirJsonSerializer();
            var serializedResource = jsonSerializer.SerializeToString(parsedResource);

            return Content(serializedResource, "application/fhir+json");
        }
        catch (Exception e)
        {
            return BadRequest($"Error updating FHIR resource: {e.Message}");
        }
    }

    /// <summary>
    /// Retrieves FHIR resources by type.
    /// </summary>
    /// <param name="resourceType">The type of the FHIR resource.</param>
    /// <returns>A bundle of FHIR resources.</returns>
    /// <remarks>
    /// This method can receive search parameters from the query string.
    /// </remarks>
    [HttpGet("{resourceType}")]
    [ProducesResponseType(typeof(string), 200)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 404)]
    public IActionResult GetByResourceType(string resourceType)
    {
        if (string.IsNullOrEmpty(resourceType))
        {
            return BadRequest("Resource type cannot be null or empty.");
        }

        var searchParameters = Request.Query.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());

        FhirUtils.ValidateResourceType(resourceType, _allowedResourceTypes);

        var bundle = new Bundle
        {
            Id = Guid.NewGuid().ToString(),
            Type = Bundle.BundleType.Searchset,
            Meta = new Meta { LastUpdated = DateTimeOffset.UtcNow },
            Entry = new List<Bundle.EntryComponent>()
        };

        var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
        var parser = new FhirJsonParser();

        try
        {
            var resources = searchParameters.Count == 0
                ? fhirResourceRepository.GetByResourceType(resourceType)
                : authorizationService.FilterAccess()
                    ? fhirResourceRepository.GetBySearchParameters(resourceType, searchParameters)
                    : new List<FhirResource>();

            foreach (var resource in resources)
            {
                if (searchParameters.Count == 0 && !authorizationService.ResourceAccess(resource.Id) &&
                    !authorizationService.ReferencedResourceAccess(resourceType, resource.Id) &&
                    !authorizationService.PractitionerAccess(resourceType) &&
                    !authorizationService.ClientAccess(resourceType, Policy.Read))
                {
                    continue;
                }

                var parsedResource = parser.Parse<Resource>(resource.ResourceContent);
                bundle.Entry.Add(new Bundle.EntryComponent
                {
                    FullUrl = $"{baseUrl}/{resourceType}/{resource.Id}",
                    Resource = parsedResource,
                    Search = new Bundle.SearchComponent { Mode = Bundle.SearchEntryMode.Match }
                });
            }

            var jsonSerializer = new FhirJsonSerializer();
            var serializedBundle = jsonSerializer.SerializeToString(bundle);

            return Content(serializedBundle, "application/fhir+json");
        }
        catch (SpKeyNotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest($"Error retrieving FHIR resources: {e.Message}");
        }
    }

    /// <summary>
    /// Retrieves a FHIR resource by type and ID.
    /// </summary>
    /// <param name="resourceType">The type of the FHIR resource.</param>
    /// <param name="id">The ID of the FHIR resource.</param>
    /// <returns>The requested FHIR resource.</returns>
    [HttpGet("{resourceType}/{id}")]
    [ProducesResponseType(typeof(Bundle), 200)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 404)]
    public IActionResult GetByResourceType(string resourceType, string id)
    {
        FhirUtils.ValidateResourceType(resourceType, _allowedResourceTypes);

        var resource = fhirResourceRepository.GetByResourceType(resourceType, id);
        if (resource == null)
        {
            return NotFound($"No resource of type {resourceType} found with id {id}");
        }

        if (!authorizationService.ResourceAccess(resource.Id) &&
            !authorizationService.ReferencedResourceAccess(resourceType, resource.Id) &&
            !authorizationService.PractitionerAccess(resourceType) &&
            !authorizationService.ClientAccess(resourceType, Policy.Read))
        {
            return Unauthorized("You are not authorized to view this resource.");
        }

        var parser = new FhirJsonParser();
        var parsedResource = parser.Parse<Resource>(resource.ResourceContent);
        var jsonSerializer = new FhirJsonSerializer();
        var serializedResource = jsonSerializer.SerializeToString(parsedResource);

        return Content(serializedResource, "application/fhir+json");
    }

    /// <summary>
    /// Deletes a FHIR resource by type and ID.
    /// </summary>
    /// <param name="resourceType">The type of the FHIR resource.</param>
    /// <param name="id">The ID of the FHIR resource.</param>
    /// <returns>HTTP status indicating the result of the operation.</returns>
    [HttpDelete("{resourceType}/{id}")]
    [ProducesResponseType(typeof(Bundle), 200)]
    [ProducesResponseType(typeof(string), 400)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 404)]
    public IActionResult Delete(string resourceType, string id)
    {
        FhirUtils.ValidateResourceType(resourceType, _allowedResourceTypes);
        try
        {
            fhirResourceService.ValidateNoReferencesExist(resourceType, id);

            var resource = fhirResourceRepository.GetByResourceType(resourceType, id);
            if (resource == null)
            {
                return NotFound($"No resource of type {resourceType} found with id {id}");
            }

            if (!authorizationService.ResourceAccess(resource.Id))
            {
                return Unauthorized("You are not authorized to delete this resource.");
            }

            if (resourceType == "Appointment")
            {
                var slot = new FhirJsonParser().Parse<Appointment>(resource.ResourceContent);
                fhirService.ReleaseBookingSlot(slot.Id);
            }

            fhirResourceRepository.Delete(resource);

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest($"Error deleting FHIR resource: {e.Message}");
        }
    }

    /// <summary>
    /// Retrieves all FHIR resources.
    /// </summary>
    /// <returns>A list of all FHIR resources.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<FhirResource>), 200)]
    [ProducesResponseType(typeof(string), 401)]
    public IActionResult GetAll()
    {
        if (!authorizationService.AdminAccess())
        {
            return Unauthorized("You are not authorized to perform this action.");
        }

        return Ok(fhirResourceRepository.GetAll());
    }
}
