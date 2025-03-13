namespace ecommerce_order.Core.Domain;

public abstract class AggregateRoot
{
    public Guid Id { get; protected set; }
    public int Version { get; protected set; } = -1;

    private readonly Queue<DomainEvent> _domainEvents = new();
    
    protected void RaiseEvent(DomainEvent @event)
    {
        @event.Version = Version + 1;
        _domainEvents.Enqueue(@event);
    }

    public IReadOnlyCollection<DomainEvent> GetEvents() => _domainEvents.ToList();
    
    public void ClearEvents() => _domainEvents.Clear();
}