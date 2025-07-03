using healthEase_backend.Exceptions.Fhir;
using healthEase_backend.Model.Interfaces.Fhir;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Utils;
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;

namespace healthEase_backend.Services.Fhir;

public class FhirResourceService(IFhirResourceRepository fhirResourceRepository): IFhirResourceService
{
    
    public void ValidateReferences(Resource resource)
    {
        var references = FhirUtils.ExtractResourceReferences(resource);
        
        foreach (var reference in references)
        {
            if (reference.Reference?.Split('/') is not { Length: 2 } parts)
            {
                throw new ArgumentException($"Invalid reference format: {reference.Reference}");
            }
            
            var resourceType = parts[0];
            var resourceId = parts[1];
            var referencedResource = fhirResourceRepository.GetByResourceType(resourceType, resourceId);
            
            if (referencedResource == null)
            {
                throw new KeyNotFoundException($"Referenced resource {resourceType}/{resourceId} not found.");
            }
        }
    }
    
    public void ValidateNoReferencesExist(string resourceType, string resourceId)
    {
        var allFhirResources = fhirResourceRepository.GetAll();
        var parser = new FhirJsonParser();

        foreach (var fhirResource in allFhirResources)
        {
            try
            {
                var resource = parser.Parse<Resource>(fhirResource.ResourceContent);
                var references = FhirUtils.ExtractResourceReferences(resource);
                if (references.Any(reference =>
                        reference.Reference?.Split('/') is { Length: 2 } parts && 
                        parts[0] == resourceType && 
                        parts[1] == resourceId))
                {
                    throw new InvalidOperationException($"The resource {resourceType}/{resourceId} is referenced by another resource.");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error processing resource {fhirResource.Id}: {ex.Message}");
            }
        }
    }
    
    public void ValidateUniqueTelecoms(Resource resource)
    {
        var telecoms = FhirUtils.ExtractTelecoms(resource);
        foreach (var telecom in telecoms)
        {
            if (telecom.System is not (ContactPoint.ContactPointSystem.Email or ContactPoint.ContactPointSystem.Phone))
            {
                continue;
            }
            if (CheckDuplicateTelecom(telecom, resource))
            {
                throw new DuplicateTelecomException($"A {telecom.System} value '{telecom.Value}' already exists for other {resource.TypeName} resource.");
            }
        }
    }

    private bool CheckDuplicateTelecom(ContactPoint contactPoint, Resource resource)
    {
        var allResources = fhirResourceRepository.GetAll();
        var parser = new FhirJsonParser();

        return allResources
            .Where(findResource => findResource.Id != resource.Id)
            .Select(fhirResource => parser.Parse<Resource>(fhirResource.ResourceContent))
            .SelectMany(FhirUtils.ExtractTelecoms)
            .Any(t => t.System == contactPoint.System && t.Value == contactPoint.Value);
    }

    public void ValidateResourceFields(Resource resource)
    {
        ValidateReferences(resource);
        ValidateUniqueTelecoms(resource);
    }
    
}
