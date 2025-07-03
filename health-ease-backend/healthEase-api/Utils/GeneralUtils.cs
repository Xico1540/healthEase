using System.Security.Cryptography;
using System.Text;

namespace healthEase_backend.Utils;

/// <summary>
/// Provides general utility methods.
/// </summary>
public static class GeneralUtils
{
    /// <summary>
    /// Generates a random password with the specified length.
    /// </summary>
    /// <param name="length">The length of the password to generate. Default is 8.</param>
    /// <returns>A randomly generated password as a string.</returns>
    public static string GenerateRandomPassword(int length = 8)
    {
        const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?";
        var password = new StringBuilder();
        using (var rng = RandomNumberGenerator.Create())
        {
            var byteBuffer = new byte[1];
            while (password.Length < length)
            {
                rng.GetBytes(byteBuffer);
                var num = byteBuffer[0] % validChars.Length;
                password.Append(validChars[num]);
            }
        }
        return password.ToString();
    }
}
