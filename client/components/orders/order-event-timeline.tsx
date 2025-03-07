'use client'

import { Clock, Package, CreditCard, Truck, AlertCircle, ShoppingBag } from "lucide-react"

interface DomainEvent {
  id: string
  orderId: string
  eventType: string
  timestamp: string
  data: any
}

interface OrderEventTimelineProps {
  events: DomainEvent[]
}

export default function OrderEventTimeline({ events }: OrderEventTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "OrderCreatedEvent":
        return <ShoppingBag className="w-5 h-5" />
      case "OrderItemAddedEvent":
        return <Package className="w-5 h-5" />
      case "OrderPaidEvent":
        return <CreditCard className="w-5 h-5" />
      case "OrderShippedEvent":
        return <Truck className="w-5 h-5" />
      case "OrderCancelledEvent":
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getEventTitle = (event: DomainEvent) => {
    switch (event.eventType) {
      case "OrderCreatedEvent":
        return "Order Created"
      case "OrderItemAddedEvent":
        return `Added ${event.data.productName} (${event.data.quantity}x)`
      case "ShippingAddressSetEvent":
        return "Shipping Address Set"
      case "OrderPaidEvent":
        return `Payment of $${event.data.amount?.amount.toFixed(2)} via ${event.data.paymentMethod}`
      case "OrderShippedEvent":
        return `Shipped via ${event.data.carrier}`
      case "OrderCancelledEvent":
        return `Order Cancelled: ${event.data.reason || "No reason provided"}`
      default:
        return event.eventType
    }
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-muted" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    {getEventIcon(event.eventType)}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{getEventTitle(event)}</p>
                    {event.eventType === "ShippingAddressSet" && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {`${event.data.street}, ${event.data.city}, ${event.data.state} ${event.data.zipCode}, ${event.data.country}`}
                      </p>
                    )}
                    {event.eventType === "OrderShipped" && (
                      <p className="mt-1 text-sm text-muted-foreground">Tracking: {event.data.trackingNumber}</p>
                    )}
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-muted-foreground">
                    {formatDate(event.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

