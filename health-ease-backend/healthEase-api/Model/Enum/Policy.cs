using System.Runtime.Serialization;

namespace healthEase_backend.Model.Enum;

/// <summary>
/// Enumeration for policy values.
/// </summary>
public enum Policy
{
    /// <summary>
    /// Represents the read policy.
    /// </summary>
    [EnumMember(Value = "read")]
    Read,
    
    /// <summary>
    /// Represents the write policy.
    /// </summary>
    [EnumMember(Value = "write")]
    Write,
}
