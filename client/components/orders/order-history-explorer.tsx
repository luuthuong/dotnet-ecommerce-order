"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Filter, X, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import type { OrderSummaryDto } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Badge from "@/components/ui/badge"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import OrderEventTimeline from "@/components/orders/order-event-timeline"
import { getOrderEventHistory, getOrders } from "@/lib/api"

export default function OrderHistoryExplorer() {
  const [orders, setOrders] = useState<OrderSummaryDto[]>([])
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})
  const [orderEvents, setOrderEvents] = useState<Record<string, any[] | undefined>>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventLoading, setEventLoading] = useState<Record<string, boolean>>({})
  const [eventErrors, setEventErrors] = useState<Record<string, string>>({})

  const [filters, setFilters] = useState({
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    status: "all",
    eventType: "all",
    searchTerm: "",
  })

  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [filters.status])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters.status && filters.status !== "all") {
        queryParams.append("status", filters.status)
      }

      const response = await getOrders(undefined)

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch orders")
      }

      let filteredOrders = response.data || []

      if (filters.dateFrom || filters.dateTo || filters.searchTerm) {
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.orderDate)
          if (filters.dateFrom && orderDate < filters.dateFrom) 
            return false
          
          if (filters.dateTo) {
            const dateToEnd = new Date(filters.dateTo)
            dateToEnd.setHours(23, 59, 59, 999)
            if (orderDate > dateToEnd) return false
          }

          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase()
            return order.id.toLowerCase().includes(searchLower) || order.customerId.toLowerCase().includes(searchLower)
          }

          return true
        })
      }

      setOrders(filteredOrders)
    } catch (err: any) {
      console.error("Error fetching orders:", err)
      setError(err.message || "An error occurred while fetching orders")
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderEvents = async (orderId: string) => {
    // if (!!orderEvents[orderId]) return

    try {
      setEventLoading((prev) => ({ ...prev, [orderId]: true }))
      setEventErrors((prev) => ({ ...prev, [orderId]: "" }))

      const response = await getOrderEventHistory(orderId)

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch order events")
      }

      let events = response.data.events || []

      if (filters.eventType && filters.eventType !== "all") {
        events = events.filter((event) => event.eventType === filters.eventType)
      }

      setOrderEvents((prev) => ({ ...prev, [orderId]: events }))
    } catch (err: any) {
      console.error(`Error fetching events for order ${orderId}:`, err)
      setEventErrors((prev) => ({
        ...prev,
        [orderId]: err.message || "Failed to load event history",
      }))
    } finally {
      setEventLoading((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const toggleOrderExpand = (orderId: string) => {
    const newExpandedState = !expandedOrders[orderId]
    setExpandedOrders((prev) => ({ ...prev, [orderId]: newExpandedState }))

    if (newExpandedState && !orderEvents[orderId]) {
      fetchOrderEvents(orderId)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))

    if (key === "eventType") {
      Object.keys(expandedOrders).forEach((orderId) => {
        if (expandedOrders[orderId]) {
          setOrderEvents((prev) => ({ ...prev, [orderId]: undefined }))
          console.log(orderEvents)
          fetchOrderEvents(orderId)
        }
      })
    }
  }

  const clearFilters = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      status: "all",
      eventType: "all",
      searchTerm: "",
    })
  }

  const applyFilters = () => {
    fetchOrders()
    Object.keys(expandedOrders).forEach((orderId) => {
      if (expandedOrders[orderId]) {
        setOrderEvents((prev) => ({ ...prev, [orderId]: undefined }))
        fetchOrderEvents(orderId)
      }
    })
  }

  const getStatusVariant = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success"
      case "processing":
        return "info"
      case "shipped":
        return "primary"
      case "cancelled":
        return "danger"
      default:
        return "default"
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1>Order Event History</h1>

        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button> */}

          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filter Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Event Type</label>
                <Select value={filters.eventType} onValueChange={(value) => handleFilterChange("eventType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Event Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Event Types</SelectItem>
                    <SelectItem value="OrderCreated">Order Created</SelectItem>
                    <SelectItem value="OrderItemAdded">Item Added</SelectItem>
                    <SelectItem value="ShippingAddressSet">Address Set</SelectItem>
                    <SelectItem value="OrderPaid">Payment</SelectItem>
                    <SelectItem value="OrderShipped">Shipping</SelectItem>
                    <SelectItem value="OrderCancelled">Cancellation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={filters.dateFrom ? format(filters.dateFrom, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null
                    handleFilterChange("dateFrom", date)
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <Input
                  type="date"
                  value={filters.dateTo ? format(filters.dateTo, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null
                    handleFilterChange("dateTo", date)
                  }}
                />
              </div>

              <div className="space-y-2 lg:col-span-4">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Order ID or Customer ID"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </CardFooter>
        </Card>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">{error}</div>}

      {loading ? (
        <div className="py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No orders found matching your criteria.</p>
            {(filters.dateFrom ||
              filters.dateTo ||
              filters.status !== "all" ||
              filters.eventType !== "all" ||
              filters.searchTerm) && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <div
                className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleOrderExpand(order.id)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    {expandedOrders[order.id] ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                    <h3 className="font-medium">Order #{order.id.substring(0, 8)}</h3>
                    <Badge variant={getStatusVariant(order.status)}>{order.status || "Unknown"}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>
                      <span suppressHydrationWarning={true} className="font-medium">Date:</span> {formatDate(order.orderDate)}
                    </div>
                    <div>
                      <span className="font-medium">Items:</span> {order.itemCount}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {expandedOrders[order.id] && (
                <div className="border-t bg-muted/30 p-6">
                  <h4 className="font-medium mb-4">Event History</h4>

                  {eventLoading[order.id] ? (
                    <LoadingSpinner />
                  ) : eventErrors[order.id] ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
                      {eventErrors[order.id]}
                    </div>
                  ) : !orderEvents[order.id] || orderEvents[order.id]?.length === 0 ? (
                    <p className="text-muted-foreground">No event history found for this order.</p>
                  ) : (
                    <OrderEventTimeline events={orderEvents[order.id] ?? []} />
                  )}

                  {!eventLoading[order.id] && !eventErrors[order.id] && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setOrderEvents((prev) => ({ ...prev, [order.id]: undefined }))
                          fetchOrderEvents(order.id)
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Events
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

