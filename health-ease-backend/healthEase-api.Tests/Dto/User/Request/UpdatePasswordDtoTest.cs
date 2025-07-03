using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using healthEase_backend.Dto.User.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Dto.User.Request;

[TestClass]
public class UpdatePasswordDtoTest
{
    [TestMethod]
    public void UpdatePasswordDto_Creation_ShouldAssignCorrectValues()
    {
        const string userEmail = "user@example.com";
        const string currentPassword = "currentPassword";
        const string newPassword = "newStrongPassword";

        var dto = new UpdatePasswordDto
        {
            UserEmail = userEmail,
            CurrentPassword = currentPassword,
            NewPassword = newPassword
        };

        Assert.AreEqual(userEmail, dto.UserEmail);
        Assert.AreEqual(currentPassword, dto.CurrentPassword);
        Assert.AreEqual(newPassword, dto.NewPassword);
    }

    [TestMethod]
    public void UpdatePasswordDto_ShouldPassValidation_WhenAllFieldsAreValid()
    {
        var dto = new UpdatePasswordDto
        {
            UserEmail = "user@example.com",
            CurrentPassword = "currentPassword",
            NewPassword = "newStrongPassword"
        };

        var context = new ValidationContext(dto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(dto, context, results, true);

        Assert.IsTrue(isValid, "UpdatePasswordDto should be valid.");
        Assert.AreEqual(0, results.Count);
    }

    [TestMethod]
    public void UpdatePasswordDto_ShouldFailValidation_WhenUserEmailIsMissing()
    {
        var dto = new UpdatePasswordDto
        {
            UserEmail = string.Empty,
            CurrentPassword = "currentPassword",
            NewPassword = "newStrongPassword"
        };

        var context = new ValidationContext(dto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(dto, context, results, true);

        Assert.IsFalse(isValid, "UpdatePasswordDto should fail validation when UserEmail is missing.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The UserEmail field is required.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void UpdatePasswordDto_ShouldFailValidation_WhenCurrentPasswordIsMissing()
    {
        var dto = new UpdatePasswordDto
        {
            UserEmail = "user@example.com",
            CurrentPassword = string.Empty,
            NewPassword = "newStrongPassword"
        };

        var context = new ValidationContext(dto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(dto, context, results, true);

        Assert.IsFalse(isValid, "UpdatePasswordDto should fail validation when CurrentPassword is missing.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The CurrentPassword field is required.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void UpdatePasswordDto_ShouldFailValidation_WhenNewPasswordIsTooShort()
    {
        var dto = new UpdatePasswordDto
        {
            UserEmail = "user@example.com",
            CurrentPassword = "currentPassword",
            NewPassword = "123"
        };

        var context = new ValidationContext(dto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(dto, context, results, true);

        Assert.IsFalse(isValid, "UpdatePasswordDto should fail validation when NewPassword is too short.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("Password must be at least 6 characters long.", results[0].ErrorMessage);
    }
}