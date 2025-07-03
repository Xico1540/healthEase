using healthEase_backend.Model.Enum;
using Microsoft.AspNetCore.Http;

namespace healthEase_backend.Tests.Utils;

public static class TestUtils
{
    public static void SetGlobalUserClaims(HttpContext httpContext, string userId, Role role)
    {
        httpContext.Items["CurrentUserId"] = userId;
        httpContext.Items["CurrentUserRole"] = role;
    }
}
