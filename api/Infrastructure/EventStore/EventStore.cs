using ecommerce_order.Application.Interfaces;
using ecommerce_order.Core.Domain;
using ecommerce_order.Core.Serializers;
using ecommerce_order.Domain.Aggregates;
using ecommerce_order.Domain.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_order.Infrastructure.EventStore;

public class EventStore(
    EventStoreDbContext context,
    ILogger<EventStore> logger,
    IMediator mediator
) : IEventStore
{
    public async Task SaveEventsAsync(
        AggregateRoot aggregate,
        IEnumerable<DomainEvent> events,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Saving events for aggregate {AggregateId}", aggregate.Id);

        var eventList = events.ToList();
        
        if (!eventList.Any())
        {
            logger.LogInformation("No events to save for aggregate {AggregateId}", aggregate.Id);
            return;
        }

        var strategy = context.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                IEnumerable<EventData> eventEntries = eventList.Select(EventData.From);

                await context.Events.AddRangeAsync(eventEntries, cancellationToken);

                await context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                logger.LogInformation(
                    "Successfully saved {EventCount} events for aggregate {AggregateId}",
                    eventList.Count, aggregate.Id);

                await ProcessHandleEventAsync(eventList);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error saving events for aggregate {AggregateId}", aggregate.Id);
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        });
    }

    private async Task ProcessHandleEventAsync(IEnumerable<DomainEvent> events)
    {
        foreach (var @event in events)
        {
            logger.LogInformation("Processing event {@EventType} for read model update",
                @event.GetType().Name);

            try
            {
                await mediator.Publish(@event);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing event {EventId} of type {EventType}",
                    @event.Id, @event.GetType().Name);
                throw;
            }
        }
    }

    public async Task<IEnumerable<DomainEvent>> GetEventsAsync(
        Guid aggregateId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting events for aggregate {AggregateId}", aggregateId);

        var eventDataList = await context.Events
            .Where(e => e.AggregateId == aggregateId)
            .OrderBy(e => e.Version)
            .ToListAsync(cancellationToken);

        if (!eventDataList.Any())
        {
            logger.LogWarning("No events found for aggregate {AggregateId}", aggregateId);
            return Enumerable.Empty<DomainEvent>();
        }

        var events = new List<DomainEvent>();
        foreach (var eventData in eventDataList)
        {
            try
            {
                var @event = EventSerializer.Deserialize(eventData.Payload, eventData.EventType);
                events.Add(@event);
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex, "Error deserializing event {EventId} of type {EventType}: {ErrorMessage}",
                    eventData.Id, eventData.EventType, ex.Message);

                throw;
            }
        }

        logger.LogInformation(
            "Retrieved {EventCount} events for aggregate {AggregateId}",
            events.Count, aggregateId);

        return events;
    }
}