import { type NextRequest, NextResponse } from "next/server"
import { dataStore, findOrderById } from "@/lib/data-store"
import { PromiseParams } from "@/lib/types"

// Use the shared data store
const orders = dataStore.orders
const orderDetails = dataStore.orderDetails

export async function GET(request: NextRequest, { params }: PromiseParams<{ id: string }>) {
  try {
    const { id } = await params;
    const orderDetail = findOrderById(id)

    if (!orderDetail) {
      console.log(`Order not found: ${id}`)
      console.log("Available order IDs:", Object.keys(orderDetails))

      return NextResponse.json(
        {
          isSuccess: false,
          message: "Order not found",
          data: null,
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        isSuccess: true,
        message: null,
        data: orderDetail,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to fetch order",
        data: null,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: PromiseParams<{ id: string }>) {
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

    const body = await request.json()

    // Update order details
    orderDetails[id] = {
      ...orderDetails[id],
      ...body,
      id: id, // Ensure ID doesn't change
      version: orderDetails[id].version + 1, // Increment version
    }

    // Update order summary if needed
    if (body.status) {
      orders[orderIndex] = {
        ...orders[orderIndex],
        status: body.status,
      }
    }

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Order updated successfully",
        data: orderDetails[id],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to update order",
        data: null,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: PromiseParams<{ id: string }>) {
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

    // In a real app, you might not want to delete orders but mark them as cancelled
    // For this demo, we'll actually delete them
    const deletedOrder = orderDetails[id]
    dataStore.orders = orders.filter((o) => o.id !== id)
    delete orderDetails[id]

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Order deleted successfully",
        data: deletedOrder,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to delete order",
        data: null,
      },
      { status: 500 },
    )
  }
}

