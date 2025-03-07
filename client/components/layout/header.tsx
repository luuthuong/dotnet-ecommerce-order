"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Package, ClipboardList } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"

export default function Header() {
  const pathname = usePathname()

  const { itemCount } = useCart()

  const isActive = (path: string) => {
    return pathname === path ? "underline font-medium" : "hover:underline"
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4  py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          E-Commerce
        </Link>

        <nav className="flex items-center space-x-6">
          <Link href="/" className={`flex items-center gap-1 ${isActive("/")}`}>
            <ShoppingCart size={18} />
            <span>Products</span>
          </Link>
          <Link href="/orders" className={`flex items-center gap-1 ${isActive("/orders")}`}>
            <Package size={18} />
            <span>Orders</span>
          </Link>
          <Link href="/order-history" className={`flex items-center gap-1 ${isActive("/order-history")}`}>
            <ClipboardList size={18} />
            <span>History</span>
          </Link>

          <Link href="/cart">
            <Button variant="default" className="relative">
              <ShoppingCart size={18} />
              <span className="ml-2">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-neutral-900 text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

