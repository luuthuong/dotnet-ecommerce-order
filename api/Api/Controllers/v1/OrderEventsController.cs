using System.Text.Json;
using ecommerce_order.Api.Models.Responses;
using ecommerce_order.Application.Queries.GetOrderEventHistory;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ecommerce_order.Api.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/orders/{orderId}/events")]
public class OrderEventsController(IMediator mediator, ILogger<OrderEventsController> logger) : ControllerBase
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<OrderEventHistoryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetOrderEventHistory(Guid orderId)
    {
        try
        {
            logger.LogInformation("Getting event history for order {OrderId}", orderId);

            var query = new GetOrderEventHistoryQuery(orderId);
            var result = await mediator.Send(query);

            if (result.Events.Count == 0)
            {
                return NotFound(ApiResponse<OrderEventHistoryResponse>.Fail($"No events found for order {orderId}"));
            }

            return Ok(ApiResponse<OrderEventHistoryResponse>.Success(result));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting event history for order {OrderId}", orderId);
            return StatusCode(500, ApiResponse<OrderEventHistoryResponse>.Fail(ex.Message));
        }
    }
}