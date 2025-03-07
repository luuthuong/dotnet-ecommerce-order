using ecommerce_order.Domain.Aggregates;

namespace ecommerce_order.Application.Interfaces;

public interface IOrderRepository
{
    Task<OrderAggregate> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveEventAsync(OrderAggregate order, CancellationToken cancellationToken = default);
}