import type { Product, OrderDto, OrderSummaryDto } from "./types"

export const products: Product[] = [
  {
    id: "d7c3561f-229d-4c0e-be48-ef6d13e43a25",
    name: "Example T-Shirt",
    description: "A comfortable cotton t-shirt with a modern design.",
    price: 25.0,
    image: "https://cdn.shopify.com/s/files/1/0874/8928/2359/files/ciseco_p_-24_ec9df7d2-f47c-4255-99ab-6c53aca02e05.png?v=1714213173&width=800&crop=center",
    colors: ["red", "green", "gray", "orange"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviewCount: 12,
    inStock: true,
  },
  {
    id: "08709317-419b-4671-9ed9-4e23b7fcab90",
    name: "The Snowboard: Liquid",
    description: "Waterproof travel bag for all your essentials.",
    price: 75.0,
    image: "https://cdn.shopify.com/s/files/1/0874/8928/2359/files/ciseco_p_-2_56f64253-fb14-4727-97c0-6873a04b72d0.png?v=1714208742&width=800&crop=center",
    colors: ["blue", "orange", "yellow", "brown"],
    rating: 4.5,
    reviewCount: 8,
    inStock: true,
  },
  {
    id: "19818cef-bdee-4d55-be8c-b4ce4f191cee",
    name: "The Snowboard: Oxygen",
    description: "Warm winter scarf made from premium materials.",
    price: 35.0,
    image: "https://cdn.shopify.com/s/files/1/0874/8928/2359/files/ciseco_p_-7_ac1953d6-ce38-4e22-b6ca-d5fdedebb7cf.png?v=1714208739&width=800&crop=center",
    colors: ["red", "pink", "green", "blue", "black"],
    rating: 5.0,
    reviewCount: 6,
    inStock: true,
  },
  {
    id: "146374b7-b93d-40e2-8e7f-3c9f49c9b918",
    name: "The 3p Fulfilled Snowboard",
    description: "Oversized sweater for maximum comfort.",
    price: 55.0,
    image: "https://cdn.shopify.com/s/files/1/0874/8928/2359/files/ciseco_p_-2_b5892135-5224-41ec-9f01-509ddd005bdc.png?v=1714213197&width=800&crop=center",
    colors: ["green", "red", "blue", "purple"],
    sizes: ["S", "M", "L", "XL"],
    rating: 5.0,
    reviewCount: 4,
    inStock: true,
  },
  {
    id: "12f163bf-deec-45ef-8e85-2cab5e079e20",
    name: "The Multi-managed Snowboard",
    description: "Minimalist backpack for everyday use.",
    price: 95.0,
    image: "https://cdn.shopify.com/s/files/1/0874/8928/2359/files/ciseco_p_-8_c91d096f-3307-4310-9000-8004b9f90d8f.png?v=1714213217&width=800&crop=center",
    colors: ["black", "blue", "pink", "red"],
    rating: 5.0,
    reviewCount: 9,
    inStock: true,
  },
  {
    id: "c58b2260-1ceb-43df-9c09-d2a42a38c9ef",
    name: "The Multi-location Snowboard",
    description: "Vintage-inspired leather travel bag.",
    price: 125.0,
    image: "https://cdn.shopify.com/s/files/1/0874/8928/2359/files/ciseco_p_-1_20c09c88-df08-409e-b02d-2b872630516e.png?v=1714208730&width=800&crop=center",
    colors: ["green", "pink", "brown", "black", "blue"],
    rating: 5.0,
    reviewCount: 3,
    inStock: true,
  },
]

// Mock orders data
export const orders: OrderSummaryDto[] = [
  {
    id: "1",
    customerName: "customer-1",
    orderDate: new Date(2023, 2, 15).toISOString(),
    status: "Completed",
    totalAmount: 125.0,
    itemCount: 3,
  },
  {
    id: "2",
    customerName: "customer-1",
    orderDate: new Date(2023, 3, 20).toISOString(),
    status: "Processing",
    totalAmount: 75.0,
    itemCount: 1,
  },
  {
    id: "3",
    customerName: "customer-1",
    orderDate: new Date(2023, 4, 5).toISOString(),
    status: "Shipped",
    totalAmount: 210.0,
    itemCount: 4,
  },
]

// Mock order details
export const orderDetails: Record<string, OrderDto> = {
  "1": {
    id: "1",
    customerName: "customer-1",
    orderDate: new Date(2023, 2, 15).toISOString(),
    status: "Completed",
    shippingAddress: {
      "street": "3035 Oak St",
      "city": "New York",
      "state": "FL",
      "zipCode": "10001",
      "country": "Germany"
    },
    totalAmount: 125.0,
    items: [
      {
        productId: "1",
        productName: "Example T-Shirt",
        unitPrice: 25.0,
        quantity: 2,
        totalPrice: 50.0,
      },
      {
        productId: "3",
        productName: "The Snowboard: Oxygen",
        unitPrice: 35.0,
        quantity: 1,
        totalPrice: 35.0,
      },
      {
        productId: "4",
        productName: "The 3p Fulfilled Snowboard",
        unitPrice: 40.0,
        quantity: 1,
        totalPrice: 40.0,
      },
    ],
    paymentDate: new Date(2023, 2, 15).toISOString(),
    shippingDate: new Date(2023, 2, 16).toISOString(),
    trackingNumber: "TRK123456789",
    carrier: "FedEx",
    version: 5,
  },
  "2": {
    id: "2",
    customerName: "customer-1",
    orderDate: new Date(2023, 3, 20).toISOString(),
    status: "Processing",
    shippingAddress: {
      "street": "3035 Oak St",
      "city": "New York",
      "state": "FL",
      "zipCode": "10001",
      "country": "Germany"
    },
    totalAmount: 75.0,
    items: [
      {
        productId: "2",
        productName: "The Snowboard: Liquid",
        unitPrice: 75.0,
        quantity: 1,
        totalPrice: 75.0,
      },
    ],
    paymentDate: new Date(2023, 3, 20).toISOString(),
    shippingDate: null,
    trackingNumber: null,
    carrier: null,
    version: 3,
  },
  "3": {
    id: "3",
    customerName: "customer-1",
    orderDate: new Date(2023, 4, 5).toISOString(),
    status: "Shipped",
    shippingAddress: {
      "street": "3035 Oak St",
      "city": "New York",
      "state": "FL",
      "zipCode": "10001",
      "country": "Germany"
    },
    totalAmount: 210.0,
    items: [
      {
        productId: "5",
        productName: "The Multi-managed Snowboard",
        unitPrice: 95.0,
        quantity: 1,
        totalPrice: 95.0,
      },
      {
        productId: "6",
        productName: "The Multi-location Snowboard",
        unitPrice: 115.0,
        quantity: 1,
        totalPrice: 115.0,
      },
    ],
    paymentDate: new Date(2023, 4, 5).toISOString(),
    shippingDate: new Date(2023, 4, 6).toISOString(),
    trackingNumber: "TRK987654321",
    carrier: "UPS",
    version: 4,
  },
}

// Mock order events
export const orderEvents: Record<
  string,
  Array<{
    id: string
    orderId: string
    eventType: string
    timestamp: string
    data: any
  }>
> = {
  "1": [
    {
      id: "event-1-1",
      orderId: "1",
      eventType: "OrderCreated",
      timestamp: new Date(2023, 2, 15, 10, 0).toISOString(),
      data: {
        customerName: "customer-1",
        items: [],
      },
    },
    {
      id: "event-1-2",
      orderId: "1",
      eventType: "OrderItemAdded",
      timestamp: new Date(2023, 2, 15, 10, 5).toISOString(),
      data: {
        productId: "1",
        productName: "Example T-Shirt",
        unitPrice: 25.0,
        quantity: 2,
      },
    },
    {
      id: "event-1-3",
      orderId: "1",
      eventType: "OrderItemAdded",
      timestamp: new Date(2023, 2, 15, 10, 7).toISOString(),
      data: {
        productId: "3",
        productName: "The Snowboard: Oxygen",
        unitPrice: 35.0,
        quantity: 1,
      },
    },
    {
      id: "event-1-4",
      orderId: "1",
      eventType: "OrderItemAdded",
      timestamp: new Date(2023, 2, 15, 10, 10).toISOString(),
      data: {
        productId: "4",
        productName: "The 3p Fulfilled Snowboard",
        unitPrice: 40.0,
        quantity: 1,
      },
    },
    {
      id: "event-1-5",
      orderId: "1",
      eventType: "ShippingAddressSet",
      timestamp: new Date(2023, 2, 15, 10, 15).toISOString(),
      data: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
    },
    {
      id: "event-1-6",
      orderId: "1",
      eventType: "OrderPaid",
      timestamp: new Date(2023, 2, 15, 10, 20).toISOString(),
      data: {
        amount: 125.0,
        paymentMethod: "Credit Card",
        transactionId: "txn_123456",
      },
    },
    {
      id: "event-1-7",
      orderId: "1",
      eventType: "OrderShipped",
      timestamp: new Date(2023, 2, 16, 9, 0).toISOString(),
      data: {
        trackingNumber: "TRK123456789",
        carrier: "FedEx",
      },
    },
  ],
  "2": [
    {
      id: "event-2-1",
      orderId: "2",
      eventType: "OrderCreated",
      timestamp: new Date(2023, 3, 20, 14, 0).toISOString(),
      data: {
        customerName: "customer-1",
        items: [],
      },
    },
    {
      id: "event-2-2",
      orderId: "2",
      eventType: "OrderItemAdded",
      timestamp: new Date(2023, 3, 20, 14, 5).toISOString(),
      data: {
        productId: "2",
        productName: "The Snowboard: Liquid",
        unitPrice: 75.0,
        quantity: 1,
      },
    },
    {
      id: "event-2-3",
      orderId: "2",
      eventType: "ShippingAddressSet",
      timestamp: new Date(2023, 3, 20, 14, 10).toISOString(),
      data: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
    },
    {
      id: "event-2-4",
      orderId: "2",
      eventType: "OrderPaid",
      timestamp: new Date(2023, 3, 20, 14, 15).toISOString(),
      data: {
        amount: 75.0,
        paymentMethod: "PayPal",
        transactionId: "txn_789012",
      },
    },
  ],
  "3": [
    {
      id: "event-3-1",
      orderId: "3",
      eventType: "OrderCreated",
      timestamp: new Date(2023, 4, 5, 11, 0).toISOString(),
      data: {
        customerName: "customer-1",
        items: [],
      },
    },
    {
      id: "event-3-2",
      orderId: "3",
      eventType: "OrderItemAdded",
      timestamp: new Date(2023, 4, 5, 11, 5).toISOString(),
      data: {
        productId: "5",
        productName: "The Multi-managed Snowboard",
        unitPrice: 95.0,
        quantity: 1,
      },
    },
    {
      id: "event-3-3",
      orderId: "3",
      eventType: "OrderItemAdded",
      timestamp: new Date(2023, 4, 5, 11, 7).toISOString(),
      data: {
        productId: "6",
        productName: "The Multi-location Snowboard",
        unitPrice: 115.0,
        quantity: 1,
      },
    },
    {
      id: "event-3-4",
      orderId: "3",
      eventType: "ShippingAddressSet",
      timestamp: new Date(2023, 4, 5, 11, 10).toISOString(),
      data: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
    },
    {
      id: "event-3-5",
      orderId: "3",
      eventType: "OrderPaid",
      timestamp: new Date(2023, 4, 5, 11, 15).toISOString(),
      data: {
        amount: 210.0,
        paymentMethod: "Credit Card",
        transactionId: "txn_345678",
      },
    },
    {
      id: "event-3-6",
      orderId: "3",
      eventType: "OrderShipped",
      timestamp: new Date(2023, 4, 6, 10, 0).toISOString(),
      data: {
        trackingNumber: "TRK987654321",
        carrier: "UPS",
      },
    },
  ],
}

