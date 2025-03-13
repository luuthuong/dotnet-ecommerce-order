using ecommerce_order.Core.Domain;
using ecommerce_order.Core.Serializers;
using ecommerce_order.Domain.Events;

namespace ecommerce_order.Infrastructure.EventStore;

public class EventData
{
    public Guid Id { get; set; } 
    public Guid AggregateId { get; set; } 
    public DateTime Timestamp { get; set; } 
    public int Version { get; set; }
    public string EventType { get; set; }
    public string Payload { get; set; }

    public static EventData From(DomainEvent @event)
    {
        return new()
        {
            Id = @event.Id,
            AggregateId = @event.AggregateId,
            Timestamp = @event.Timestamp,
            Version = @event.Version,
            EventType = @event.GetType().AssemblyQualifiedName!,
            Payload = EventSerializer.Serialize(@event)
        };
    }
}