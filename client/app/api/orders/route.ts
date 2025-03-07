import { type NextRequest, NextResponse } from "next/server"
import type { OrderSummaryDto, OrderDto, CreateOrderRequest } from "@/lib/types"
import { dataStore } from "@/lib/data-store"
import { v4 as uuidv4 } from "uuid"

// Use the shared data store
const orders = dataStore.orders
const orderDetails = dataStore.orderDetails

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")
    const status = searchParams.get("status")
    const sortBy = searchParams.get("sortBy")

    // Filter orders
    let filteredOrders = [...orders]

    if (customerId) {
      filteredOrders = filteredOrders.filter((order) => order.customerId === customerId)
    }

    if (status) {
      filteredOrders = filteredOrders.filter((order) => order.status?.toLowerCase() === status.toLowerCase())
    }

    // Sort orders
    if (sortBy) {
      filteredOrders.sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
          case "price-high":
            return b.totalAmount - a.totalAmount
          case "price-low":
            return a.totalAmount - b.totalAmount
          case "newest":
          default:
            return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        }
      })
    }

    return NextResponse.json(
      {
        isSuccess: true,
        message: null,
        data: filteredOrders,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to fetch orders",
        data: null,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()
    // Validate required fields
    if (!body.customerId) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Customer ID is required",
          data: null,
        },
        { status: 400 },
      )
    }

    // Generate a new order ID
    const orderId = uuidv4()
    const orderDate = new Date().toISOString()

    // Calculate total amount and item count
    let totalAmount = 0
    const orderItems = body.orderItems || []

    orderItems.forEach((item) => {
      totalAmount += item.unitPrice.amount * item.quantity
    })

    // Create order summary
    const orderSummary: OrderSummaryDto = {
      id: orderId,
      customerId: body.customerId,
      orderDate,
      status: "Processing",
      totalAmount,
      itemCount: orderItems.length,
    }

    // Create order details
    const orderDetail: OrderDto = {
      id: orderId,
      customerId: body.customerId,
      orderDate,
      status: "Processing",
      shippingAddress: {
        city: body.address?.city!,
        street: body.address?.street!,
        state: body.address?.state!,
        zipCode: body.address?.zipCode!,
        country: body.address?.city!
      },
      totalAmount,
      items: orderItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice.amount,
        quantity: item.quantity,
        totalPrice: item.unitPrice.amount * item.quantity,
      })),
      paymentDate: null,
      shippingDate: null,
      trackingNumber: null,
      carrier: null,
      version: 1,
    }

    // Add to in-memory store
    orders.push(orderSummary)
    orderDetails[orderId] = orderDetail

    // Add to order events (would be in a separate endpoint in a real app)
    // This is simplified for the demo

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Order created successfully",
        data: orderId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to create order",
        data: null,
      },
      { status: 500 },
    )
  }
}

