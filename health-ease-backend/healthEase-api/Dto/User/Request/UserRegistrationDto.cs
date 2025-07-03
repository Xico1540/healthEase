using System.ComponentModel.DataAnnotations;
using healthEase_backend.Model.Enum;

namespace healthEase_backend.Dto.User.Request;

/// <summary>
/// Data transfer object for user registration.
/// </summary>
public class UserRegistrationDto
{
    /// <summary>
    /// Gets or sets the ID of the user.
    /// </summary>
    [MaxLength(50)] 
    public string? Id { get; set; }
    
    /// <summary>
    /// Gets or sets the email address of the user.
    /// </summary>
    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the password of the user.
    /// </summary>
    public string Password { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the role of the user.
    /// </summary>
    [Required] 
    public Role Role { get; set; }
}
