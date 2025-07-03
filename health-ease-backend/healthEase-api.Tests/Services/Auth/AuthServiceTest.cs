using System;
using System.Collections.Generic;
using healthEase_backend.Services.Auth;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Security.Claims;
using healthEase_backend.Model;
using healthEase_backend.Model.Enum;
using healthEase_backend.Model.Interfaces.Auth;

namespace healthEase_backend.Tests.Services.Auth;

[TestClass]
public class AuthServiceTests
{
    private IAuthService _authService;

    [TestInitialize]
    public void Setup()
    {
        _authService = new AuthService();
    }

    [TestMethod]
    public void GetUserClaims_ShouldReturnUserRoleAndResourceId_WhenClaimsAreValid()
    {
        var claims = new List<Claim>
        {
            new (UserClaims.UserRole, Role.Admin.ToString()),
            new (UserClaims.FhirResourceId, "resource-123")
        };
        
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));
        var result = _authService.GetUserClaims(claimsPrincipal);
        
        Assert.AreEqual(Role.Admin, result.UserRole);
        Assert.AreEqual("resource-123", result.FhirResourceId);
    }
    
    [TestMethod]
    [ExpectedException(typeof(UnauthorizedAccessException))]
    public void GetUserClaims_ShouldThrowUnauthorizedAccessException_WhenUserRoleClaimIsMissing()
    {
        var claims = new List<Claim>
        {
            new (UserClaims.FhirResourceId, "resource-123")
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));
        _authService.GetUserClaims(claimsPrincipal);
    }
    
    [TestMethod]
    [ExpectedException(typeof(UnauthorizedAccessException))]
    public void GetUserClaims_ShouldThrowUnauthorizedAccessException_WhenFhirResourceIdClaimIsMissing()
    {
        var claims = new List<Claim>
        {
            new (UserClaims.UserRole, Role.Patient.ToString())
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));
        _authService.GetUserClaims(claimsPrincipal);
    }
    
    [TestMethod]
    [ExpectedException(typeof(ArgumentException))]
    public void GetUserClaims_ShouldThrowArgumentException_WhenUserRoleClaimIsInvalid()
    {
        var claims = new List<Claim>
        {
            new (UserClaims.UserRole, "InvalidRole"),
            new (UserClaims.FhirResourceId, "resource-123")
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));
        
        _authService.GetUserClaims(claimsPrincipal);
    }

    [TestMethod]
    [ExpectedException(typeof(UnauthorizedAccessException))]
    public void GetUserClaims_ShouldThrowUnauthorizedAccessException_WhenClaimsAreMissing()
    {
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity());
        _authService.GetUserClaims(claimsPrincipal);
    }
}
