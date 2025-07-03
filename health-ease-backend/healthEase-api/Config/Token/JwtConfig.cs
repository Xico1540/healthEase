namespace healthEase_backend.Config.Token;

/// <summary>
/// Configuration settings for JWT (JSON Web Token).
/// </summary>
public class JwtConfig
{
    /// <summary>
    /// Gets or sets the secret key used for signing the JWT.
    /// </summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the issuer of the JWT.
    /// </summary>
    public string Issuer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the audience for the JWT.
    /// </summary>
    public string Audience { get; set; } = string.Empty;
}
