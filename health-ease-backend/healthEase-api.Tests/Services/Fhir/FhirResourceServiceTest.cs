using System;
using System.Collections.Generic;
using healthEase_backend.Exceptions.Fhir;
using healthEase_backend.Model;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Services.Fhir;
using Hl7.Fhir.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace healthEase_backend.Tests.Services.Fhir;

[TestClass]
public class FhirResourceServiceTest
{
    private Mock<IFhirResourceRepository> _fhirResourceRepositoryMock;
    private FhirResourceService _fhirResourceService;

    [TestInitialize]
    public void Setup()
    {
        _fhirResourceRepositoryMock = new Mock<IFhirResourceRepository>();
        _fhirResourceService = new FhirResourceService(_fhirResourceRepositoryMock.Object);
    }

    [TestMethod]
    [ExpectedException(typeof(KeyNotFoundException))]
    public void ValidateReferences_ShouldThrowException_WhenReferencedResourceNotFound()
    {
        var resource = new Patient
        {
            GeneralPractitioner = new List<ResourceReference>
            {
                new ("Practitioner/123")
            }
        };

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Practitioner", "123"))
            .Returns((FhirResource)null);
        _fhirResourceService.ValidateReferences(resource);
    }
    
    [TestMethod]
    [ExpectedException(typeof(ArgumentException))]
    public void ValidateReferences_ShouldThrowException_WhenReferenceFormatIsInvalid()
    {
        var resource = new Patient
        {
            GeneralPractitioner = new List<ResourceReference>
            {
                new ResourceReference("InvalidReferenceFormat")
            }
        };

        _fhirResourceService.ValidateReferences(resource);
    }
    
    [TestMethod]
    [ExpectedException(typeof(InvalidOperationException))]
    public void ValidateNoReferencesExist_ShouldThrowException_WhenResourceIsReferencedByAnother()
    {
        const string resourceJson = "{ \"resourceType\": \"Practitioner\", \"patient\": [{ \"reference\": \"Patient/123\" }] }";
        var fhirResource = new FhirResource("1", "Practitioner", resourceJson);

        _fhirResourceRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<FhirResource> { fhirResource });

        _fhirResourceService.ValidateNoReferencesExist("Patient", "123");
    }
    
    [TestMethod]
    public void ValidateReferences_ShouldNotThrowException_WhenAllReferencesAreValid()
    {
        var resource = new Patient
        {
            GeneralPractitioner = new List<ResourceReference>
            {
                new ("Practitioner/123")
            }
        };

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Practitioner", "123"))
            .Returns(new FhirResource("123", "Practitioner", "{}"));

        _fhirResourceService.ValidateReferences(resource);

        _fhirResourceRepositoryMock.Verify(repo => repo.GetByResourceType("Practitioner", "123"), Times.Once);
    }
    
    [TestMethod]
    public void ValidateNoReferencesExist_ShouldNotThrowException_WhenResourceIsNotReferencedByAnother()
    {
        var fhirResourceList = new List<FhirResource>
        {
            new ("1", "Practitioner", "{ \"resourceType\": \"Practitioner\", \"id\": \"1\" }")
        };

        _fhirResourceRepositoryMock.Setup(repo => repo.GetAll()).Returns(fhirResourceList);

        _fhirResourceService.ValidateNoReferencesExist("Patient", "123");

        _fhirResourceRepositoryMock.Verify(repo => repo.GetAll(), Times.Once);
    }

    
    [TestMethod]
    [ExpectedException(typeof(DuplicateTelecomException))]
    public void ValidateUniqueTelecoms_ShouldThrowException_WhenDuplicateTelecomExists()
    {
        var resource = new Patient
        {
            Telecom = new List<ContactPoint>
            {
                new ContactPoint
                {
                    System = ContactPoint.ContactPointSystem.Email,
                    Value = "test@example.com"
                }
            }
        };

        var duplicateResourceJson = "{ \"resourceType\": \"Patient\", \"telecom\": [{ \"system\": \"email\", \"value\": \"test@example.com\" }] }";
        var duplicateFhirResource = new FhirResource("1", "Patient", duplicateResourceJson);

        _fhirResourceRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<FhirResource> { duplicateFhirResource });
        
        _fhirResourceService.ValidateUniqueTelecoms(resource);
    }
    
    [TestMethod]
    public void ValidateUniqueTelecoms_ShouldNotThrowException_WhenNoDuplicateTelecomExists()
    {
        var resource = new Patient
        {
            Telecom = new List<ContactPoint>
            {
                new ContactPoint
                {
                    System = ContactPoint.ContactPointSystem.Email,
                    Value = "newemail@example.com"
                }
            }
        };

        _fhirResourceRepositoryMock.Setup(repo => repo.GetAll())
            .Returns(new List<FhirResource>());

        _fhirResourceService.ValidateUniqueTelecoms(resource);

        _fhirResourceRepositoryMock.Verify(repo => repo.GetAll(), Times.Once);
    }

    [TestMethod]
    public void ValidateResourceFields_ShouldCallValidateMethods()
    {
        var resource = new Patient
        {
            Telecom = new List<ContactPoint>
            {
                new ContactPoint
                {
                    System = ContactPoint.ContactPointSystem.Email,
                    Value = "test@example.com"
                }
            }
        };
        
        _fhirResourceRepositoryMock.Setup(repo => repo.GetAll())
            .Returns(new List<FhirResource>());

        _fhirResourceService.ValidateResourceFields(resource);
        _fhirResourceRepositoryMock.Verify(repo => repo.GetAll(), Times.Once);
    }

}
