using System.Collections.Generic;
using System.Linq;
using healthEase_backend.Services.Fhir;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace healthEase_backend.Tests.Services.Fhir;

[TestClass]
public class AllowedResourcesServiceTest
{
    private Mock<IConfiguration> _configurationMock;
    private AllowedResourcesService _allowedResourcesService;

    [TestInitialize]
    public void Setup()
    {
        _configurationMock = new Mock<IConfiguration>();
    }

    [TestMethod]
    public void Constructor_ShouldInitializeAllowedResourceTypes_WhenConfigurationIsValid()
    {
        _configurationMock.Setup(config => config["AllowedResourceTypes"])
            .Returns("Patient, Practitioner, Observation");
        
        _allowedResourcesService = new AllowedResourcesService(_configurationMock.Object);
        var expectedResources = new HashSet<string> { "Patient", "Practitioner", "Observation" };
        CollectionAssert.AreEquivalent(expectedResources.ToList(), _allowedResourcesService.AllowedResourceTypes.ToList());
    }
    
    [TestMethod]
    public void Constructor_ShouldInitializeEmptyAllowedResourceTypes_WhenConfigurationIsEmpty()
    {
        _configurationMock.Setup(config => config["AllowedResourceTypes"])
            .Returns(string.Empty); 
        
        _allowedResourcesService = new AllowedResourcesService(_configurationMock.Object);
        Assert.AreEqual(0, _allowedResourcesService.AllowedResourceTypes.Count);
    }
    
    [TestMethod]
    public void Constructor_ShouldRemoveDuplicatesAndTrimSpaces_WhenConfigurationHasDuplicatesAndSpaces()
    {
        _configurationMock.Setup(config => config["AllowedResourceTypes"])
            .Returns("Patient,   Practitioner , Patient,Observation");
        
        _allowedResourcesService = new AllowedResourcesService(_configurationMock.Object);
        var expectedResources = new HashSet<string> { "Patient", "Practitioner", "Observation" };
        CollectionAssert.AreEquivalent(expectedResources.ToList(), _allowedResourcesService.AllowedResourceTypes.ToList());
    }

    [TestMethod]
    public void Constructor_ShouldInitializeEmptyAllowedResourceTypes_WhenConfigurationIsNull()
    {
        _configurationMock.Setup(config => config["AllowedResourceTypes"])
            .Returns((string)null);


        _allowedResourcesService = new AllowedResourcesService(_configurationMock.Object);
        Assert.AreEqual(0, _allowedResourcesService.AllowedResourceTypes.Count);
    }

}
