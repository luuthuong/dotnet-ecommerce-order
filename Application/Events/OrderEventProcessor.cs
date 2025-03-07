using ecommerce_order.Core.Domain;
using ecommerce_order.Domain.Events;
using ecommerce_order.Infrastructure.QueryStore;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_order.Application.Events;

public class OrderEventProcessor(
    ILogger<OrderEventProcessor> logger,
    QueryDbContext context
) : IDomainEventHandler<OrderCreatedEvent>,
    IDomainEventHandler<OrderItemAddedEvent>,
    IDomainEventHandler<OrderAddressSetEvent>,
    IDomainEventHandler<OrderPaidEvent>,
    IDomainEventHandler<OrderShippedEvent>,
    IDomainEventHandler<OrderCanceledEvent>
{
    public async Task Handle(OrderCreatedEvent @event, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling OrderCreatedEvent for order {OrderId}", @event.AggregateId);
        
        var order = OrderReadModel.Create(@event);

        await context.Orders.AddAsync(order, cancellationToken);
        
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Successfully processed OrderCreatedEvent for order {OrderId}", @event.AggregateId);
    }

    public async Task Handle(OrderItemAddedEvent @event, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling OrderItemAddedEvent for order {OrderId}", @event.AggregateId);

        var order = await context.Orders
            .Include(o => o.Items)
            .AsTracking()
            .FirstOrDefaultAsync(o => o.Id == @event.AggregateId, cancellationToken);

        if (order is null)
        {
            logger.LogError("Order {OrderId} not found when handling OrderItemAddedEvent", @event.AggregateId);
            return;
        }
        
        order.Apply(@event);
        
        await context.SaveChangesAsync(cancellationToken);
        
        logger.LogInformation("Successfully processed OrderItemAddedEvent for order {OrderId}", @event.AggregateId);
    }

    public async Task Handle(OrderAddressSetEvent @event, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling OrderAddressSetEvent for order {OrderId}", @event.AggregateId);

        var order = await GetOrderByIdAsync(@event.AggregateId, cancellationToken);
        
        if (order == null)
        {
            logger.LogWarning("Order {OrderId} not found when handling OrderAddressSetEvent", @event.AggregateId);
            return;
        }
        
        order.Apply(@event);

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Successfully processed OrderAddressSetEvent for order {OrderId}", @event.AggregateId);
    }

    public async Task Handle(OrderPaidEvent @event, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling OrderPaidEvent for order {OrderId}", @event.AggregateId);

        var order = await GetOrderByIdAsync(@event.AggregateId, cancellationToken);
        
        if (order is null)
        {
            logger.LogError("Order {OrderId} not found when handling OrderPaidEvent", @event.AggregateId);
            return;
        }

        order = context.Attach(order).Entity;

        order.Apply(@event);

        await context.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Successfully processed OrderPaidEvent for order {OrderId}", @event.AggregateId);
    }

    public async Task Handle(OrderShippedEvent @event, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling OrderShippedEvent for order {OrderId}", @event.AggregateId);

        var order = await GetOrderByIdAsync(@event.AggregateId, cancellationToken);

        if (order == null)
        {
            logger.LogError("Order {OrderId} not found when handling OrderShippedEvent", @event.AggregateId);
            return;
        }
        
        order.Apply(@event);

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Successfully processed OrderShippedEvent for order {OrderId}", @event.AggregateId);
    }

    public async Task Handle(OrderCanceledEvent @event, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling OrderCanceledEvent for order {OrderId}", @event.AggregateId);
        
        var order = await GetOrderByIdAsync(@event.AggregateId, cancellationToken);

        if (order == null)
        {
            logger.LogError("Order {OrderId} not found when handling OrderCanceledEvent", @event.AggregateId);
            return;
        }
        
        order.Apply(@event);

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Successfully processed OrderCanceledEvent for order {OrderId}", @event.AggregateId);
    }

    private async Task<OrderReadModel?> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await context.Orders.AsTracking().FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (order is null)
            return null;

        return order;
    }
}