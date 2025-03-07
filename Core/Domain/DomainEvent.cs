namespace ecommerce_order.Core.Domain;

public record DomainEvent: IDomainEvent
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    
    public required Guid AggregateId { get; init; }
    
    public DateTime Timestamp { get; private set; } = DateTime.UtcNow;

    public int Version { get; set; }
}