import { type NextRequest, NextResponse } from "next/server"
import { orders as initialOrders, orderDetails as initialOrderDetails } from "@/lib/mock-data"
import type { OrderSummaryDto, OrderDto, AddOrderItemRequest, PromiseParams } from "@/lib/types"

// In-memory store for orders
const orders: OrderSummaryDto[] = [...initialOrders]
const orderDetails: Record<string, OrderDto> = { ...initialOrderDetails }

export async function POST(request: NextRequest, { params }: PromiseParams<{ id: string }>) {
  try {
    const { id } = await params;
    const orderIndex = orders.findIndex((o) => o.id === id)

    if (orderIndex === -1 || !orderDetails[id]) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Order not found",
          data: null,
        },
        { status: 404 },
      )
    }

    const body: AddOrderItemRequest = await request.json()

    // Validate required fields
    if (!body.productId || !body.quantity || body.quantity <= 0) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Product ID and quantity > 0 are required",
          data: null,
        },
        { status: 400 },
      )
    }

    // Calculate item total price
    const totalPrice = body.unitPrice * body.quantity

    // Create new order item
    const newItem = {
      productId: body.productId,
      productName: body.productName || "Unknown Product",
      unitPrice: body.unitPrice,
      quantity: body.quantity,
      totalPrice,
    }

    // Add item to order
    const orderDetail = orderDetails[id]
    const items = orderDetail.items || []
    orderDetail.items = [...items, newItem]

    // Update order total amount and item count
    orderDetail.totalAmount += totalPrice
    orderDetail.version += 1

    // Update order summary
    orders[orderIndex].totalAmount += totalPrice
    orders[orderIndex].itemCount += 1

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Item added to order successfully",
        data: newItem,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error adding item to order:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to add item to order",
        data: null,
      },
      { status: 500 },
    )
  }
}

