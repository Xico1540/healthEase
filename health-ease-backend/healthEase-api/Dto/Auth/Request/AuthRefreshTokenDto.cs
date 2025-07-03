namespace healthEase_backend.Dto.Auth.Request;

/// <summary>
/// Data transfer object for refreshing authentication tokens.
/// </summary>
public class AuthRefreshTokenDto
{
    /// <summary>
    /// Gets or sets the access token.
    /// </summary>
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the refresh token.
    /// </summary>
    public string RefreshToken { get; set; } = string.Empty;
}
