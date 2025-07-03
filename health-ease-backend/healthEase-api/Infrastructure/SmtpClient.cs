using System.Net;
using System.Net.Mail;
using healthEase_backend.Model.Interfaces.Email;

namespace healthEase_backend.Infrastructure;

public class SmtpClient(string host, int port) : ISmtpClient
{
    private readonly System.Net.Mail.SmtpClient _smtpClient = new(host, port);

    public NetworkCredential Credentials
    {
        set => _smtpClient.Credentials = value;
    }

    public bool EnableSsl
    {
        set => _smtpClient.EnableSsl = value;
    }

    public void Send(MailMessage mailMessage)
    {
        _smtpClient.Send(mailMessage);
    }
}
