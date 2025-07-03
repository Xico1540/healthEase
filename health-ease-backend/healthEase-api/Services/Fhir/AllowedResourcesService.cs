using healthEase_backend.Model.Interfaces.Fhir;

namespace healthEase_backend.Services.Fhir;

public class AllowedResourcesService : IAllowedResourcesService
{
    public HashSet<string> AllowedResourceTypes { get; }

    public AllowedResourcesService(IConfiguration configuration)
    {
        AllowedResourceTypes =
            configuration["AllowedResourceTypes"]?.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(t => t.Trim()).ToHashSet(StringComparer.OrdinalIgnoreCase) ??
            new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    }
}
