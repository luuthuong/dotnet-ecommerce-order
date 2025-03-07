
export type PromiseParams<T> = {
  params: Promise<T>
}

// API Response Types
export interface ApiResponse<T> {
  isSuccess: boolean
  message: string | null
  data: T
}

export interface GuidApiResponse {
  isSuccess: boolean
  message: string | null
  data: string // UUID
}

// Order Types
export interface OrderSummaryDto {
  id: string
  customerId: string
  orderDate: string
  status: string | null
  totalAmount: number
  itemCount: number
}

export interface OrderItemDto {
  productId: string
  productName: string | null
  unitPrice: number
  quantity: number
  totalPrice: number
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface OrderDto {
  id: string
  customerId: string
  orderDate: string
  status: string | null
  shippingAddress: ShippingAddress
  totalAmount: number
  items: OrderItemDto[] | null
  paymentDate: string | null
  shippingDate: string | null
  trackingNumber: string | null
  carrier: string | null
  version: number
}

// Request Types
export interface AddressRequest {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface MoneyRequest {
  amount: number
  currency: string | null
}

export interface OrderItemRequest {
  productId: string
  productName: string
  unitPrice: MoneyRequest
  quantity: number
}

export interface CreateOrderRequest {
  customerId: string
  address?: AddressRequest
  orderItems?: OrderItemRequest[]
}

export interface AddOrderItemRequest {
  productId: string
  productName: string | null
  unitPrice: number
  quantity: number
}

export interface SetShippingAddressRequest {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PayOrderRequest {
  amount: number
  paymentMethod: string | null
  transactionId: string | null
}

export interface ShipOrderRequest {
  trackingNumber: string | null
  carrier: string | null
}

export interface CancelOrderRequest {
  reason: string | null
}

// Product Types (for demo purposes)
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  colors: string[]
  sizes?: string[]
  rating: number
  reviewCount: number
  inStock: boolean
}

export type OrderEvent = {
  id: string
  orderId: string
  eventType: string
  timestamp: string
  version: number
  data: any
}

export type OrderEventHistoryDTO = {
  orderId: string;
  events: OrderEvent[]
}