using ecommerce_order.Core.Domain;
using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Domain.Events;

public record OrderAddressSetEvent : DomainEvent
{
    public required Address Address { get; init; }
}