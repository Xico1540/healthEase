using healthEase_backend.Model;
using Microsoft.EntityFrameworkCore;

namespace healthEase_backend.Infrastructure;

/// <summary>
/// Database context for the application.
/// </summary>
public class ConnectionContext(DbContextOptions<ConnectionContext> options) : DbContext(options)
{
    /// <summary>
    /// Gets the DbSet of FHIR resources.
    /// </summary>
    public DbSet<FhirResource> FhirResources { get; init; }

    /// <summary>
    /// Gets the DbSet of users.
    /// </summary>
    public DbSet<User> Users { get; init; }
}
