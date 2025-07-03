using System.Net.Mail;

namespace healthEase_backend.Model.Interfaces.Email;

/// <summary>
/// Interface for SMTP client to send email messages.
/// </summary>
public interface ISmtpClient
{
    /// <summary>
    /// Sends an email message.
    /// </summary>
    /// <param name="mailMessage">The email message to send.</param>
    void Send(MailMessage mailMessage);
}
