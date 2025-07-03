namespace healthEase_backend.Dto.Auth.Response;

/// <summary>
/// Data transfer object for authentication response.
/// </summary>
public class AuthResponseDto
{
    /// <summary>
    /// Gets the access token.
    /// </summary>
    public string AccessToken { get; init; } = string.Empty;

    /// <summary>
    /// Gets the refresh token.
    /// </summary>
    public string RefreshToken { get; init; } = string.Empty;
}
