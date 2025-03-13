using ecommerce_order.Core.Domain;

namespace ecommerce_order.Domain.Events;

public record OrderCanceledEvent: DomainEvent
{
    public required string Reason { get; init; }
    public required DateTime CancellationDate { get; init; } = DateTime.Now;
}