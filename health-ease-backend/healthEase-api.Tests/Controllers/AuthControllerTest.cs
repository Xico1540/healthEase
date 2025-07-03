using System.Collections.Generic;
using System.Security.Claims;
using healthEase_backend.Controllers;
using healthEase_backend.Dto.Auth.Request;
using healthEase_backend.Dto.Auth.Response;
using healthEase_backend.Model;
using healthEase_backend.Model.Enum;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Auth;
using healthEase_backend.Model.Interfaces.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace healthEase_backend.Tests.Controllers;

[TestClass]
public class AuthControllerTest
{
    private Mock<ITokenService> _tokenServiceMock;

    private Mock<IUserRepository> _userRepositoryMock;

    private AuthController _controller;

    [TestInitialize]
    public void Setup()
    {
        _tokenServiceMock = new Mock<ITokenService>();
        _userRepositoryMock = new Mock<IUserRepository>();

        _controller = new AuthController(_tokenServiceMock.Object, _userRepositoryMock.Object);
    }

    [TestMethod]
    public void Login_ValidCredentials_ShouldReturnSuccess()
    {
        var authLoginDto = new AuthLoginDto
        {
            Email = "user@example.com",
            Password = "validPassword"
        };
        
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("validPassword");

        var user = new User
        {
            Id = "user-id", 
            Email = "user@example.com", 
            Role = Role.Patient,
            PasswordHash = passwordHash
        };
        
        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<User> { user });
        
        _tokenServiceMock.Setup(service => service.GenerateAccessToken(user.Id, user.Role)).Returns("access-token");
        _tokenServiceMock.Setup(service => service.GenerateRefreshToken()).Returns("refresh-token");
        
        _userRepositoryMock.Setup(repo => repo.Update(It.IsAny<User>()));
        
        var result = _controller.Login(authLoginDto);
        
        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
    
        var okResult = (OkObjectResult)result;
        
        var tokens = okResult.Value as AuthResponseDto;
    
