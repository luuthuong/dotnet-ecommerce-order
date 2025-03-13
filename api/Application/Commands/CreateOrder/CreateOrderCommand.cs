using ecommerce_order.Domain.ValueObjects;
using MediatR;

namespace ecommerce_order.Application.Commands;

public class CreateOrderCommand : IRequest<Guid>
{
    public required string CustomerName { get; init; }
    public required Address ShippingAddress { get; init; }
    public required IEnumerable<OrderItemDetails> OrderItems { get; init; }

    public record OrderItemDetails
    {
        public required Guid ProductId { get; init; }
        public required string ProductName { get; init; }
        public required Money UnitPrice { get; init; }
        public required int Quantity { get; init; }
    }
}