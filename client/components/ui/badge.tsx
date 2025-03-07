import type { ReactNode } from "react"

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info"

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  )
}

