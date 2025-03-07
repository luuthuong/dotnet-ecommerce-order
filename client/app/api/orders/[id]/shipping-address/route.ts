import { type NextRequest, NextResponse } from "next/server"
import { orderDetails as initialOrderDetails } from "@/lib/mock-data"
import type { OrderDto, SetShippingAddressRequest } from "@/lib/types"

// In-memory store for orders
const orderDetails: Record<string, OrderDto> = { ...initialOrderDetails }

export async function POST(request: NextRequest, { params }: PromiseParams<{ id: string }>) {
  try {
    const { id } = await params;
    if (!orderDetails[id]) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Order not found",
          data: null,
        },
        { status: 404 },
      )
    }

    const body: SetShippingAddressRequest = await request.json()

    // Validate required fields
    if (!body.street || !body.city || !body.state || !body.zipCode || !body.country) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "All address fields are required",
          data: null,
        },
        { status: 400 },
      )
    }

    // Format address string
    const addressString = `${body.street}, ${body.city}, ${body.state} ${body.zipCode}, ${body.country}`

    // Update order shipping address
    orderDetails[id].shippingAddress = addressString
    orderDetails[id].version += 1

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Shipping address set successfully",
        data: {
          orderId: id,
          shippingAddress: addressString,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error setting shipping address:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to set shipping address",
        data: null,
      },
      { status: 500 },
    )
  }
}

