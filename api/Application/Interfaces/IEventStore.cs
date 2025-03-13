using ecommerce_order.Core.Domain;
using ecommerce_order.Domain.Aggregates;
using ecommerce_order.Domain.Events;

namespace ecommerce_order.Application.Interfaces;

public interface IEventStore
{
    Task SaveEventsAsync(AggregateRoot aggregate, IEnumerable<DomainEvent> events, CancellationToken cancellationToken = default);

    Task<IEnumerable<DomainEvent>> GetEventsAsync(Guid aggregateId, CancellationToken cancellationToken = default);
}