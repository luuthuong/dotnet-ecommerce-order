using ecommerce_order.Application.Interfaces;
using ecommerce_order.Domain.Aggregates;

namespace ecommerce_order.Infrastructure.Repositories;

public class OrderRepository(IEventStore eventStore, ILogger<OrderRepository> logger) : IOrderRepository
{
    public async Task<OrderAggregate> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting order aggregate {OrderId}", id);

        var events = (await eventStore.GetEventsAsync(id, cancellationToken)).ToList();
        if (!events.Any())
        {
            logger.LogWarning("No events found for order aggregate {OrderId}", id);
            return null;
        }

        OrderAggregate order = new();
        order.LoadFromHistory(events);

        logger.LogInformation("Order aggregate {OrderId} loaded successfully", id);

        return order;
    }

    public async Task SaveEventAsync(OrderAggregate order, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Saving order aggregate {OrderId}", order.Id);

        var events = order.GetEvents();
        if (!events.Any())
        {
            logger.LogWarning("No events to save for order aggregate {OrderId}", order.Id);
            return;
        }

        await eventStore.SaveEventsAsync(order, events, cancellationToken);
        
        order.ClearEvents();

        logger.LogInformation("Order aggregate {OrderId} saved successfully", order.Id);
    }
}