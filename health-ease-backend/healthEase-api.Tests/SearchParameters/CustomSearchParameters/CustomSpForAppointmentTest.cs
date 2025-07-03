using System.Collections.Generic;
using System.Linq;
using healthEase_backend.Infrastructure;
using healthEase_backend.Model;
using healthEase_backend.SearchParameters.CustomSearchParameters;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.SearchParameters.CustomSearchParameters;

[TestClass]
public class CustomSpForAppointmentTest
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
            new FhirResource("1", "Appointment", "{\"start\": \"2023-11-01T09:00:00\"}"),
            new FhirResource("2", "Appointment", "{\"start\": \"2023-11-05T09:00:00\"}"),
            new FhirResource("3", "Appointment", "{\"start\": \"2023-10-28T09:00:00\"}")
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
    public void FilterAppointmentByDateAndParticipant_ShouldReturnAppointments_OnValidStartDate()
    {
        const string startDate = "2023-11-01T00:00:00";

        var result = CustomSpForAppointment.FilterAppointmentByDateAndParticipant(startDate, _context);
        
        Assert.AreEqual(2, result.Count());
        Assert.IsTrue(result.Any(r => r.Id == "1"));
        Assert.IsTrue(result.Any(r => r.Id == "2"));
    }
}
