using Microsoft.EntityFrameworkCore;

namespace ecommerce_order.Infrastructure.EventStore;

public class EventStoreDbContext(DbContextOptions<EventStoreDbContext> options) : DbContext(options)
{
    public DbSet<EventData> Events { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EventData>(builder =>
        {
            builder.ToTable("Events");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.AggregateId).IsRequired();
            builder.Property(e => e.Timestamp).IsRequired();
            builder.Property(e => e.Version).IsRequired();
            builder.Property(e => e.EventType).IsRequired().HasMaxLength(255);
            builder.Property(e => e.Payload).IsRequired();
                
            // Create index on AggregateId for faster querying
            builder.HasIndex(e => e.AggregateId);
                
            // Create index on EventType for potential event type based queries
            builder.HasIndex(e => e.EventType);
        });
    }
}
