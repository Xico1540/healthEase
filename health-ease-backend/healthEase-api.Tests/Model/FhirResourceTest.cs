using Microsoft.VisualStudio.TestTools.UnitTesting;
using healthEase_backend.Model;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace healthEase_backend.Tests.Model;

[TestClass]
public class FhirResourceTest
{
    [TestMethod]
    public void FhirResource_Creation_ShouldAssignCorrectValues()
    {
        const string expectedId = "12345";
        const string expectedResourceType = "Patient";
        const string expectedResourceContent = "{ \"resourceType\": \"Patient\" }";

        var fhirResource = new FhirResource(expectedId, expectedResourceType, expectedResourceContent);

        Assert.AreEqual(expectedId, fhirResource.Id);
        Assert.AreEqual(expectedResourceType, fhirResource.ResourceType);
        Assert.AreEqual(expectedResourceContent, fhirResource.ResourceContent);
    }

    [TestMethod]
    public void FhirResource_ShouldPassValidation()
    {
        var fhirResource = new FhirResource("12345", "Patient", "{ \"resourceType\": \"Patient\" }");
        
        var context = new ValidationContext(fhirResource, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(fhirResource, context, results, true);
        
        Assert.IsTrue(isValid, "FhirResource should be valid.");
        Assert.AreEqual(0, results.Count);
    }

    [TestMethod]
    public void FhirResource_ShouldFailValidation_WhenIdExceedsMaxLength()
    {
        var invalidId = new string('a', 51);
        var fhirResource = new FhirResource(invalidId, "Patient", "{ \"resourceType\": \"Patient\" }");
        
        var context = new ValidationContext(fhirResource, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(fhirResource, context, results, true);
        
        Assert.IsFalse(isValid, "FhirResource should fail validation when Id exceeds the max length.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The field Id must be a string or array type with a maximum length of '50'.",
            results[0].ErrorMessage);
    }

    [TestMethod]
    public void FhirResource_ShouldFailValidation_WhenResourceTypeExceedsMaxLength()
    {
        var invalidResourceType = new string('b', 51);
        var fhirResource = new FhirResource("12345", invalidResourceType, "{ \"resourceType\": \"Patient\" }");
        
        var context = new ValidationContext(fhirResource, null, null);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(fhirResource, context, results, true);
        
        Assert.IsFalse(isValid, "FhirResource should fail validation when ResourceType exceeds the max length.");
        Assert.AreEqual(1, results.Count);
        Assert.AreEqual("The field ResourceType must be a string or array type with a maximum length of '50'.",
            results[0].ErrorMessage);
    }
}
