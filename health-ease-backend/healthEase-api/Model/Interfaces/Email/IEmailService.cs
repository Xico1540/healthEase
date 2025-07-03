namespace healthEase_backend.Model.Interfaces;

/// <summary>
/// Interface for email service to send emails.
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Sends an email with the user's password.
    /// </summary>
    /// <param name="to">The recipient's email address.</param>
    /// <param name="password">The user's password.</param>
    /// <param name="userFirstName">The user's first name.</param>
    void SendPasswordEmail(string to, string password, string userFirstName);
}
