using ecommerce_order.Application.DTOs;
using MediatR;

namespace ecommerce_order.Application.Queries;

public class GetOrderQuery(Guid orderId) : IRequest<OrderDto?>
{
    public Guid OrderId { get; } = orderId;
}