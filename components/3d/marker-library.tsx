"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { DoorOpen, DoorClosed, Mic2, Store, Utensils, Info, Users } from "lucide-react"
import type { Marker3D } from "@/lib/types"

const MARKER_TYPES = [
  { type: "entrance" as const, label: "Entrada", icon: DoorOpen, color: "#10b981" },
  { type: "exit" as const, label: "Salida", icon: DoorClosed, color: "#ef4444" },
  { type: "stage" as const, label: "Escenario", icon: Mic2, color: "#9333ea" },
  { type: "booth" as const, label: "Stand", icon: Store, color: "#06b6d4" },
  { type: "food" as const, label: "Comida", icon: Utensils, color: "#f59e0b" },
  { type: "bathroom" as const, label: "Baño", icon: Users, color: "#8b5cf6" },
  { type: "info" as const, label: "Información", icon: Info, color: "#ec4899" },
]

interface MarkerLibraryProps {
  onAddMarker: (type: Marker3D["type"]) => void
}

export function MarkerLibrary({ onAddMarker }: MarkerLibraryProps) {
  return (
    <GlassCard className="h-full">
      <h3 className="text-lg font-bold text-foreground mb-4">Elementos 3D</h3>

      <div className="space-y-2">
        {MARKER_TYPES.map((markerType) => (
          <button
            key={markerType.type}
            onClick={() => onAddMarker(markerType.type)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-all border border-border/50 hover:border-primary/50 group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
              style={{ backgroundColor: `${markerType.color}20`, color: markerType.color }}
            >
              <markerType.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{markerType.label}</p>
              <p className="text-xs text-muted">Click para agregar</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-sm text-muted">
          <span className="font-semibold text-primary">Tip:</span> Arrastra los elementos en el canvas 3D para
          posicionarlos
        </p>
      </div>
    </GlassCard>
  )
}
