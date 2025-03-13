using MediatR;

namespace ecommerce_order.Application.Commands;

public class PayOrderCommand : IRequest
{
    public Guid OrderId { get; }
    public decimal Amount { get; }
    public string PaymentMethod { get; }
    public string TransactionId { get; }

    public PayOrderCommand(Guid orderId, decimal amount, string paymentMethod, string transactionId)
    {
        OrderId = orderId;
        Amount = amount;
        PaymentMethod = paymentMethod;
        TransactionId = transactionId;
    }
}