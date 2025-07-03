using healthEase_backend.Dto.User.Request;
using healthEase_backend.Filter.Auth;
using healthEase_backend.Model;
using healthEase_backend.Model.Enum;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Fhir;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Utils;
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace healthEase_backend.Controllers;

/// <summary>
/// Controller for managing user-related operations.
/// </summary>
[ApiController]
[Route("users")]
public class UserController(
    IUserRepository userRepository,
    IFhirService fhirService,
    IFhirResourceRepository fhirResourceRepository,
    IEmailService emailService) : ControllerBase
{
    private string? UserId => HttpContext.Items["CurrentUserId"]?.ToString();
    private Role? UserRole => HttpContext.Items["CurrentUserRole"] as Role?;

    /// <summary>
    /// Registers a new user.
    /// </summary>
    /// <param name="userDto">The user registration data transfer object.</param>
    /// <returns>The registered user.</returns>
    [HttpPost("register")]
    [ProducesResponseType(typeof(User), 200)]
    [ProducesResponseType(typeof(string), 400)]
    [ProducesResponseType(typeof(string), 409)]
    [ProducesResponseType(typeof(string), 404)]
    public IActionResult Register([FromBody] UserRegistrationDto userDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (userDto.Role == Role.Practitioner)
        {
            if (userDto.Id == null)
            {
                return BadRequest("Practitioner ID is required.");
            }

            var existingPractitioner = fhirResourceRepository.GetByResourceType("Practitioner", userDto.Id);
            if (existingPractitioner == null)
            {
                return NotFound("Practitioner resource not found. " +
                                "Please create a Practitioner resource before registering a practitioner user.");
            }
            
            var parser = new FhirJsonParser();
            var parsedResource = parser.Parse<Practitioner>(existingPractitioner.ResourceContent);
            userDto.Password = GeneralUtils.GenerateRandomPassword();
            emailService.SendPasswordEmail(userDto.Email, userDto.Password, parsedResource.Name.First().GivenElement[0].Value);
        }

        if (UserWithEmailExists(userDto.Email))
        {
            return Conflict("User with that email already exists.");
        }

        var user = CreateUser(userDto.Id ?? Guid.NewGuid().ToString(), userDto.Email, userDto.Role, userDto.Password);
        userRepository.Add(user);

        return Ok(user);
    }

    /// <summary>
    /// Registers a new patient user.
    /// </summary>
    /// <param name="userPatientDto">The patient user registration data transfer object.</param>
    /// <returns>The registered patient user.</returns>
    [HttpPost("register/patient")]
    [ProducesResponseType(typeof(User), 200)]
    [ProducesResponseType(typeof(string), 409)]
    [ProducesResponseType(typeof(string), 400)]
    public IActionResult RegisterPatientUser([FromBody] UserPatientRegistrationDto userPatientDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (UserWithEmailExists(userPatientDto.Email))
        {
            return Conflict("User with that email already exists.");
        }

        var resourceId = Guid.NewGuid().ToString();

        fhirService.CreateFhirPatientResource(userPatientDto, resourceId);

        var user = CreateUser(resourceId, userPatientDto.Email, Role.Patient, userPatientDto.Password);
        userRepository.Add(user);

        return Ok(user);
    }

    /// <summary>
    /// Updates the email of an existing user.
    /// </summary>
    /// <param name="emailDto">The email update data transfer object.</param>
    /// <returns>HTTP status indicating the result of the operation.</returns>
    [HttpPut("update/email")]
    [ProducesResponseType(typeof(User), 200)]
    [ProducesResponseType(typeof(string), 409)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 404)]
    [ProducesResponseType(typeof(string), 400)]
    [ServiceFilter(typeof(UserClaimsFilter))]
    [Authorize]
    public IActionResult UpdateEmail([FromBody] UserUpdateEmailDto emailDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = userRepository.GetByEmail(emailDto.OldEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        if (UserRole != Role.Admin && user.Id != UserId)
        {
            return Unauthorized("You do not have permission to update this user's email.");
        }

        if (UserWithEmailExists(emailDto.NewEmail))
        {
            return Conflict("Email is already in use.");
        }

        user.Email = emailDto.NewEmail;
        userRepository.Update(user);

        return Ok("Email updated successfully.");
    }

    /// <summary>
    /// Updates the password of an existing user.
    /// </summary>
    /// <param name="passwordDto">The password update data transfer object.</param>
    /// <returns>HTTP status indicating the result of the operation.</returns>
    [HttpPut("update/password")]
    [ProducesResponseType(typeof(User), 200)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 404)]
    [ProducesResponseType(typeof(string), 400)]
    [ProducesResponseType(typeof(string), 422)]
    [ServiceFilter(typeof(UserClaimsFilter))]
    [Authorize]
    public IActionResult UpdatePassword([FromBody] UpdatePasswordDto passwordDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = userRepository.GetByEmail(passwordDto.UserEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        if (!user.VerifyPassword(passwordDto.CurrentPassword))
        {
            return UnprocessableEntity("Invalid current password.");
        }

        if (UserRole != Role.Admin && user.Id != UserId)
        {
            return Unauthorized("You do not have permission to update this user's password.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(passwordDto.NewPassword);
        userRepository.Update(user);

        return Ok("Password updated successfully.");
    }

    /// <summary>
    /// Deletes a user by email.
    /// </summary>
    /// <param name="email">The email of the user to delete.</param>
    /// <returns>HTTP status indicating the result of the operation.</returns>
    [HttpDelete("delete/email={email}")]
    [ProducesResponseType(typeof(User), 200)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 404)]
    [ProducesResponseType(typeof(string), 400)]
    [ServiceFilter(typeof(UserClaimsFilter))]
    [Authorize]
    public IActionResult DeleteUserByEmail(string email)
    {
        var user = userRepository.GetByEmail(email);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        if (UserRole != Role.Admin && user.Id != UserId)
        {
            return Unauthorized("You do not have permission to delete this user.");
        }

        if (user.Role == Role.Patient)
        {
            var fhirResource = fhirResourceRepository.GetByResourceType("Patient", user.Id);
            if (fhirResource != null)
            {
                fhirResourceRepository.Delete(fhirResource);
            }
        }

        userRepository.Delete(user);

        return Ok("User deleted successfully.");
    }

    /// <summary>
    /// Retrieves all users.
    /// </summary>
    /// <returns>A list of all users.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<User>), 200)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 404)]
    [ProducesResponseType(typeof(string), 400)]
    [ServiceFilter(typeof(UserClaimsFilter))]
    [Authorize]
    public IActionResult GetAllUsers()
    {
        if (UserRole != Role.Admin)
        {
            return Unauthorized("You do not have permission to view all users.");
        }

        var users = userRepository.GetAll();
        if (users.Count == 0)
        {
            return NotFound("No users found.");
        }

        return Ok(users);
    }

    private bool UserWithEmailExists(string email)
    {
        return userRepository.GetAll().Any(u => u.Email == email);
    }

    private static User CreateUser(string resourceId, string email, Role role, string password)
    {
        return new User
        {
            Id = resourceId,
            Email = email,
            Role = role,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
        };
    }
}
