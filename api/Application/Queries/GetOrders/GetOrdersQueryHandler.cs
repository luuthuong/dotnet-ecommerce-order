using ecommerce_order.Application.DTOs;
using ecommerce_order.Application.Interfaces;
using MediatR;

namespace ecommerce_order.Application.Queries;

public class GetOrdersQueryHandler(IQueryStore queryStore, ILogger<GetOrdersQueryHandler> logger)
    : IRequestHandler<GetOrdersQuery, IEnumerable<OrderSummaryDto>>
{
    private readonly IQueryStore _queryStore = queryStore ?? throw new ArgumentNullException(nameof(queryStore));
    private readonly ILogger<GetOrdersQueryHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<IEnumerable<OrderSummaryDto>> Handle(GetOrdersQuery query,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting orders");

        var orders = await _queryStore.GetOrdersAsync(null, cancellationToken);

        return orders;
    }
}