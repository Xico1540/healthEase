using System.Net.Mail;
using healthEase_backend.Config.Email;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Email;
using Microsoft.Extensions.Options;

namespace healthEase_backend.Services.Email;

public class EmailService(IOptions<EmailConfig> emailConfig, ISmtpClient smtpClient) : IEmailService
{
    private readonly EmailConfig _emailConfig = emailConfig.Value;

    public void SendPasswordEmail(string to, string password, string userFirstName)
    {
        const string subject = "HealthEase - Registo concluído";
        var body = GetPasswordEmailBody(password, userFirstName);
        SendEmail(to, subject, body);
    }

    private static string GetPasswordEmailBody(string password, string userFirstName)
    {
        var templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources", "Email", "Templates",
            "PasswordEmailTemplate.html");
        var templateContent = File.ReadAllText(templatePath);

        var healthEaseLogoPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources", "Email", "Images",
            "HealthEaseLogo.png");
        var healthEaseLogoBytes = File.ReadAllBytes(healthEaseLogoPath);
        var healthEaseLogoBase64 = Convert.ToBase64String(healthEaseLogoBytes);

        templateContent = templateContent.Replace("{{healthEaseLogoBase64}}", healthEaseLogoBase64);
        templateContent = templateContent.Replace("{{name}}", userFirstName);
        templateContent = templateContent.Replace("{{password}}", password);
        templateContent = templateContent.Replace("{{currentYear}}", DateTime.Now.Year.ToString());

        return templateContent;
    }

    private void SendEmail(string to, string subject, string body)
    {
        var mail = new MailMessage
        {
            From = new MailAddress(_emailConfig.FromEmail),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        mail.To.Add(to);
        smtpClient.Send(mail);
    }
}
