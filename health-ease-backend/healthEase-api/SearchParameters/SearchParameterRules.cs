using healthEase_backend.Infrastructure;
using healthEase_backend.Model;
using healthEase_backend.SearchParameters.CustomSearchParameters;

namespace healthEase_backend.SearchParameters;

/// <summary>
/// Represents the rules for search parameters.
/// </summary>
public class SearchParameterRules
{
    /// <summary>
    /// Gets or sets the property name for the search parameter.
    /// </summary>
    public string? PropertyName { get; set; }

    /// <summary>
    /// Gets or sets the resource type for the search parameter.
    /// </summary>
    public string? ResourceType { get; set; }

    /// <summary>
    /// Gets or sets the filter method for the search parameter.
    /// </summary>
    public Func<string, IEnumerable<FhirResource>>? FilterMethod { get; set; }

    /// <summary>
    /// Gets the search parameter rules based on the provided value and context.
    /// </summary>
    /// <param name="value">The value to filter by.</param>
    /// <param name="context">The database context.</param>
    /// <returns>A list of search parameter rules.</returns>
    public static List<SearchParameterRules> GetSearchParameterRulesRules(string value, ConnectionContext context)
    {
        return new List<SearchParameterRules>
        {
            new()
            {
                ResourceType = "Practitioner", PropertyName = "specialty",
                FilterMethod = _ =>
                    CustomSpForPractitioner.FilterPractitionerBySpecialty(value, context)
            },
            new()
            {
                ResourceType = "Appointment", PropertyName = "startDate",
                FilterMethod = _ =>
                    CustomSpForAppointment.FilterAppointmentByDateAndParticipant(value, context)
            },
            new()
            {
                ResourceType = "Location", PropertyName = "practitioner",
                FilterMethod = _ =>
                    CustomSpForLocation.FilterLocationByPractitionerViaPractitionerRole(value, context)
            }
        };
    }
}
