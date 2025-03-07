namespace ecommerce_order.Api.Models.Requests;

public record CreateOrderRequest
{
    public Guid CustomerId { get; set; }
    public AddressRequest Address { get; set; }
    public List<OrderItemRequest> OrderItems { get; set; } = new();
}

public record AddressRequest
{
    public required string Street { get; init; }
    public required string City { get; init; }
    public required string State { get; init; }
    public required string ZipCode { get; init; }
    public required string Country { get; init; }
}

public record OrderItemRequest
{
    public required Guid ProductId { get; set; }
    public required string ProductName { get; set; }
    public required MoneyRequest UnitPrice { get; set; }
    public required int Quantity { get; set; }
}

public record MoneyRequest
{
    public decimal Amount { get; set; } // Using string to handle decimal values better in JSON
    public string Currency { get; set; } = "USD";
}