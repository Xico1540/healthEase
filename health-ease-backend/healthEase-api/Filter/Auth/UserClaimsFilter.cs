using healthEase_backend.Model.Interfaces.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace healthEase_backend.Filter.Auth;

/// <summary>
/// Filter to extract user claims and add them to the HTTP context items.
/// </summary>
public class UserClaimsFilter : IActionFilter
{
    private readonly IAuthService _authService;

    /// <summary>
    /// Initializes a new instance of the <see cref="UserClaimsFilter"/> class.
    /// </summary>
    /// <param name="authService">The authentication service to retrieve user claims.</param>
    public UserClaimsFilter(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Called before the action executes, extracts user claims and adds them to the HTTP context items.
    /// </summary>
    /// <param name="context">The action executing context.</param>
    public void OnActionExecuting(ActionExecutingContext context)
    {
        var (role, resourceId) = _authService.GetUserClaims(context.HttpContext.User);
        context.HttpContext.Items["CurrentUserRole"] = role;
        context.HttpContext.Items["CurrentUserId"] = resourceId;
    }

    /// <summary>
    /// Called after the action executes, logs the action name and status code.
    /// </summary>
    /// <param name="context">The action executed context.</param>
    public void OnActionExecuted(ActionExecutedContext context)
    {
        var actionName = context.ActionDescriptor.DisplayName;
        int? statusCode = context.Result switch
        {
            ObjectResult objectResult => objectResult.StatusCode,
            StatusCodeResult statusCodeResult => statusCodeResult.StatusCode,
            _ => null
        };
        Console.WriteLine($"Action '{actionName}' executed with status code: {statusCode}");
    }
}