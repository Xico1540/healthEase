using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using healthEase_backend.Dto.User.Request;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Dto.User.Request;

[TestClass]
public class UserPatientRegistrationDtoTest
{
    [TestMethod]
    public void UserPatientRegistrationDto_Creation_ShouldAssignCorrectValues()
    {
        const string firstName = "John";
        const string lastName = "Doe";
        const string email = "john.doe@example.com";
        const string phoneNumber = "1234567890";
        const string password = "strongPassword";

        var address = new Address()
        {
            Street = "123 Main St",
            City = "Sample City",
            PostalCode = "12345"
        };

        var userDto = new UserPatientRegistrationDto
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PhoneNumber = phoneNumber,
            Address = address,
            Password = password
        };

        Assert.AreEqual(firstName, userDto.FirstName);
        Assert.AreEqual(lastName, userDto.LastName);
        Assert.AreEqual(email, userDto.Email);
        Assert.AreEqual(phoneNumber, userDto.PhoneNumber);
        Assert.AreEqual(address, userDto.Address);
        Assert.AreEqual(password, userDto.Password);
    }

    [TestMethod]
    public void UserPatientRegistrationDto_ShouldPassValidation_WhenAllFieldsAreValid()
    {
        var userDto = new UserPatientRegistrationDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "1234567890",
            Address = new Address
            {
                Street = "123 Main St",
                City = "Sample City",
                PostalCode = "12345"
            },
            Password = "strongPassword"
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsTrue(isValid, "UserPatientRegistrationDto should be valid.");
        Assert.AreEqual(0, results.Count);
    }

    [TestMethod]
    public void UserPatientRegistrationDto_ShouldFailValidation_WhenFirstNameIsEmpty()
    {
        var userDto = new UserPatientRegistrationDto
        {
            FirstName = "",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "1234567890",
            Address = new Address
            {
                Street = "123 Main St",
                City = "Sample City",
                PostalCode = "12345"
            },
            Password = "strongPassword"
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserPatientRegistrationDto should fail validation when FirstName is empty.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The FirstName field is required.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void UserPatientRegistrationDto_ShouldFailValidation_WhenEmailIsInvalid()
    {
        var userDto = new UserPatientRegistrationDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "invalid-email",
            PhoneNumber = "1234567890",
            Address = new Address
            {
                Street = "123 Main St",
                City = "Sample City",
                PostalCode = "12345"
            },
            Password = "strongPassword"
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserPatientRegistrationDto should fail validation when Email is invalid.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The Email field is not a valid e-mail address.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void UserPatientRegistrationDto_ShouldFailValidation_WhenPhoneNumberIsInvalid()
    {
        var userDto = new UserPatientRegistrationDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "invalid-phone",
            Address = new Address
            {
                Street = "123 Main St",
                City = "Sample City",
                PostalCode = "12345"
            },
            Password = "strongPassword"
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserPatientRegistrationDto should fail validation when PhoneNumber is invalid.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The PhoneNumber field is not a valid phone number.", results[0].ErrorMessage);
    }

    [TestMethod]
    public void UserPatientRegistrationDto_ShouldFailValidation_WhenPasswordIsTooShort()
    {
        var userDto = new UserPatientRegistrationDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "1234567890",
            Address = new Address
            {
                Street = "123 Main St",
                City = "Sample City",
                PostalCode = "12345"
            },
            Password = "123"
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserPatientRegistrationDto should fail validation when Password is too short.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("Password must be at least 8 characters long.", results[0].ErrorMessage);
    }
    
    [TestMethod]
    public void Address_ShouldPassValidation_WhenAllFieldsAreValid()
    {
        var address = new Address
        {
            Street = "123 Main St",
            City = "Sample City",
            PostalCode = "12345"
        };

        var context = new ValidationContext(address, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(address, context, results, true);

        Assert.IsTrue(isValid, "Address should be valid.");
        Assert.AreEqual(0, results.Count);
    }

    [TestMethod]
    public void UserPatientRegistrationDto_ShouldFailValidation_WhenFirstNameExceedsMaxLength()
    {
        var invalidFirstName = new string('a', 101);
        var userDto = new UserPatientRegistrationDto
        {
            FirstName = invalidFirstName,
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "1234567890",
            Address = new Address
            {
                Street = "123 Main St",
                City = "Sample City",
                PostalCode = "12345"
            },
            Password = "strongPassword"
        };

        var context = new ValidationContext(userDto, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(userDto, context, results, true);

        Assert.IsFalse(isValid, "UserPatientRegistrationDto should fail validation when FirstName exceeds max length.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The field FirstName must be a string or array type with a maximum length of '100'.",
            results[0].ErrorMessage);
    }
    
}