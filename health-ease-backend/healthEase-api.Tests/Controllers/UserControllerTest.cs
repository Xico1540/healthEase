using System.Collections.Generic;
using healthEase_backend.Controllers;
using healthEase_backend.Dto.User.Request;
using healthEase_backend.Model;
using healthEase_backend.Model.Enum;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Fhir;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Tests.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace healthEase_backend.Tests.Controllers;

[TestClass]
public class UserControllerTest
{
    private Mock<IUserRepository> _userRepositoryMock;

    private Mock<IFhirResourceRepository> _fhirResourceRepositoryMock;

    private Mock<IFhirService> _fhirServiceMock;

    private Mock<IEmailService> _emailServiceMock;

    private UserController _controller;

    [TestInitialize]
    public void Setup()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _fhirServiceMock = new Mock<IFhirService>();
        _fhirResourceRepositoryMock = new Mock<IFhirResourceRepository>();
        _emailServiceMock = new Mock<IEmailService>();

        var httpContextMock = new Mock<HttpContext>();
        httpContextMock.Setup(c => c.Items).Returns(new Dictionary<object, object>());

        _controller = new UserController(_userRepositoryMock.Object, _fhirServiceMock.Object,
            _fhirResourceRepositoryMock.Object, _emailServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = httpContextMock.Object
            }
        };
    }

    [TestMethod]
    public void Register_PatientUser_ShouldReturnSuccess()
    {
        var userDto = new UserRegistrationDto()
        {
            Email = "test@example.com",
            Password = "password",
            Role = Role.Patient
        };

        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<User>());
        _userRepositoryMock.Setup(repo => repo.Add(It.IsAny<User>()));

        var result = _controller.Register(userDto);

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
    }

    [TestMethod]
    public void Register_PatientUser_ShouldReturnBadRequest()
    {
        var userDto = new UserRegistrationDto()
        {
            Email = "",
            Password = "password",
            Role = Role.Patient
        };

        _controller.ModelState.AddModelError("Email", "Email is required");

        var result = _controller.Register(userDto);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
    }

    [TestMethod]
    public void RegisterPatientUser_InvalidModelState_ShouldReturnBadRequest()
    {
        var userPatientDto = new UserPatientRegistrationDto
        {
            Email = "",
            Password = "password",
            FirstName = "John",
            LastName = "Doe"
        };

        _controller.ModelState.AddModelError("Email", "Email is required");

        var result = _controller.RegisterPatientUser(userPatientDto);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
    }

    [TestMethod]
    public void Register_UserWithEmailAlreadyExists_ShouldReturnConflict()
    {
        var userDto = new UserRegistrationDto
        {
            Email = "test@example.com",
            Password = "password",
            Role = Role.Admin
        };

        var existingUsers = new List<User> { new User { Email = "test@example.com" } };
        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(existingUsers);

        var result = _controller.Register(userDto);

        Assert.IsInstanceOfType(result, typeof(ConflictObjectResult));
        var conflictResult = (ConflictObjectResult)result;
        Assert.AreEqual("User with that email already exists.", conflictResult.Value);
    }

    [TestMethod]
    public void Register_PractitionerWithoutId_ShouldReturnBadRequest()
    {
        var userDto = new UserRegistrationDto
        {
            Email = "practitioner@example.com",
            Password = "password",
            Role = Role.Practitioner
        };

        var result = _controller.Register(userDto);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        var badRequestResult = (BadRequestObjectResult)result;
        Assert.AreEqual("Practitioner ID is required.", badRequestResult.Value);
    }

    [TestMethod]
    public void Register_PractitionerWithValidId_ShouldReturnSuccess()
    {
        var userDto = new UserRegistrationDto
        {
            Email = "practitioner@example.com",
            Password = "password",
            Role = Role.Practitioner,
            Id = "valid-practitioner-id"
        };

        const string practitionerJson = """
                                        {
                                            "resourceType": "Practitioner",
                                            "id": "valid-practitioner-id",
                                            "name": [
                                                {
                                                    "given": ["John"],
                                                    "family": "Doe"
                                                }
                                            ]
                                        }
                                        """;

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Practitioner", "valid-practitioner-id"))
            .Returns(new FhirResource("valid-practitioner-id", "Practitioner", practitionerJson));

        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<User>());
        _userRepositoryMock.Setup(repo => repo.Add(It.IsAny<User>()));

        var result = _controller.Register(userDto);

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
    }

    [TestMethod]
    public void Register_PractitionerWithInvalidId_ShouldReturnNotFound()
    {
        var userDto = new UserRegistrationDto
        {
            Email = "practitioner@example.com",
            Password = "password",
            Role = Role.Practitioner,
            Id = "12345"
        };

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Practitioner", "12345"))
            .Returns((FhirResource)null);

        var result = _controller.Register(userDto);

        Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.AreEqual(
            "Practitioner resource not found. Please create a Practitioner resource before registering a practitioner user.",
            notFoundResult.Value);
    }

    [TestMethod]
    public void RegisterPatientUser_ShouldReturnSuccess()
    {
        var userPatientDto = new UserPatientRegistrationDto
        {
            Email = "patient@example.com",
            Password = "password",
            FirstName = "John",
            LastName = "Doe"
        };

        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<User>());
        _fhirServiceMock.Setup(service => service.CreateFhirPatientResource(userPatientDto, It.IsAny<string>()));
        _userRepositoryMock.Setup(repo => repo.Add(It.IsAny<User>()));

        var result = _controller.RegisterPatientUser(userPatientDto);

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
    }

    [TestMethod]
    public void RegisterPatientUser_EmailAlreadyExists_ShouldReturnConflict()
    {
        var userPatientDto = new UserPatientRegistrationDto
        {
            Email = "patient@example.com",
            Password = "password",
            FirstName = "John",
            LastName = "Doe"
        };

        var existingUsers = new List<User> { new User { Email = "patient@example.com" } };
        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(existingUsers);

        var result = _controller.RegisterPatientUser(userPatientDto);

        Assert.IsInstanceOfType(result, typeof(ConflictObjectResult));
        var conflictResult = (ConflictObjectResult)result;
        Assert.AreEqual("User with that email already exists.", conflictResult.Value);
    }

    [TestMethod]
    public void UpdateEmail_AdminUser_ShouldReturnSuccess()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        var emailDto = new UserUpdateEmailDto
        {
            OldEmail = "old@example.com",
            NewEmail = "new@example.com"
        };

        var existingUser = new User { Id = "123456789", Email = "old@example.com" };

        _userRepositoryMock.Setup(repo => repo.GetByEmail(emailDto.OldEmail)).Returns(existingUser);
        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<User>());
        _userRepositoryMock.Setup(repo => repo.Update(It.IsAny<User>()));

        var result = _controller.UpdateEmail(emailDto);

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        Assert.AreEqual("Email updated successfully.", okResult.Value);
    }

    [TestMethod]
    public void UpdateEmail_InvalidModelState_ShouldReturnBadRequest()
    {
        var emailDto = new UserUpdateEmailDto
        {
            OldEmail = "old@",
            NewEmail = "new@.com"
        };
        _controller.ModelState.AddModelError("Email", "Invalid email format");

        var result = _controller.UpdateEmail(emailDto);
        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
    }

    [TestMethod]
    public void UpdateEmail_NonAdminUpdatingOtherUserEmail_ShouldReturnUnauthorized()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        var emailDto = new UserUpdateEmailDto
        {
            OldEmail = "old@example.com",
            NewEmail = "new@example.com"
        };

        var existingUser = new User { Id = "987654321", Email = "old@example.com" };
        _userRepositoryMock.Setup(repo => repo.GetByEmail(emailDto.OldEmail)).Returns(existingUser);

        var result = _controller.UpdateEmail(emailDto);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("You do not have permission to update this user's email.", unauthorizedResult.Value);
    }

    [TestMethod]
    public void UpdateEmail_EmailAlreadyInUse_ShouldReturnConflict()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        var emailDto = new UserUpdateEmailDto
        {
            OldEmail = "old@example.com",
            NewEmail = "new@example.com"
        };

        var existingUser = new User { Id = "123456789", Email = "old@example.com" };
        _userRepositoryMock.Setup(repo => repo.GetByEmail(emailDto.OldEmail)).Returns(existingUser);

        var existingUsers = new List<User> { new User { Email = "new@example.com" } };
        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(existingUsers);

        var result = _controller.UpdateEmail(emailDto);

        Assert.IsInstanceOfType(result, typeof(ConflictObjectResult));
        var conflictResult = (ConflictObjectResult)result;
        Assert.AreEqual("Email is already in use.", conflictResult.Value);
    }

    [TestMethod]
    public void UpdateEmail_UserNotFound_ShouldReturnNotFound()
    {
        var emailDto = new UserUpdateEmailDto
        {
            OldEmail = "nonexistent@example.com",
            NewEmail = "new@example.com"
        };

        _userRepositoryMock.Setup(repo => repo.GetByEmail(emailDto.OldEmail)).Returns((User)null);

        var result = _controller.UpdateEmail(emailDto);

        Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.AreEqual("User not found.", notFoundResult.Value);
    }

    [TestMethod]
    public void UpdateEmail_SameEmail_ShouldReturnSuccessWithoutConflict()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        var emailDto = new UserUpdateEmailDto
        {
            OldEmail = "same@example.com",
            NewEmail = "same@example.com"
        };

        var existingUser = new User { Id = "123456789", Email = "same@example.com" };

        _userRepositoryMock.Setup(repo => repo.GetByEmail(emailDto.OldEmail)).Returns(existingUser);
        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<User>());
        _userRepositoryMock.Setup(repo => repo.Update(It.IsAny<User>()));

        var result = _controller.UpdateEmail(emailDto);

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        Assert.AreEqual("Email updated successfully.", okResult.Value);
    }

    [TestMethod]
    public void UpdatePassword_ValidData_ShouldReturnSuccess()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "user-id", Role.Patient);

        var passwordDto = new UpdatePasswordDto
        {
            UserEmail = "user@example.com",
            CurrentPassword = "oldpassword",
            NewPassword = "newpassword"
        };

        var existingUser = new User
        {
            Id = "user-id", Email = "user@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("oldpassword")
        };
        _userRepositoryMock.Setup(repo => repo.GetByEmail(passwordDto.UserEmail)).Returns(existingUser);
        _userRepositoryMock.Setup(repo => repo.Update(It.IsAny<User>()));

        var result = _controller.UpdatePassword(passwordDto);

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        Assert.AreEqual("Password updated successfully.", okResult.Value);
    }

    [TestMethod]
    public void UpdatePassword_InvalidCurrentPassword_ShouldReturnUnprocessableEntity()
    {
        var passwordDto = new UpdatePasswordDto
        {
            UserEmail = "user@example.com",
            CurrentPassword = "wrongpassword",
            NewPassword = "newpassword"
        };

        var existingUser = new User
        {
            Id = "user-id", Email = "user@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("oldpassword")
        };
        _userRepositoryMock.Setup(repo => repo.GetByEmail(passwordDto.UserEmail)).Returns(existingUser);

        var result = _controller.UpdatePassword(passwordDto);

        Assert.IsInstanceOfType(result, typeof(UnprocessableEntityObjectResult));
        var unprocessableResult = (UnprocessableEntityObjectResult)result;
        Assert.AreEqual("Invalid current password.", unprocessableResult.Value);
    }

    [TestMethod]
    public void UpdatePassword_InvalidModelState_ShouldReturnBadRequest()
    {
        var passwordDto = new UpdatePasswordDto
        {
            UserEmail = "user@example.com",
            CurrentPassword = "oldpassword",
            NewPassword = "newpassword"
        };

        _controller.ModelState.AddModelError("Password", "Password is required");

        var result = _controller.UpdatePassword(passwordDto);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
    }

    [TestMethod]
    public void UpdatePassword_UserNotFound_ShouldReturnNotFound()
    {
        var passwordDto = new UpdatePasswordDto
        {
            UserEmail = "nonexistent@example.com",
            CurrentPassword = "password",
            NewPassword = "newpassword"
        };

        _userRepositoryMock.Setup(repo => repo.GetByEmail(passwordDto.UserEmail)).Returns((User)null);

        var result = _controller.UpdatePassword(passwordDto);

        Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.AreEqual("User not found.", notFoundResult.Value);
    }

    [TestMethod]
    public void UpdatePassword_NonAdminTryingToUpdateAnotherUserPassword_ShouldReturnUnauthorized()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123123123", Role.Patient);

        var passwordDto = new UpdatePasswordDto
        {
            UserEmail = "user@example.com",
            CurrentPassword = "oldpassword",
            NewPassword = "newpassword"
        };

        var existingUser = new User
        {
            Id = "user-id", Email = "user@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("oldpassword")
        };
        _userRepositoryMock.Setup(repo => repo.GetByEmail(passwordDto.UserEmail)).Returns(existingUser);

        var result = _controller.UpdatePassword(passwordDto);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("You do not have permission to update this user's password.", unauthorizedResult.Value);
    }

    [TestMethod]
    public void DeleteUserByEmail_AdminUser_ShouldReturnSuccess()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        var existingUser = new User { Id = "user-id", Email = "user@example.com", Role = Role.Patient };
        _userRepositoryMock.Setup(repo => repo.GetByEmail("user@example.com")).Returns(existingUser);
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Patient", "user-id"))
            .Returns(new FhirResource("user-id", "Patient", "{}"));
        _fhirResourceRepositoryMock.Setup(repo => repo.Delete(It.IsAny<FhirResource>()));
        _userRepositoryMock.Setup(repo => repo.Delete(It.IsAny<User>()));

        var result = _controller.DeleteUserByEmail("user@example.com");

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        Assert.AreEqual("User deleted successfully.", okResult.Value);
    }

    [TestMethod]
    public void DeleteUserByEmail_UserNotFound_ShouldReturnNotFound()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        _userRepositoryMock.Setup(repo => repo.GetByEmail("user@example.com")).Returns((User)null);

        var result = _controller.DeleteUserByEmail("user@example.com");

        Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.AreEqual("User not found.", notFoundResult.Value);
    }

    [TestMethod]
    public void DeleteUserByEmail_NonAdminUser_ShouldReturnUnauthorized()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "non-admin-id", Role.Patient);

        var existingUser = new User { Id = "user-id", Email = "user@example.com", Role = Role.Patient };
        _userRepositoryMock.Setup(repo => repo.GetByEmail("user@example.com")).Returns(existingUser);

        var result = _controller.DeleteUserByEmail("user@example.com");

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("You do not have permission to delete this user.", unauthorizedResult.Value);
    }

    [TestMethod]
    public void GetAllUsers_AdminUser_ShouldReturnUsers()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        var users = new List<User>
        {
            new User { Id = "user1", Email = "user1@example.com" },
            new User { Id = "user2", Email = "user2@example.com" }
        };
        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(users);

        var result = _controller.GetAllUsers();

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        Assert.AreEqual(users, okResult.Value);
    }

    [TestMethod]
    public void GetAllUsers_NoUsersFound_ShouldReturnNotFound()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<User>());

        var result = _controller.GetAllUsers();

        Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.AreEqual("No users found.", notFoundResult.Value);
    }

    [TestMethod]
    public void GetAllUsers_NonAdminUser_ShouldReturnUnauthorized()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "user-id", Role.Patient);

        var result = _controller.GetAllUsers();

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("You do not have permission to view all users.", unauthorizedResult.Value);
    }
}
