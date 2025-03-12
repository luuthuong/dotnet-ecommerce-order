using Microsoft.EntityFrameworkCore;

namespace ecommerce_order.Infrastructure.QueryStore;

public class QueryDbContext(DbContextOptions<QueryDbContext> options) : DbContext(options)
{
    public DbSet<OrderReadModel> Orders { get; set; }
    
    public DbSet<OrderItemReadModel> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderReadModel>(builder =>
        {
            builder.ToTable("OrderViews");
            builder.HasKey(o => o.Id);
            builder.Property(o => o.Id).ValueGeneratedNever();
            builder.Property(o => o.CustomerName).IsRequired();
            builder.Property(o => o.OrderDate).IsRequired();
            builder.Property(o => o.Status).IsRequired().HasMaxLength(50);
            builder.Property(o => o.TotalAmount).HasColumnType("decimal(18, 2)");
            builder.Property(o => o.Version).IsRequired();

            builder.OwnsMany(
                o => o.Items,
                oiBuilder =>
                {
                    oiBuilder.ToTable("OrderItemViews");
                    oiBuilder.WithOwner().HasForeignKey(oi => oi.OrderId);
                    oiBuilder.Property(oi => oi.OrderId).IsRequired();
                    oiBuilder.Property(oi => oi.ProductId).IsRequired();
                    oiBuilder.Property(oi => oi.ProductName).IsRequired().HasMaxLength(255);
                    oiBuilder.Property(oi => oi.UnitPrice).HasColumnType("decimal(18, 2)");
                    oiBuilder.Property(oi => oi.Quantity).IsRequired();
                    oiBuilder.Property(oi => oi.TotalPrice).HasColumnType("decimal(18, 2)");
                    
                    oiBuilder.HasIndex(oi => oi.OrderId);
                }
            );

            builder.OwnsOne(
                o => o.ShippingAddress,
                oaBuilder =>
                {
                    oaBuilder.Property(oa => oa.City).HasColumnName("City").IsRequired().HasMaxLength(255);
                    oaBuilder.Property(oa => oa.Country).IsRequired().HasColumnName("Country").HasMaxLength(255);
                    oaBuilder.Property(oa => oa.State).IsRequired().HasColumnName("State").HasMaxLength(255);
                    oaBuilder.Property(oa => oa.ZipCode).IsRequired().HasColumnName("ZipCode").HasMaxLength(255);
                    oaBuilder.Property(oa => oa.Street).IsRequired().HasColumnName("Street").HasMaxLength(255);
                }
            );

            builder.HasIndex(o => o.CustomerName);
            builder.HasIndex(o => o.Status);
        });
    }
}