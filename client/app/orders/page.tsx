"use client"

import { useState, useEffect } from "react"
import OrderGrid from "@/components/orders/order-grid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { OrderSummaryDto } from "@/lib/types"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { getOrders } from "@/lib/api"

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [orders, setOrders] = useState<OrderSummaryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        const status = statusFilter !== "all" ? statusFilter : undefined
        const response = await getOrders(undefined)
        setOrders(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load orders. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [statusFilter, sortBy])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Your Orders</h1>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No orders found.</p>
        </div>
      ) : (
        <OrderGrid orders={orders} />
      )}
    </div>
  )
}

