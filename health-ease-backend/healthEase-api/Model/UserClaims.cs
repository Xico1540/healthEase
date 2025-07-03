namespace healthEase_backend.Model;

/// <summary>
/// Contains constants for user claims.
/// </summary>
public static class UserClaims
{
    /// <summary>
    /// Claim type for the user's role.
    /// </summary>
    public const string UserRole = "user_role";

    /// <summary>
    /// Claim type for the FHIR resource ID.
    /// </summary>
    public const string FhirResourceId = "fhir_resource_id";
}
