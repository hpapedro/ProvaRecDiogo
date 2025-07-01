using Microsoft.EntityFrameworkCore;
using API.Models;
namespace API.data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Receita> Receitas { get; set; }
    public DbSet<Despesa> Despesas { get; set; }





    

}