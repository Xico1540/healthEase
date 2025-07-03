using System;
using System.Collections.Generic;
using System.Linq;
using healthEase_backend.Model.Enum;
using healthEase_backend.Utils;
using Hl7.Fhir.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Utils;

[TestClass]
public class FhirUtilsTest
{
    private HashSet<string> _allowedResourceTypes;

    [TestInitialize]
    public void Setup()
    {
        _allowedResourceTypes = new HashSet<string> { "Patient", "Practitioner", "Appointment" };
    }

    [TestMethod]
    public void ValidateResourceType_ValidResourceType_ShouldNotThrowException()
    {
        const string validResourceType = "Patient";
        FhirUtils.ValidateResourceType(validResourceType, _allowedResourceTypes);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception), "Resource type InvalidType is not allowed.")]
    public void ValidateResourceType_InvalidResourceType_ShouldThrowException()
    {
        const string invalidResourceType = "InvalidType";
        FhirUtils.ValidateResourceType(invalidResourceType, _allowedResourceTypes);
    }

    [TestMethod]
    public void ValidateResourceType_EmptyAllowedResourceTypes_ShouldThrowException()
    {
        const string resourceType = "Patient";
        var emptyAllowedResourceTypes = new HashSet<string>();

        var ex = Assert.ThrowsException<Exception>(() =>
            FhirUtils.ValidateResourceType(resourceType, emptyAllowedResourceTypes)
        );

        Assert.AreEqual("Resource type Patient is not allowed.", ex.Message);
    }
    
    [TestMethod]
    public void ConvertGender_ShouldConvertMaleCorrectly()
    {
        Assert.AreEqual(AdministrativeGender.Male, FhirUtils.ConvertGender(Gender.Male));
    }

    [TestMethod]
    public void ConvertGender_ShouldConvertFemaleCorrectly()
    {
        Assert.AreEqual(AdministrativeGender.Female, FhirUtils.ConvertGender(Gender.Female));
    }

    [TestMethod]
    public void ConvertGender_ShouldReturnNullForUnknownGender()
    {
        Assert.IsNull(FhirUtils.ConvertGender((Gender)999));
    }
    
    [TestMethod]
    public void ExtractTelecoms_ShouldReturnTelecomsFromResource()
    {
        var patient = new Patient()
        {
            Telecom = new List<ContactPoint>
            {
                new ContactPoint { System = ContactPoint.ContactPointSystem.Email, Value = "email@example.com" },
                new ContactPoint { System = ContactPoint.ContactPointSystem.Phone, Value = "123456789" }
            }
        };
        
        var telecoms = FhirUtils.ExtractTelecoms(patient);
        Assert.AreEqual(2, telecoms.Count());
        Assert.IsTrue(telecoms.Any(t => t.System == ContactPoint.ContactPointSystem.Email && t.Value == "email@example.com"));
        Assert.IsTrue(telecoms.Any(t => t.System == ContactPoint.ContactPointSystem.Phone && t.Value == "123456789"));
    }
    
    [TestMethod]
    public void ConvertDayOfWeek_ShouldConvertCorrectly()
    {
        Assert.AreEqual(DaysOfWeek.Mon, FhirUtils.ConvertDayOfWeek(DayOfWeek.Monday));
        Assert.AreEqual(DaysOfWeek.Tue, FhirUtils.ConvertDayOfWeek(DayOfWeek.Tuesday));
        Assert.AreEqual(DaysOfWeek.Wed, FhirUtils.ConvertDayOfWeek(DayOfWeek.Wednesday));
        Assert.AreEqual(DaysOfWeek.Thu, FhirUtils.ConvertDayOfWeek(DayOfWeek.Thursday));
        Assert.AreEqual(DaysOfWeek.Fri, FhirUtils.ConvertDayOfWeek(DayOfWeek.Friday));
        Assert.AreEqual(DaysOfWeek.Sat, FhirUtils.ConvertDayOfWeek(DayOfWeek.Saturday));
        Assert.AreEqual(DaysOfWeek.Sun, FhirUtils.ConvertDayOfWeek(DayOfWeek.Sunday));
        Assert.IsNull(FhirUtils.ConvertDayOfWeek((DayOfWeek)8));
    }

    [TestMethod]
    public void ExtractResourceReferences_ShouldReturnReferencesFromResource()
    {
        var observation = new Observation
        {
            Performer = new List<ResourceReference>
            {
                new ("Practitioner/1"),
                new ("Practitioner/2")
            }
        };
        
        var references = FhirUtils.ExtractResourceReferences(observation);
        Assert.AreEqual(2, references.Count());
        Assert.IsTrue(references.Any(r => r.Reference == "Practitioner/1"));
        Assert.IsTrue(references.Any(r => r.Reference == "Practitioner/2"));
    }
    
    [TestMethod]
    public void DoesPropertyExist_ValidPropertyPath_ShouldReturnTrue()
    {
        var patient = new Patient
        {
            Name = new List<HumanName> { new HumanName { Family = "Smith" } }
        };

        var result = FhirUtils.DoesPropertyExist(patient, "Name.Family");
        Assert.IsTrue(result);
    }

    [TestMethod]
    public void DoesPropertyExist_InvalidPropertyPath_ShouldReturnFalse()
    {
        var patient = new Patient();

        var result = FhirUtils.DoesPropertyExist(patient, "NonExistentProperty");
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void JsonContains_ValidKeyValuePair_ShouldReturnTrue()
    {
        const string jsonContent = "{\"name\": {\"family\": \"Smith\"}}";
        var result = FhirUtils.JsonContains(jsonContent, "name.family", "Smith");
        Assert.IsTrue(result);
    }

    [TestMethod]
    public void JsonContains_InvalidKeyValuePair_ShouldReturnFalse()
    {
        const string jsonContent = "{\"name\": {\"family\": \"Smith\"}}";
        var result = FhirUtils.JsonContains(jsonContent, "name.family", "Johnson");
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void CreateFhirResourceInstance_ValidResourceType_ShouldReturnInstance()
    {
        var instance = FhirUtils.CreateFhirResourceInstance("Patient");
        Assert.IsNotNull(instance);
        Assert.IsInstanceOfType(instance, typeof(Patient));
    }

    [TestMethod]
    public void CreateFhirResourceInstance_InvalidResourceType_ShouldReturnNull()
    {
        var instance = FhirUtils.CreateFhirResourceInstance("InvalidResourceType");
        Assert.IsNull(instance);
    }

    [TestMethod]
    public void ExtractIdFromReference_ValidReference_ShouldReturnId()
    {
        const string reference = "Patient/12345";
        var id = FhirUtils.ExtractIdFromReference(reference);
        Assert.AreEqual("12345", id);
    }

    [TestMethod]
    public void ExtractIdFromReference_InvalidReference_ShouldReturnEmptyString()
    {
        const string reference = "Patient";
        var id = FhirUtils.ExtractIdFromReference(reference);
        Assert.AreEqual(string.Empty, id);
    }
    
    [TestMethod]
    public void JsonContains_EmptyKeys_ShouldReturnFalse()
    {
        const string jsonContent = "{\"name\": \"John\"}";
        var result = FhirUtils.JsonContains(jsonContent, "", "John");
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void JsonContains_ArrayValueKind_ShouldReturnTrue()
    {
        const string jsonContent = "{\"items\": [{\"name\": \"John\"}, {\"name\": \"Jane\"}]}";
        var result = FhirUtils.JsonContains(jsonContent, "items.name", "Jane");
        Assert.IsTrue(result);
    }

    [TestMethod]
    public void JsonContains_ArrayValueKind_ShouldReturnFalseForNonExistentValue()
    {
        const string jsonContent = "{\"items\": [{\"name\": \"John\"}, {\"name\": \"Jane\"}]}";
        var result = FhirUtils.JsonContains(jsonContent, "items.name", "NonExistent");
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void JsonContains_KeyNotFound_ShouldReturnFalse()
    {
        const string jsonContent = "{\"name\": \"John\"}";
        var result = FhirUtils.JsonContains(jsonContent, "nonexistentKey", "John");
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void JsonContains_NestedKeyWithArray_ShouldReturnTrue()
    {
        const string jsonContent = "{\"details\": {\"contacts\": [{\"type\": \"email\", \"value\": \"test@example.com\"}]}}";
        var result = FhirUtils.JsonContains(jsonContent, "details.contacts.value", "test@example.com");
        Assert.IsTrue(result);
    }
}
