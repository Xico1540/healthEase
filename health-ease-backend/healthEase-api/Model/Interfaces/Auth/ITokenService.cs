using System.Security.Claims;
using healthEase_backend.Model.Enum;

namespace healthEase_backend.Model.Interfaces.Auth;

/// <summary>
/// Interface for token service to manage JWT tokens.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Generates an access token for a user.
    /// </summary>
    /// <param name="userId">The ID of the user.</param>
    /// <param name="role">The role of the user.</param>
    /// <returns>The generated access token.</returns>
    string GenerateAccessToken(string userId, Role role);

    /// <summary>
    /// Generates a refresh token.
    /// </summary>
    /// <returns>The generated refresh token.</returns>
    string GenerateRefreshToken();

    /// <summary>
    /// Gets the principal from an expired token.
    /// </summary>
    /// <param name="token">The expired token.</param>
    /// <returns>The claims principal extracted from the token.</returns>
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
