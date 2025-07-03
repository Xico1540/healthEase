using healthEase_backend.Exceptions.Fhir;
using healthEase_backend.Model;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Infrastructure;

namespace healthEase_backend.Infrastructure.FhirResourceRepository;

public class FhirResourceRepository(ConnectionContext context) : IFhirResourceRepository
{
    private readonly GetBySearchParameters _getBySearchParameters = new(context);

    public void Add(FhirResource resource)
    {
        context.FhirResources.Add(resource);
        context.SaveChanges();
    }

    public void Update(FhirResource updatedResource)
    {
        var existingResource = context.FhirResources
            .FirstOrDefault(resource =>
                resource.Id == updatedResource.Id && resource.ResourceType == updatedResource.ResourceType);

        if (existingResource != null)
        {
            existingResource.ResourceContent = updatedResource.ResourceContent;
            existingResource.ResourceType = updatedResource.ResourceType;
            context.FhirResources.Update(existingResource);
            context.SaveChanges();
        }
        else
        {
            throw new SpKeyNotFoundException($"Resource with ID {updatedResource.Id} not found.");
        }
    }

    public void Delete(FhirResource resource)
    {
        context.FhirResources.Remove(resource);
        context.SaveChanges();
    }

    public List<FhirResource> GetAll()
    {
        return context.FhirResources.ToList();
    }

    public List<FhirResource> GetByResourceType(string resourceType)
    {
        return context.FhirResources
            .Where(resource => resource.ResourceType == resourceType)
            .ToList();
    }

    public FhirResource? GetByResourceType(string resourceType, string id)
    {
        var resource = context.FhirResources
            .FirstOrDefault(resource => resource.ResourceType == resourceType && resource.Id == id);

        return resource;
    }

    public IEnumerable<FhirResource> GetBySearchParameters(string resourceType,
        Dictionary<string, string> searchParameters)
    {
        return _getBySearchParameters.SearchFhirResources(resourceType, searchParameters);
    }
}
