using healthEase_backend.Dto.User.Request;
using healthEase_backend.Mappers;
using healthEase_backend.Model;
using healthEase_backend.Model.Interfaces.Fhir;
using healthEase_backend.Model.Interfaces.Infrastructure;
using healthEase_backend.Utils;
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;
using Lombok.NET;

namespace healthEase_backend.Services.Fhir;

[AllArgsConstructor]
public partial class FhirService : IFhirService
{
    private readonly IFhirResourceRepository _fhirResourceRepository;
    
    public void CreateFhirPatientResource(UserPatientRegistrationDto userPatientDto, string resourceId)
    {
        var patientResource = FhirPatientMapper.Map(userPatientDto);
        patientResource.Id = resourceId;

        var jsonSerializer = new FhirJsonSerializer();
        var patientResourceJson = jsonSerializer.SerializeToString(patientResource);

        var fhirResource = new FhirResource(resourceId, "Patient", patientResourceJson);
        _fhirResourceRepository.Add(fhirResource);
    }
    
        public void CreateSchedulesAndSlots(PractitionerRole practitionerRole)
    {
        if (practitionerRole.AvailableTime == null || practitionerRole.AvailableTime.Count == 0)
            return;

        const int daysToProcess = 30;
        var currentDate = DateTimeOffset.Now.AddDays(7);

        foreach (var dayOffset in Enumerable.Range(0, daysToProcess))
        {
            var targetDate = currentDate.AddDays(dayOffset);
            practitionerRole.AvailableTime
                .Where(availableTime => availableTime.DaysOfWeek.Any(d =>
                    string.Equals(d?.ToString(), FhirUtils.ConvertDayOfWeek(targetDate.DayOfWeek)?.ToString(),
                        StringComparison.OrdinalIgnoreCase)))
                .ToList()
                .ForEach(availableTime => CreateSchedule(practitionerRole, availableTime, targetDate));
        }
    }

    private void CreateSchedule(PractitionerRole practitionerRole,
        PractitionerRole.AvailableTimeComponent availableTime, DateTimeOffset day)
    {
        var startTime = TimeSpan.Parse(availableTime.AvailableStartTime);
        var endTime = TimeSpan.Parse(availableTime.AvailableEndTime);

        var scheduleStart = day.Date.Add(startTime);
        var scheduleEnd = day.Date.Add(endTime);

        var schedule = new Schedule
        {
            Id = Guid.NewGuid().ToString(),
            Active = true,
            Actor = new List<ResourceReference> { new($"{practitionerRole.Practitioner.Reference}") },
            PlanningHorizon = new Period
            {
                Start = scheduleStart.ToString("o"),
                End = scheduleEnd.ToString("o")
            },
            Comment = $"Schedule for {day.DayOfWeek} on {day:yyyy-MM-dd} - (auto generated)"
        };

        _fhirResourceRepository.Add(new FhirResource(schedule.Id, "Schedule", schedule.ToJson()));

        CreateSlots(schedule, startTime, endTime, day);
    }

    private void CreateSlots(Schedule schedule, TimeSpan startTime, TimeSpan endTime, DateTimeOffset day)
    {
        foreach (var time in Enumerable.Range(0, (int)(endTime - startTime).TotalMinutes / 30)
                     .Select(offset => startTime.Add(TimeSpan.FromMinutes(30 * offset))))
        {
            var slotStart = day.Date.Add(time);
            var slotEnd = slotStart.AddMinutes(30);

            var slot = new Slot
            {
                Id = Guid.NewGuid().ToString(),
                Schedule = new ResourceReference($"Schedule/{schedule.Id}"),
                Status = Slot.SlotStatus.Free,
                Start = slotStart,
                End = slotEnd,
                Comment =
                    $"Slot from {slotStart:HH:mm} to {slotEnd:HH:mm} for {day.DayOfWeek} - (auto generated)"
            };
            _fhirResourceRepository.Add(new FhirResource(slot.Id, "Slot", slot.ToJson()));
        }
    }
    
        public void ReserveBookingSlot(Appointment appointment)
    {
        ArgumentNullException.ThrowIfNull(appointment);

        var patientActor = appointment.Participant.FirstOrDefault(p => p.Actor.Reference.StartsWith("Patient/"));
        var practitionerActor =
            appointment.Participant.FirstOrDefault(p => p.Actor.Reference.StartsWith("Practitioner/"));

        if (patientActor == null)
            throw new ArgumentException("The Appointment does not contain a valid patient.");

        if (practitionerActor == null)
            throw new ArgumentException("The Appointment does not contain a valid practitioner.");

        if (!appointment.Start.HasValue || !appointment.End.HasValue)
            throw new ArgumentException("The Appointment does not contain valid times.");

        var slotReference = appointment.Slot.FirstOrDefault()?.Reference;
        if (slotReference == null)
            throw new ArgumentException("The Appointment does not contain a valid slot reference.");

        var slotId = FhirUtils.ExtractIdFromReference(slotReference);
        var slotResource = _fhirResourceRepository.GetByResourceType("Slot", slotId);

        if (slotResource == null)
            throw new ArgumentException("The Slot could not be found.");

        var slot = new FhirJsonParser().Parse<Slot>(slotResource.ResourceContent);
        slot.Status = Slot.SlotStatus.Busy;

        _fhirResourceRepository.Update(new FhirResource(slot.Id, slotResource.ResourceType, slot.ToJson()));
    }

    public void ReleaseBookingSlot(string appointmentId)
    {
        var appointmentResource = _fhirResourceRepository.GetByResourceType("Appointment", appointmentId);
        if (appointmentResource == null)
            throw new ArgumentException("The Appointment could not be found.");

        var appointment = new FhirJsonParser().Parse<Appointment>(appointmentResource.ResourceContent);

        var slotReference = appointment.Slot.FirstOrDefault()?.Reference;
        if (slotReference == null)
            return;

        var slotId = FhirUtils.ExtractIdFromReference(slotReference);
        var slotResource = _fhirResourceRepository.GetByResourceType("Slot", slotId);

        if (slotResource == null)
            throw new ArgumentException("The Slot could not be found.");

        var slot = new FhirJsonParser().Parse<Slot>(slotResource.ResourceContent);
        slot.Status = Slot.SlotStatus.Free;

        _fhirResourceRepository.Update(new FhirResource(slot.Id, slotResource.ResourceType, slot.ToJson()));
    }
}
