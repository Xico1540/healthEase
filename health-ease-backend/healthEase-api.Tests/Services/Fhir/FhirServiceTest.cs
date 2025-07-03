using System;
using System.Collections.Generic;
using healthEase_backend.Dto.User.Request;
using healthEase_backend.Model;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Services.Fhir;
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Address = healthEase_backend.Dto.User.Request.Address;

namespace healthEase_backend.Tests.Services.Fhir;

[TestClass]
public class FhirServiceTest
{
    private Mock<IFhirResourceRepository> _fhirResourceRepositoryMock;
    private FhirService _fhirService;

    [TestInitialize]
    public void Setup()
    {
        _fhirResourceRepositoryMock = new Mock<IFhirResourceRepository>();
        _fhirService = new FhirService(_fhirResourceRepositoryMock.Object);
    }

    [TestMethod]
    public void CreateFhirPatientResource_ShouldAddPatientResourceToRepository()
    {
        var userPatientDto = new UserPatientRegistrationDto()
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "123456789",
            Address = new Address
            {
                Street = "123 Main St",
                City = "City",
                PostalCode = "12345"
            }
        };
        const string resourceId = "patient-123";

        _fhirService.CreateFhirPatientResource(userPatientDto, resourceId);

        _fhirResourceRepositoryMock.Verify(repo => repo.Add(It.Is<FhirResource>(fr =>
            fr.Id == resourceId &&
            fr.ResourceType == "Patient")), Times.Once);
    }

    [TestMethod]
    public void CreateSchedulesAndSlots_ShouldCreateSchedulesAndSlots_WhenAvailableTimeExists()
    {
        // Arrange
        var practitionerRole = new PractitionerRole
        {
            Practitioner = new ResourceReference("Practitioner/123"),
            AvailableTime = new List<PractitionerRole.AvailableTimeComponent>
            {
                new PractitionerRole.AvailableTimeComponent
                {
                    DaysOfWeek = new List<DaysOfWeek?> { DaysOfWeek.Mon },
                    AvailableStartTime = "09:00",
                    AvailableEndTime = "17:00"
                }
            }
        };

        _fhirService.CreateSchedulesAndSlots(practitionerRole);

        _fhirResourceRepositoryMock.Verify(repo => repo.Add(It.Is<FhirResource>(fr =>
            fr.ResourceType == "Schedule")), Times.AtLeastOnce);

        _fhirResourceRepositoryMock.Verify(repo => repo.Add(It.Is<FhirResource>(fr =>
            fr.ResourceType == "Slot")), Times.AtLeastOnce);
    }

    [TestMethod]
    public void CreateSchedulesAndSlots_ShouldNotCreateSchedulesOrSlots_WhenNoAvailableTimeExists()
    {
        var practitionerRole = new PractitionerRole
        {
            Practitioner = new ResourceReference("Practitioner/123"),
            AvailableTime = new List<PractitionerRole.AvailableTimeComponent>()
        };

        _fhirService.CreateSchedulesAndSlots(practitionerRole);
        _fhirResourceRepositoryMock.Verify(repo => repo.Add(It.IsAny<FhirResource>()), Times.Never);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentNullException))]
    public void ReserveBookingSlot_ShouldThrowArgumentNullException_WhenAppointmentIsNull()
    {
        _fhirService.ReserveBookingSlot(null);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentException), "The Appointment does not contain a valid patient.")]
    public void ReserveBookingSlot_ShouldThrowException_WhenPatientIsMissing()
    {
        var appointment = new Appointment
        {
            Participant = new List<Appointment.ParticipantComponent>
            {
                new Appointment.ParticipantComponent
                {
                    Actor = new ResourceReference("Practitioner/123")
                }
            }
        };

        _fhirService.ReserveBookingSlot(appointment);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentException), "The Appointment does not contain a valid practitioner.")]
    public void ReserveBookingSlot_ShouldThrowException_WhenPractitionerIsMissing()
    {
        var appointment = new Appointment
        {
            Participant = new List<Appointment.ParticipantComponent>
            {
                new Appointment.ParticipantComponent
                {
                    Actor = new ResourceReference("Patient/123")
                }
            }
        };

        _fhirService.ReserveBookingSlot(appointment);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentException), "The Appointment does not contain valid times.")]
    public void ReserveBookingSlot_ShouldThrowException_WhenTimesAreMissing()
    {
        var appointment = new Appointment
        {
            Participant = new List<Appointment.ParticipantComponent>
            {
                new Appointment.ParticipantComponent
                {
                    Actor = new ResourceReference("Patient/123")
                },
                new Appointment.ParticipantComponent
                {
                    Actor = new ResourceReference("Practitioner/123")
                }
            }
        };

        _fhirService.ReserveBookingSlot(appointment);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentException), "The Appointment does not contain a valid slot reference.")]
    public void ReserveBookingSlot_ShouldThrowException_WhenSlotReferenceIsMissing()
    {
        var appointment = new Appointment
        {
            Participant = new List<Appointment.ParticipantComponent>
            {
                new Appointment.ParticipantComponent { Actor = new ResourceReference("Patient/123") },
                new Appointment.ParticipantComponent { Actor = new ResourceReference("Practitioner/123") }
            },
            Start = DateTimeOffset.Now,
            End = DateTimeOffset.Now.AddHours(1)
        };

        _fhirService.ReserveBookingSlot(appointment);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentException), "The Slot could not be found.")]
    public void ReserveBookingSlot_ShouldThrowException_WhenSlotDoesNotExist()
    {
        var appointment = new Appointment
        {
            Participant = new List<Appointment.ParticipantComponent>
            {
                new Appointment.ParticipantComponent { Actor = new ResourceReference("Patient/123") },
                new Appointment.ParticipantComponent { Actor = new ResourceReference("Practitioner/123") }
            },
            Start = DateTimeOffset.Now,
            End = DateTimeOffset.Now.AddHours(1),
            Slot = new List<ResourceReference> { new ResourceReference("Slot/456") }
        };

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Slot", "456")).Returns((FhirResource)null);
        _fhirService.ReserveBookingSlot(appointment);
    }

    [TestMethod]
    public void ReserveBookingSlot_ShouldUpdateSlotStatusToBusy()
    {
        var appointment = new Appointment
        {
            Participant = new List<Appointment.ParticipantComponent>
            {
                new Appointment.ParticipantComponent { Actor = new ResourceReference("Patient/123") },
                new Appointment.ParticipantComponent { Actor = new ResourceReference("Practitioner/123") }
            },
            Start = DateTimeOffset.Now,
            End = DateTimeOffset.Now.AddHours(1),
            Slot = new List<ResourceReference> { new ResourceReference("Slot/456") }
        };

        var slot = new Slot { Id = "456", Status = Slot.SlotStatus.Free };
        var slotResource = new FhirResource("456", "Slot", slot.ToJson());

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Slot", "456")).Returns(slotResource);
        _fhirService.ReserveBookingSlot(appointment);

        var parser = new FhirJsonParser();
        _fhirResourceRepositoryMock.Verify(repo => repo.Update(It.Is<FhirResource>(fr =>
            fr.Id == "456" && fr.ResourceType == "Slot" &&
            parser.Parse<Slot>(fr.ResourceContent).Status == Slot.SlotStatus.Busy)), Times.Once);
    }
    
    [TestMethod]
    [ExpectedException(typeof(ArgumentException), "The Appointment could not be found.")]
    public void ReleaseBookingSlot_ShouldThrowException_WhenAppointmentDoesNotExist()
    {
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Appointment", "appointment-123"))
            .Returns((FhirResource)null);

        _fhirService.ReleaseBookingSlot("appointment-123");
    }

    [TestMethod]
    public void ReleaseBookingSlot_ShouldNotThrowException_WhenSlotReferenceIsMissing()
    {
        var appointment = new Appointment { Slot = new List<ResourceReference>() };
        var appointmentResource = new FhirResource("appointment-123", "Appointment", appointment.ToJson());

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Appointment", "appointment-123"))
            .Returns(appointmentResource);

        _fhirService.ReleaseBookingSlot("appointment-123");
        
        _fhirResourceRepositoryMock.Verify(repo => repo.Update(It.IsAny<FhirResource>()), Times.Never);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentException), "The Slot could not be found.")]
    public void ReleaseBookingSlot_ShouldThrowException_WhenSlotDoesNotExist()
    {
        var appointment = new Appointment
        {
            Slot = new List<ResourceReference> { new ResourceReference("Slot/456") }
        };
        var appointmentResource = new FhirResource("appointment-123", "Appointment", appointment.ToJson());

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Appointment", "appointment-123"))
            .Returns(appointmentResource);
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Slot", "456")).Returns((FhirResource)null);

        _fhirService.ReleaseBookingSlot("appointment-123");
    }

    [TestMethod]
    public void ReleaseBookingSlot_ShouldUpdateSlotStatusToFree()
    {
        var appointment = new Appointment
        {
            Slot = new List<ResourceReference> { new ResourceReference("Slot/456") }
        };
        var appointmentResource = new FhirResource("appointment-123", "Appointment", appointment.ToJson());

        var slot = new Slot { Id = "456", Status = Slot.SlotStatus.Busy };
        var slotResource = new FhirResource("456", "Slot", slot.ToJson());

        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Appointment", "appointment-123"))
            .Returns(appointmentResource);
        _fhirResourceRepositoryMock.Setup(repo => repo.GetByResourceType("Slot", "456")).Returns(slotResource);

        _fhirService.ReleaseBookingSlot("appointment-123");

        var parser = new FhirJsonParser();
        _fhirResourceRepositoryMock.Verify(repo => repo.Update(It.Is<FhirResource>(fr =>
            fr.Id == "456" && fr.ResourceType == "Slot" &&
            parser.Parse<Slot>(fr.ResourceContent).Status == Slot.SlotStatus.Free)), Times.Once);
    }
}
