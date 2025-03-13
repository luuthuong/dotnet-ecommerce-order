using ecommerce_order.Application.Interfaces;
using ecommerce_order.Domain.ValueObjects;
using MediatR;

namespace ecommerce_order.Application.Commands;

public class AddOrderItemCommandHandler(IOrderRepository orderRepository, ILogger<AddOrderItemCommandHandler> logger)
    : IRequestHandler<AddOrderItemCommand>
{
    private readonly IOrderRepository _orderRepository =
        orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));

    private readonly ILogger<AddOrderItemCommandHandler> _logger =
        logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task Handle(AddOrderItemCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Adding item {ProductId} to order {OrderId}",
            request.ProductId, request.OrderId);

        var order = await _orderRepository.GetByIdAsync(request.OrderId, cancellationToken);
        
        if (order == null)
        {
            _logger.LogWarning("Order {OrderId} not found", request.OrderId);
            throw new InvalidOperationException($"Order {request.OrderId} not found");
        }

        order.AddItem( request.ProductId, request.ProductName,  new Money(request.UnitPrice), request.Quantity);

        await _orderRepository.SaveEventAsync(order, cancellationToken);

        _logger.LogInformation("Item {ProductId} added to order {OrderId} successfully",
            request.ProductId, request.OrderId);
    }
}