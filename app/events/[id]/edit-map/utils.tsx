import { DoorOpen, DoorClosed, Mic2, Store, Utensils, Info, Users, AlertTriangle } from "lucide-react"

// Marker categories organized by type
export const MARKER_CATEGORIES = {
  access: [
    { type: "entrance", label: "Entrada", icon: DoorOpen, color: "#10b981" },
    { type: "exit", label: "Salida", icon: DoorClosed, color: "#ef4444" },
    { type: "emergency_exit", label: "Salida de Emergencia", icon: AlertTriangle, color: "#f59e0b" },
  ],
  stages: [
    { type: "stage", label: "Escenario", icon: Mic2, color: "#9333ea" },
    { type: "backstage", label: "Backstage", icon: Mic2, color: "#7c3aed" },
  ],
  booths: [
    { type: "booth", label: "Stand", icon: Store, color: "#06b6d4" },
    { type: "sponsor_booth", label: "Stand de Patrocinador", icon: Store, color: "#0891b2" },
    { type: "info_booth", label: "Stand de Información", icon: Info, color: "#ec4899" },
    { type: "merchandise", label: "Merchandising", icon: Store, color: "#8b5cf6" },
  ],
  services: [
    { type: "food", label: "Comida", icon: Utensils, color: "#f59e0b" },
    { type: "bathroom", label: "Baño", icon: Users, color: "#8b5cf6" },
    { type: "info", label: "Información", icon: Info, color: "#ec4899" },
  ],
}

// Check if a marker type should have capacity field
export const isCapacityElement = (type: string): boolean => {
  const capacityTypes = ["stage", "booth", "sponsor_booth", "info_booth", "food", "bathroom", "merchandise"]
  return capacityTypes.includes(type)
}

// Get marker color by type
export const getMarkerColor = (type: string): string => {
  for (const category of Object.values(MARKER_CATEGORIES)) {
    const marker = category.find((m) => m.type === type)
    if (marker) return marker.color
  }
  return "#6b7280" // default gray
}

// Get marker label by type
export const getMarkerLabel = (type: string): string => {
  for (const category of Object.values(MARKER_CATEGORIES)) {
    const marker = category.find((m) => m.type === type)
    if (marker) return marker.label
  }
  return type
}
