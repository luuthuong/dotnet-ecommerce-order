using ecommerce_order.Core.Domain;
using ecommerce_order.Domain.Aggregates.Data;
using ecommerce_order.Domain.Events;
using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Domain.Aggregates;

public class OrderAggregate: AggregateRoot
{
    private readonly List<OrderItem> _items = new();

    public Guid Id { get; private set; }
    public string CustomerName { get; private set; }
    public DateTime OrderDate { get; private set; }
    public OrderStatus Status { get; private set; }
    public Address ShippingAddress { get; private set; }

    public Money TotalAmount
    {
        get
        {
            Money total = new Money(0, Items[0].UnitPrice.Currency);

            foreach (var item in _items)
            {
                total += item.TotalPrice;
            }

            return total;
        }
    }

    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();
    public DateTime? PaymentDate { get; private set; }
    public DateTime? ShippingDate { get; private set; }
    public string TrackingNumber { get; private set; }
    public string Carrier { get; private set; }

    public OrderAggregate()
    {
    }

    public static OrderAggregate Create(OrderCreateData data)
    {
        var order = new OrderAggregate();

        OrderCreatedEvent @event = new()
        {
            AggregateId = Guid.NewGuid(),
            CustomerName = data.CustomerName,
            OrderDate = DateTime.UtcNow,
            Address = data.ShippingAddress,
            OrderItems = data.OrderItems
        };
        
        order.RaiseEvent(@event);
        order.Apply(@event);
        
        return order;
    }
    
    public void AddItem(Guid productId, string productName, Money unitPrice, int quantity)
    {
        if (Status > OrderStatus.Processing)
        {
            throw new InvalidOperationException($"Cannot change shipping address of an order that is not in {Status.ToString()}");
        }
        
        OrderItemAddedEvent @event = new()
        {
            AggregateId = Id,
            ProductId = productId,
            ProductName = productName,
            UnitPrice = unitPrice,
            Quantity = quantity
        };
        
        RaiseEvent(@event);
        Apply(@event);
    }

    public void SetShippingAddress(Address address)
    {
        if (Status != OrderStatus.Processing)
            throw new InvalidOperationException("Cannot change shipping address of an order that is not in New status");

        OrderAddressSetEvent @event = new()
        {
            AggregateId = Id,
            Address = address,
        };
        
        RaiseEvent(@event);
        Apply(@event);
    }

    public void MarkAsPaid(Money amount, string paymentMethod, string transactionId)
    {
        if(Status == OrderStatus.Paid)
            throw new InvalidOperationException("The order is already paid");
        
        if (amount.Amount < TotalAmount.Amount)
            throw new InvalidOperationException("Payment amount is less than the order total");

        if (string.IsNullOrEmpty(transactionId))
            throw new ArgumentException("Transaction ID is required", nameof(transactionId));

        OrderPaidEvent @event = new()
        {
            AggregateId = Id,
            Amount = amount,
            PaymentMethod = paymentMethod,
            TransactionId = transactionId,
            PaymentDate = DateTime.UtcNow
        };
        
        RaiseEvent(@event);
        Apply(@event);
    }

    public void Ship(string trackingNumber, string carrier)
    {
        if (Status != OrderStatus.Paid)
            throw new InvalidOperationException("Cannot ship an order that is not paid");

        if (string.IsNullOrEmpty(trackingNumber))
            throw new ArgumentException("Tracking number is required", nameof(trackingNumber));

        if (string.IsNullOrEmpty(carrier))
            throw new ArgumentException("Carrier is required", nameof(carrier));

        OrderShippedEvent @event = new()
        {
            AggregateId = Id,
            TrackingNumber = trackingNumber,
            Carrier = carrier,
            ShippingDate = DateTime.UtcNow
        };
        
        RaiseEvent(@event);
        Apply(@event);
    }

    public void Cancel(string reason)
    {
        if (Status == OrderStatus.Shipped || Status == OrderStatus.Delivered)
            throw new InvalidOperationException("Cannot cancel an order that is already shipped or delivered");

        if (string.IsNullOrEmpty(reason))
            throw new ArgumentException("Cancellation reason is required", nameof(reason));

        OrderCanceledEvent @event = new()
        {
            AggregateId = Id,
            Reason = reason,
            CancellationDate = DateTime.UtcNow,
        };
        
        RaiseEvent(@event);
        Apply(@event);
    }
    
    public void LoadFromHistory(IEnumerable<DomainEvent> history)
    {
        dynamic @this = this;

        foreach (var @event in history)
        {
            dynamic @thisEvent = @event;
            @this.Version = @event.Version;
            @this.Apply(@thisEvent);
        }
    }

    void Apply(OrderCreatedEvent @event)
    {
        Id = @event.AggregateId;
        CustomerName = @event.CustomerName;
        OrderDate = @event.OrderDate;
        Status = OrderStatus.Processing;
        TrackingNumber = Guid.NewGuid().ToString();
        ShippingAddress = @event.Address;

        foreach (var item in @event.OrderItems)
        {
            var orderItem = new OrderItem(
                item.ProductId,
                item.ProductName,
                item.UnitPrice,
                item.Quantity);
            
            _items.Add(orderItem);
        }
    }

    void Apply(OrderItemAddedEvent @event)
    {
        var orderItem = new OrderItem(
            @event.ProductId,
            @event.ProductName,
            @event.UnitPrice,
            @event.Quantity);

        _items.Add(orderItem);
    }

    void Apply(OrderAddressSetEvent @event)
    {
        ShippingAddress = @event.Address;
    }
    void Apply(OrderPaidEvent @event)
    {
        Status = OrderStatus.Paid;
        PaymentDate = @event.PaymentDate;
    }

    void Apply(OrderShippedEvent @event)
    {
        Status = OrderStatus.Shipped;
        ShippingDate = @event.ShippingDate;
        TrackingNumber = @event.TrackingNumber;
        Carrier = @event.Carrier;
    }

    void Apply(OrderCanceledEvent @event)
    {
        Status = OrderStatus.Canceled;
    }
}