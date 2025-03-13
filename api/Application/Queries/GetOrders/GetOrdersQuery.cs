using ecommerce_order.Application.DTOs;
using MediatR;

namespace ecommerce_order.Application.Queries;

public class GetOrdersQuery : IRequest<IEnumerable<OrderSummaryDto>>
{

    public GetOrdersQuery(Guid? customerId = null)
    {
    }
}