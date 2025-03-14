"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname.startsWith("/signin") && !pathname.startsWith("/signup")) {
      router.push("/signin?redirect=" + encodeURIComponent(pathname))
    }
  }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="medium" />
      </div>
    )
  }

  if (!isAuthenticated && !pathname.startsWith("/signin") && !pathname.startsWith("/signup")) {
    return null
  }

  return <>{children}</>
}

