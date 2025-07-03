using System.ComponentModel.DataAnnotations;

namespace healthEase_backend.Dto.User.Request;

/// <summary>
/// Data transfer object for updating a user's email address.
/// </summary>
public class UserUpdateEmailDto
{
    /// <summary>
    /// Gets or sets the old email address of the user.
    /// </summary>
    [Required]
    public string OldEmail { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the new email address of the user.
    /// </summary>
    [Required]
    [EmailAddress]
    public string NewEmail { get; set; } = string.Empty;
}
