using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using healthEase_backend.Model.Enum;

namespace healthEase_backend.Model;

/// <summary>
/// Represents a user in the system.
/// </summary>
[Table("user")]
public class User
{
    /// <summary>
    /// Gets the ID of the user.
    /// </summary>
    [Key] [MaxLength(50)] public string Id { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets the email of the user.
    /// </summary>
    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the role of the user.
    /// </summary>
    [Required] public Role Role { get; set; } = Role.Patient;

    /// <summary>
    /// Gets or sets the password hash of the user.
    /// </summary>
    [MaxLength(255)]
    [JsonIgnore] public string PasswordHash { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the refresh token of the user.
    /// </summary>
    [JsonIgnore]
    [MaxLength(999)]
    public string? RefreshToken { get; set; } = string.Empty;

    /// <summary>
    /// Verifies the provided password against the stored password hash.
    /// </summary>
    /// <param name="password">The password to verify.</param>
    /// <returns>True if the password is correct, otherwise false.</returns>
    /// <exception cref="InvalidOperationException">Thrown if the password hash is not set.</exception>
    public bool VerifyPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(PasswordHash))
        {
            throw new InvalidOperationException("Password hash is not set.");
        }
        return BCrypt.Net.BCrypt.Verify(password, PasswordHash);
    }
}
