using System.Security.Claims;
using healthEase_backend.Model;
using healthEase_backend.Model.Enum;
using healthEase_backend.Model.Interfaces.Auth;

namespace healthEase_backend.Services.Auth;

public class AuthService : IAuthService
{
    public (Role UserRole, string FhirResourceId) GetUserClaims(ClaimsPrincipal user)
    {
        var roleClaim = user.Claims.FirstOrDefault(c => c.Type == UserClaims.UserRole);
        if (roleClaim == null)
        {
            throw new UnauthorizedAccessException("Role claim not found.");
        }

        var resourceIdClaim = user.Claims.FirstOrDefault(c => c.Type == UserClaims.FhirResourceId);
        if (resourceIdClaim == null)
        {
            throw new UnauthorizedAccessException("FHIR resource ID claim not found.");
        }

        var userRole = Enum.Parse<Role>(roleClaim.Value);

        return (userRole, resourceIdClaim.Value);
    }
}
