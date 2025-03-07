using MediatR;

namespace ecommerce_order.Core.Domain;

public interface IDomainEvent: INotification
{
}

public interface IDomainEventHandler<in T> : INotificationHandler<T> where T : IDomainEvent
{
    new Task Handle(T @event, CancellationToken cancellationToken);
}