using ecommerce_order.Core.Domain;
using ecommerce_order.Domain.Aggregates;
using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Domain.Events;

public record OrderCreatedEvent : DomainEvent
{
    public required Guid CustomerId { get; init; }
    public required DateTime OrderDate { get; init; }

    public required Address Address { get; init; }

    public required IEnumerable<OrderItem> OrderItems { get; init; }
}