using healthEase_backend.Exceptions.Fhir;
using healthEase_backend.Model;
using healthEase_backend.SearchParameters;
using healthEase_backend.Utils;

namespace healthEase_backend.Infrastructure.FhirResourceRepository;

/// <summary>
/// Class to handle searching FHIR resources by various search parameters.
/// </summary>
public class GetBySearchParameters(ConnectionContext context)
{
    /// <summary>
    /// Searches FHIR resources based on the specified resource type and search parameters.
    /// </summary>
    /// <param name="resourceType">The type of the FHIR resource.</param>
    /// <param name="searchParameters">The search parameters to filter the resources.</param>
    /// <returns>An enumerable of FHIR resources that match the search parameters.</returns>
    public IEnumerable<FhirResource> SearchFhirResources(string resourceType,
        Dictionary<string, string> searchParameters)
    {
        var resourceInstance = CreateFhirResourceInstance(resourceType);
        var query = context.FhirResources.AsQueryable().Where(r => r.ResourceType == resourceType);
        var result = query.AsEnumerable();

        result = searchParameters.Aggregate(result, (current, searchParameter) =>
            ApplyFilterRules(resourceType, searchParameter, current, resourceInstance, context));

        return result.ToList();
    }

    /// <summary>
    /// Creates an instance of a FHIR resource based on the resource type.
    /// </summary>
    /// <param name="resourceType">The type of the FHIR resource.</param>
    /// <returns>An instance of the FHIR resource.</returns>
    /// <exception cref="SpKeyNotFoundException">Thrown when the resource type is not recognized by FHIR.</exception>
    private static object CreateFhirResourceInstance(string resourceType)
    {
        var resourceInstance = FhirUtils.CreateFhirResourceInstance(resourceType);
        if (resourceInstance == null)
        {
            throw new SpKeyNotFoundException($"ResourceType '{resourceType}' is not recognized by FHIR.");
        }

        return resourceInstance;
    }

    /// <summary>
    /// Applies filter rules to the search results based on the search parameters.
    /// </summary>
    /// <param name="resourceType">The type of the FHIR resource.</param>
    /// <param name="searchParameter">The search parameter to apply.</param>
    /// <param name="result">The current search results.</param>
    /// <param name="resourceInstance">The instance of the FHIR resource.</param>
    /// <param name="localContext">The database context.</param>
    /// <returns>The filtered search results.</returns>
    private static IEnumerable<FhirResource> ApplyFilterRules(string resourceType,
        KeyValuePair<string, string> searchParameter, IEnumerable<FhirResource> result,
        object resourceInstance, ConnectionContext localContext)
    {
        var filterRules = SearchParameterRules.GetSearchParameterRulesRules(searchParameter.Value, localContext);
        var applicableRule = filterRules
            .FirstOrDefault(rule => rule.PropertyName == searchParameter.Key && rule.ResourceType == resourceType);

        if (applicableRule is { FilterMethod: not null })
        {
            result = applicableRule.FilterMethod(searchParameter.Value);
        }
        else
        {
            ValidateSearchParameter(resourceInstance, searchParameter.Key, resourceType);
            result = FilterResources(result, searchParameter);
        }

        return result;
    }

    /// <summary>
    /// Validates if the search parameter key exists in the FHIR resource instance.
    /// </summary>
    /// <param name="resourceInstance">The instance of the FHIR resource.</param>
    /// <param name="searchParameterKey">The search parameter key to validate.</param>
    /// <param name="resourceType">The type of the FHIR resource.</param>
    /// <exception cref="SpKeyNotFoundException">Thrown when the search parameter key is not valid for the resource type.</exception>
    private static void ValidateSearchParameter(object resourceInstance, string searchParameterKey,
        string resourceType)
    {
        if (!FhirUtils.DoesPropertyExist(resourceInstance, searchParameterKey))
        {
            throw new SpKeyNotFoundException(
                $"Search parameter key '{searchParameterKey}' is not valid for resourceType '{resourceType}'.");
        }
    }

    /// <summary>
    /// Filters the search results based on the search parameter.
    /// </summary>
    /// <param name="result">The current search results.</param>
    /// <param name="searchParameter">The search parameter to apply.</param>
    /// <returns>The filtered search results.</returns>
    private static IEnumerable<FhirResource> FilterResources(IEnumerable<FhirResource>? result,
        KeyValuePair<string, string> searchParameter)
    {
        if (result == null)
        {
            return new List<FhirResource>();
        }

        return result.Where(r =>
            FhirUtils.JsonContains(r.ResourceContent, searchParameter.Key, searchParameter.Value));
    }
}
