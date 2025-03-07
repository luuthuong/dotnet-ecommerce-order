namespace ecommerce_order.Api.Models.Requests;

public class AddOrderItemRequest
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}