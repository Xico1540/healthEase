namespace healthEase_backend.Config.Email;

/// <summary>
/// Configuration settings for email.
/// </summary>
public class EmailConfig
{
    /// <summary>
    /// Gets or sets the email address from which emails are sent.
    /// </summary>
    public string FromEmail { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the application password for the email account.
    /// </summary>
    public string AppPassword { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the SMTP server address.
    /// </summary>
    public string SmtpServer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the port number for the SMTP server.
    /// </summary>
    public int Port { get; set; } = 0;

    /// <summary>
    /// Gets or sets a value indicating whether SSL is enabled for the SMTP server.
    /// </summary>
    public bool EnableSsl { get; set; } = false;
}
