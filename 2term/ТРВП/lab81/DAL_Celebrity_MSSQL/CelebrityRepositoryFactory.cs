using DAL_Celebrity;
using DAL_Celebrity.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DAL_Celebrity_MSSQL;

public static class CelebrityRepositoryFactory
{
    public static IRepository<Celebrity, LifeEvent> Create(string connectionStringName)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", true)
            .Build();

        var connectionString = configuration.GetConnectionString(connectionStringName)
                               ?? throw new ArgumentException(
                                   $"Connection string '{connectionStringName}' not found.");

        var optionsBuilder = new DbContextOptionsBuilder<CelebrityDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        var context = new CelebrityDbContext(optionsBuilder.Options);
        return new CelebrityRepository(context);
    }

    public static IRepository<Celebrity, LifeEvent> CreateWithDirectConnectionString(string connectionString)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CelebrityDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        var context = new CelebrityDbContext(optionsBuilder.Options);
        return new CelebrityRepository(context);
    }

    public static IRepository<Celebrity, LifeEvent> Create(DbContextOptions<CelebrityDbContext> options)
    {
        var context = new CelebrityDbContext(options);
        return new CelebrityRepository(context);
    }
}