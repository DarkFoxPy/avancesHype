import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  glow?: boolean
}

export function GradientButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  glow = true,
  className,
  disabled,
  ...props
}: GradientButtonProps) {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105",
    secondary: "bg-gradient-to-r from-secondary to-accent-pink text-white hover:shadow-lg hover:scale-105",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const glowClass = glow && variant !== "outline" ? "glow-primary" : ""

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], glowClass, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
