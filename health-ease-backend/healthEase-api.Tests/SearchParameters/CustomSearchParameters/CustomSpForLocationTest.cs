using System;
using System.Collections.Generic;
using System.Linq;
using healthEase_backend.Infrastructure;
using healthEase_backend.Model;
using healthEase_backend.SearchParameters.CustomSearchParameters;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.SearchParameters.CustomSearchParameters;

[TestClass]
public class CustomSpForLocationTest
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
            new FhirResource("1", "Practitioner", "{}"),
            new FhirResource("2", "PractitionerRole",
                "{\"practitioner\": {\"reference\": \"Practitioner/1\"}, \"location\": [{\"reference\": \"Location/3\"}]}"),
            new FhirResource("3", "Location", "{}")
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
    public void FilterLocationByPractitionerViaPractitionerRole_ShouldReturnLocation_WhenPractitionerExists()
    {
        var result = CustomSpForLocation.FilterLocationByPractitionerViaPractitionerRole("1", _context);

        Assert.AreEqual(1, result.Count());
        Assert.AreEqual("3", result.First().Id);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception), "No Practitioner found with id 999")]
    public void FilterLocationByPractitionerViaPractitionerRole_ShouldThrowException_WhenPractitionerNotFound()
    {
        CustomSpForLocation.FilterLocationByPractitionerViaPractitionerRole("999", _context);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception), "No PractitionerRole found for Practitioner with id 1")]
    public void FilterLocationByPractitionerViaPractitionerRole_ShouldThrowException_WhenPractitionerRoleNotFound()
    {
        _context.FhirResources.Remove(
            _context.FhirResources.Single(r => r.Id == "2" && r.ResourceType == "PractitionerRole"));
        _context.SaveChanges();

        CustomSpForLocation.FilterLocationByPractitionerViaPractitionerRole("1", _context);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception), "No Location found for PractitionerRole with id 2")]
    public void FilterLocationByPractitionerViaPractitionerRole_ShouldThrowException_WhenLocationReferenceIsMissing()
    {
        var practitionerRoleResource =
            _context.FhirResources.Single(r => r.Id == "2" && r.ResourceType == "PractitionerRole");
        practitionerRoleResource.ResourceContent =
            "{\"practitioner\": {\"reference\": \"Practitioner/1\"}, \"location\": []}";
        _context.SaveChanges();

        CustomSpForLocation.FilterLocationByPractitionerViaPractitionerRole("1", _context);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception), "No Location found with id 3")]
    public void FilterLocationByPractitionerViaPractitionerRole_ShouldThrowException_WhenLocationNotFound()
    {
        _context.FhirResources.Remove(_context.FhirResources.Single(r => r.Id == "3" && r.ResourceType == "Location"));
        _context.SaveChanges();

        CustomSpForLocation.FilterLocationByPractitionerViaPractitionerRole("1", _context);
    }
}
