using ecommerce_order.Domain.ValueObjects;

namespace ecommerce_order.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public Money Price { get; private set; }
    public int InventoryCount { get; private set; }

    private Product() { } // For EF Core

    public Product(Guid id, string name, string description, Money price, int inventoryCount)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Product ID cannot be empty", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Product name cannot be empty", nameof(name));
        }

        if (price.Amount <= 0)
        {
            throw new ArgumentException("Product price must be positive", nameof(price));
        }

        if (inventoryCount < 0)
        {
            throw new ArgumentException("Inventory count cannot be negative", nameof(inventoryCount));
        }

        Id = id;
        Name = name;
        Description = description ?? string.Empty;
        Price = price;
        InventoryCount = inventoryCount;
    }

    public void UpdateInventory(int newCount)
    {
        if (newCount < 0)
            throw new ArgumentException("Inventory count cannot be negative", nameof(newCount));

        InventoryCount = newCount;
    }

    public bool CanFulfillOrder(int quantity)
    {
        return InventoryCount >= quantity;
    }

    public void ReduceInventory(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        if (!CanFulfillOrder(quantity))
            throw new InvalidOperationException($"Insufficient inventory for product {Id}");

        InventoryCount -= quantity;
    }
}