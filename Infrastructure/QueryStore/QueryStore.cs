using ecommerce_order.Application.DTOs;
using ecommerce_order.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ecommerce_order.Infrastructure.QueryStore;

public class QueryStore(QueryDbContext context, ILogger<QueryStore> logger) : IQueryStore
{
    public async Task<OrderDto?> GetOrderAsync(Guid id, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting order {OrderId} from query store", id);

        var order = await context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (order == null)
        {
            logger.LogWarning("Order {OrderId} not found in query store", id);
            return null;
        }

        var result = new OrderDto
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            OrderDate = order.OrderDate,
            Status = order.Status,
            ShippingAddress = order.ShippingAddress,
            TotalAmount = order.TotalAmount,
            PaymentDate = order.PaymentDate,
            ShippingDate = order.ShippingDate,
            TrackingNumber = order.TrackingNumber,
            Carrier = order.Carrier,
            Version = order.Version,
            Items = order.Items.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity,
                TotalPrice = oi.TotalPrice
            }).ToList()
        };

        logger.LogInformation("Order {OrderId} retrieved successfully from query store", id);
        return result;
    }

    public async Task<IEnumerable<OrderSummaryDto>> GetOrdersAsync(Guid? customerId = null,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting orders from query store for customer {CustomerId}", customerId);

        IQueryable<OrderReadModel> query = context.Orders;

        if (customerId.HasValue)
        {
            query = query.Where(o => o.CustomerId == customerId.Value);
        }

        var orders = await query
            .Select(o => new OrderSummaryDto
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                OrderDate = o.OrderDate,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                ItemCount = o.Items.Count
            })
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {OrderCount} orders for customer {CustomerId}", orders.Count, customerId);
        return orders;
    }

    public async Task<IEnumerable<OrderSummaryDto>> GetOrdersByStatusAsync(string status,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting orders with status {Status} from query store", status);

        var orders = await context.Orders
            .Where(o => o.Status == status)
            .Select(o => new OrderSummaryDto
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                OrderDate = o.OrderDate,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                ItemCount = o.Items.Count
            })
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {OrderCount} orders with status {Status}", orders.Count, status);
        return orders;
    }
}