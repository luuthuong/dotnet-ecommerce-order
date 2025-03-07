// Centralized data store for our mock API
import type { Product, OrderSummaryDto, OrderDto } from "./types"
import {
  products as initialProducts,
  orders as initialOrders,
  orderDetails as initialOrderDetails,
  orderEvents as initialOrderEvents,
} from "./mock-data"

// Create mutable copies of our initial data
export const dataStore = {
  products: [...initialProducts] as Product[],
  orders: [...initialOrders] as OrderSummaryDto[],
  orderDetails: { ...initialOrderDetails } as Record<string, OrderDto>,
  orderEvents: { ...initialOrderEvents } as Record<
    string,
    Array<{
      id: string
      orderId: string
      eventType: string
      timestamp: string
      data: any
    }>
  >,
}

// Helper function to find an order by ID
export function findOrderById(id: string): OrderDto | undefined {
  return dataStore.orderDetails[id]
}

// Helper function to find an order summary by ID
export function findOrderSummaryById(id: string): OrderSummaryDto | undefined {
  return dataStore.orders.find((order) => order.id === id)
}

// Helper function to find a product by ID
export function findProductById(id: string): Product | undefined {
  return dataStore.products.find((product) => product.id === id)
}

// Debug function to log the current state of the data store
export function logDataStore() {
  console.log("Products:", dataStore.products.length)
  console.log("Orders:", dataStore.orders.length)
  console.log("Order Details:", Object.keys(dataStore.orderDetails).length)
  console.log("Order Events:", Object.keys(dataStore.orderEvents).length)
}

