using Hl7.Fhir.Model;

namespace healthEase_backend.Model.Interfaces.Fhir;

/// <summary>
/// Interface for FHIR resource service to validate FHIR resources.
/// </summary>
public interface IFhirResourceService
{
    /// <summary>
    /// Validates that no references exist for a given resource type and ID.
    /// </summary>
    /// <param name="resourceType">The type of the resource.</param>
    /// <param name="resourceId">The ID of the resource.</param>
    void ValidateNoReferencesExist(string resourceType, string resourceId);
    
    /// <summary>
    /// Validates the fields of a given FHIR resource.
    /// </summary>
    /// <param name="resource">The FHIR resource to validate.</param>
    void ValidateResourceFields(Resource resource);
}
