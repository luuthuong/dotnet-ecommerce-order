using ecommerce_order.Core.Domain;
using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Domain.Events;

public record OrderItemAddedEvent : DomainEvent
{
    public required Guid ProductId { get; init; }
    public required string ProductName { get; init; }
    public required Money UnitPrice { get; init; }
    public required int Quantity { get; init; }
}