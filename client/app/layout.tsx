import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import { CartProvider } from "@/lib/cart-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { AuthProvider } from "@/lib/auth-context"
import MotionWrapper from "@/components/motion/motion-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Commerce Order Management",
  description: "A comprehensive order management system using event sourcing",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProtectedRoute>
            <CartProvider>
              <Header />
              <MotionWrapper>
                <main className="container mx-auto px-4 py-6">{children}</main>
              </MotionWrapper>
            </CartProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  )
}

