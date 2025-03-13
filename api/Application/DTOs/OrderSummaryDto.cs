namespace ecommerce_order.Application.DTOs;

public class OrderSummaryDto
{
    public Guid Id { get; set; }
    public string CustomerName { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public decimal TotalAmount { get; set; }
    public int ItemCount { get; set; }
}