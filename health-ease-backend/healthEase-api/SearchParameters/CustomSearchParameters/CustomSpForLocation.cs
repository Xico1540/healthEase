using System.Text.Json;
using healthEase_backend.Infrastructure;
using healthEase_backend.Model;
using healthEase_backend.Utils;
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;

namespace healthEase_backend.SearchParameters.CustomSearchParameters;

/// <summary>
/// Provides custom search parameters for locations.
/// </summary>
public static class CustomSpForLocation
{
    /// <summary>
    /// Filters locations by practitioner via practitioner role.
    /// </summary>
    /// <param name="practitionerId">The ID of the practitioner.</param>
    /// <param name="context">The database context.</param>
    /// <returns>An enumerable of FHIR resources representing the filtered locations.</returns>
    /// <exception cref="Exception">Thrown when no practitioner, practitioner role, or location is found.</exception>
    public static IEnumerable<FhirResource> FilterLocationByPractitionerViaPractitionerRole(string practitionerId,
        ConnectionContext context)
    {
        try
        {
            var practitionerResource = context.FhirResources
                .FirstOrDefault(r => r.ResourceType == "Practitioner" && r.Id == practitionerId);
            if (practitionerResource == null)
            {
                throw new Exception($"No Practitioner found with id {practitionerId}");
            }

            var practitionerReference = $"Practitioner/{practitionerId}";

            var practitionerRoleResources = context.FhirResources
                .Where(r => r.ResourceType == "PractitionerRole")
                .ToList();

            var practitionerRoleResource = practitionerRoleResources
                .FirstOrDefault(r => JsonDocument.Parse(r.ResourceContent).RootElement
                    .GetProperty("practitioner").GetProperty("reference").GetString() == practitionerReference);

            if (practitionerRoleResource == null)
            {
                throw new Exception($"No PractitionerRole found for Practitioner with id {practitionerId}");
            }

            var practitionerRole =
                new FhirJsonParser().Parse<PractitionerRole>(practitionerRoleResource.ResourceContent);
            var locationReference = practitionerRole.Location.FirstOrDefault()?.Reference;
            if (locationReference == null)
            {
                throw new Exception($"No Location found for PractitionerRole with id {practitionerRole.Id}");
            }

            var locationId = FhirUtils.ExtractIdFromReference(locationReference);
            var locationResource = context.FhirResources
                .FirstOrDefault(r => r.ResourceType == "Location" && r.Id == locationId);
            if (locationResource == null)
            {
                throw new Exception($"No Location found with id {locationId}");
            }

            return new List<FhirResource> { locationResource };
        }
        catch (Exception e)
        {
            throw new Exception($"Error retrieving Location with details: {e.Message}");
        }
    }
}
