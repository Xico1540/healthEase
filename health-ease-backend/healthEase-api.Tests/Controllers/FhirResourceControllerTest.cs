using System;
using System.Collections.Generic;
using System.Text.Json;
using healthEase_backend.Controllers;
using healthEase_backend.Exceptions.Fhir;
using healthEase_backend.Model;
using healthEase_backend.Model.Enum;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Fhir;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Services.Auth;
using healthEase_backend.Tests.Utils;
using healthEase_backend.Utils;
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace healthEase_backend.Tests.Controllers;

[TestClass]
public class FhirResourceControllerTest
{
    private Mock<IFhirResourceRepository> _fhirResourceRepositoryMock;
    private Mock<IAllowedResourcesService> _allowedResourcesServiceMock;
    private Mock<IFhirService> _fhirServiceMock;
    private Mock<IFhirResourceService> _fhirResourceServiceMock;
    private Mock<IHttpContextAccessor> _httpContextAccessorMock;
    private FhirResourceController _controller;
    private HashSet<string> _allowedResourceTypes;

    [TestInitialize]
    public void Setup()
    {
        _fhirResourceRepositoryMock = new Mock<IFhirResourceRepository>();
        _fhirServiceMock = new Mock<IFhirService>();
        _fhirResourceServiceMock = new Mock<IFhirResourceService>();
        _allowedResourcesServiceMock = new Mock<IAllowedResourcesService>();
        _allowedResourceTypes = new() { "Patient", "Practitioner", "PractitionerRole" };

        _allowedResourcesServiceMock.Setup(a => a.AllowedResourceTypes).Returns(_allowedResourceTypes);

        var httpContextMock = new Mock<HttpContext>();
        var requestMock = new Mock<HttpRequest>();

        httpContextMock.Setup(c => c.Request).Returns(requestMock.Object);
        requestMock.Setup(r => r.Scheme).Returns("http");
        requestMock.Setup(r => r.Host).Returns(new HostString("localhost", 5000));
        requestMock.Setup(r => r.PathBase).Returns("/fhir");

        httpContextMock.Setup(c => c.Items).Returns(new Dictionary<object, object>());
        
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        _httpContextAccessorMock.Setup(a => a.HttpContext).Returns(httpContextMock.Object);
        
        var authorizationService = new AuthorizationService(_httpContextAccessorMock.Object, _fhirResourceRepositoryMock.Object);
        
        _controller = new FhirResourceController(_fhirResourceRepositoryMock.Object, _fhirServiceMock.Object,
            _fhirResourceServiceMock.Object, authorizationService, _allowedResourcesServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = httpContextMock.Object
            }
        };
    }

    [TestMethod]
    public void Add_AdminUser_ShouldReturnSuccess()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\"}").RootElement;

        var result = _controller.Add(resourceType, resourceJson);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
        var contentResult = (ContentResult)result;
        Assert.AreEqual("application/fhir+json", contentResult.ContentType);
    }

    [TestMethod]
    public void Add_InvalidResourceTypeOrNullResource_ShouldReturnBadRequest()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Practitioner\"}").RootElement;

        var result = _controller.Add(resourceType, resourceJson);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        var badRequestResult = (BadRequestObjectResult)result;
        Assert.AreEqual("Invalid JSON format or resource type mismatch.", badRequestResult.Value);
    }

    [TestMethod]
    public void Add_NonAdminUser_ShouldReturnUnauthorized()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\"}").RootElement;

        var result = _controller.Add(resourceType, resourceJson);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("You are not authorized to perform this action.", unauthorizedResult.Value);
    }

    [TestMethod]
    public void Add_PractitionerRole_ShouldCreateSchedulesAndSlots()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "PractitionerRole";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"PractitionerRole\"}").RootElement;

        var result = _controller.Add(resourceType, resourceJson);

        _fhirServiceMock.Verify(service => service.CreateSchedulesAndSlots(It.IsAny<PractitionerRole>()), Times.Once);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
    }

    [TestMethod]
    public void Add_InvalidResourceType_ShouldReturnBadRequest()
    {
        const string resourceType = "InvalidType";

        var ex = Assert.ThrowsException<Exception>(() =>
            FhirUtils.ValidateResourceType(resourceType, _allowedResourceTypes));
        Assert.AreEqual("Resource type InvalidType is not allowed.", ex.Message);
    }

    [TestMethod]
    public void Add_InvalidJsonFormat_ShouldReturnBadRequest()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var invalidJson = JsonDocument.Parse("{\"resourceType\":\"Practitioner\"}").RootElement;

        var result = _controller.Add(resourceType, invalidJson);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        var badRequestResult = (BadRequestObjectResult)result;
        Assert.AreEqual("Invalid JSON format or resource type mismatch.", badRequestResult.Value);
    }

    [TestMethod]
    public void Add_ErrorWhileAddingResource_ShouldReturnBadRequest()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\"}").RootElement;

        _fhirResourceRepositoryMock.Setup(repo => repo.Add(It.IsAny<FhirResource>()))
            .Throws(new Exception("Database error"));

        var result = _controller.Add(resourceType, resourceJson);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        var badRequestResult = (BadRequestObjectResult)result;
        Assert.AreEqual("Error parsing FHIR resource: Database error", badRequestResult.Value);
    }

    [TestMethod]
    public void Add_DuplicateTelecomException_ShouldReturnConflict()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\"}").RootElement;

        _fhirResourceServiceMock.Setup(service => service.ValidateResourceFields(It.IsAny<Resource>()))
            .Throws(new DuplicateTelecomException("Duplicate telecom entry"));

        var result = _controller.Add(resourceType, resourceJson);

        Assert.IsInstanceOfType(result, typeof(ConflictObjectResult));
        var conflictResult = (ConflictObjectResult)result;
        Assert.AreEqual("Duplicate telecom entry", conflictResult.Value);
    }

    [TestMethod]
    public void Update_ValidResource_ShouldReturnSuccess()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\", \"id\": \"12345\"}").RootElement;

        var existingResource =
            new FhirResource("12345", resourceType, "{\"resourceType\":\"Patient\", \"id\":\"12345\"}");
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, "12345"))
            .Returns(existingResource);

        _fhirResourceRepositoryMock.Setup(repo => repo.Update(It.IsAny<FhirResource>()));

        var result = _controller.Update(resourceType, "12345", resourceJson);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
    }

    [TestMethod]
    public void UpdateResource_NonAdminUser_DifferentResourceId_ShouldReturnUnauthorized()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\", \"id\": \"12345671\"}").RootElement;

        var existingResource =
            new FhirResource("12345671", resourceType, "{\"resourceType\":\"Patient\", \"id\":\"12345671\"}");
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, "12345671"))
            .Returns(existingResource);

        var result = _controller.Update(resourceType, "12345671", resourceJson);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("You are not authorized to perform this action.", unauthorizedResult.Value);
    }

    [TestMethod]
    public void Update_InvalidJsonOrIdMismatch_ShouldReturnBadRequest()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\", \"id\": \"wrong-id\"}").RootElement;

        var existingResource =
            new FhirResource("12345", resourceType, "{\"resourceType\":\"Patient\", \"id\":\"12345\"}");
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, "12345"))
            .Returns(existingResource);

        var result = _controller.Update(resourceType, "12345", resourceJson);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        var badRequestResult = (BadRequestObjectResult)result;
        Assert.AreEqual("Invalid JSON format or ID mismatch.", badRequestResult.Value);
    }

    [TestMethod]
    public void UpdateResource_NonAdminUser_EqualResourceId_ShouldReturnSuccess()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\", \"id\": \"123456789\"}").RootElement;

        var existingResource = new FhirResource("123456789", resourceType,
            "{\"resourceType\":\"Patient\", \"id\":\"123456789\"}");
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, "123456789"))
            .Returns(existingResource);

        var result = _controller.Update(resourceType, "123456789", resourceJson);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
    }

    [TestMethod]
    public void Update_ResourceNotFound_ShouldReturnNotFound()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\", \"id\": \"12345\"}").RootElement;

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, "12345"))
            .Returns((FhirResource)null);

        var result = _controller.Update(resourceType, "12345", resourceJson);

        Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.AreEqual("No resource of type Patient found with id 12345", notFoundResult.Value);
    }

    [TestMethod]
    public void Update_Exception_ShouldReturnBadRequest()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var resourceJson = JsonDocument.Parse("{\"resourceType\":\"Patient\", \"id\": \"12345\"}").RootElement;

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, "12345"))
            .Throws(new Exception("Unexpected error"));

        var result = _controller.Update(resourceType, "12345", resourceJson);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        var badRequestResult = (BadRequestObjectResult)result;
        Assert.AreEqual("Error updating FHIR resource: Unexpected error", badRequestResult.Value);
    }

    [TestMethod]
    public void GetByResourceType_NoResources_ShouldReturnEmptyBundle()
    {
        const string resourceType = "Patient";

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType))
            .Returns(new List<FhirResource>());
        
        var requestMock = new Mock<HttpRequest>();
        requestMock.Setup(r => r.Query).Returns(new QueryCollection(new Dictionary<string, StringValues>()));
        
        var httpContextMock = new Mock<HttpContext>();
        httpContextMock.Setup(c => c.Request).Returns(requestMock.Object);
        _controller.ControllerContext.HttpContext = httpContextMock.Object;

        var result = _controller.GetByResourceType(resourceType);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
        var contentResult = (ContentResult)result;

        Assert.AreEqual("application/fhir+json", contentResult.ContentType);

        var parser = new FhirJsonParser();
        var resultBundle = parser.Parse<Bundle>(contentResult.Content);

        Assert.AreEqual(Bundle.BundleType.Searchset, resultBundle.Type);
        Assert.AreEqual(0, resultBundle.Entry.Count);
        Assert.IsNotNull(resultBundle.Meta);
        Assert.IsNotNull(resultBundle.Meta.LastUpdated);
    }

    [TestMethod]
    public void GetByResourceType_AdminUser_ShouldReturnBundleWithEntries()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        var resourceList = new List<FhirResource>
        {
            new("12345", resourceType, "{ \"resourceType\": \"Patient\" }"),
            new("12346", resourceType, "{ \"resourceType\": \"Patient\" }"),
            new("12347", resourceType, "{ \"resourceType\": \"Patient\" }")
        };

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType)).Returns(resourceList);
        
        var requestMock = new Mock<HttpRequest>();
        requestMock.Setup(r => r.Query).Returns(new QueryCollection(new Dictionary<string, StringValues>()));
        
        var httpContextMock = new Mock<HttpContext>();
        httpContextMock.Setup(c => c.Request).Returns(requestMock.Object);
        _controller.ControllerContext.HttpContext = httpContextMock.Object;

        var result = _controller.GetByResourceType(resourceType);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
        var contentResult = (ContentResult)result;

        var parser = new FhirJsonParser();
        var bundle = parser.Parse<Bundle>(contentResult.Content);

        Assert.AreEqual(3, bundle.Entry.Count);
    }
    
    [TestMethod]
    public void GetByResourceType_NonAdminUser_DifferentResourceId_ShouldReturnBundleWithoutEntries()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        var resourceList = new List<FhirResource>
        {
            new("12345", resourceType, "{ \"resourceType\": \"Patient\" }"),
            new("12346", resourceType, "{ \"resourceType\": \"Patient\" }"),
            new("12347", resourceType, "{ \"resourceType\": \"Patient\" }")
        };
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType)).Returns(resourceList);
        
        var requestMock = new Mock<HttpRequest>();
        requestMock.Setup(r => r.Query).Returns(new QueryCollection(new Dictionary<string, StringValues>()));
        
        var httpContextMock = new Mock<HttpContext>();
        httpContextMock.Setup(c => c.Request).Returns(requestMock.Object);
        _controller.ControllerContext.HttpContext = httpContextMock.Object;

        var result = _controller.GetByResourceType(resourceType);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
        var contentResult = (ContentResult)result;

        var parser = new FhirJsonParser();
        var bundle = parser.Parse<Bundle>(contentResult.Content);

        Assert.AreEqual(0, bundle.Entry.Count);
    }

    [TestMethod]
    public void GetByResourceType_NonAdminUser_EqualResourceId_ShouldReturnBundleWithRespectiveEntry()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        var resourceList = new List<FhirResource>
        {
            new("123456789", resourceType, "{ \"resourceType\": \"Patient\" }"),
            new("12346", resourceType, "{ \"resourceType\": \"Patient\" }"),
            new("12347", resourceType, "{ \"resourceType\": \"Patient\" }")
        };
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType)).Returns(resourceList);
        
        var requestMock = new Mock<HttpRequest>();
        requestMock.Setup(r => r.Query).Returns(new QueryCollection(new Dictionary<string, StringValues>()));
        
        var httpContextMock = new Mock<HttpContext>();
        httpContextMock.Setup(c => c.Request).Returns(requestMock.Object);
        _controller.ControllerContext.HttpContext = httpContextMock.Object;

        var result = _controller.GetByResourceType(resourceType);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
        var contentResult = (ContentResult)result;

        var parser = new FhirJsonParser();
        var bundle = parser.Parse<Bundle>(contentResult.Content);

        Assert.AreEqual(1, bundle.Entry.Count);
    }

    [TestMethod]
    public void GetByResourceType_AdminUser_ShouldReturnResource()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        const string resourceId = "12345";
        var resource =
            new FhirResource(resourceId, resourceType, "{ \"resourceType\": \"Patient\", \"id\": \"12345\" }");
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, resourceId)).Returns(resource);

        var result = _controller.GetByResourceType(resourceType, resourceId);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
        var contentResult = (ContentResult)result;

        var parser = new FhirJsonParser();
        var parsedResource = parser.Parse<Resource>(contentResult.Content);

        Assert.AreEqual(resourceId, parsedResource.Id);
    }

    [TestMethod]
    public void GetByResourceType_NonAdminUser_DifferentResourceId_ShouldReturnUnauthorized()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        const string resourceId = "12345";
        var resource =
            new FhirResource(resourceId, resourceType, "{ \"resourceType\": \"Patient\", \"id\": \"12345\" }");
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, resourceId)).Returns(resource);

        var result = _controller.GetByResourceType(resourceType, resourceId);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
    }

    [TestMethod]
    public void GetByResourceType_NonAdminUser_EqualResourceId_ShouldReturnResource()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        const string resourceId = "123456789";
        var resource = new FhirResource(resourceId, resourceType,
            "{ \"resourceType\": \"Patient\", \"id\": \"123456789\" }");
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, resourceId)).Returns(resource);

        var result = _controller.GetByResourceType(resourceType, resourceId);

        Assert.IsInstanceOfType(result, typeof(ContentResult));
        var contentResult = (ContentResult)result;

        var parser = new FhirJsonParser();
        var parsedResource = parser.Parse<Resource>(contentResult.Content);

        Assert.AreEqual(resourceId, parsedResource.Id);
    }

    [TestMethod]
    public void GetByResourceType_ResourceNotFound_ShouldReturnNotFound()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        const string resourceId = "987654321";
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, resourceId))
            .Returns((FhirResource)null);

        var result = _controller.GetByResourceType(resourceType, resourceId);

        Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.AreEqual($"No resource of type {resourceType} found with id {resourceId}", notFoundResult.Value);
    }

    [TestMethod]
    public void Delete_AdminUser_ShouldReturnOk()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "admin-user-id", Role.Admin);

        const string resourceType = "Patient";
        const string resourceId = "12345";
        var resource =
            new FhirResource(resourceId, resourceType, "{ \"resourceType\": \"Patient\", \"id\": \"12345\" }");

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, resourceId)).Returns(resource);
        _fhirResourceRepositoryMock.Setup(repo => repo.Delete(It.IsAny<FhirResource>()));

        var result = _controller.Delete(resourceType, resourceId);

        Assert.IsInstanceOfType(result, typeof(OkResult));
    }

    [TestMethod]
    public void Delete_NonAdminUser_DifferentResourceId_ShouldReturnUnauthorized()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        const string resourceId = "12345";
        var resource =
            new FhirResource(resourceId, resourceType, "{ \"resourceType\": \"Patient\", \"id\": \"12345\" }");

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, resourceId)).Returns(resource);

        var result = _controller.Delete(resourceType, resourceId);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
    }

    [TestMethod]
    public void Delete_ResourceNotFound_ShouldReturnNotFound()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        const string resourceId = "987654321";

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, resourceId))
            .Returns((FhirResource)null);

        var result = _controller.Delete(resourceType, resourceId);

        Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.AreEqual($"No resource of type {resourceType} found with id {resourceId}", notFoundResult.Value);
    }

    [TestMethod]
    public void Delete_ErrorDeletingResource_ShouldReturnBadRequest()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        const string resourceType = "Patient";
        const string resourceId = "12345";
        var resource =
            new FhirResource(resourceId, resourceType, "{ \"resourceType\": \"Patient\", \"id\": \"12345\" }");

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, resourceId)).Returns(resource);
        _fhirResourceRepositoryMock.Setup(repo => repo.Delete(It.IsAny<FhirResource>()))
            .Throws(new Exception("Database error"));

        var result = _controller.Delete(resourceType, resourceId);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        var badRequestResult = (BadRequestObjectResult)result;
        Assert.AreEqual("Error deleting FHIR resource: Database error", badRequestResult.Value);
    }

    [TestMethod]
    public void Delete_NonAdminUser_EqualResourceId_ShouldReturnOk()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        const string resourceType = "Patient";
        const string resourceId = "123456789";
        var resource = new FhirResource(resourceId, resourceType,
            "{ \"resourceType\": \"Patient\", \"id\": \"123456789\" }");

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType(resourceType, resourceId)).Returns(resource);
        _fhirResourceRepositoryMock.Setup(repo => repo.Delete(It.IsAny<FhirResource>()));

        var result = _controller.Delete(resourceType, resourceId);

        Assert.IsInstanceOfType(result, typeof(OkResult));
    }

    [TestMethod]
    public void GetAll_AdminUser_ShouldReturnResources()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Admin);

        var resourceList = new List<FhirResource>
        {
            new("12345", "Patient", "{ \"resourceType\": \"Patient\", \"id\": \"12345\" }"),
            new("12346", "Patient", "{ \"resourceType\": \"Patient\", \"id\": \"12346\" }")
        };

        _fhirResourceRepositoryMock.Setup(repo => repo.GetAll()).Returns(resourceList);

        var result = _controller.GetAll();

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        Assert.AreEqual(resourceList, okResult.Value);
    }

    [TestMethod]
    public void GetAll_NonAdminUser_ShouldReturnUnauthorized()
    {
        TestUtils.SetGlobalUserClaims(_controller.ControllerContext.HttpContext, "123456789", Role.Patient);

        var result = _controller.GetAll();

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("You are not authorized to perform this action.", unauthorizedResult.Value);
    }
}