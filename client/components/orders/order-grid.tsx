import type { OrderSummaryDto } from "@/lib/types"
import OrderCard from "./order-card"

interface OrderGridProps {
  orders: OrderSummaryDto[]
}

export default function OrderGrid({ orders }: OrderGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

