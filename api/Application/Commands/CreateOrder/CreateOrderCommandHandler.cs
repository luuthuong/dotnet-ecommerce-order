using ecommerce_order.Application.Interfaces;
using ecommerce_order.Domain.Aggregates;
using MediatR;

namespace ecommerce_order.Application.Commands;

public class CreateOrderCommandHandler(IOrderRepository orderRepository, ILogger<CreateOrderCommandHandler> logger)
    : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IOrderRepository _orderRepository =
        orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));

    private readonly ILogger<CreateOrderCommandHandler> _logger =
        logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken = default)
    {
        var order = OrderAggregate.Create(
            new(
                request.CustomerName, 
                request.ShippingAddress,
                request.OrderItems.Select(
                    item => new OrderItem(item.ProductId, item.ProductName, item.UnitPrice, item.Quantity)
                )
            )
        );

        _logger.LogInformation("Creating new order {OrderId} for customer {CustomerId}",
            order.Id, request.CustomerName);

        await _orderRepository.SaveEventAsync(order, cancellationToken);

        _logger.LogInformation("Order {OrderId} created successfully", order.Id);

        return order.Id;
    }
}