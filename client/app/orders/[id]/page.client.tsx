"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, Package, Truck, CreditCard } from "lucide-react"
import Badge from "@/components/ui/badge"
import OrderEventTimeline from "@/components/orders/order-event-timeline"
import type { OrderDto } from "@/lib/types"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import UpdateOrderModal from "@/components/orders/update-order-modal"
import CancelOrderModal from "@/components/orders/cancel-order-modal"
import { getOrderById, getOrderEventHistory } from "@/lib/api"
import PaymentModal from "@/components/orders/payment-modal"
import { orderStatus } from "@/lib/order-status"

interface OrderDetailPageProps {
  id: string
}

export default function OrderDetailPage({ id }: OrderDetailPageProps) {
  const [order, setOrder] = useState<OrderDto | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    async function fetchOrderData() {
      try {
        setLoading(true)

        const orderResponse = await getOrderById(id)

        if (!orderResponse.isSuccess || !orderResponse.data) {
          throw new Error(orderResponse.message || "Order not found")
        }

        setOrder(orderResponse.data)

        try {
          const eventsResponse = await getOrderEventHistory(id)
          setEvents(eventsResponse.data.events || [])
        } catch (eventError) {
          console.error("Error fetching order events:", eventError)
          setEvents([])
        }

        setError(null)
      } catch (err: any) {
        console.error("Error fetching order data:", err)
        setError(err.message || "Failed to load order details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [id])

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleOrderUpdated = async () => {
    setLoading(true)
    try {
      const orderResponse = await getOrderById(id)

      if (orderResponse.isSuccess && orderResponse.data) {
        setOrder(orderResponse.data)
      }

      try {
        const eventsResponse = await getOrderEventHistory(id)
        setEvents(eventsResponse.data.events || [])
      } catch (eventError) {
        console.error("Error fetching order events:", eventError)
      }

      setShowCancelModal(false)
      setShowUpdateModal(false)
      setShowPaymentModal(false)

    } catch (err) {
      console.error("Error refreshing order data:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">{error || "Order not found"}</p>
        <Link href="/orders">
          <Button className="mt-4">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex justify-between items-center mt-4">
          <h1>Order #{id.substring(0, 8)}</h1>
          <Badge variant={getStatusVariant(order.status)}>{order.status || "Unknown"}</Badge>
        </div>

        <div className="text-sm text-muted-foreground mt-1">Placed on {formatDate(order.orderDate)}</div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Order Items</h2>
            <div className="divide-y">
              {order.items?.map((item) => (
                <div key={item.productId} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <div className="text-sm text-muted-foreground">
                      ${item.unitPrice.toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between mt-2 font-bold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Order Timeline</h2>
            {events.length > 0 ? (
              <OrderEventTimeline events={events} />
            ) : (
              <p className="text-muted-foreground">No events found for this order.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Order Information</h2>
            <div className="space-y-4">
              <div>
              <h3 className="text-sm font-medium text-muted-foreground">Customer Name</h3>
              <p className="mt-1">{order.customerName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Shipping Address</h3>
                <p className="mt-1">{`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}` || "Not provided"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment</h3>
                <div className="mt-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>{order.paymentDate ? "Paid on " + formatDate(order.paymentDate) : "Not paid"}</span>
                </div>
              </div>
              {order.shippingDate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Shipping</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>Shipped on {formatDate(order.shippingDate)}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-medium">Carrier:</span> {order.carrier}
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-medium">Tracking:</span> {order.trackingNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
          <OrderAction
            order={order}
            onClickPayment={() => setShowPaymentModal(true)}
            onClickUpdateShippingAddress={() => setShowUpdateModal(true)}
            onClickCancelOrder={() => setShowCancelModal(true)} />
        </div>
      </div>

      <CancelOrderModal
        orderId={id}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSuccess={handleOrderUpdated}
      />

      <UpdateOrderModal
        orderId={id}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSuccess={handleOrderUpdated}
      />

      <PaymentModal
        orderId={id}
        orderTotal={order.totalAmount}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handleOrderUpdated}
      />
    </div>
  )
}


export type OrderActionProps = {
  order: OrderDto;
  onClickPayment(): void;
  onClickUpdateShippingAddress(): void;
  onClickCancelOrder(): void;
}

export function OrderAction(
  {
    order,
    onClickCancelOrder,
    onClickPayment,
    onClickUpdateShippingAddress
  }: OrderActionProps) {

  const canShowAction = [
    orderStatus.processing,
    orderStatus.paid
  ].includes(order.status ?? '')

  return canShowAction && <div className="bg-card border rounded-lg p-6">
    <h2 className="text-lg font-medium mb-4">Actions</h2>
    <p className="text-sm text-muted-foreground mb-4">
      You can update or cancel this order.
    </p>
    <div className="space-y-2">
      {
        order.status !== orderStatus.paid &&
        <Button className="w-full" variant="outline" onClick={onClickPayment}>
          Pay Now
        </Button>
      }
      {
        order.status !== orderStatus.paid &&
        <Button className="w-full" variant="outline" onClick={onClickUpdateShippingAddress}>
          Update Shipping Address
        </Button>
      }
      {
        order.status !== orderStatus.shipped &&
        <Button className="w-full" variant="danger" onClick={onClickCancelOrder}>
          Cancel Order
        </Button>
      }
    </div>
  </div>
}