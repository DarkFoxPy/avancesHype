"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Trash2 } from "lucide-react"
import type { Marker3D } from "@/lib/types"

interface MarkerPropertiesProps {
  marker: Marker3D | null
  onUpdate: (updates: Partial<Marker3D>) => void
  onDelete: () => void
}

export function MarkerProperties({ marker, onUpdate, onDelete }: MarkerPropertiesProps) {
  if (!marker) {
    return (
      <GlassCard className="h-full">
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <p className="text-muted">Selecciona un elemento para editar sus propiedades</p>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Propiedades</h3>
        <button onClick={onDelete} className="p-2 rounded-lg bg-error/20 hover:bg-error/30 text-error transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
          <input
            type="text"
            value={marker.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
          <textarea
            value={marker.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground text-sm resize-none"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Posición</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-muted">X</label>
              <input
                type="number"
                value={marker.position.x.toFixed(1)}
                onChange={(e) =>
                  onUpdate({
                    position: { ...marker.position, x: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 bg-surface/50 border border-border/50 rounded text-foreground text-sm"
                step="0.5"
              />
            </div>
            <div>
              <label className="text-xs text-muted">Y</label>
              <input
                type="number"
                value={marker.position.y.toFixed(1)}
                onChange={(e) =>
                  onUpdate({
                    position: { ...marker.position, y: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 bg-surface/50 border border-border/50 rounded text-foreground text-sm"
                step="0.5"
              />
            </div>
            <div>
              <label className="text-xs text-muted">Z</label>
              <input
                type="number"
                value={marker.position.z.toFixed(1)}
                onChange={(e) =>
                  onUpdate({
                    position: { ...marker.position, z: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 bg-surface/50 border border-border/50 rounded text-foreground text-sm"
                step="0.5"
              />
            </div>
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Color</label>
          <input
            type="color"
            value={marker.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>

        {/* Capacity (if applicable) */}
        {["stage", "booth", "food"].includes(marker.type) && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Capacidad</label>
            <input
              type="number"
              value={marker.capacity || 0}
              onChange={(e) => onUpdate({ capacity: Number.parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground text-sm"
              min="0"
            />
          </div>
        )}
      </div>
    </GlassCard>
  )
}
