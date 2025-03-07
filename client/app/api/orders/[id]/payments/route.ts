import { type NextRequest, NextResponse } from "next/server"
import { orders as initialOrders, orderDetails as initialOrderDetails } from "@/lib/mock-data"
import type { OrderSummaryDto, OrderDto, PayOrderRequest, PromiseParams } from "@/lib/types"

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

    const body: PayOrderRequest = await request.json()

    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Payment amount must be greater than 0",
          data: null,
        },
        { status: 400 },
      )
    }

    // Update order payment details
    const paymentDate = new Date().toISOString()
    orderDetails[id].paymentDate = paymentDate
    orderDetails[id].version += 1

    // Update order status if it was 'Created'
    if (orderDetails[id].status === "Created") {
      orderDetails[id].status = "Processing"
      orders[orderIndex].status = "Processing"
    }

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Payment processed successfully",
        data: {
          orderId: id,
          amount: body.amount,
          paymentMethod: body.paymentMethod,
          transactionId: body.transactionId,
          paymentDate,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to process payment",
        data: null,
      },
      { status: 500 },
    )
  }
}

