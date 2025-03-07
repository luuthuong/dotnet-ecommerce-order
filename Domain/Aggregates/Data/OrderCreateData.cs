using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Domain.Aggregates.Data;

public record OrderCreateData(
        Guid CustomerId,
        Address ShippingAddress,
        IEnumerable<OrderItem> OrderItems
);