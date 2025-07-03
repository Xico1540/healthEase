using System.Text.Json;
using healthEase_backend.Infrastructure;
using healthEase_backend.Model;
using healthEase_backend.Utils;

namespace healthEase_backend.SearchParameters.CustomSearchParameters;

/// <summary>
/// Provides custom search parameters for practitioners.
/// </summary>
public static class CustomSpForPractitioner
{
    /// <summary>
    /// Filters practitioners by specialty.
    /// </summary>
    /// <param name="specialty">The specialty to filter practitioners by.</param>
    /// <param name="context">The database context.</param>
    /// <returns>An enumerable of FHIR resources representing the filtered practitioners.</returns>
    public static IEnumerable<FhirResource> FilterPractitionerBySpecialty(string specialty, ConnectionContext context)
    {
        var practitionerRoles = context.FhirResources
            .Where(r => r.ResourceType == "PractitionerRole")
            .AsEnumerable()
            .Where(r => FhirUtils.JsonContains(r.ResourceContent, "specialty", specialty))
            .ToList();

        var practitionerIds = new List<string>();
        foreach (var role in practitionerRoles)
        {
            using var doc = JsonDocument.Parse(role.ResourceContent);
            if (doc.RootElement.TryGetProperty("practitioner", out var practitionerElement))
            {
                var practitionerId = practitionerElement.GetProperty("reference").GetString()?.Split('/').Last();
                if (practitionerId != null)
                {
                    practitionerIds.Add(practitionerId);
                }
            }
        }

        return context.FhirResources
            .Where(r => r.ResourceType == "Practitioner" && practitionerIds.Contains(r.Id))
            .ToList();
    }
}
