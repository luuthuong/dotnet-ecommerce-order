namespace ecommerce_order.Domain.Aggregates;

public enum OrderStatus
{
    Processing = 1,
    Paid = 2,
    Shipped = 3,
    Delivered = 4,
    Canceled = 5
}