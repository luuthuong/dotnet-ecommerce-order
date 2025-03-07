import { type NextRequest, NextResponse } from "next/server"
import { orders as initialOrders, orderDetails as initialOrderDetails } from "@/lib/mock-data"
import type { OrderSummaryDto, OrderDto, CancelOrderRequest, PromiseParams } from "@/lib/types"

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

    const body: CancelOrderRequest = await request.json()

    // Check if order can be cancelled
    if (orderDetails[id].status === "Completed") {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Completed orders cannot be cancelled",
          data: null,
        },
        { status: 400 },
      )
    }

    // Update order status
    orderDetails[id].status = "Cancelled"
    orderDetails[id].version += 1

    // Update order summary
    orders[orderIndex].status = "Cancelled"

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Order cancelled successfully",
        data: {
          orderId: id,
          reason: body.reason,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error cancelling order:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to cancel order",
        data: null,
      },
      { status: 500 },
    )
  }
}

