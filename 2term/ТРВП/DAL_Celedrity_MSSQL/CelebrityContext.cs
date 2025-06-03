using DAL_Celebrity;
using Microsoft.EntityFrameworkCore;

public class CelebrityContext : DbContext
{
    public DbSet<Celebrity> Celebrities { get; set; }
    public DbSet<Lifeevent> Lifeevents { get; set; }

    public CelebrityContext(DbContextOptions<CelebrityContext> options)
        : base(options)
    {
    }

    public CelebrityContext(string connString) : base()
    {
        ConnectionString = connString ?? throw new ArgumentNullException(nameof(connString));
        this.Database.EnsureDeleted();
        this.Database.EnsureCreated();
    } 

    private string ConnectionString { get; set; } = null;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            if (string.IsNullOrEmpty(ConnectionString))
            {
                throw new InvalidOperationException("ConnectionString is not set. Provide a valid connection string when creating the context.");
            }
            optionsBuilder.UseSqlServer(ConnectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Celebrity>()
            .HasMany(c => c.Lifeevents)
            .WithOne(l => l.Celebrity)
            .HasForeignKey(l => l.CelebrityId);

        modelBuilder.Entity<Celebrity>()
            .Property(c => c.FullName)
            .IsRequired()
            .HasMaxLength(255);

        modelBuilder.Entity<Celebrity>()
            .Property(c => c.Nationality)
            .IsRequired()
            .HasMaxLength(2);

        modelBuilder.Entity<Lifeevent>()
            .Property(l => l.Description)
            .IsRequired()
            .HasMaxLength(1000);
    }
}