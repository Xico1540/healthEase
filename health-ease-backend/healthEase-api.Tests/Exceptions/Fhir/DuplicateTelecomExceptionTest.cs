using System;
using healthEase_backend.Exceptions.Fhir;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Exceptions.Fhir;

[TestClass]
public class DuplicateTelecomExceptionTests
{
    [TestMethod]
    public void DuplicateTelecomException_ShouldStoreMessage()
    {
        const string expectedMessage = "Duplicate telecom entry found.";
        var exception = new DuplicateTelecomException(expectedMessage);
        Assert.AreEqual(expectedMessage, exception.Message);
    }
    
    [TestMethod]
    public void DuplicateTelecomException_ShouldStoreMessageAndInnerException()
    {
        const string expectedMessage = "Duplicate telecom entry found.";
        var innerException = new Exception("Inner exception message");
        
        var exception = new DuplicateTelecomException(expectedMessage, innerException);
        Assert.AreEqual(expectedMessage, exception.Message);
        Assert.AreEqual(innerException, exception.InnerException);
    }

}
