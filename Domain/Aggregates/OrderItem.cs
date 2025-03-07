using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Domain.Aggregates;

public class OrderItem
{
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; }
    public Money UnitPrice { get; private set; }
    public int Quantity { get; private set; }
    public Money TotalPrice => new Money(UnitPrice.Amount * Quantity, UnitPrice.Currency);

    public OrderItem(Guid productId, string productName, Money unitPrice, int quantity)
    {
        if (productId == Guid.Empty)
            throw new ArgumentException("Product ID cannot be empty", nameof(productId));
        
        if (string.IsNullOrWhiteSpace(productName))
            throw new ArgumentException("Product name cannot be empty", nameof(productName));
        
        if (unitPrice.Amount <= 0)
            throw new ArgumentException("Unit price must be positive", nameof(unitPrice));
        
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        ProductId = productId;
        ProductName = productName;
        UnitPrice = unitPrice;
        Quantity = quantity;
    }
}