"use client"

import { type ReactNode, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { getReducedMotion, pageTransition } from "@/lib/motion"

interface MotionWrapperProps {
  children: ReactNode
}

export default function MotionWrapper({ children }: MotionWrapperProps) {
  const pathname = usePathname()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setPrefersReducedMotion(getReducedMotion())

    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} initial="hidden" animate="visible" exit="exit" variants={pageTransition}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

