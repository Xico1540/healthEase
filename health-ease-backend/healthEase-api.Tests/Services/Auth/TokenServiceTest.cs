using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using healthEase_backend.Config.Token;
using healthEase_backend.Model.Enum;
using healthEase_backend.Services.Auth;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace healthEase_backend.Tests.Services.Auth;

[TestClass]
public class TokenServiceTest
{
    private Mock<IOptions<JwtConfig>> _configurationMock;
    private TokenService _tokenService;

    [TestInitialize]
    public void Setup()
    {
        _configurationMock = new Mock<IOptions<JwtConfig>>();
        var jwtConfig = new JwtConfig
        {
            Key = "a_long_secret_key_32_characters_long",
            Issuer = "testIssuer",
            Audience = "testAudience"
        };
        _configurationMock.Setup(config => config.Value).Returns(jwtConfig);
        _tokenService = new TokenService(_configurationMock.Object);
    }
    
    [TestMethod]
    public void GenerateAccessToken_ShouldCreateValidToken()
    {
        const string userId = "user123";
        const Role role = Role.Patient;
        
        var token = _tokenService.GenerateAccessToken(userId, role);
        Assert.IsNotNull(token);
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(token);
        
        Assert.AreEqual("testIssuer", jwtToken.Issuer);
        Assert.AreEqual("testAudience", jwtToken.Audiences.First());
        Assert.AreEqual(userId, jwtToken.Claims.First(c => c.Type == "fhir_resource_id").Value);
        Assert.AreEqual(role.ToString(), jwtToken.Claims.First(c => c.Type == "user_role").Value);
    }
    
    [TestMethod]
    public void GenerateRefreshToken_ShouldReturnBase64String()
    {
        var refreshToken = _tokenService.GenerateRefreshToken();
        
        Assert.IsNotNull(refreshToken);
        var tokenBytes = Convert.FromBase64String(refreshToken);
        Assert.AreEqual(32, tokenBytes.Length);
    }
    
    [TestMethod]
    public void GetPrincipalFromExpiredToken_ShouldReturnPrincipal_WhenTokenIsValid()
    {
        const string userId = "user123";
        const Role role = Role.Patient;
        var validToken = _tokenService.GenerateAccessToken(userId, role);
        
        var principal = _tokenService.GetPrincipalFromExpiredToken(validToken);
        
        Assert.IsNotNull(principal);
        Assert.AreEqual(userId, principal.Claims.First(c => c.Type == "fhir_resource_id").Value);
        Assert.AreEqual(role.ToString(), principal.Claims.First(c => c.Type == "user_role").Value);
    }
    
    [TestMethod]
    [ExpectedException(typeof(SecurityTokenMalformedException))]
    public void GetPrincipalFromExpiredToken_ShouldThrowException_WhenTokenIsInvalid()
    {
        const string invalidToken = "invalid_token_string";
        _tokenService.GetPrincipalFromExpiredToken(invalidToken);
    }
    
}
