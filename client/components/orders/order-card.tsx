import Link from "next/link"
import { Calendar, Package } from "lucide-react"
import type { OrderSummaryDto } from "@/lib/types"
import Badge from "@/components/ui/badge"

interface OrderCardProps {
  order: OrderSummaryDto
}

export default function OrderCard({ order }: OrderCardProps) {
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
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">Order #{order.id.substring(0, 8)}</h3>
        <Badge variant={getStatusVariant(order.status)}>{order.status || "Unknown"}</Badge>
      </div>

      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Calendar className="w-4 h-4 mr-1" />
        <span>{formatDate(order.orderDate)}</span>
      </div>

      <div className="flex items-center text-sm text-muted-foreground mb-3">
        <Package className="w-4 h-4 mr-1" />
        <span>
          {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
        <Link href={`/orders/${order.id}`} className="text-sm font-medium text-black underline">
          View Details
        </Link>
      </div>
    </div>
  )
}

