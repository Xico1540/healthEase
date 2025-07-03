using healthEase_backend.Dto.Auth.Request;
using healthEase_backend.Dto.Auth.Response;
using healthEase_backend.Model;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Auth;
using healthEase_backend.Model.Interfaces.Infrastructure;
using Lombok.NET;
using Microsoft.AspNetCore.Mvc;

namespace healthEase_backend.Controllers;

/// <summary>
/// Controller for handling authentication-related actions.
/// </summary>
[ApiController]
[Route("auth")]
[AllArgsConstructor]
public partial class AuthController : ControllerBase
{
    private readonly ITokenService _tokenService;
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Authenticates a user and generates access and refresh tokens.
    /// </summary>
    /// <param name="authLoginDto">The login credentials.</param>
    /// <returns>An <see cref="IActionResult"/> containing the authentication response.</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), 200)]
    [ProducesResponseType(typeof(string), 400)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 404)]
    public IActionResult Login([FromBody] AuthLoginDto authLoginDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = _userRepository.GetAll().FirstOrDefault(u => u.Email == authLoginDto.Email);
        if (user == null)
        {
            return NotFound("Couldn't find user with that email.");
        }

        if (!user.VerifyPassword(authLoginDto.Password))
        {
            return Unauthorized("Invalid password, please try again.");
        }

        var accessToken = _tokenService.GenerateAccessToken(user.Id, user.Role);
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        _userRepository.Update(user);

        var response = new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };

        return Ok(response);
    }

    /// <summary>
    /// Refreshes the access token using a valid refresh token.
    /// </summary>
    /// <param name="authRefreshToken">The refresh token details.</param>
    /// <returns>An <see cref="IActionResult"/> containing the new authentication response.</returns>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponseDto), 200)]
    [ProducesResponseType(typeof(string), 400)]
    [ProducesResponseType(typeof(string), 401)]
    public IActionResult Refresh([FromBody] AuthRefreshTokenDto authRefreshToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var principal = _tokenService.GetPrincipalFromExpiredToken(authRefreshToken.AccessToken);
        var userId = principal.Claims.FirstOrDefault(c => c.Type == UserClaims.FhirResourceId)?.Value;

        if (userId == null)
        {
            return Unauthorized("Invalid access token.");
        }

        var user = _userRepository.GetById(userId);
        if (user == null || user.RefreshToken != authRefreshToken.RefreshToken)
        {
            return Unauthorized("Invalid refresh token.");
        }

        var newAccessToken = _tokenService.GenerateAccessToken(user.Id, user.Role);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        _userRepository.Update(user);

        var response = new AuthResponseDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        };

        return Ok(response);
    }
}
