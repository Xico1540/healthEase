using System.Runtime.Serialization;

namespace healthEase_backend.Model.Enum;

/// <summary>
/// Enumeration for role values.
/// </summary>
public enum Role
{
    /// <summary>
    /// Represents the patient role.
    /// </summary>
    [EnumMember(Value = "patient")] Patient,

    /// <summary>
    /// Represents the practitioner role.
    /// </summary>
    [EnumMember(Value = "practitioner")] Practitioner,

    /// <summary>
    /// Represents the admin role.
    /// </summary>
    [EnumMember(Value = "admin")] Admin,

    /// <summary>
    /// Represents the client role.
    /// </summary>
    [EnumMember(Value = "client")] Client
}
