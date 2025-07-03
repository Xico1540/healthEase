using System.ComponentModel.DataAnnotations;

namespace healthEase_backend.Dto.User.Request;

/// <summary>
/// Data transfer object for updating a user's password.
/// </summary>
public class UpdatePasswordDto
{
    /// <summary>
    /// Gets or sets the email address of the user.
    /// </summary>
    [Required]
    public string UserEmail { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the current password of the user.
    /// </summary>
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the new password of the user.
    /// </summary>
    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string NewPassword { get; set; } = string.Empty;
}
