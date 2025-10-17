"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/media/image-uploader"
import { GalleryUploader } from "@/components/media/gallery-uploader"
import { JsonUploader } from "@/components/media/json-uploader"
import { Plus, Calendar, MapPin, Check, Trash } from "lucide-react"
import { toast } from "sonner"

interface ScheduleDay {
  id: string
  dayNumber: number
  dayDate: string
  title: string
  description?: string
  mapJsonFile?: string
  coverImage?: string
  galleryImages?: string[]
  videos?: string[]
}

interface ScheduleDayManagerProps {
  eventId?: string
  startDate: string
  endDate: string
  durationDays: number
}

export function ScheduleDayManager({ eventId, startDate, endDate, durationDays }: ScheduleDayManagerProps) {
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([])
  const [loading, setLoading] = useState(false)
  const [editingDay, setEditingDay] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mapJsonFile: "",
    coverImage: "",
    galleryImages: [] as string[],
    videos: [] as string[],
  })

  useEffect(() => {
    if (eventId) {
      fetchScheduleDays()
    }
  }, [eventId])

  const fetchScheduleDays = async () => {
    if (!eventId) return

    try {
      const response = await fetch(`/api/events/${eventId}/schedule-days`)
      const data = await response.json()
      setScheduleDays(data.scheduleDays || [])
    } catch (error) {
      console.error("[v0] Error fetching schedule days:", error)
    }
  }

  const handleCreateDay = async (dayNumber: number) => {
    if (!formData.title) {
      toast.error("El título es requerido")
      return
    }

    if (!eventId) {
      toast.error("Primero debes crear el evento")
      return
    }

    setLoading(true)
    try {
      const dayDate = new Date(startDate)
      dayDate.setDate(dayDate.getDate() + dayNumber - 1)

      const response = await fetch(`/api/events/${eventId}/schedule-days`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayNumber,
          dayDate: dayDate.toISOString(),
          ...formData,
        }),
      })

      if (response.ok) {
        toast.success(`Día ${dayNumber} agregado exitosamente`)
        fetchScheduleDays()
        setEditingDay(null)
        setFormData({
          title: "",
          description: "",
          mapJsonFile: "",
          coverImage: "",
          galleryImages: [],
          videos: [],
        })
      } else {
        toast.error("Error al crear el día del cronograma")
      }
    } catch (error) {
      toast.error("Error al crear el día del cronograma")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDay = async (dayId: string, dayNumber: number) => {
    if (!confirm(`¿Estás seguro de eliminar el Día ${dayNumber}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}/schedule-days?dayId=${dayId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success(`Día ${dayNumber} eliminado exitosamente`)
        fetchScheduleDays()
      } else {
        toast.error("Error al eliminar el día del cronograma")
      }
    } catch (error) {
      toast.error("Error al eliminar el día del cronograma")
    }
  }

  const getDayDate = (dayNumber: number) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + dayNumber - 1)
    return date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  if (durationDays <= 1) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#ffddff]">Cronograma por Días</h3>
          <p className="text-sm text-[#e2e2e2]">
            Tu evento dura {durationDays} días.{" "}
            {eventId
              ? "Configura cada día con su propio mapa, imágenes y detalles."
              : "Podrás configurar cada día después de crear el evento."}
          </p>
        </div>
      </div>

      {!eventId && (
        <div className="p-4 rounded-lg bg-[#f1c6ff]/10 border border-[#f1c6ff]/30">
          <p className="text-sm text-[#ffddff]">
            💡 Primero crea el evento, luego podrás configurar el cronograma detallado por día.
          </p>
        </div>
      )}

      {eventId && (
        <div className="grid gap-4">
          {Array.from({ length: durationDays }, (_, i) => i + 1).map((dayNumber) => {
            const existingDay = scheduleDays.find((d) => d.dayNumber === dayNumber)
            const isEditing = editingDay === dayNumber

            return (
              <Card key={dayNumber} className="p-6 bg-[#1e1732]/50 border-[#f1c6ff]/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1c6ff]/20">
                      <Calendar className="h-5 w-5 text-[#f1c6ff]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#ffddff]">Día {dayNumber}</h4>
                      <p className="text-sm text-[#e2e2e2]">{getDayDate(dayNumber)}</p>
                    </div>
                  </div>
                  {existingDay ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-[#10b981]">
                        <Check className="h-5 w-5" />
                        <span className="text-sm font-medium">Configurado</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteDay(existingDay.id, dayNumber)}
                        className="border-error/30 text-error hover:bg-error/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : !isEditing ? (
                    <Button
                      size="sm"
                      onClick={() => setEditingDay(dayNumber)}
                      className="bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] hover:shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Configurar Día
                    </Button>
                  ) : null}
                </div>

                {existingDay && (
                  <div className="space-y-2 border-t border-[#f1c6ff]/20 pt-4">
                    <h5 className="font-medium text-[#ffddff]">{existingDay.title}</h5>
                    {existingDay.description && <p className="text-sm text-[#e2e2e2]">{existingDay.description}</p>}
                    {existingDay.mapJsonFile && (
                      <div className="flex items-center gap-2 text-sm text-[#e2e2e2]">
                        <MapPin className="h-4 w-4 text-[#f1c6ff]" />
                        <span>Mapa 3D configurado</span>
                      </div>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-4 border-t border-[#f1c6ff]/20 pt-4">
                    <div>
                      <Label className="text-[#ffddff]">Título del Día</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={`Ej: Día ${dayNumber} - Inauguración`}
                        className="bg-[#1e1732]/50 border-[#f1c6ff]/20 text-[#ffddff]"
                      />
                    </div>

                    <div>
                      <Label className="text-[#ffddff]">Descripción</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe las actividades de este día..."
                        rows={3}
                        className="bg-[#1e1732]/50 border-[#f1c6ff]/20 text-[#ffddff]"
                      />
                    </div>

                    <div>
                      <Label className="text-[#ffddff]">Mapa 3D (JSON)</Label>
                      <JsonUploader
                        value={formData.mapJsonFile}
                        onChange={(value) => setFormData({ ...formData, mapJsonFile: value })}
                      />
                    </div>

                    <div>
                      <Label className="text-[#ffddff]">Imagen Principal</Label>
                      <ImageUploader
                        value={formData.coverImage}
                        onChange={(value) => setFormData({ ...formData, coverImage: value })}
                      />
                    </div>

                    <div>
                      <Label className="text-[#ffddff]">Galería de Imágenes</Label>
                      <GalleryUploader
                        images={formData.galleryImages}
                        videos={formData.videos}
                        onImagesChange={(images) => setFormData({ ...formData, galleryImages: images })}
                        onVideosChange={(videos) => setFormData({ ...formData, videos })}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCreateDay(dayNumber)}
                        disabled={loading}
                        className="bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                      >
                        Guardar Día {dayNumber}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingDay(null)}
                        className="border-[#f1c6ff]/20 text-[#ffddff]"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
