namespace ecommerce_order.Api.Models.Requests;

public class ShipOrderRequest
{
    public string TrackingNumber { get; set; }
    public string Carrier { get; set; }
}