using System.Security.Claims;
using healthEase_backend.Model.Enum;

namespace healthEase_backend.Model.Interfaces.Auth;

/// <summary>
/// Interface for authentication service to retrieve user claims.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Retrieves the user role and FHIR resource ID from the user's claims.
    /// </summary>
    /// <param name="user">The claims principal representing the user.</param>
    /// <returns>A tuple containing the user role and FHIR resource ID.</returns>
    (Role UserRole, string FhirResourceId) GetUserClaims(ClaimsPrincipal user);
}
