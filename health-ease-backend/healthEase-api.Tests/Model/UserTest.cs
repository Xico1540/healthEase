using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using healthEase_backend.Model;
using healthEase_backend.Model.Enum;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Model;

[TestClass]
public class UserTest
{
    [TestMethod]
    public void User_Creation_ShouldAssignCorrectValues()
    {
        const string expectedId = "12345";
        const string expectedEmail = "user@example.com";
        const Role expectedRole = Role.Admin;
        const string expectedPasswordHash = "hashedPassword";
        const string expectedRefreshToken = "refreshToken";

        var user = new User
        {
            Id = expectedId,
            Email = expectedEmail,
            Role = expectedRole,
            PasswordHash = expectedPasswordHash,
            RefreshToken = expectedRefreshToken
        };

        Assert.AreEqual(expectedId, user.Id);
        Assert.AreEqual(expectedEmail, user.Email);
        Assert.AreEqual(expectedRole, user.Role);
        Assert.AreEqual(expectedPasswordHash, user.PasswordHash);
        Assert.AreEqual(expectedRefreshToken, user.RefreshToken);
    }

    [TestMethod]
    public void User_ShouldPassValidation()
    {
        var user = new User
        {
            Id = "12345",
            Email = "user@example.com",
            Role = Role.Patient,
            PasswordHash = "hashedPassword",
            RefreshToken = "refreshToken"
        };

        var context = new ValidationContext(user, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(user, context, results, true);

        Assert.IsTrue(isValid, "User should be valid.");
        Assert.AreEqual(0, results.Count);
    }

    [TestMethod]
    public void User_ShouldFailValidation_WhenEmailIsInvalid()
    {
        var user = new User
        {
            Id = "12345",
            Email = "invalid-email",
            Role = Role.Patient,
            PasswordHash = "hashedPassword",
            RefreshToken = "refreshToken"
        };

        var context = new ValidationContext(user, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(user, context, results, true);

        Assert.IsFalse(isValid, "User should fail validation when Email is invalid.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The Email field is not a valid e-mail address.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void User_ShouldFailValidation_WhenEmailExceedsMaxLength()
    {
        var invalidEmail = new string('a', 101) + "@example.com";
        var user = new User
        {
            Id = "12345",
            Email = invalidEmail,
            Role = Role.Patient,
            PasswordHash = "hashedPassword",
            RefreshToken = "refreshToken"
        };

        var context = new ValidationContext(user, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(user, context, results, true);

        Assert.IsFalse(isValid, "User should fail validation when Email exceeds the max length.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The field Email must be a string or array type with a maximum length of '100'.",
            results[0].ErrorMessage);
    }

    [TestMethod]
    public void User_ShouldFailValidation_WhenPasswordHashExceedsMaxLength()
    {
        var invalidPasswordHash = new string('p', 256);
        var user = new User
        {
            Id = "12345",
            Email = "user@example.com",
            Role = Role.Patient,
            PasswordHash = invalidPasswordHash,
            RefreshToken = "refreshToken"
        };

        var context = new ValidationContext(user, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(user, context, results, true);

        Assert.IsFalse(isValid, "User should fail validation when PasswordHash exceeds the max length.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The field PasswordHash must be a string or array type with a maximum length of '255'.",
            results[0].ErrorMessage);
    }

    [TestMethod]
    public void User_ShouldFailValidation_WhenRefreshTokenExceedsMaxLength()
    {
        var invalidRefreshToken = new string('r', 1000);
        var user = new User
        {
            Id = "12345",
            Email = "user@example.com",
            Role = Role.Patient,
            PasswordHash = "hashedPassword",
            RefreshToken = invalidRefreshToken
        };

        var context = new ValidationContext(user, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(user, context, results, true);

        Assert.IsFalse(isValid, "User should fail validation when RefreshToken exceeds the max length.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The field RefreshToken must be a string or array type with a maximum length of '999'.",
            results[0].ErrorMessage);
    }

    [TestMethod]
    [ExpectedException(typeof(InvalidOperationException))]
    public void VerifyPassword_ShouldThrowException_WhenPasswordHashIsNotSet()
    {
        var user = new User
        {
            Id = "12345",
            Email = "user@example.com",
            Role = Role.Patient
        };

        user.VerifyPassword("password");
    }

    [TestMethod]
    public void VerifyPassword_ShouldReturnTrue_WhenPasswordIsCorrect()
    {
        var password = "password";
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User
        {
            Id = "12345",
            Email = "user@example.com",
            Role = Role.Patient,
            PasswordHash = passwordHash
        };

        var isPasswordCorrect = user.VerifyPassword(password);

        Assert.IsTrue(isPasswordCorrect, "Password should be verified as correct.");
    }

    [TestMethod]
    public void VerifyPassword_ShouldReturnFalse_WhenPasswordIsIncorrect()
    {
        var password = "password";
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User
        {
            Id = "12345",
            Email = "user@example.com",
            Role = Role.Patient,
            PasswordHash = passwordHash
        };

        var isPasswordCorrect = user.VerifyPassword("wrongpassword");

        Assert.IsFalse(isPasswordCorrect, "Password should be verified as incorrect.");
    }
    
    [TestMethod]
    public void User_ShouldFailValidation_WhenEmailIsMissing()
    {
        var user = new User
        {
            Id = "12345",
            Role = Role.Patient,
            PasswordHash = "hashedPassword",
            RefreshToken = "refreshToken"
        };

        var context = new ValidationContext(user, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(user, context, results, true);

        Assert.IsFalse(isValid, "User should fail validation when Email is missing.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The Email field is required.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void User_ShouldPassValidation_WhenEmailIsExactlyAtMaxLength()
    {
        var validEmail = new string('a', 100 - "@example.com".Length) + "@example.com";
        var user = new User
        {
            Id = "12345",
            Email = validEmail,
            Role = Role.Patient,
            PasswordHash = "hashedPassword",
            RefreshToken = "refreshToken"
        };

        var context = new ValidationContext(user, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(user, context, results, true);

        Assert.IsTrue(isValid, "User should pass validation when Email is exactly at the max length.");
    }
    
    [TestMethod]
    public void User_Creation_ShouldSetDefaultValues()
    {
        var user = new User();

        Assert.AreEqual(Role.Patient, user.Role, "Default role should be Patient.");
        Assert.AreEqual(string.Empty, user.RefreshToken, "Default RefreshToken should be an empty string.");
    }

    [TestMethod]
    [ExpectedException(typeof(InvalidOperationException))]
    public void VerifyPassword_ShouldThrowException_WhenPasswordIsEmpty()
    {
        var user = new User
        {
            Id = "12345",
            Email = "user@example.com",
            Role = Role.Patient,
            PasswordHash = string.Empty
        };

        user.VerifyPassword("password");
    }
    
}