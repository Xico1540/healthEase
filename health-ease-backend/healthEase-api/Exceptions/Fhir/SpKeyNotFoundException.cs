namespace healthEase_backend.Exceptions.Fhir;

/// <summary>
/// Exception thrown when a specific key is not found in the FHIR resource.
/// </summary>
public class SpKeyNotFoundException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="SpKeyNotFoundException"/> class with a specified error message.
    /// </summary>
    /// <param name="message">The message that describes the error.</param>
    public SpKeyNotFoundException(string message) : base(message)
    {
    }
}