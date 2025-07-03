using System.Text.Json;
using healthEase_backend.Infrastructure;
using healthEase_backend.Model;

namespace healthEase_backend.SearchParameters.CustomSearchParameters;

/// <summary>
/// Provides custom search parameters for appointments.
/// </summary>
public static class CustomSpForAppointment
{
    /// <summary>
    /// Filters appointments by start date and participant.
    /// </summary>
    /// <param name="startDate">The start date to filter appointments.</param>
    /// <param name="context">The database context.</param>
    /// <returns>An enumerable of FHIR resources representing the filtered appointments.</returns>
    public static IEnumerable<FhirResource> FilterAppointmentByDateAndParticipant(string startDate,
        ConnectionContext context)
    {
        var parsedStartDate = DateTime.Parse(startDate);
        return context.FhirResources
            .Where(r => r.ResourceType == "Appointment")
            .AsEnumerable()
            .Where(r => JsonDocument.Parse(r.ResourceContent).RootElement.GetProperty("start").GetDateTime() >=
                        parsedStartDate)
            .OrderBy(r => JsonDocument.Parse(r.ResourceContent).RootElement.GetProperty("start").GetDateTime());
    }
}
