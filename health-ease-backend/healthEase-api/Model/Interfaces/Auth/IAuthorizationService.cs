using healthEase_backend.Model.Enum;

namespace healthEase_backend.Model.Interfaces.Auth;

/// <summary>
/// Interface for authorization service to check access permissions.
/// </summary>
public interface IAuthorizationService
{
    /// <summary>
    /// Checks if the current user has admin access.
    /// </summary>
    /// <returns>True if the user has admin access, otherwise false.</returns>
    bool AdminAccess();

    /// <summary>
    /// Checks if the current user has access to a specific resource.
    /// </summary>
    /// <param name="resourceId">The ID of the resource.</param>
    /// <returns>True if the user has access to the resource, otherwise false.</returns>
    bool ResourceAccess(string resourceId);

    /// <summary>
    /// Checks if the current user has access to apply filters.
    /// </summary>
    /// <returns>True if the user has filter access, otherwise false.</returns>
    bool FilterAccess();

    /// <summary>
    /// Checks if the current user has access to a referenced resource.
    /// </summary>
    /// <param name="resourceType">The type of the resource.</param>
    /// <param name="resourceId">The ID of the resource.</param>
    /// <returns>True if the user has access to the referenced resource, otherwise false.</returns>
    bool ReferencedResourceAccess(string resourceType, string resourceId);

    /// <summary>
    /// Checks if the current user has practitioner access to a specific resource type.
    /// </summary>
    /// <param name="resourceType">The type of the resource.</param>
    /// <returns>True if the user has practitioner access, otherwise false.</returns>
    bool PractitionerAccess(string resourceType);

    /// <summary>
    /// Checks if the current user has client access to a specific resource type with a given policy.
    /// </summary>
    /// <param name="resourceType">The type of the resource.</param>
    /// <param name="policy">The policy to check against.</param>
    /// <returns>True if the user has client access with the given policy, otherwise false.</returns>
    bool ClientAccess(string resourceType, Policy policy);
}
