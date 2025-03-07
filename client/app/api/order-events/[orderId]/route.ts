import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { v4 as uuidv4 } from "uuid"
import { PromiseParams } from "@/lib/types"

// Use the shared data store
const orderEvents = dataStore.orderEvents

export async function GET(request: NextRequest, { params }: PromiseParams<{ orderId: string }>) {
  try {
    const { orderId } = await params;
    const events = orderEvents[orderId] || []

    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get("sortBy") || "newest"

    const sortedEvents = [...events].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      } else {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })

    return NextResponse.json(
      {
        isSuccess: true,
        message: null,
        data: sortedEvents,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching order events:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to fetch order events",
        data: null,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: PromiseParams<{ orderId: string }>) {
  try {
    const { orderId } = await params;
    const body = await request.json()

    // Validate required fields
    if (!body.eventType || !body.data) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Event type and data are required",
          data: null,
        },
        { status: 400 },
      )
    }

    const newEvent = {
      id: uuidv4(),
      orderId: orderId,
      eventType: body.eventType,
      timestamp: new Date().toISOString(),
      data: body.data,
    }

    // Initialize events array for this order if it doesn't exist
    if (!orderEvents[orderId]) {
      orderEvents[orderId] = []
    }

    // Add event to the array
    orderEvents[orderId].push(newEvent)

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Event added successfully",
        data: newEvent,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding order event:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to add order event",
        data: null,
      },
      { status: 500 },
    )
  }
}

