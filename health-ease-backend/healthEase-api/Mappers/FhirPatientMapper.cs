using healthEase_backend.Dto.User.Request;
using healthEase_backend.Utils;
using Hl7.Fhir.Model;
using Address = Hl7.Fhir.Model.Address;

namespace healthEase_backend.Mappers;

/// <summary>
/// Mapper class for converting UserPatientRegistrationDto to FHIR Patient.
/// </summary>
public class FhirPatientMapper
{
    /// <summary>
    /// Maps a UserPatientRegistrationDto to a FHIR Patient.
    /// </summary>
    /// <param name="userPatientRegistrationDto">The user patient registration DTO.</param>
    /// <returns>A FHIR Patient object.</returns>
    public static Patient Map(UserPatientRegistrationDto userPatientRegistrationDto)
    {
        return new Patient
        {
            Name =
            {
                new HumanName
                {
                    Family = userPatientRegistrationDto.LastName,
                    Given = new List<string> { userPatientRegistrationDto.FirstName }
                }
            },
            Gender = FhirUtils.ConvertGender(userPatientRegistrationDto.Gender),
            BirthDate = userPatientRegistrationDto.BirthDate.ToString("yyyy-MM-dd"),
            Identifier =
            {
                new Identifier
                {
                    System = "heathId", 
                    Value = userPatientRegistrationDto.HealthId.ToString()
                }
            },
            Telecom =
            {
                new ContactPoint
                {
                    System = ContactPoint.ContactPointSystem.Email,
                    Value = userPatientRegistrationDto.Email,
                },
                new ContactPoint
                {
                    System = ContactPoint.ContactPointSystem.Phone,
                    Value = userPatientRegistrationDto.PhoneNumber,
                }
            },
            Address =
            {
                new Address
                {
                    Line = new List<string> { userPatientRegistrationDto.Address.Street },
                    City = userPatientRegistrationDto.Address.City,
                    PostalCode = userPatientRegistrationDto.Address.PostalCode,
                }
            },
            Active = true
        };
    }
}
