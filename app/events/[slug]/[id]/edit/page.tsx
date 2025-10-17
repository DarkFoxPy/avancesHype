"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FuturisticBackground } from "@/components/futuristic-background"
import { ArrowLeft } from "lucide-react"
import { ImageUploader } from "@/components/media/image-uploader"
import { GalleryUploader } from "@/components/media/gallery-uploader"
import { JsonUploader } from "@/components/media/json-uploader"
import { ScheduleDayManager } from "@/components/events/schedule-day-manager"
import toast from "react-hot-toast"
import Link from "next/link"

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const { getEventById, updateEvent } = useEventsStore()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [durationDays, setDurationDays] = useState(0)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [location, setLocation] = useState("")
  const [eventType, setEventType] = useState<"presencial" | "virtual" | "no-definido">("presencial")
  const [eventLink, setEventLink] = useState("")
  const [category, setCategory] = useState("")
  const [capacity, setCapacity] = useState(200)
  const [unlimitedCapacity, setUnlimitedCapacity] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [requiresApproval, setRequiresApproval] = useState(false)
  const [aboutEvent, setAboutEvent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [mapJsonFile, setMapJsonFile] = useState("")
  const [hasCustomForm, setHasCustomForm] = useState(false)
  const [customFormFields, setCustomFormFields] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const loadEvent = async () => {
      const eventData = await getEventById(params.id as string)

      if (!eventData) {
        toast.error("Evento no encontrado")
        router.push("/events")
        return
      }

      if (eventData.organizerId !== user?.id) {
        toast.error("No tienes permiso para editar este evento")
        router.push("/events")
        return
      }

      setEvent(eventData)
      setTitle(eventData.title)
      setDescription(eventData.description)
      setStartDate(new Date(eventData.startDate).toISOString().slice(0, 16))
      setEndDate(new Date(eventData.endDate).toISOString().slice(0, 16))
      setLocation(eventData.location || "")
      setEventType(eventData.eventType)
      setEventLink(eventData.eventLink || "")
      setCategory(eventData.category)
      setCapacity(eventData.capacity)
      setUnlimitedCapacity(eventData.unlimitedCapacity)
      setIsPublic(eventData.isPublic)
      setRequiresApproval(eventData.requiresApproval)
      setAboutEvent(eventData.aboutEvent || "")
      setCoverImage(eventData.coverImage || "")
      setGalleryImages(eventData.galleryImages || [])
      setVideos(eventData.videos || [])
      setMapJsonFile(eventData.mapJsonFile || "")
      setHasCustomForm(eventData.hasCustomForm)
      setCustomFormFields(eventData.customFormFields || [])

      const start = new Date(eventData.startDate)
      const end = new Date(eventData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      setDurationDays(days)

      setLoading(false)
    }

    loadEvent()
  }, [isAuthenticated, user, params.id, router])

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      setDurationDays(days)
    }
  }, [startDate, endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const startDateTime = new Date(startDate)
      const endDateTime = new Date(endDate)
      const now = new Date()

      if (endDateTime < startDateTime) {
        toast.error("La fecha de fin no puede ser anterior a la fecha de inicio")
        setSaving(false)
        return
      }

      if (startDateTime < now && endDateTime < now) {
        toast.error("La fecha de fin no puede ser menor al día actual")
        setSaving(false)
        return
      }

      if (eventType === "presencial" && !location.trim()) {
        toast.error("La ubicación es obligatoria para eventos presenciales")
        setSaving(false)
        return
      }

      await updateEvent(params.id as string, {
        title,
        description,
        startDate: startDateTime,
        endDate: endDateTime,
        location: eventType === "presencial" ? location : "",
        eventType,
        eventLink,
        category,
        capacity,
        unlimitedCapacity,
        isPublic,
        requiresApproval,
        aboutEvent,
        coverImage,
        galleryImages,
        videos,
        mapJsonFile,
        hasCustomForm,
        customFormFields,
      })

      toast.success("Evento actualizado exitosamente")
      router.push("/events")
    } catch (error) {
      console.error("[v0] Error updating event:", error)
      toast.error("Error al actualizar el evento")
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated || loading) {
    return null
  }

  return (
    <FuturisticBackground>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 lg:ml-64">
          <Header />

          <main className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/events">
                <button className="p-2 rounded-lg bg-[#1e1732]/50 hover:bg-[#1e1732] text-[#ffddff] transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-[#ffddff]">Editar Evento</h1>
                <p className="text-[#e2e2e2]">Actualiza la información de tu evento</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <GlassCard>
                <h2 className="text-xl font-bold text-[#ffddff] mb-4">Información Básica</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Título del Evento</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Descripción</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Acerca del Evento</label>
                    <textarea
                      value={aboutEvent}
                      onChange={(e) => setAboutEvent(e.target.value)}
                      rows={3}
                      placeholder="Información adicional sobre el evento..."
                      className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Fecha de Inicio</label>
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] focus:outline-none focus:border-[#f1c6ff]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Fecha de Fin</label>
                      <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] focus:outline-none focus:border-[#f1c6ff]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Tipo de Evento</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] focus:outline-none focus:border-[#f1c6ff]"
                    >
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                      <option value="no-definido">No Definido</option>
                    </select>
                  </div>

                  {eventType === "presencial" && (
                    <div>
                      <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Ubicación</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required={eventType === "presencial"}
                        placeholder="Dirección del evento"
                        className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                      />
                    </div>
                  )}

                  {eventType === "virtual" && (
                    <div>
                      <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Enlace del Evento</label>
                      <input
                        type="url"
                        value={eventLink}
                        onChange={(e) => setEventLink(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] placeholder:text-[#78767b] focus:outline-none focus:border-[#f1c6ff]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Categoría</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/30 text-[#ffddff] focus:outline-none focus:border-[#f1c6ff]"
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="Conferencia">Conferencia</option>
                      <option value="Concierto">Concierto</option>
                      <option value="Exposición">Exposición</option>
                      <option value="Networking">Networking</option>
                      <option value="Taller">Taller</option>
                      <option value="Deportivo">Deportivo</option>
                      <option value="Cultural">Cultural</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h2 className="text-xl font-bold text-[#ffddff] mb-4">Multimedia</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Imagen Principal</label>
                    <ImageUploader value={coverImage} onChange={setCoverImage} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e2e2e2] mb-2">
                      Galería de Imágenes y Videos
                    </label>
                    <GalleryUploader
                      images={galleryImages}
                      videos={videos}
                      onImagesChange={setGalleryImages}
                      onVideosChange={setVideos}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e2e2e2] mb-2">Mapa 3D (JSON)</label>
                    <JsonUploader value={mapJsonFile} onChange={setMapJsonFile} />
                  </div>
                </div>
              </GlassCard>

              {durationDays > 1 && event && (
                <GlassCard>
                  <h2 className="text-xl font-bold text-[#ffddff] mb-4">Cronograma Multi-Día</h2>
                  <ScheduleDayManager
                    eventId={params.id as string}
                    startDate={startDate}
                    endDate={endDate}
                    durationDays={durationDays}
                  />
                </GlassCard>
              )}

              <div className="flex gap-4">
                <Link href="/events" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-6 py-3 rounded-lg bg-[#1e1732]/50 hover:bg-[#1e1732] text-[#ffddff] transition-all"
                  >
                    Cancelar
                  </button>
                </Link>
                <GradientButton type="submit" disabled={saving} className="flex-1">
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </GradientButton>
              </div>
            </form>
          </main>
        </div>
      </div>
    </FuturisticBackground>
  )
}
