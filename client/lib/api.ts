import type {
  ApiResponse,
  GuidApiResponse,
  OrderDto,
  OrderSummaryDto,
  CreateOrderRequest,
  AddOrderItemRequest,
  SetShippingAddressRequest,
  PayOrderRequest,
  ShipOrderRequest,
  CancelOrderRequest,
  OrderEventHistoryDTO,
} from "./types"

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://localhost:5251/api/v1"

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "An error occurred")
  }

  return data
}

// Order API functions
export async function getOrders(customerName?: string): Promise<ApiResponse<OrderSummaryDto[]>> {
  const endpoint = customerName ? `/Orders?customerName=${customerName}` : "/Orders"
  return fetchApi<ApiResponse<OrderSummaryDto[]>>(endpoint)
}

export async function getOrdersByStatus(status: string): Promise<ApiResponse<OrderSummaryDto[]>> {
  return fetchApi<ApiResponse<OrderSummaryDto[]>>(`/Orders/status/${status}`)
}

export async function getOrderById(id: string): Promise<ApiResponse<OrderDto>> {
  return fetchApi<ApiResponse<OrderDto>>(`/Orders/${id}`)
}

export async function getOrderEventHistory(id: string): Promise<ApiResponse<OrderEventHistoryDTO>> {
  return fetchApi<ApiResponse<OrderEventHistoryDTO>>(`/orders/${id}/events`)
}

export async function createOrder(order: CreateOrderRequest): Promise<GuidApiResponse> {
  return fetchApi<GuidApiResponse>("/Orders", {
    method: "POST",
    body: JSON.stringify(order),
  })
}

export async function addOrderItem(orderId: string, item: AddOrderItemRequest): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/Orders/${orderId}/items`, {
    method: "PUT",
    body: JSON.stringify(item),
  })
}

export async function setShippingAddress(
  orderId: string,
  address: SetShippingAddressRequest,
): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/Orders/${orderId}/shipping-address`, {
    method: "PUT",
    body: JSON.stringify(address),
  })
}

export async function payOrder(orderId: string, payment: PayOrderRequest): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/Orders/${orderId}/payments`, {
    method: "PUT",
    body: JSON.stringify(payment),
  })
}

export async function shipOrder(orderId: string, shipping: ShipOrderRequest): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/Orders/${orderId}/ship`, {
    method: "PUT",
    body: JSON.stringify(shipping),
  })
}

export async function cancelOrder(orderId: string, cancellation: CancelOrderRequest): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/Orders/${orderId}/cancel`, {
    method: "PUT",
    body: JSON.stringify(cancellation),
  })
}

