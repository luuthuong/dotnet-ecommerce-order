"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Package, ClipboardList, User2Icon, LogOut, Menu, Bell } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from "./sidebar"

export default function Header() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const { user, signOut, isAuthenticated } = useAuth()

  const isActive = (path: string) => {
    return pathname === path ? "underline font-medium" : "text-foreground hover:underline"
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent aria-describedby="sf" side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>

          <Link href="/" className="ml-4 md:ml-0 font-bold text-xl">
            E-Commerce
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
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
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="outline" className="relative">
              <ShoppingCart size={18} />
              <span className="ml-2">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative grid h-8 w-8 rounded-full">
                  <User2Icon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border shadow-md">
                <DropdownMenuLabel>
                  {user?.firstName} {user?.lastName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer">
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

