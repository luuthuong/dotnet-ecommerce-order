namespace ecommerce_order.Api.Models.Requests;

public class PayOrderRequest
{
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; }
    public string TransactionId { get; set; }
}