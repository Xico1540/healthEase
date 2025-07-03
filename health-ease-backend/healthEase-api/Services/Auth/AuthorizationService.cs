using healthEase_backend.Model.Enum;
using healthEase_backend.Model.Interfaces.Auth;
using healthEase_backend.Model.Interfaces.Fhir;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Utils;
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;

namespace healthEase_backend.Services.Auth;

public class AuthorizationService(
    IHttpContextAccessor httpContextAccessor,
    IFhirResourceRepository fhirResourceRepository) : IAuthorizationService
{
    private string? UserId => httpContextAccessor.HttpContext?.Items["CurrentUserId"]?.ToString();
    private Role? UserRole => httpContextAccessor.HttpContext?.Items["CurrentUserRole"] as Role?;

    public bool AdminAccess()
    {
        return UserRole == Role.Admin;
    }

    public bool PractitionerAccess(string resourceType)
    {
        return UserRole == Role.Practitioner && resourceType == "Patient";
    }

    public bool ClientAccess(string resourceType, Policy policy)
    {
        var allowedResources = policy switch
        {
            Policy.Read => new[]
                { "Practitioner", "Schedule", "Slot", "Appointment", "PractitionerRole", "Location", "Organization" },
            Policy.Write => new[]
                { "Practitioner", "Schedule", "Slot", "Appointment", "PractitionerRole", "Location", "Organization" },
            _ => Array.Empty<string>()
        };
        return UserRole == Role.Client && allowedResources.Contains(resourceType);
    }

    public bool ResourceAccess(string resourceId)
    {
        return UserRole == Role.Admin || resourceId == UserId;
    }

    public bool FilterAccess()
    {
        return UserRole is Role.Admin or Role.Client;
    }

    public bool ReferencedResourceAccess(string resourceType, string resourceId)
    {
        return HasUserReference(resourceType, resourceId);
    }

    private bool HasUserReference(string resourceType, string resourceId)
    {
        var resource = fhirResourceRepository.GetByResourceType(resourceType, resourceId);
        if (resource == null) return false;

        var parser = new FhirJsonParser();
        var parsedResource = parser.Parse<Resource>(resource.ResourceContent);

        var references = FhirUtils.ExtractResourceReferences(parsedResource);
        return references.Any(reference =>
            reference.Reference?.Split('/') is { Length: 2 } parts &&
            parts[1] == UserId);
    }
}