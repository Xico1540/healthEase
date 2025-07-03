using healthEase_backend.Model;
using healthEase_backend.Model.Interfaces;
using healthEase_backend.Model.Interfaces.Infrastructure;

namespace healthEase_backend.Infrastructure;

public class UserRepository(ConnectionContext context) : IUserRepository
{
    public void Add(User user)
    {
        context.Users.Add(user);
        context.SaveChanges();
    }
    
    public void Update(User user)
    {
        context.Users.Update(user);
        context.SaveChanges();
    }
    
    public void Delete(User user)
    {
        context.Users.Remove(user);
        context.SaveChanges();
    }
    
    public User? GetByEmail(string email)
    {
        return context.Users.FirstOrDefault(user => user.Email == email);
    }
    
    public User? GetById(string id)
    {
        return context.Users.FirstOrDefault(user => user.Id == id);
    }

    public List<User> GetAll()
    {
        return context.Users.ToList();
    }
}
