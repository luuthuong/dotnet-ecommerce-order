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
  Product,
} from "./types"

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const response = await fetch(endpoint, {
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

// Product API functions
export async function getProducts(category?: string, sortBy?: string): Promise<ApiResponse<Product[]>> {
  let endpoint = "/api/products"
  const params = new URLSearchParams()

  if (category) params.append("category", category)
  if (sortBy) params.append("sortBy", sortBy)

  if (params.toString()) {
    endpoint += `?${params.toString()}`
  }

  return fetchApi<ApiResponse<Product[]>>(endpoint)
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  return fetchApi<ApiResponse<Product>>(`/api/products/${id}`)
}

export async function createProduct(product: Partial<Product>): Promise<ApiResponse<Product>> {
  return fetchApi<ApiResponse<Product>>("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  })
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
  return fetchApi<ApiResponse<Product>>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  })
}

export async function deleteProduct(id: string): Promise<ApiResponse<Product>> {
  return fetchApi<ApiResponse<Product>>(`/api/products/${id}`, {
    method: "DELETE",
  })
}

// Order API functions
export async function getOrders(
  customerId?: string,
  status?: string,
  sortBy?: string,
): Promise<ApiResponse<OrderSummaryDto[]>> {
  let endpoint = "/api/orders"
  const params = new URLSearchParams()

  if (customerId)
    params.append("customerId", customerId)

  if (status)
    params.append("status", status)

  if (sortBy)
    params.append("sortBy", sortBy)

  if (params.toString()) {
    endpoint += `?${params.toString()}`
  }

  return fetchApi<ApiResponse<OrderSummaryDto[]>>(endpoint)
}

export async function getOrderById(id: string): Promise<ApiResponse<OrderDto>> {
  return fetchApi<ApiResponse<OrderDto>>(`/api/orders/${id}`)
}

export async function createOrder(order: CreateOrderRequest): Promise<GuidApiResponse> {
  return fetchApi<GuidApiResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  })
}

export async function addOrderItem(orderId: string, item: AddOrderItemRequest): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/api/orders/${orderId}/items`, {
    method: "POST",
    body: JSON.stringify(item),
  })
}

export async function setShippingAddress(
  orderId: string,
  address: SetShippingAddressRequest,
): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/api/orders/${orderId}/shipping-address`, {
    method: "POST",
    body: JSON.stringify(address),
  })
}

export async function payOrder(orderId: string, payment: PayOrderRequest): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/api/orders/${orderId}/payments`, {
    method: "POST",
    body: JSON.stringify(payment),
  })
}

export async function shipOrder(orderId: string, shipping: ShipOrderRequest): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/api/orders/${orderId}/ship`, {
    method: "POST",
    body: JSON.stringify(shipping),
  })
}

export async function cancelOrder(orderId: string, cancellation: CancelOrderRequest): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/api/orders/${orderId}/cancel`, {
    method: "POST",
    body: JSON.stringify(cancellation),
  })
}

export async function updateOrder(orderId: string, updateData: any): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/api/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  })
}

// Order Events API functions
export async function getOrderEvents(
  orderId?: string,
  eventType?: string,
  sortBy?: string,
): Promise<ApiResponse<any[]>> {
  let endpoint = "/api/order-events"
  const params = new URLSearchParams()

  if (orderId) params.append("orderId", orderId)
  if (eventType) params.append("eventType", eventType)
  if (sortBy) params.append("sortBy", sortBy)

  if (params.toString()) {
    endpoint += `?${params.toString()}`
  }

  return fetchApi<ApiResponse<any[]>>(endpoint)
}

export async function getOrderEventsByOrderId(orderId: string, sortBy?: string): Promise<ApiResponse<any[]>> {
  let endpoint = `/api/order-events/${orderId}`

  if (sortBy) {
    endpoint += `?sortBy=${sortBy}`
  }

  return fetchApi<ApiResponse<any[]>>(endpoint)
}

export async function addOrderEvent(orderId: string, eventType: string, data: any): Promise<ApiResponse<any>> {
  return fetchApi<ApiResponse<any>>(`/api/order-events/${orderId}`, {
    method: "POST",
    body: JSON.stringify({
      eventType,
      data,
    }),
  })
}

