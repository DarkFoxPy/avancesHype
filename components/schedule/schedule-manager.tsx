"use client"

import type React from "react"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Plus, Upload, Trash2, Edit2, Download, Calendar, Clock, MapPin, User } from "lucide-react"
import type { ScheduleItem } from "@/lib/types"
import toast from "react-hot-toast"

interface ScheduleManagerProps {
  schedule: ScheduleItem[]
  onChange: (schedule: ScheduleItem[]) => void
  eventDurationDays: number
}

export function ScheduleManager({ schedule, onChange, eventDurationDays }: ScheduleManagerProps) {
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    day: 1,
    time: "",
    title: "",
    description: "",
    location: "",
    speaker: "",
  })

  const handleAddItem = () => {
    if (!formData.title || !formData.time) {
      toast.error("Por favor completa título y hora")
      return
    }

    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      day: formData.day,
      time: formData.time,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      speaker: formData.speaker,
    }

    onChange([...schedule, newItem])
    resetForm()
    toast.success("Actividad agregada")
  }

  const handleUpdateItem = () => {
    if (!editingItem || !formData.title || !formData.time) {
      toast.error("Por favor completa título y hora")
      return
    }

    const updatedSchedule = schedule.map((item) =>
      item.id === editingItem.id
        ? {
            ...item,
            day: formData.day,
            time: formData.time,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            speaker: formData.speaker,
          }
        : item,
    )

    onChange(updatedSchedule)
    resetForm()
    toast.success("Actividad actualizada")
  }

  const handleDeleteItem = (id: string) => {
    if (confirm("¿Eliminar esta actividad?")) {
      onChange(schedule.filter((item) => item.id !== id))
      toast.success("Actividad eliminada")
    }
  }

  const handleEditItem = (item: ScheduleItem) => {
    setEditingItem(item)
    setFormData({
      day: item.day,
      time: item.time,
      title: item.title,
      description: item.description || "",
      location: item.location || "",
      speaker: item.speaker || "",
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      day: 1,
      time: "",
      title: "",
      description: "",
      location: "",
      speaker: "",
    })
    setEditingItem(null)
    setShowForm(false)
  }

  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        if (Array.isArray(json)) {
          // Validate structure
          const validItems = json.every(
            (item) => typeof item.day === "number" && typeof item.time === "string" && typeof item.title === "string",
          )

          if (validItems) {
            // Add IDs if missing
            const itemsWithIds = json.map((item) => ({
              ...item,
              id: item.id || Date.now().toString() + Math.random(),
            }))
            onChange(itemsWithIds)
            toast.success(`${itemsWithIds.length} actividades importadas`)
          } else {
            toast.error("Formato JSON inválido")
          }
        } else {
          toast.error("El JSON debe ser un array de actividades")
        }
      } catch (error) {
        toast.error("Error al leer el archivo JSON")
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  const handleExportJson = () => {
    const dataStr = JSON.stringify(schedule, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "schedule.json"
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Cronograma exportado")
  }

  // Group schedule by day
  const scheduleByDay = schedule.reduce(
    (acc, item) => {
      if (!acc[item.day]) acc[item.day] = []
      acc[item.day].push(item)
      return acc
    },
    {} as Record<number, ScheduleItem[]>,
  )

  // Sort items by time within each day
  Object.keys(scheduleByDay).forEach((day) => {
    scheduleByDay[Number(day)].sort((a, b) => a.time.localeCompare(b.time))
  })

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-3">
        <GradientButton onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          {showForm ? "Cancelar" : "Agregar Actividad"}
        </GradientButton>

        <label>
          <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
          <GradientButton variant="secondary" className="gap-2" as="span">
            <Upload className="w-4 h-4" />
            Importar JSON
          </GradientButton>
        </label>

        {schedule.length > 0 && (
          <GradientButton variant="outline" onClick={handleExportJson} glow={false} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar JSON
          </GradientButton>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <GlassCard glow="primary">
          <h3 className="text-lg font-bold text-[#ffddff] mb-4">
            {editingItem ? "Editar Actividad" : "Nueva Actividad"}
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#ffddff] mb-2">Día *</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg text-[#ffddff]"
                >
                  {Array.from({ length: eventDurationDays }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      Día {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ffddff] mb-2">Hora *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg text-[#ffddff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#ffddff] mb-2">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Conferencia inaugural"
                className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg text-[#ffddff] placeholder:text-[#78767b]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#ffddff] mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Descripción de la actividad..."
                className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg text-[#ffddff] placeholder:text-[#78767b] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#ffddff] mb-2">Ubicación</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ej: Sala Principal"
                  className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg text-[#ffddff] placeholder:text-[#78767b]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ffddff] mb-2">Ponente</label>
                <input
                  type="text"
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  placeholder="Ej: Dr. Juan Pérez"
                  className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg text-[#ffddff] placeholder:text-[#78767b]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <GradientButton onClick={editingItem ? handleUpdateItem : handleAddItem} className="flex-1">
                {editingItem ? "Actualizar" : "Agregar"}
              </GradientButton>
              <GradientButton variant="outline" onClick={resetForm} glow={false}>
                Cancelar
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Schedule Display */}
      {schedule.length === 0 ? (
        <GlassCard>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-[#78767b] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#ffddff] mb-2">Sin cronograma</h3>
            <p className="text-[#e2e2e2] mb-4">Agrega actividades o importa un archivo JSON</p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {Array.from({ length: eventDurationDays }, (_, i) => i + 1).map((day) => {
            const dayItems = scheduleByDay[day] || []
            if (dayItems.length === 0) return null

            return (
              <GlassCard key={day} glow="secondary">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#f1c6ff]/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] flex items-center justify-center">
                    <span className="text-lg font-bold text-[#1e1732]">{day}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#ffddff]">Día {day}</h3>
                    <p className="text-sm text-[#e2e2e2]">{dayItems.length} actividades</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/20 hover:border-[#f1c6ff]/40 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 text-[#f1c6ff]">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">{item.time}</span>
                            </div>
                            <h4 className="text-lg font-bold text-[#ffddff]">{item.title}</h4>
                          </div>

                          {item.description && <p className="text-sm text-[#e2e2e2] mb-2">{item.description}</p>}

                          <div className="flex flex-wrap gap-3 text-sm text-[#e2e2e2]">
                            {item.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{item.location}</span>
                              </div>
                            )}
                            {item.speaker && (
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{item.speaker}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 rounded-lg bg-[#f1c6ff]/20 hover:bg-[#f1c6ff]/30 text-[#f1c6ff] transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
