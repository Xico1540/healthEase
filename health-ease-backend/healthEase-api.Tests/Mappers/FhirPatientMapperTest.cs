using System.Linq;
using healthEase_backend.Dto.User.Request;
using healthEase_backend.Mappers;
using Hl7.Fhir.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Address = healthEase_backend.Dto.User.Request.Address;

namespace healthEase_backend.Tests.Mappers;

[TestClass]
public class FhirPatientMapperTests
{
    [TestMethod]
    public void Map_ShouldMapBasicPatientData()
    {
        var userPatientRegistrationDto = new UserPatientRegistrationDto()
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "123456789",
            Address = new Address
            {
                Street = "123 Main St",
                City = "Anytown",
                PostalCode = "12345"
            }
        };
        
        var patient = FhirPatientMapper.Map(userPatientRegistrationDto);
        
        Assert.AreEqual("Doe", patient.Name[0].Family);
        Assert.AreEqual("John", patient.Name[0].GivenElement[0].ToString());
        Assert.AreEqual("john.doe@example.com", patient.Telecom[0].Value);
        Assert.AreEqual(ContactPoint.ContactPointSystem.Email, patient.Telecom[0].System);
        Assert.AreEqual("123456789", patient.Telecom[1].Value);
        Assert.AreEqual(ContactPoint.ContactPointSystem.Phone, patient.Telecom[1].System);
        Assert.AreEqual("123 Main St", patient.Address[0].Line.First());
        Assert.AreEqual("Anytown", patient.Address[0].City);
        Assert.AreEqual("12345", patient.Address[0].PostalCode);
    }
    
    [TestMethod]
    public void Map_ShouldSetPatientAsActive()
    {
        var userPatientRegistrationDto = new UserPatientRegistrationDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "123456789",
            Address = new Address
            {
                Street = "123 Main St",
                City = "Anytown",
                PostalCode = "12345"
            }
        };
        
        var patient = FhirPatientMapper.Map(userPatientRegistrationDto);
        Assert.IsTrue(patient.Active);
    }
    
    [TestMethod]
    public void Map_ShouldHandleNullValuesGracefully()
    {
        var userPatientRegistrationDto = new UserPatientRegistrationDto
        {
            FirstName = null,
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = null,
            Address = new Address
            {
                Street = "123 Main St",
                City = null,
                PostalCode = "12345"
            }
        };
        
        var patient = FhirPatientMapper.Map(userPatientRegistrationDto);
        Assert.AreEqual("Doe", patient.Name[0].Family);
        Assert.IsTrue(string.IsNullOrEmpty(patient.Name[0].GivenElement[0].ToString()));
        Assert.AreEqual("john.doe@example.com", patient.Telecom[0].Value);
        var phoneContact = patient.Telecom.FirstOrDefault(t => t.System == ContactPoint.ContactPointSystem.Phone);
        Assert.IsNotNull(phoneContact);
        Assert.IsNull(phoneContact.Value);
        Assert.AreEqual("123 Main St", patient.Address[0].Line.First());
        Assert.IsNull(patient.Address[0].City);
    }
    
}
