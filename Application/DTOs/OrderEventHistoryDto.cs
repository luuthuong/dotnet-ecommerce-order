using System.Text.Json;

namespace ecommerce_order.Application.DTOs;

public class OrderEventHistoryDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string EventType { get; set; }
    public DateTime Timestamp { get; set; }
    public int Version { get; set; }
    public JsonElement Data { get; set; }
}