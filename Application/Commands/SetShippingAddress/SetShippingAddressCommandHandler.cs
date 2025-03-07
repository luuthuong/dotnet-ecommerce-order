using ecommerce_order.Application.Interfaces;
using ecommerce_order.Domain.ValueObjects;
using MediatR;

namespace ecommerce_order.Application.Commands;

public class SetShippingAddressCommandHandler(
    IOrderRepository orderRepository,
    ILogger<SetShippingAddressCommandHandler> logger)
    : IRequestHandler<SetShippingAddressCommand>
{
    private readonly IOrderRepository _orderRepository =
        orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));

    private readonly ILogger<SetShippingAddressCommandHandler> _logger =
        logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task Handle(SetShippingAddressCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Setting shipping address for order {OrderId}", request.OrderId);


        // Get the order
        var order = await _orderRepository.GetByIdAsync(request.OrderId, cancellationToken);
        if (order == null)
        {
            _logger.LogWarning("Order {OrderId} not found", request.OrderId);
            throw new InvalidOperationException($"Order {request.OrderId} not found");
        }

        // Create the address value object
        var address = new Address(
            request.Street,
            request.City,
            request.State,
            request.ZipCode,
            request.Country);

        // Set the shipping address
        order.SetShippingAddress(address);

        // Save the updated order
        await _orderRepository.SaveEventAsync(order, cancellationToken);

        _logger.LogInformation("Shipping address set for order {OrderId} successfully", request.OrderId);
    }
}