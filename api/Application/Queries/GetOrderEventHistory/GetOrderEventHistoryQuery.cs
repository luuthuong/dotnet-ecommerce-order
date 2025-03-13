using ecommerce_order.Application.DTOs;
using MediatR;

namespace ecommerce_order.Application.Queries.GetOrderEventHistory;

public record GetOrderEventHistoryQuery(Guid OrderId): IRequest<OrderEventHistoryResponse>;


public record OrderEventHistoryResponse
{
    public Guid OrderId { get; set; }
    public List<OrderEventHistoryDto> Events { get; set; } = new();
}