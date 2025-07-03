using healthEase_backend.Exceptions.Fhir;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Exceptions.Fhir;

[TestClass]
public class SpKeyNotFoundExceptionTests
{
    [TestMethod]
    public void SpKeyNotFoundException_ShouldStoreMessageCorrectly()
    {
        const string expectedMessage = "Specific key not found in the FHIR resource.";
        var exception = new SpKeyNotFoundException(expectedMessage);
        Assert.AreEqual(expectedMessage, exception.Message);
    }

    [TestMethod]
    [ExpectedException(typeof(SpKeyNotFoundException))]
    public void SpKeyNotFoundException_ShouldThrowException()
    {
        const string errorMessage = "Key not found.";
        throw new SpKeyNotFoundException(errorMessage);
    }
}
