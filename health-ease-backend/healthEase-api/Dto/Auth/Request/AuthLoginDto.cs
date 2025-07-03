using System.ComponentModel.DataAnnotations;

namespace healthEase_backend.Dto.Auth.Request;

/// <summary>
/// Data transfer object for user login.
/// </summary>
public class AuthLoginDto
{
    /// <summary>
    /// Gets or sets the email address of the user.
    /// </summary>
    [Required]
    [EmailAddress(ErrorMessage = "The Email field is not a valid e-mail address.")]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the password of the user.
    /// </summary>
    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; } = string.Empty;
}
