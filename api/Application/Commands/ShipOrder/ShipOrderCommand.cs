using MediatR;

namespace ecommerce_order.Application.Commands;

public class ShipOrderCommand : IRequest
{
    public Guid OrderId { get; }
    public string TrackingNumber { get; }
    public string Carrier { get; }

    public ShipOrderCommand(Guid orderId, string trackingNumber, string carrier)
    {
        OrderId = orderId;
        TrackingNumber = trackingNumber;
        Carrier = carrier;
    }
}