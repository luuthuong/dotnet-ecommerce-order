using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Domain.Aggregates.Data;

public record OrderCreateData(
        string CustomerName,
        Address ShippingAddress,
        IEnumerable<OrderItem> OrderItems
);