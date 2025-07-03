using System.Collections.Generic;
using System.Linq;
using healthEase_backend.Infrastructure;
using healthEase_backend.Model;
using healthEase_backend.SearchParameters;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.SearchParameters;

[TestClass]
public class SearchParameterRulesTest
{
    private ConnectionContext _context;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<ConnectionContext>()
            .UseInMemoryDatabase(databaseName: "FhirResources")
            .Options;
        _context = new ConnectionContext(options);

        _context.FhirResources.AddRange(new List<FhirResource>
        {
            new FhirResource("1", "Practitioner", "{\"id\": \"Practitioner/1\"}"),
            new FhirResource("2", "PractitionerRole",
                "{\"practitioner\": {\"reference\": \"Practitioner/1\"}, \"location\": [{\"reference\": \"Location/4\"}], \"specialty\": [{\"coding\": [{\"system\": \"http://snomed.info/sct\", \"code\": \"394913002\", \"display\": \"Cardiology\"}]}]}"),
            new FhirResource("3", "Appointment", "{\"start\": \"2023-11-01T09:00:00\"}"),
            new FhirResource("4", "Location", "{}")
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
    public void GetSearchParameterRulesRules_ShouldReturnExpectedRules()
    {
        const string testValue = "test";

        var rules = SearchParameterRules.GetSearchParameterRulesRules(testValue, _context);

        Assert.AreEqual(3, rules.Count);

        var practitionerRule = rules.FirstOrDefault(r => r.ResourceType == "Practitioner");
        Assert.IsNotNull(practitionerRule);
        Assert.AreEqual("specialty", practitionerRule.PropertyName);
        Assert.IsNotNull(practitionerRule.FilterMethod);

        var appointmentRule = rules.FirstOrDefault(r => r.ResourceType == "Appointment");
        Assert.IsNotNull(appointmentRule);
        Assert.AreEqual("startDate", appointmentRule.PropertyName);
        Assert.IsNotNull(appointmentRule.FilterMethod);

        var locationRule = rules.FirstOrDefault(r => r.ResourceType == "Location");
        Assert.IsNotNull(locationRule);
        Assert.AreEqual("practitioner", locationRule.PropertyName);
        Assert.IsNotNull(locationRule.FilterMethod);
    }

    [TestMethod]
    public void GetSearchParameterRulesRules_PractitionerRule_ShouldCallFilterPractitionerBySpecialty()
    {
        const string testValue = "Cardiology";
        var rules = SearchParameterRules.GetSearchParameterRulesRules(testValue, _context);
        var practitionerRule = rules.First(r => r.ResourceType == "Practitioner");

        var result = practitionerRule.FilterMethod(testValue);

        Assert.IsTrue(result.Any(r => r.ResourceType == "Practitioner" && r.Id == "1"));
    }

    [TestMethod]
    public void GetSearchParameterRulesRules_AppointmentRule_ShouldCallFilterAppointmentByDateAndParticipant()
    {
        const string testValue = "2023-11-01T00:00:00";
        var rules = SearchParameterRules.GetSearchParameterRulesRules(testValue, _context);
        var appointmentRule = rules.First(r => r.ResourceType == "Appointment");

        var result = appointmentRule.FilterMethod(testValue);

        Assert.IsTrue(result.Any(r => r.ResourceType == "Appointment" && r.Id == "3"));
    }

    [TestMethod]
    public void GetSearchParameterRulesRules_LocationRule_ShouldCallFilterLocationByPractitionerViaPractitionerRole()
    {
        const string testValue = "1";
        var rules = SearchParameterRules.GetSearchParameterRulesRules(testValue, _context);
        var locationRule = rules.First(r => r.ResourceType == "Location");

        var result = locationRule.FilterMethod(testValue);

        Assert.IsTrue(result.Any(r => r.ResourceType == "Location" && r.Id == "4"));
    }
}
