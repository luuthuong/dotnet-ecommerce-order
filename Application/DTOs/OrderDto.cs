using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Application.DTOs;

public class OrderDto
{
    public Guid Id { get; set; }
    public string CustomerName { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public Address ShippingAddress { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public DateTime? PaymentDate { get; set; }
    public DateTime? ShippingDate { get; set; }
    public string TrackingNumber { get; set; }
    public string Carrier { get; set; }
    public int Version { get; set; }
}