using ecommerce_order.Application.DTOs;
using MediatR;

namespace ecommerce_order.Application.Queries;

public class GetOrdersByStatusQuery : IRequest<IEnumerable<OrderSummaryDto>>
{
    public string Status { get; }

    public GetOrdersByStatusQuery(string status)
    {
        Status = status;
    }
}