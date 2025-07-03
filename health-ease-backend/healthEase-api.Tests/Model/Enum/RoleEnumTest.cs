using System.Runtime.Serialization;
using healthEase_backend.Model.Enum;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace healthEase_backend.Tests.Model.Enum;

[TestClass]
public class RoleEnumTest
{
    [TestMethod]
    public void Role_Patient_ShouldHaveCorrectEnumMemberValue()
    {
        const Role role = Role.Patient;
        var enumMember = GetEnumMemberValue(role);
        Assert.AreEqual("patient", enumMember, "The EnumMember value for Role.Patient should be 'patient'.");
    }

    [TestMethod]
    public void Role_Practitioner_ShouldHaveCorrectEnumMemberValue()
    {
        const Role role = Role.Practitioner;
        var enumMember = GetEnumMemberValue(role);
        Assert.AreEqual("practitioner", enumMember, "The EnumMember value for Role.Practitioner should be 'practitioner'.");
    }

    [TestMethod]
    public void Role_Admin_ShouldHaveCorrectEnumMemberValue()
    {
        const Role  role = Role.Admin;
        var enumMember = GetEnumMemberValue(role);
        Assert.AreEqual("admin", enumMember, "The EnumMember value for Role.Admin should be 'admin'.");
    }

    private static string GetEnumMemberValue(Role role)
    {
        var enumType = typeof(Role);
        var memberInfo = enumType.GetMember(role.ToString())[0];
        var enumMemberAttribute = (EnumMemberAttribute)memberInfo
            .GetCustomAttributes(typeof(EnumMemberAttribute), false)[0];
        return enumMemberAttribute.Value;
    }
}
