using System.ComponentModel.DataAnnotations;
using ecommerce_order.Domain.Aggregates;
using ecommerce_order.Domain.Events;
using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Infrastructure.QueryStore;

public class OrderReadModel
{
    public Guid Id { get; private set; }
    public Guid CustomerId { get; private set; }
    public DateTime OrderDate { get; private set; }
    public string Status { get; private set; } = OrderStatus.Processing.ToString();
    public Address? ShippingAddress { get; private set; }
    public decimal TotalAmount { get; private set; } = 0;
    public DateTime? PaymentDate { get; private set; }
    public DateTime? ShippingDate { get; private set; }
    
    [MaxLength(200)]
    public string? TrackingNumber { get; private set; } = string.Empty;
    
    [MaxLength(200)]
    public string? Carrier { get; private set; } = string.Empty;
    public int Version { get; private set; }

    public List<OrderItemReadModel> Items { get; private init; } = new();

    public static OrderReadModel Create(OrderCreatedEvent @event)
    {
        return new OrderReadModel()
        {
            Id = @event.AggregateId,
            CustomerId = @event.CustomerId,
            OrderDate = @event.OrderDate,
            Status = OrderStatus.Processing.ToString(),
            Items = @event.OrderItems.Select(item => new OrderItemReadModel()
            {
                Quantity = item.Quantity,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                UnitPrice = item.UnitPrice.Amount,
                TotalPrice = item.UnitPrice.Amount * item.Quantity,
                OrderId = @event.AggregateId
            }).ToList(),
            TotalAmount = @event.OrderItems.Sum(i => i.Quantity * i.UnitPrice.Amount),
            ShippingAddress = @event.Address,
            Version = @event.Version,
        };
    }

    public void Apply(OrderItemAddedEvent @event)
    {
        Items.Add(new OrderItemReadModel()
        {
            OrderId = @event.AggregateId,
            ProductId = @event.ProductId,
            ProductName = @event.ProductName,
            UnitPrice = @event.UnitPrice.Amount,
            Quantity = @event.Quantity,
            TotalPrice = @event.UnitPrice.Amount * @event.Quantity
        });

        TotalAmount = Items.Sum(i => i.TotalPrice);
        Status = OrderStatus.Processing.ToString();
        Version = @event.Version;
    }

    public void Apply(OrderAddressSetEvent @event)
    {
        ShippingAddress = @event.Address;
        Version = @event.Version;
    }

    public void Apply(OrderPaidEvent @event)
    {
        Status = OrderStatus.Paid.ToString();
        PaymentDate = @event.PaymentDate;
        Version = @event.Version;
    }

    public void Apply(OrderShippedEvent @event)
    {
        Status = OrderStatus.Shipped.ToString();
        ShippingDate = @event.ShippingDate;
        TrackingNumber = @event.TrackingNumber;
        Carrier = @event.Carrier;
        Version = @event.Version;
    }

    public void Apply(OrderCanceledEvent @event)
    {
        Status = OrderStatus.Canceled.ToString();
        Version = @event.Version;
    }
}