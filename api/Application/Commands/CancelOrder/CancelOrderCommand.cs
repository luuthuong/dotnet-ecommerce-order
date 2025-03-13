using MediatR;

namespace ecommerce_order.Application.Commands;

public class CancelOrderCommand : IRequest
{
    public Guid OrderId { get; }
    public string Reason { get; }

    public CancelOrderCommand(Guid orderId, string reason)
    {
        OrderId = orderId;
        Reason = reason;
    }
}