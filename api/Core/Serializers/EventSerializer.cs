using System.Text.Json;
using System.Text.Json.Serialization;
using ecommerce_order.Core.Domain;
using ecommerce_order.Infrastructure.EventStore.Exceptions;

namespace ecommerce_order.Core.Serializers;

public class EventSerializer
{
    private static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Converters = { new JsonStringEnumConverter() }
    };

    public static string Serialize(DomainEvent @event)
    {
        try
        {
            return JsonSerializer.Serialize(@event, @event.GetType(), Options);
        }
        catch (Exception ex)
        {
            throw new EventSerializationException($"Failed to serialize event of type {@event.GetType().Name}", ex);
        }
    }

    public static DomainEvent Deserialize(string eventData, string eventType)
    {
        if (string.IsNullOrWhiteSpace(eventData))
        {
            throw new ArgumentException("Event data cannot be null or whitespace", nameof(eventData));
        }

        if (string.IsNullOrWhiteSpace(eventType))
        {
            throw new ArgumentException("Event type cannot be null or whitespace", nameof(eventType));
        }

        try
        {
            Type? type = Type.GetType(eventType);

            if (type is null)
            {
                throw new EventDeserializationException($"Event type {eventType} not found");
            }

            var result = JsonSerializer.Deserialize(eventData, type, Options);

            if (result == null)
            {
                throw new EventDeserializationException("Failed to cast deserialized object to DomainEvent");
            }

            return (DomainEvent)result;
        }
        catch (Exception ex) when (!(ex is EventDeserializationException))
        {
            throw new EventDeserializationException($"Failed to deserialize event of type {eventType}", ex);
        }
    }
}