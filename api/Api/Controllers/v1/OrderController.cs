using ecommerce_order.Api.Models.Requests;
using ecommerce_order.Api.Models.Responses;
using ecommerce_order.Application.Commands;
using ecommerce_order.Application.DTOs;
using ecommerce_order.Application.Queries;
using ecommerce_order.Domain.ValueObjects;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ecommerce_order.Api.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class OrdersController(IMediator mediator, ILogger<OrdersController> logger) : ControllerBase
{
    private readonly IMediator _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    private readonly ILogger<OrdersController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        try
        {
            var command = new CreateOrderCommand
            {
                CustomerName = request.CustomerName,
                ShippingAddress = new Address(
                    request.Address.Street, request.Address.City,
                    request.Address.State, request.Address.ZipCode,
                    request.Address.Country
                ),
                OrderItems = request.OrderItems.Select(item => new CreateOrderCommand.OrderItemDetails()
                {
                    Quantity = item.Quantity,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    UnitPrice = new Money(item.UnitPrice.Amount, item.UnitPrice.Currency)
                })
            };
            var orderId = await _mediator.Send(command);

            return CreatedAtAction(
                nameof(GetOrder), 
                new { id = orderId },
                ApiResponse<Guid>.Success(orderId, "Order created successfully")
            );
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<Guid>.Fail(ex.Message));
        }
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<OrderDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        try
        {
            var query = new GetOrderQuery(id);
            var order = await _mediator.Send(query);

            if (order is null)
            {
                return NotFound(ApiResponse<OrderDto>.Fail($"Order {id} not found"));
            }

            return Ok(ApiResponse<OrderDto>.Success(order));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<OrderDto>.Fail(ex.Message));
        }
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<OrderSummaryDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetOrders([FromQuery] Guid? customerId = null)
    {
        try
        {
            var query = new GetOrdersQuery(customerId);
            var orders = await _mediator.Send(query);

            return Ok(ApiResponse<IEnumerable<OrderSummaryDto>>.Success(orders));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<OrderSummaryDto>>.Fail(ex.Message));
        }
    }

    [HttpGet("status/{status}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<OrderSummaryDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetOrdersByStatus(string status)
    {
        try
        {
            var query = new GetOrdersByStatusQuery(status);
            var orders = await _mediator.Send(query);

            return Ok(ApiResponse<IEnumerable<OrderSummaryDto>>.Success(orders));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<IEnumerable<OrderSummaryDto>>.Fail(ex.Message));
        }
    }

    [HttpPost("{id:guid}/items")]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddOrderItem(Guid id, [FromBody] AddOrderItemRequest request)
    {
        try
        {
            var command = new AddOrderItemCommand(
                id,
                request.ProductId,
                request.ProductName,
                request.UnitPrice,
                request.Quantity);

            await _mediator.Send(command);

            return Ok(ApiResponse<string>.Success("Item added to order successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<string>.Fail(ex.Message));
        }
    }

    [HttpPut("{id:guid}/shipping-address")]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SetShippingAddress(Guid id, [FromBody] SetShippingAddressRequest request)
    {
        try
        {
            var command = new SetShippingAddressCommand(
                id,
                request.Street,
                request.City,
                request.State,
                request.ZipCode,
                request.Country);

            await _mediator.Send(command);

            return Ok(ApiResponse<string>.Success("Shipping address set successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<string>.Fail(ex.Message));
        }
    }

    [HttpPut("{id:guid}/payments")]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ProcessPayment(Guid id, [FromBody] PayOrderRequest request)
    {
        try
        {
            var command = new PayOrderCommand(
                id,
                request.Amount,
                request.PaymentMethod,
                request.TransactionId);

            await _mediator.Send(command);

            return Ok(ApiResponse<string>.Success("Payment processed successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<string>.Fail(ex.Message));
        }
    }

    [HttpPut("{id:guid}/ship")]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ShipOrder(Guid id, [FromBody] ShipOrderRequest request)
    {
        try
        {
            var command = new ShipOrderCommand(
                id,
                request.TrackingNumber,
                request.Carrier);

            await _mediator.Send(command);

            return Ok(ApiResponse<string>.Success("Order shipped successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<string>.Fail(ex.Message));
        }
    }

    [HttpPut("{id:guid}/cancel")]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CancelOrder(Guid id, [FromBody] CancelOrderRequest request)
    {
        try
        {
            _logger.LogInformation("Canceling order {OrderId}", id);

            var command = new CancelOrderCommand(id, request.Reason);
            await _mediator.Send(command);

            return Ok(ApiResponse<string>.Success("Order canceled successfully"));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation when canceling order {OrderId}", id);
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error canceling order {OrderId}", id);
            return StatusCode(500, ApiResponse<string>.Fail(ex.Message));
        }
    }
}