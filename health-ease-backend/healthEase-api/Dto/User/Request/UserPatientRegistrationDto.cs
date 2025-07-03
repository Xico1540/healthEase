using System;
using System.ComponentModel.DataAnnotations;
using healthEase_backend.Model.Enum;

namespace healthEase_backend.Dto.User.Request;

/// <summary>
/// Data transfer object for registering a patient user.
/// </summary>
public class UserPatientRegistrationDto
{
    /// <summary>
    /// Gets or sets the first name of the patient.
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the last name of the patient.
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the gender of the patient.
    /// </summary>
    [Required]
    public Gender Gender { get; set; }

    /// <summary>
    /// Gets or sets the birth date of the patient.
    /// </summary>
    [Required] 
    public DateTime BirthDate { get; set; }
    
    /// <summary>
    /// Gets or sets the health ID of the patient.
    /// </summary>
    [Required]
    public int HealthId { get; set; } = int.MaxValue;
    
    /// <summary>
    /// Gets or sets the email address of the patient.
    /// </summary>
    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the phone number of the patient.
    /// </summary>
    [Required]
    [Phone]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the address of the patient.
    /// </summary>
    [Required]
    public Address Address { get; set;} = new Address();

    /// <summary>
    /// Gets or sets the password of the patient.
    /// </summary>
    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 8 characters long.")]
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Represents an address.
/// </summary>
public class Address {
    /// <summary>
    /// Gets or sets the street of the address.
    /// </summary>
    public string Street { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the city of the address.
    /// </summary>
    public string City { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the postal code of the address.
    /// </summary>
    public string PostalCode { get; set; } = string.Empty;
}
