"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/debug")
      const data = await response.json()

      if (!data.isSuccess) {
        throw new Error(data.message || "Failed to fetch debug information")
      }

      setDebugInfo(data.data)
    } catch (err: any) {
      console.error("Error fetching debug info:", err)
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>API Debug Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={fetchDebugInfo} disabled={loading} className="mb-4">
          {loading ? "Loading..." : "Fetch Debug Info"}
        </Button>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {debugInfo && (
          <div className="space-y-2">
            <div>
              <strong>Products:</strong> {debugInfo.products}
            </div>
            <div>
              <strong>Orders:</strong> {debugInfo.orders}
            </div>
            <div>
              <strong>Order Details:</strong> {debugInfo.orderDetails.length}
              <ul className="text-xs mt-1 ml-4">
                {debugInfo.orderDetails.map((id: string) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Order Events:</strong> {debugInfo.orderEvents.length}
              <ul className="text-xs mt-1 ml-4">
                {debugInfo.orderEvents.map((id: string) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

