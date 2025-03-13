using ecommerce_order.Application.DTOs;
using ecommerce_order.Application.Interfaces;
using MediatR;

namespace ecommerce_order.Application.Queries;

public class GetOrdersByStatusQueryHandler(IQueryStore queryStore, ILogger<GetOrdersByStatusQueryHandler> logger)
    : IRequestHandler<GetOrdersByStatusQuery, IEnumerable<OrderSummaryDto>>
{
    private readonly IQueryStore _queryStore = queryStore ?? throw new ArgumentNullException(nameof(queryStore));

    private readonly ILogger<GetOrdersByStatusQueryHandler> _logger =
        logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<IEnumerable<OrderSummaryDto>> Handle(GetOrdersByStatusQuery query,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting orders with status {Status}", query.Status);

        var orders = await _queryStore.GetOrdersByStatusAsync(query.Status, cancellationToken);

        _logger.LogInformation("Orders with status {Status} retrieved successfully", query.Status);
        return orders;
    }
}