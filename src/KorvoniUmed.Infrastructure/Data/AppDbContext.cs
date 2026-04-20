using KorvoniUmed.Domain.Entities;
using KorvoniUmed.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace KorvoniUmed.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<HelpRequest> HelpRequests => Set<HelpRequest>();
    public DbSet<News> News => Set<News>();
    public DbSet<ChatSession> ChatSessions => Set<ChatSession>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<SiteContent> SiteContents => Set<SiteContent>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<HelpRequest>(e =>
        {
            e.HasIndex(r => r.Status);
            e.HasIndex(r => r.CreatedAt);
        });

        builder.Entity<News>(e =>
        {
            e.HasIndex(n => n.Slug).IsUnique();
            e.HasIndex(n => n.Status);
            e.HasIndex(n => n.PublishedAt);
        });

        builder.Entity<ChatSession>(e =>
        {
            e.HasIndex(s => s.IsActive);
            e.HasIndex(s => s.Source);
            e.HasMany(s => s.Messages)
                .WithOne(m => m.ChatSession)
                .HasForeignKey(m => m.ChatSessionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<SiteContent>(e =>
        {
            e.HasIndex(c => c.Key).IsUnique();
        });
    }
}
