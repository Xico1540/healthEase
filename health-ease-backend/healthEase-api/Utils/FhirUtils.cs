using System.Reflection;
using System.Text.Json;
using healthEase_backend.Model.Enum;
using Hl7.Fhir.FhirPath;
using Hl7.Fhir.Model;

namespace healthEase_backend.Utils;

/// <summary>
/// Provides utility methods for working with FHIR resources.
/// </summary>
public static class FhirUtils
{
    /// <summary>
    /// Validates if the given resource type is allowed.
    /// </summary>
    /// <param name="resourceType">The resource type to validate.</param>
    /// <param name="allowedResourceTypes">A set of allowed resource types.</param>
    /// <exception cref="Exception">Thrown when the resource type is not allowed.</exception>
    public static void ValidateResourceType(string resourceType, HashSet<string> allowedResourceTypes)
    {
        if (!allowedResourceTypes.Contains(resourceType))
        {
            throw new Exception($"Resource type {resourceType} is not allowed.");
        }
    }

    /// <summary>
    /// Extracts telecom contact points from a FHIR resource.
    /// </summary>
    /// <param name="resource">The FHIR resource to extract telecoms from.</param>
    /// <returns>An enumerable of contact points.</returns>
    public static IEnumerable<ContactPoint> ExtractTelecoms(Resource resource)
    {
        var telecoms = resource
            .Select("descendants().where($this is ContactPoint)")
            .Cast<ContactPoint>();
        return telecoms;
    }

    /// <summary>
    /// Converts a <see cref="DayOfWeek"/> to a FHIR <see cref="DaysOfWeek"/>.
    /// </summary>
    /// <param name="dayOfWeek">The day of the week to convert.</param>
    /// <returns>The corresponding FHIR day of the week, or null if no match is found.</returns>
    public static DaysOfWeek? ConvertDayOfWeek(DayOfWeek dayOfWeek)
    {
        return dayOfWeek switch
        {
            DayOfWeek.Monday => DaysOfWeek.Mon,
            DayOfWeek.Tuesday => DaysOfWeek.Tue,
            DayOfWeek.Wednesday => DaysOfWeek.Wed,
            DayOfWeek.Thursday => DaysOfWeek.Thu,
            DayOfWeek.Friday => DaysOfWeek.Fri,
            DayOfWeek.Saturday => DaysOfWeek.Sat,
            DayOfWeek.Sunday => DaysOfWeek.Sun,
            _ => null
        };
    }

    /// <summary>
    /// Converts a <see cref="Gender"/> to a FHIR <see cref="AdministrativeGender"/>.
    /// </summary>
    /// <param name="gender">The gender to convert.</param>
    /// <returns>The corresponding FHIR administrative gender, or null if no match is found.</returns>
    public static AdministrativeGender? ConvertGender(Gender gender)
    {
        return gender switch
        {
            Gender.Male => AdministrativeGender.Male,
            Gender.Female => AdministrativeGender.Female,
            _ => null
        };
    }

    /// <summary>
    /// Extracts resource references from a FHIR resource.
    /// </summary>
    /// <param name="resource">The FHIR resource to extract references from.</param>
    /// <returns>An enumerable of resource references.</returns>
    public static IEnumerable<ResourceReference> ExtractResourceReferences(Resource resource)
    {
        var references = resource.Select("descendants().where($this is Reference)")
            .Cast<ResourceReference>();
        return references;
    }

    /// <summary>
    /// Checks if a property exists in a resource instance.
    /// </summary>
    /// <param name="resourceInstance">The resource instance to check.</param>
    /// <param name="propertyPath">The property path to check.</param>
    /// <returns>True if the property exists, otherwise false.</returns>
    public static bool DoesPropertyExist(object resourceInstance, string propertyPath)
    {
        var propertyNames = propertyPath.Split('.');
        var currentObject = resourceInstance;

        if (propertyNames.Length == 0)
        {
            return false;
        }

        for (var i = 0; i < propertyNames.Length; i++)
        {
            var propertyName = propertyNames[i];

            if (currentObject == null) return false;

            var currentType = currentObject.GetType();

            if (typeof(IEnumerable<object>).IsAssignableFrom(currentType) && currentType.IsGenericType)
            {
                currentType = currentType.GetGenericArguments()[0];
            }

            var propertyInfo = currentType.GetProperty(propertyName,
                BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

            if (propertyInfo == null)
            {
                return false;
            }

            if (i < propertyNames.Length - 1)
            {
                currentObject = propertyInfo.GetValue(currentObject);
            }
        }

        return true;
    }

    /// <summary>
    /// Checks if a JSON content contains a specific key-value pair.
    /// </summary>
    /// <param name="jsonContent">The JSON content to check.</param>
    /// <param name="key">The key to look for.</param>
    /// <param name="value">The value to match.</param>
    /// <returns>True if the key-value pair is found, otherwise false.</returns>
    public static bool JsonContains(string jsonContent, string key, string value)
    {
        using var doc = JsonDocument.Parse(jsonContent);
        return JsonElementContains(doc.RootElement, key.Split('.'), value);
    }

    /// <summary>
    /// Recursively checks if a JSON element contains a specific key-value pair.
    /// </summary>
    /// <param name="element">The JSON element to check.</param>
    /// <param name="keys">The keys to look for.</param>
    /// <param name="value">The value to match.</param>
    /// <returns>True if the key-value pair is found, otherwise false.</returns>
    private static bool JsonElementContains(JsonElement element, string[] keys, string value)
    {
        if (keys.Length == 0)
        {
            return false;
        }

        var currentKey = keys[0];
        var remainingKeys = keys.Skip(1).ToArray();

        if (element.ValueKind == JsonValueKind.Object)
        {
            foreach (var property in element.EnumerateObject())
            {
                if (property.Name.Equals(currentKey, StringComparison.OrdinalIgnoreCase))
                {
                    if (remainingKeys.Length == 0)
                    {
                        if (property.Value.ToString().Contains(value, StringComparison.OrdinalIgnoreCase))
                        {
                            return true;
                        }
                    }
                    else
                    {
                        if (JsonElementContains(property.Value, remainingKeys, value))
                        {
                            return true;
                        }
                    }
                }
            }
        }
        else if (element.ValueKind == JsonValueKind.Array)
        {
            return element.EnumerateArray().Any(item => JsonElementContains(item, keys, value));
        }

        return false;
    }

    /// <summary>
    /// Creates an instance of a FHIR resource based on the resource type.
    /// </summary>
    /// <param name="resourceType">The resource type to create an instance of.</param>
    /// <returns>The created FHIR resource instance, or null if the type is not found.</returns>
    public static object? CreateFhirResourceInstance(string resourceType)
    {
        var fhirType = Type.GetType($"Hl7.Fhir.Model.{resourceType}, Hl7.Fhir.R4");
        return fhirType != null ? Activator.CreateInstance(fhirType) : null;
    }
    
    /// <summary>
    /// Extracts the ID from a FHIR resource reference.
    /// </summary>
    /// <param name="reference">The resource reference to extract the ID from.</param>
    /// <returns>The extracted ID as a string.</returns>
    public static string ExtractIdFromReference(string reference)
    {
        var parts = reference.Split('/');
        return parts.Length > 1 ? parts[1] : string.Empty;
    }
}
