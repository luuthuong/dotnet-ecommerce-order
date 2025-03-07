using MediatR;

namespace ecommerce_order.Application.Commands;

public class AddOrderItemCommand(Guid orderId, Guid productId, string productName, decimal unitPrice, int quantity)
    : IRequest
{
    public Guid OrderId { get; } = orderId;
    public Guid ProductId { get; } = productId;
    public string ProductName { get; } = productName;
    public decimal UnitPrice { get; } = unitPrice;
    public int Quantity { get; } = quantity;
}