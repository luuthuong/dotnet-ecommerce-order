import { type NextRequest, NextResponse } from "next/server"
import { orderEvents as initialOrderEvents } from "@/lib/mock-data"

// In-memory store for order events
const orderEvents: Record<
  string,
  Array<{
    id: string
    orderId: string
    eventType: string
    timestamp: string
    data: any
  }>
> = { ...initialOrderEvents }

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const eventType = searchParams.get("eventType")
    const sortBy = searchParams.get("sortBy") || "newest"

    // Get all events
    let allEvents = Object.values(orderEvents).flat()

    // Filter by orderId if provided
    if (orderId) {
      allEvents = allEvents.filter((event) => event.orderId === orderId)
    }

    // Filter by eventType if provided
    if (eventType) {
      allEvents = allEvents.filter((event) => event.eventType === eventType)
    }

    // Sort events
    allEvents.sort((a, b) => {
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
        data: allEvents,
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

