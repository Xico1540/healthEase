using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using healthEase_backend.Dto.User.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Dto.User.Request;

[TestClass]
public class UserUpdateEmailDtoTest
{
    [TestMethod]
    public void UserUpdateEmailDto_Creation_ShouldAssignCorrectValues()
    {
        const string oldEmail = "old@example.com";
        const string newEmail = "new@example.com";

        var userDto = new UserUpdateEmailDto
        {
            OldEmail = oldEmail,
            NewEmail = newEmail
        };

        Assert.AreEqual(oldEmail, userDto.OldEmail);
        Assert.AreEqual(newEmail, userDto.NewEmail);
    }

    [TestMethod]
    public void UserUpdateEmailDto_ShouldPassValidation_WhenAllFieldsAreValid()
    {
        var userDto = new UserUpdateEmailDto
        {
            OldEmail = "old@example.com",
            NewEmail = "new@example.com"
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsTrue(isValid, "UserUpdateEmailDto should be valid.");
        Assert.AreEqual(0, results.Count);
    }

    [TestMethod]
    public void UserUpdateEmailDto_ShouldFailValidation_WhenOldEmailIsMissing()
    {
        var userDto = new UserUpdateEmailDto
        {
            OldEmail = string.Empty,
            NewEmail = "new@example.com"
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserUpdateEmailDto should fail validation when OldEmail is missing.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The OldEmail field is required.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void UserUpdateEmailDto_ShouldFailValidation_WhenNewEmailIsMissing()
    {
        var userDto = new UserUpdateEmailDto
        {
            OldEmail = "old@example.com",
            NewEmail = string.Empty
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserUpdateEmailDto should fail validation when NewEmail is missing.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The NewEmail field is required.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void UserUpdateEmailDto_ShouldFailValidation_WhenNewEmailIsInvalid()
    {
        var userDto = new UserUpdateEmailDto
        {
            OldEmail = "old@example.com",
            NewEmail = "invalid-email"
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserUpdateEmailDto should fail validation when NewEmail is invalid.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The NewEmail field is not a valid e-mail address.", results[0].ErrorMessage);
    }
}
