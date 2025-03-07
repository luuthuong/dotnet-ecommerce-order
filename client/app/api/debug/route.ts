import { type NextRequest, NextResponse } from "next/server"
import { dataStore, logDataStore } from "@/lib/data-store"

// This endpoint is for debugging purposes only
export async function GET(request: NextRequest) {
  try {
    // Log the current state of the data store
    logDataStore()

    // Return a summary of the data store
    return NextResponse.json(
      {
        isSuccess: true,
        message: "Debug information",
        data: {
          products: dataStore.products.length,
          orders: dataStore.orders.length,
          orderDetails: Object.keys(dataStore.orderDetails),
          orderEvents: Object.keys(dataStore.orderEvents),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in debug endpoint:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Error in debug endpoint",
        data: null,
      },
      { status: 500 },
    )
  }
}

