namespace ecommerce_order.Infrastructure.EventStore.Exceptions;

public class EventDeserializationException : Exception
{
    public EventDeserializationException(string message) : base(message)
    {
    }

    public EventDeserializationException(string message, Exception innerException) : base(message, innerException)
    {
    }
}