        Assert.IsNotNull(tokens);
        Assert.AreEqual("access-token", tokens.AccessToken);
        Assert.AreEqual("refresh-token", tokens.RefreshToken);
    }
    
    [TestMethod]
    public void Login_InvalidModelState_ShouldReturnBadRequest()
    {
        var authLoginDto = new AuthLoginDto
        {
            Email = "invalid-email",
            Password = "validPassword"
        };

        _controller.ModelState.AddModelError("Email", "Invalid email format");

        var result = _controller.Login(authLoginDto);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        var badRequestResult = (BadRequestObjectResult)result;
        Assert.IsNotNull(badRequestResult.Value);
    }
    
    [TestMethod]
    public void Login_InvalidPassword_ShouldReturnUnauthorized()
    {
        var authLoginDto = new AuthLoginDto
        {
            Email = "user@example.com",
            Password = "wrongPassword"
        };

        var passwordHash = BCrypt.Net.BCrypt.HashPassword("validPassword");

        var user = new User
        {
            Id = "user-id", 
            Email = "user@example.com", 
            Role = Role.Patient,
            PasswordHash = passwordHash
        };
    
        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<User> { user });

        var result = _controller.Login(authLoginDto);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("Invalid password, please try again.", unauthorizedResult.Value);
    }

    [TestMethod]
    public void Login_UserNotFound_ShouldReturnNotFound()
    {
        var authLoginDto = new AuthLoginDto
        {
            Email = "user@example.com",
            Password = "validPassword"
        };

        _userRepositoryMock.Setup(repo => repo.GetAll()).Returns(new List<User>());

        var result = _controller.Login(authLoginDto);

        Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
        var notFoundResult = (NotFoundObjectResult)result;
        Assert.AreEqual("Couldn't find user with that email.", notFoundResult.Value);
    }
    
    [TestMethod]
    public void Refresh_ValidTokens_ShouldReturnSuccess()
    {
        var authRefreshTokenDto = new AuthRefreshTokenDto
        {
            AccessToken = "expired-access-token",
            RefreshToken = "valid-refresh-token"
        };

        var user = new User
        {
            Id = "user-id", 
            Role = Role.Patient, 
            RefreshToken = "valid-refresh-token"
        };

        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new (UserClaims.FhirResourceId, "user-id")
        }));

        _tokenServiceMock.Setup(service => service.GetPrincipalFromExpiredToken(authRefreshTokenDto.AccessToken))
            .Returns(claimsPrincipal);
        _userRepositoryMock.Setup(repo => repo.GetById("user-id")).Returns(user);
        _tokenServiceMock.Setup(service => service.GenerateAccessToken(user.Id, user.Role)).Returns("new-access-token");
        _tokenServiceMock.Setup(service => service.GenerateRefreshToken()).Returns("new-refresh-token");

        var result = _controller.Refresh(authRefreshTokenDto);

        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
    
        var okResult = (OkObjectResult)result;
        var response = okResult.Value as AuthResponseDto;
    
        Assert.IsNotNull(response);
        Assert.AreEqual("new-access-token", response.AccessToken);
        Assert.AreEqual("new-refresh-token", response.RefreshToken);
    }
    
    [TestMethod]
    public void Refresh_InvalidModelState_ShouldReturnBadRequest()
    {
        var authRefreshTokenDto = new AuthRefreshTokenDto
        {
            AccessToken = "",
            RefreshToken = "valid-refresh-token"
        };

        _controller.ModelState.AddModelError("AccessToken", "AccessToken is required");

        var result = _controller.Refresh(authRefreshTokenDto);

        Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        var badRequestResult = (BadRequestObjectResult)result;
        Assert.IsNotNull(badRequestResult.Value);
    }

    [TestMethod]
    public void Refresh_UserIdIsNull_ShouldReturnUnauthorized()
    {
        var authRefreshTokenDto = new AuthRefreshTokenDto
        {
            AccessToken = "expired-access-token",
            RefreshToken = "valid-refresh-token"
        };

        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>()));

        _tokenServiceMock.Setup(service => service.GetPrincipalFromExpiredToken(authRefreshTokenDto.AccessToken))
            .Returns(claimsPrincipal);

        var result = _controller.Refresh(authRefreshTokenDto);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("Invalid access token.", unauthorizedResult.Value);
    }
    
    [TestMethod]
    public void Refresh_InvalidRefreshToken_ShouldReturnUnauthorized()
    {
        var authRefreshTokenDto = new AuthRefreshTokenDto
        {
            AccessToken = "expired-access-token",
            RefreshToken = "invalid-refresh-token"
        };

        var user = new User
        {
            Id = "user-id", 
            Role = Role.Patient, 
            RefreshToken = "valid-refresh-token"
        };

        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new (UserClaims.FhirResourceId, "user-id")
        }));

        _tokenServiceMock.Setup(service => service.GetPrincipalFromExpiredToken(authRefreshTokenDto.AccessToken))
            .Returns(claimsPrincipal);
        _userRepositoryMock.Setup(repo => repo.GetById("user-id")).Returns(user);

        var result = _controller.Refresh(authRefreshTokenDto);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("Invalid refresh token.", unauthorizedResult.Value);
    }
    
    [TestMethod]
    public void Refresh_UserNotFound_ShouldReturnUnauthorized()
    {
        var authRefreshTokenDto = new AuthRefreshTokenDto
        {
            AccessToken = "expired-access-token",
            RefreshToken = "valid-refresh-token"
        };

        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new (UserClaims.FhirResourceId, "non-existent-user-id")
        }));

        _tokenServiceMock.Setup(service => service.GetPrincipalFromExpiredToken(authRefreshTokenDto.AccessToken))
            .Returns(claimsPrincipal);

        _userRepositoryMock.Setup(repo => repo.GetById("non-existent-user-id")).Returns((User)null);

        var result = _controller.Refresh(authRefreshTokenDto);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("Invalid refresh token.", unauthorizedResult.Value);
    }

    [TestMethod]
    public void Refresh_UserWithoutRefreshToken_ShouldReturnUnauthorized()
    {
        var authRefreshTokenDto = new AuthRefreshTokenDto
        {
            AccessToken = "expired-access-token",
            RefreshToken = "valid-refresh-token"
        };

        var user = new User
        {
            Id = "user-id", 
            Role = Role.Patient, 
            RefreshToken = null
        };

        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new (UserClaims.FhirResourceId, "user-id")
        }));

        _tokenServiceMock.Setup(service => service.GetPrincipalFromExpiredToken(authRefreshTokenDto.AccessToken))
            .Returns(claimsPrincipal);
        _userRepositoryMock.Setup(repo => repo.GetById("user-id")).Returns(user);

        var result = _controller.Refresh(authRefreshTokenDto);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedObjectResult));
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        Assert.AreEqual("Invalid refresh token.", unauthorizedResult.Value);
    }

    
}
