namespace ecommerce_order.Infrastructure.EventStore.Exceptions;

public class EventSerializationException : Exception
{
    public EventSerializationException(string message) : base(message)
    {
    }

    public EventSerializationException(string message, Exception innerException) : base(message, innerException)
    {
    }
}