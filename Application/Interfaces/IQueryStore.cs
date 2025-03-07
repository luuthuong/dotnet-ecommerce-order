using ecommerce_order.Application.DTOs;

namespace ecommerce_order.Application.Interfaces;

public interface IQueryStore
{
    Task<OrderDto?> GetOrderAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<OrderSummaryDto>> GetOrdersAsync(Guid? customerId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<OrderSummaryDto>> GetOrdersByStatusAsync(string status, CancellationToken cancellationToken = default);
}