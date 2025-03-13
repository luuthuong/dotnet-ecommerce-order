using ecommerce_order.Core.Domain;

namespace ecommerce_order.Domain.Events;

public record OrderShippedEvent : DomainEvent
{
    public required string TrackingNumber { get; init; }
    public required string Carrier { get; init; }
    public required DateTime ShippingDate { get; init; }
}