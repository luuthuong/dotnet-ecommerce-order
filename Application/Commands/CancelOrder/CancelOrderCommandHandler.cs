using ecommerce_order.Application.Interfaces;
using MediatR;

namespace ecommerce_order.Application.Commands;

public class CancelOrderCommandHandler(IOrderRepository orderRepository, ILogger<CancelOrderCommandHandler> logger): IRequestHandler<CancelOrderCommand>
{
    private readonly IOrderRepository _orderRepository =
        orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));

    private readonly ILogger<CancelOrderCommandHandler> _logger =
        logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task Handle(CancelOrderCommand request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Canceling order {OrderId}", request.OrderId);

        // Get the order
        var order = await _orderRepository.GetByIdAsync(request.OrderId, cancellationToken);
        if (order == null)
        {
            _logger.LogWarning("Order {OrderId} not found", request.OrderId);
            throw new InvalidOperationException($"Order {request.OrderId} not found");
        }

        // Cancel the order
        order.Cancel(request.Reason);

        // Save the updated order
        await _orderRepository.SaveEventAsync(order, cancellationToken);

        _logger.LogInformation("Order {OrderId} canceled successfully", request.OrderId);
    }
}