using System.Text.Json;
using ecommerce_order.Application.DTOs;
using ecommerce_order.Infrastructure.EventStore;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_order.Application.Queries.GetOrderEventHistory;

public class GetOrderEventHistoryQueryHandler(
    EventStoreDbContext eventStoreDbContext,
    ILogger<GetOrderEventHistoryQueryHandler> logger)
    : IRequestHandler<GetOrderEventHistoryQuery, OrderEventHistoryResponse>
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task<OrderEventHistoryResponse> Handle(
        GetOrderEventHistoryQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting event history for order {OrderId}", query.OrderId);

        var events = await eventStoreDbContext.Events
            .Where(e => e.AggregateId == query.OrderId)
            .OrderByDescending(e => e.Version)
            .ToListAsync(cancellationToken);

        if (!events.Any())
        {
            logger.LogWarning("No events found for order {OrderId}", query.OrderId);
            return new OrderEventHistoryResponse
            {
                OrderId = query.OrderId,
                Events = new List<OrderEventHistoryDto>()
            };
        }

        var result = new OrderEventHistoryResponse
        {
            OrderId = query.OrderId,
            Events = events.Select(e => new OrderEventHistoryDto
            {
                Id = e.Id,
                OrderId = e.AggregateId,
                EventType = e.EventType.Split(',').First().Split('.').LastOrDefault() ?? string.Empty,
                Timestamp = e.Timestamp,
                Version = e.Version,
                Data = ParseEventData(e.Payload)
            }).ToList()
        };

        logger.LogInformation("Retrieved {EventCount} events for order {OrderId}",
            result.Events.Count, query.OrderId);

        return result;
    }

    private static string GetEventTypeName(string fullyQualifiedTypeName)
    {
        try
        {
            var lastDot = fullyQualifiedTypeName.LastIndexOf('.');
            if (lastDot > 0 && lastDot < fullyQualifiedTypeName.Length - 1)
            {
                var typeName = fullyQualifiedTypeName.Substring(lastDot + 1);

                var commaIndex = typeName.IndexOf(',');
                if (commaIndex > 0)
                {
                    typeName = typeName.Substring(0, commaIndex);
                }

                return typeName;
            }
        }
        catch
        {
            // In case of any parsing error, return the full type name
        }

        return fullyQualifiedTypeName;
    }

    private static JsonElement ParseEventData(string jsonData)
    {
        try
        {
            using var document = JsonDocument.Parse(jsonData);
            return document.RootElement.Clone();
        }
        catch (Exception)
        {
            // If parsing fails, return an empty object
            return JsonDocument.Parse("{}").RootElement.Clone();
        }
    }
}
