using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace healthEase_backend.Model;

/// <summary>
/// Represents a FHIR resource.
/// </summary>
[Table("resources")]
public class FhirResource(string id, string resourceType, string resourceContent)
{
    /// <summary>
    /// Gets the ID of the resource.
    /// </summary>
    [Key] [MaxLength(50)] public string Id { get; init; } = id;

    /// <summary>
    /// Gets or sets the type of the resource.
    /// </summary>
    [MaxLength(50)] public string ResourceType { get; set; } = resourceType;

    /// <summary>
    /// Gets or sets the content of the resource.
    /// </summary>
    [MaxLength(int.MaxValue)] public string ResourceContent { get; set; } = resourceContent;
}
