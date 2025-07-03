using System;
using System.Net.Mail;
using System.Reflection;
using healthEase_backend.Config.Email;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Email;
using healthEase_backend.Services.Email;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace healthEase_backend.Tests.Services.Email;

[TestClass]
public class EmailServiceTest
{
    private Mock<IOptions<EmailConfig>> _mockEmailConfig;
    private Mock<ISmtpClient> _mockSmtpClient;
    private EmailConfig _emailConfig;
    private EmailService _emailService;

    [TestInitialize]
    public void Setup()
    {
        _emailConfig = new EmailConfig
        {
            FromEmail = "test@example.com",
            SmtpServer = "smtp.example.com",
            Port = 587,
            AppPassword = "app-password",
            EnableSsl = true
        };
        _mockEmailConfig = new Mock<IOptions<EmailConfig>>();
        _mockEmailConfig.Setup(x => x.Value).Returns(_emailConfig);
        _mockSmtpClient = new Mock<ISmtpClient>();
        _emailService = new EmailService(_mockEmailConfig.Object, _mockSmtpClient.Object);
    }

    [TestMethod]
    public void SendPasswordEmail_ShouldCallSendEmail_WithCorrectParameters()
    {
        const string to = "user@example.com";
        const string password = "userpassword";
        const string userFirstName = "User";
        const string expectedSubject = "HealthEase - Registo concluído";

        _emailService.SendPasswordEmail(to, password, userFirstName);

        _mockSmtpClient.Verify(client => client.Send(It.Is<MailMessage>(mail =>
            mail.To[0].Address == to &&
            mail.Subject == expectedSubject &&
            mail.Body.Contains(password) &&
            mail.Body.Contains(userFirstName) &&
            mail.From.Address == _emailConfig.FromEmail &&
            mail.IsBodyHtml == true
        )), Times.Once);
    }

    [TestMethod]
    public void GetPasswordEmailBody_ShouldContainReplacedPlaceholders()
    {
        const string password = "TestPassword123";
        const string userFirstName = "John";
        
        var body = typeof(EmailService)
            .GetMethod("GetPasswordEmailBody",
                BindingFlags.NonPublic | BindingFlags.Static)
            ?.Invoke(null, new object[] { password, userFirstName }) as string;

        Assert.IsNotNull(body);
        Assert.IsTrue(body.Contains(password));
        Assert.IsTrue(body.Contains(userFirstName));
        Assert.IsTrue(body.Contains(DateTime.Now.Year.ToString()));
    }

    [TestMethod]
    public void SendEmail_ShouldThrowException_ForInvalidSmtpConfiguration()
    {
        const string to = "user@example.com";

        _mockSmtpClient.Setup(client => client.Send(It.IsAny<MailMessage>())).Throws<SmtpException>();

        Assert.ThrowsException<SmtpException>(() => _emailService.SendPasswordEmail(to, "anypassword", "anyUser"));
    }
}
