using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using healthEase_backend.Dto.User.Request;
using healthEase_backend.Model.Enum;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Dto.User.Request;

[TestClass]
public class UserRegistrationDtoTest
{
    [TestMethod]
    public void UserRegistrationDto_Creation_ShouldAssignCorrectValues()
    {
        const string id = "12345";
        const string email = "user@example.com";
        const string password = "strongPassword";
        const Role role = Role.Admin;

        var userDto = new UserRegistrationDto
        {
            Id = id,
            Email = email,
            Password = password,
            Role = role
        };

        Assert.AreEqual(id, userDto.Id);
        Assert.AreEqual(email, userDto.Email);
        Assert.AreEqual(password, userDto.Password);
        Assert.AreEqual(role, userDto.Role);
    }

    [TestMethod]
    public void UserRegistrationDto_ShouldPassValidation_WhenAllFieldsAreValid()
    {
        var userDto = new UserRegistrationDto
        {
            Id = "12345",
            Email = "user@example.com",
            Password = "strongPassword",
            Role = Role.Practitioner
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsTrue(isValid, "UserRegistrationDto should be valid.");
        Assert.AreEqual(0, results.Count);
    }

    [TestMethod]
    public void UserRegistrationDto_ShouldFailValidation_WhenEmailIsInvalid()
    {
        var userDto = new UserRegistrationDto
        {
            Id = "12345",
            Email = "invalid-email",
            Password = "strongPassword",
            Role = Role.Patient
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserRegistrationDto should fail validation when Email is invalid.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The Email field is not a valid e-mail address.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void UserRegistrationDto_ShouldFailValidation_WhenEmailExceedsMaxLength()
    {
        var invalidEmail = new string('a', 101) + "@example.com"; // Exceeding 100 chars
        var userDto = new UserRegistrationDto
        {
            Id = "12345",
            Email = invalidEmail,
            Password = "strongPassword",
            Role = Role.Admin
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserRegistrationDto should fail validation when Email exceeds max length.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The field Email must be a string or array type with a maximum length of '100'.",
            results[0].ErrorMessage);
    }

    [TestMethod]
    public void UserRegistrationDto_ShouldFailValidation_WhenIdExceedsMaxLength()
    {
        var invalidId = new string('a', 51); // Exceeding 50 chars
        var userDto = new UserRegistrationDto
        {
            Id = invalidId,
            Email = "user@example.com",
            Password = "strongPassword",
            Role = Role.Patient
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserRegistrationDto should fail validation when Id exceeds max length.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The field Id must be a string or array type with a maximum length of '50'.",
            results[0].ErrorMessage);
    }

}