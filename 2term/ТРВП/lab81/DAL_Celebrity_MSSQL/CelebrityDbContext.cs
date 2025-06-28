using DAL_Celebrity.Entity;
using Microsoft.EntityFrameworkCore;

namespace DAL_Celebrity_MSSQL;

public class CelebrityDbContext : DbContext
{
    public CelebrityDbContext(DbContextOptions<CelebrityDbContext> options)
        : base(options)
    {
    }

    public DbSet<Celebrity> Celebrities { get; set; }
    public DbSet<LifeEvent> LifeEvents { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Celebrity>(entity =>
        {
            entity.ToTable("celebrities");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FullName).HasColumnName("full_name").IsRequired();
            entity.Property(e => e.Nationality).HasColumnName("nationality").IsRequired();
            entity.Property(e => e.ReqPhotoPath).HasColumnName("request_photo_path");
        });

        modelBuilder.Entity<LifeEvent>(entity =>
        {
            entity.ToTable("life_events");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CelebrityId).HasColumnName("celebrity_id");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Description).HasColumnName("description").IsRequired();
            entity.Property(e => e.ReqPhotoPath).HasColumnName("request_photo_path");

            entity.HasOne<Celebrity>()
                .WithMany()
                .HasForeignKey(e => e.CelebrityId);
        });
    }
}