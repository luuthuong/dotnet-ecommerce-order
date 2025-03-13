using System.Diagnostics;
using ecommerce_order.Application.DTOs;
using ecommerce_order.Application.Interfaces;
using ecommerce_order.Core.Diagnostic;
using MediatR;

namespace ecommerce_order.Application.Queries;

public class GetOrderQueryHandler(IQueryStore queryStore, ILogger<GetOrderQueryHandler> logger)
    : IRequestHandler<GetOrderQuery, OrderDto?>
{
    private readonly IQueryStore _queryStore = queryStore ?? throw new ArgumentNullException(nameof(queryStore));
    private readonly ILogger<GetOrderQueryHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public Task<OrderDto?> Handle(GetOrderQuery query, CancellationToken cancellationToken = default)
    {
        using var activity = DiagnosticConfig.Source.StartActivity("GetOrderQueryHandler.Handle", ActivityKind.Internal, query.OrderId.ToString());
        return _queryStore.GetOrderAsync(query.OrderId, cancellationToken);
    }
}