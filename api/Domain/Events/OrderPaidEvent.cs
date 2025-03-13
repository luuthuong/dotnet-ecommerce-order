using ecommerce_order.Core.Domain;
using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Domain.Events;

public record OrderPaidEvent : DomainEvent
{
    public required Money Amount { get; init; }
    public required string PaymentMethod { get; init; }
    public required string TransactionId { get; init; }
    public required DateTime PaymentDate { get; init; }
}