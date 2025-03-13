using ecommerce_order.Application.Interfaces;
using MediatR;

namespace ecommerce_order.Application.Commands;

public class ShipOrderCommandHandler(IOrderRepository orderRepository, ILogger<ShipOrderCommandHandler> logger)
    : IRequestHandler<ShipOrderCommand>
{
    private readonly IOrderRepository _orderRepository =
        orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));

    private readonly ILogger<ShipOrderCommandHandler> _logger =
        logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task Handle(ShipOrderCommand request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Shipping order {OrderId}", request.OrderId);

        var order = await _orderRepository.GetByIdAsync(request.OrderId, cancellationToken);
        if (order == null)
        {
            _logger.LogWarning("Order {OrderId} not found", request.OrderId);
            throw new InvalidOperationException($"Order {request.OrderId} not found");
        }

        order.Ship(request.TrackingNumber, request.Carrier);

        await _orderRepository.SaveEventAsync(order, cancellationToken);

        _logger.LogInformation("Order {OrderId} shipped successfully", request.OrderId);
    }
}