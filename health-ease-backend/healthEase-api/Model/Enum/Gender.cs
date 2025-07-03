using System.Runtime.Serialization;

namespace healthEase_backend.Model.Enum;

/// <summary>
/// Enumeration for gender values.
/// </summary>
public enum Gender
{
    /// <summary>
    /// Represents the male gender.
    /// </summary>
    [EnumMember(Value = "male")]
    Male,
    
    /// <summary>
    /// Represents the female gender.
    /// </summary>
    [EnumMember(Value = "female")]
    Female,
}
