import { type NextRequest, NextResponse } from "next/server"
import { orders as initialOrders, orderDetails as initialOrderDetails } from "@/lib/mock-data"
import type { OrderSummaryDto, OrderDto, ShipOrderRequest, PromiseParams } from "@/lib/types"

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

    const body: ShipOrderRequest = await request.json()

    // Check if order can be shipped
    if (!orderDetails[id].paymentDate) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Order must be paid before shipping",
          data: null,
        },
        { status: 400 },
      )
    }

    // Update order shipping details
    const shippingDate = new Date().toISOString()
    orderDetails[id].shippingDate = shippingDate
    orderDetails[id].trackingNumber = body.trackingNumber
    orderDetails[id].carrier = body.carrier
    orderDetails[id].status = "Shipped"
    orderDetails[id].version += 1

    // Update order summary
    orders[orderIndex].status = "Shipped"

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Order shipped successfully",
        data: {
          orderId: id,
          trackingNumber: body.trackingNumber,
          carrier: body.carrier,
          shippingDate,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error shipping order:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to ship order",
        data: null,
      },
      { status: 500 },
    )
  }
}

