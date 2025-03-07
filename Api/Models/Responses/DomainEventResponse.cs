using System.Text.Json;

namespace ecommerce_order.Api.Models.Responses;

public record DomainEventResponse
{
    public string Id { get; set; }
    public string OrderId { get; set; }
    public string EventType { get; set; }
    public string Timestamp { get; set; }
    public JsonElement Data { get; set; }
}