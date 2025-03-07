using ecommerce_order.Application.Interfaces;
using ecommerce_order.Domain.ValueObjects;
using MediatR;

namespace ecommerce_order.Application.Commands;

public class PayOrderCommandHandler(IOrderRepository orderRepository, ILogger<PayOrderCommandHandler> logger)
    : IRequestHandler<PayOrderCommand>
{
    private readonly IOrderRepository _orderRepository =
        orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));

    private readonly ILogger<PayOrderCommandHandler>
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task Handle(PayOrderCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing payment for order {OrderId}", request.OrderId);

        var order = await _orderRepository.GetByIdAsync(request.OrderId, cancellationToken);
        if (order == null)
        {
            _logger.LogWarning("Order {OrderId} not found", request.OrderId);
            throw new InvalidOperationException($"Order {request.OrderId} not found");
        }

        order.MarkAsPaid(
            new Money(request.Amount),
            request.PaymentMethod,
            request.TransactionId);

        await _orderRepository.SaveEventAsync(order, cancellationToken);

        _logger.LogInformation("Payment processed for order {OrderId} successfully", request.OrderId);
    }
}