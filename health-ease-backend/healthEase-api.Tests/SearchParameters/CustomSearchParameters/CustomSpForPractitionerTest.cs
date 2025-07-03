using System.Collections.Generic;
using System.Linq;
using healthEase_backend.Infrastructure;
using healthEase_backend.Model;
using healthEase_backend.SearchParameters.CustomSearchParameters;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.SearchParameters.CustomSearchParameters;

[TestClass]
public class CustomSpForPractitionerTest
{
    private ConnectionContext _context;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<ConnectionContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;
        _context = new ConnectionContext(options);

        _context.FhirResources.AddRange(new List<FhirResource>
        {
            new FhirResource("1", "PractitionerRole",
                "{\"specialty\": [{\"coding\": [{\"system\": \"http://snomed.info/sct\", \"code\": \"394913002\", \"display\": \"Cardiology\"}]}], \"practitioner\": {\"reference\": \"Practitioner/100\"}}"),
            new FhirResource("2", "PractitionerRole",
                "{\"specialty\": [{\"coding\": [{\"system\": \"http://snomed.info/sct\", \"code\": \"394811002\", \"display\": \"Orthopedics\"}]}], \"practitioner\": {\"reference\": \"Practitioner/200\"}}"),
            new FhirResource("3", "PractitionerRole",
                "{\"specialty\": [{\"coding\": [{\"system\": \"http://snomed.info/sct\", \"code\": \"394913002\", \"display\": \"Cardiology\"}]}], \"practitioner\": {\"reference\": \"Practitioner/300\"}}"),
            new FhirResource("100", "Practitioner", "{}"),
            new FhirResource("200", "Practitioner", "{}"),
            new FhirResource("300", "Practitioner", "{}")
        });
        _context.SaveChanges();
    }

    [TestCleanup]
    public void Cleanup()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [TestMethod]
    public void FilterPractitionerBySpecialty_ShouldReturnPractitioners_WithMatchingSpecialty()
    {
        var result = CustomSpForPractitioner.FilterPractitionerBySpecialty("Cardiology", _context);

        Assert.AreEqual(2, result.Count());
        Assert.IsTrue(result.Any(r => r.Id == "100"));
        Assert.IsTrue(result.Any(r => r.Id == "300"));
    }

    [TestMethod]
    public void FilterPractitionerBySpecialty_ShouldReturnEmpty_WhenSpecialtyNotFound()
    {
        var result = CustomSpForPractitioner.FilterPractitionerBySpecialty("Neurology", _context);
        Assert.AreEqual(0, result.Count());
    }

    [TestMethod]
    public void FilterPractitionerBySpecialty_ShouldReturnEmpty_WhenNoPractitionerRolesMatchSpecialty()
    {
        _context.FhirResources.RemoveRange(_context.FhirResources.Where(r => r.ResourceType == "PractitionerRole"));
        _context.SaveChanges();

        var result = CustomSpForPractitioner.FilterPractitionerBySpecialty("Cardiology", _context);
        Assert.AreEqual(0, result.Count());
    }

    [TestMethod]
    public void FilterPractitionerBySpecialty_ShouldReturnPractitioners_OnlyMatchingSpecialty()
    {
        var result = CustomSpForPractitioner.FilterPractitionerBySpecialty("Orthopedics", _context);

        Assert.AreEqual(1, result.Count());
        Assert.AreEqual("200", result.First().Id);
    }
}