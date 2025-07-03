using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using healthEase_backend.Filter.Auth;
using healthEase_backend.Model.Enum;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Filter.Auth;

[TestClass]
public class UserClaimsFilterTests
{
    private Mock<IAuthService> _authServiceMock;
    private UserClaimsFilter _filter;
    private ActionExecutingContext _executingContext;

    [TestInitialize]
    public void Setup()
    {
        _authServiceMock = new Mock<IAuthService>();

        _filter = new UserClaimsFilter(_authServiceMock.Object);

        var httpContext = new DefaultHttpContext();
        _executingContext = new ActionExecutingContext(
            new ActionContext
            {
                HttpContext = httpContext,
                RouteData = new RouteData(),
                ActionDescriptor = new ControllerActionDescriptor()
            },
            new List<IFilterMetadata>(),
            new Dictionary<string, object>(),
            new Mock<Controller>().Object
        );
    }

    [TestMethod]
    public void OnActionExecuting_ShouldSetUserClaimsInHttpContext()
    {
        _authServiceMock.Setup(service => service.GetUserClaims(It.IsAny<ClaimsPrincipal>()))
            .Returns((Role.Admin, "resource-123"));
        _filter.OnActionExecuting(_executingContext);
        Assert.AreEqual(Role.Admin, _executingContext.HttpContext.Items["CurrentUserRole"]);
        Assert.AreEqual("resource-123", _executingContext.HttpContext.Items["CurrentUserId"]);
    }

    [TestMethod]
    public void OnActionExecuted_ShouldLogActionNameAndStatusCode()
    {
        var context = new ActionExecutedContext(
            new ActionContext
            {
                HttpContext = new DefaultHttpContext(),
                RouteData = new RouteData(),
                ActionDescriptor = new ControllerActionDescriptor { DisplayName = "TestAction" }
            },
            new List<IFilterMetadata>(),
            new Mock<Controller>().Object
        );

        context.Result = new ObjectResult(null) { StatusCode = 200 };

        using (var consoleOutput = new StringWriter())
        {
            Console.SetOut(consoleOutput);
            _filter.OnActionExecuted(context);
            const string expectedOutput = "Action 'TestAction' executed with status code: 200";
            Assert.IsTrue(consoleOutput.ToString().Trim().Contains(expectedOutput));
        }
    }

    [TestMethod]
    public void OnActionExecuted_ShouldHandleObjectResult()
    {
        var context = new ActionExecutedContext(
            new ActionContext
            {
                HttpContext = new DefaultHttpContext(),
                RouteData = new RouteData(),
                ActionDescriptor = new ControllerActionDescriptor { DisplayName = "TestAction" }
            },
            new List<IFilterMetadata>(),
            new Mock<Controller>().Object
        );
        
        context.Result = new ObjectResult(null) { StatusCode = 200 };
        using (var consoleOutput = new StringWriter())
        {
            Console.SetOut(consoleOutput);
            _filter.OnActionExecuted(context);
            const string expectedOutput = "Action 'TestAction' executed with status code: 200";
            Assert.IsTrue(consoleOutput.ToString().Trim().Contains(expectedOutput));
        }
    }

    [TestMethod]
    public void OnActionExecuted_ShouldHandleStatusCodeResult()
    {
        var context = new ActionExecutedContext(
            new ActionContext
            {
                HttpContext = new DefaultHttpContext(),
                RouteData = new RouteData(),
                ActionDescriptor = new ControllerActionDescriptor { DisplayName = "TestAction" }
            },
            new List<IFilterMetadata>(),
            new Mock<Controller>().Object
        );
        
        context.Result = new StatusCodeResult(404);
        using (var consoleOutput = new StringWriter())
        {
            Console.SetOut(consoleOutput);
            _filter.OnActionExecuted(context);
            const string expectedOutput = "Action 'TestAction' executed with status code: 404";
            Assert.IsTrue(consoleOutput.ToString().Trim().Contains(expectedOutput));
        }
    }
}
