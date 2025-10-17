import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: "primary" | "secondary" | "pink" | "none"
}

export function GlassCard({ children, className, hover = false, glow = "none" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1",
        glow === "primary" && "hover:glow-primary",
        glow === "secondary" && "hover:glow-secondary",
        glow === "pink" && "hover:glow-pink",
        className,
      )}
    >
      {children}
    </div>
  )
}
