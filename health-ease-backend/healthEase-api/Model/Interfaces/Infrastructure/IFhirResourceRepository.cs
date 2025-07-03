namespace healthEase_backend.Model.Interfaces.Infrastructure;

/// <summary>
/// Interface for FHIR resource repository to manage FHIR resources.
/// </summary>
public interface IFhirResourceRepository
{
    /// <summary>
    /// Adds a new FHIR resource.
    /// </summary>
    /// <param name="fhirResource">The FHIR resource to add.</param>
    void Add(FhirResource fhirResource);

    /// <summary>
    /// Updates an existing FHIR resource.
    /// </summary>
    /// <param name="fhirResource">The FHIR resource to update.</param>
    void Update(FhirResource fhirResource);

    /// <summary>
    /// Deletes a FHIR resource.
    /// </summary>
    /// <param name="fhirResource">The FHIR resource to delete.</param>
    void Delete(FhirResource fhirResource);

    /// <summary>
    /// Gets all FHIR resources.
    /// </summary>
    /// <returns>A list of all FHIR resources.</returns>
    List<FhirResource> GetAll();

    /// <summary>
    /// Gets FHIR resources by resource type.
    /// </summary>
    /// <param name="resourceType">The type of the resource.</param>
    /// <returns>A list of FHIR resources of the specified type.</returns>
    List<FhirResource> GetByResourceType(string resourceType);

    /// <summary>
    /// Gets a FHIR resource by resource type and ID.
    /// </summary>
    /// <param name="resourceType">The type of the resource.</param>
    /// <param name="id">The ID of the resource.</param>
    /// <returns>The FHIR resource if found, otherwise null.</returns>
    FhirResource? GetByResourceType(string resourceType, string id);

    /// <summary>
    /// Gets FHIR resources by search parameters.
    /// </summary>
    /// <param name="resourceType">The type of the resource.</param>
    /// <param name="searchParameters">The search parameters as key-value pairs.</param>
    /// <returns>An enumerable of FHIR resources matching the search parameters.</returns>
    IEnumerable<FhirResource> GetBySearchParameters(string resourceType, Dictionary<string, string> searchParameters);
}
