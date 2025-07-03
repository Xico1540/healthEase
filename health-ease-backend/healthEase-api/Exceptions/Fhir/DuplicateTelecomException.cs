using System;

namespace healthEase_backend.Exceptions.Fhir;

/// <summary>
/// Exception thrown when a duplicate telecom entry is detected.
/// </summary>
public class DuplicateTelecomException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DuplicateTelecomException"/> class with a specified error message.
    /// </summary>
    /// <param name="message">The message that describes the error.</param>
    public DuplicateTelecomException(string message) : base(message)
    {
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="DuplicateTelecomException"/> class with a specified error message and a reference to the inner exception that is the cause of this exception.
    /// </summary>
    /// <param name="message">The message that describes the error.</param>
    /// <param name="innerException">The exception that is the cause of the current exception.</param>
    public DuplicateTelecomException(string message, Exception innerException) 
        : base(message, innerException)
    {
    }
}