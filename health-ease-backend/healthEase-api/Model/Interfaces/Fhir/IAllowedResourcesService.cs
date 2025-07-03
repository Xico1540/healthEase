namespace healthEase_backend.Model.Interfaces.Fhir;

/// <summary>
/// Interface for a service that provides allowed resource types.
/// </summary>
public interface IAllowedResourcesService
{
    /// <summary>
    /// Gets the set of allowed resource types.
    /// </summary>
    HashSet<string> AllowedResourceTypes { get; }
}
