namespace healthEase_backend.Model.Interfaces.Infrastructure;

/// <summary>
/// Interface for user repository to manage user entities.
/// </summary>
public interface IUserRepository
{
    /// <summary>
    /// Adds a new user.
    /// </summary>
    /// <param name="user">The user to add.</param>
    void Add(User user);
    
    /// <summary>
    /// Deletes an existing user.
    /// </summary>
    /// <param name="user">The user to delete.</param>
    void Delete(User user);
    
    /// <summary>
    /// Updates an existing user.
    /// </summary>
    /// <param name="user">The user to update.</param>
    void Update(User user);
    
    /// <summary>
    /// Gets a user by email.
    /// </summary>
    /// <param name="email">The email of the user.</param>
    /// <returns>The user if found, otherwise null.</returns>
    User? GetByEmail(string email);
    
    /// <summary>
    /// Gets a user by ID.
    /// </summary>
    /// <param name="id">The ID of the user.</param>
    /// <returns>The user if found, otherwise null.</returns>
    User? GetById(string id);
    
    /// <summary>
    /// Gets all users.
    /// </summary>
    /// <returns>A list of all users.</returns>
    List<User> GetAll();
}
