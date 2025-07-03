using healthEase_backend.Dto.User.Request;
using Hl7.Fhir.Model;

namespace healthEase_backend.Model.Interfaces.Fhir;

/// <summary>
/// Interface for FHIR service to manage FHIR resources and operations.
/// </summary>
public interface IFhirService
{
    /// <summary>
    /// Creates a FHIR patient resource.
    /// </summary>
    /// <param name="userPatientDto">The user patient registration DTO.</param>
    /// <param name="resourceId">The ID of the resource.</param>
    void CreateFhirPatientResource(UserPatientRegistrationDto userPatientDto, string resourceId);

    /// <summary>
    /// Creates schedules and slots for a practitioner role.
    /// </summary>
    /// <param name="practitionerRole">The practitioner role.</param>
    void CreateSchedulesAndSlots(PractitionerRole practitionerRole);
    
    /// <summary>
    /// Reserves a booking slot for an appointment.
    /// </summary>
    /// <param name="appointment">The appointment to reserve a slot for.</param>
    void ReserveBookingSlot(Appointment appointment);

    /// <summary>
    /// Releases a booking slot by appointment ID.
    /// </summary>
    /// <param name="appointmentId">The ID of the appointment.</param>
    void ReleaseBookingSlot(string appointmentId);
}
