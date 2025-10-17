"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { ArrowLeft, ArrowRight, Check, MapPin, Video, HelpCircle, Infinity, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import type { Map3DConfig, FormField } from "@/lib/types"
import { FuturisticBackground } from "@/components/futuristic-background"
import { FormBuilder } from "@/components/forms/form-builder"
import { ImageUploader } from "@/components/media/image-uploader"
import { GalleryUploader } from "@/components/media/gallery-uploader"
import { JsonUploader } from "@/components/media/json-uploader"
import { ScheduleDayManager } from "@/components/events/schedule-day-manager"

const CATEGORIES = ["Conferencia", "Concierto", "Exposición", "Networking", "Taller", "Deportivo", "Cultural", "Otro"]

export default function CreateEventPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { addEvent } = useEventsStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showSchedulePrompt, setShowSchedulePrompt] = useState(false)
  const [durationDays, setDurationDays] = useState(0)
  const [eventId, setEventId] = useState(null)
  const [dateError, setDateError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    capacity: 200,
    unlimitedCapacity: false,
    isPublic: true,
    requiresApproval: false,
    eventType: "no_definido" as "presencial" | "virtual" | "no_definido",
    eventLink: "",
    hasCustomForm: false,
    customFormFields: [] as FormField[],
    coverImage: "",
    galleryImages: [] as string[],
    videos: [] as string[],
    mapJsonFile: "",
    aboutEvent: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const now = new Date()

      // Clear previous errors
      setDateError("")

      // Validation 1: End date cannot be before start date
      if (end < start) {
        setDateError("La fecha de fin no puede ser anterior a la fecha de inicio")
        return
      }

      // Validation 2: If start date is in the past, end date must be >= today
      if (start < now && end < now) {
        setDateError("Si el evento ya comenzó, la fecha de fin debe ser igual o posterior a hoy")
        return
      }

      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      setDurationDays(days)

      // Show schedule prompt if event is more than 1 day
      if (days > 1 && step === 1) {
        setShowSchedulePrompt(true)
      }
    }
  }, [formData.startDate, formData.endDate, step])

  if (!isAuthenticated) {
    return null
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      console.log("[v0] Creating event with data:", formData)

      const map3DConfig: Map3DConfig = {
        id: Date.now().toString(),
        markers: [],
        lighting: { ambient: 0.5, directional: 0.8 },
        viewAngles: [],
      }

      const newEvent = await addEvent({
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        location: formData.location,
        eventType: formData.eventType,
        eventLink: formData.eventLink,
        category: formData.category,
        capacity: formData.capacity,
        unlimitedCapacity: formData.unlimitedCapacity,
        isPublic: formData.isPublic,
        requiresApproval: formData.requiresApproval,
        organizerId: user!.id,
        map3DConfig,
        hasCustomForm: formData.hasCustomForm,
        customFormFields: formData.customFormFields,
        coverImage: formData.coverImage,
        galleryImages: formData.galleryImages,
        videos: formData.videos,
        mapJsonFile: formData.mapJsonFile,
        aboutEvent: formData.aboutEvent,
        status: "draft",
      })

      console.log("[v0] Event created successfully:", newEvent)
      toast.success("Evento creado exitosamente")
      router.push(`/events/${newEvent.slug}/${newEvent.id}/edit-map`)
      setEventId(newEvent.id)
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      toast.error("Error al crear el evento")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
        toast.error("Por favor completa todos los campos")
        return
      }
      if (dateError) {
        toast.error(dateError)
        return
      }
    }
    if (step === 2) {
      if (!formData.category) {
        toast.error("Por favor selecciona una categoría")
        return
      }
      if (formData.eventType === "presencial" && !formData.location) {
        toast.error("La ubicación es obligatoria para eventos presenciales")
        return
      }
    }
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  return (
    <FuturisticBackground>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 lg:ml-64">
          <Header />

          <main className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-[#f1c6ff]/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-[#ffddff]" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-[#ffddff]">Crear Evento</h1>
                <p className="text-[#e2e2e2]">Paso {step} de 3</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    s <= step
                      ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                      : "bg-[#1e1732]/50"
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <GlassCard glow="primary">
                <h2 className="text-2xl font-bold text-[#ffddff] mb-6">Información Básica</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#ffddff] mb-2">Nombre del Evento *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 focus:border-[#f1c6ff] transition-all text-[#ffddff] placeholder:text-[#78767b]"
                      placeholder="Ej: Conferencia Tech 2025"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#ffddff] mb-2">Descripción *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 focus:border-[#f1c6ff] transition-all text-[#ffddff] placeholder:text-[#78767b] resize-none"
                      placeholder="Describe tu evento..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#ffddff] mb-2">Fecha Inicio *</label>
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 focus:border-[#f1c6ff] transition-all text-[#ffddff]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#ffddff] mb-2">Fecha Fin *</label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 focus:border-[#f1c6ff] transition-all text-[#ffddff]"
                      />
                    </div>
                  </div>

                  {dateError && (
                    <div className="p-4 rounded-lg bg-error/10 border border-error/30 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-error">{dateError}</p>
                    </div>
                  )}

                  {/* Duration Info and Schedule Prompt */}
                  {durationDays > 0 && !dateError && (
                    <div className="p-4 rounded-lg bg-[#f1c6ff]/10 border border-[#f1c6ff]/30">
                      <p className="text-sm text-[#ffddff]">
                        <span className="font-semibold">Duración:</span> {durationDays}{" "}
                        {durationDays === 1 ? "día" : "días"}
                      </p>
                      {durationDays > 1 && showSchedulePrompt && (
                        <p className="text-sm text-[#e2e2e2] mt-2">
                          💡 Tu evento dura más de 24 horas. Podrás configurar un cronograma detallado por día con mapas
                          y ubicaciones distintas en el paso 3.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

            {/* Step 2: Location & Category */}
            {step === 2 && (
              <GlassCard glow="secondary">
                <h2 className="text-2xl font-bold text-[#ffddff] mb-6">Ubicación y Categoría</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#ffddff] mb-3">Tipo de Evento *</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => setFormData({ ...formData, eventType: "presencial", eventLink: "" })}
                        className={`p-4 rounded-lg font-medium transition-all ${
                          formData.eventType === "presencial"
                            ? "bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] text-[#1e1732] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                            : "bg-[#1e1732]/50 border border-[#f1c6ff]/20 text-[#e2e2e2] hover:text-[#ffddff]"
                        }`}
                      >
                        <MapPin className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">Presencial</div>
                      </button>

                      <button
                        onClick={() => setFormData({ ...formData, eventType: "virtual", eventLink: "" })}
                        className={`p-4 rounded-lg font-medium transition-all ${
                          formData.eventType === "virtual"
                            ? "bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] text-[#1e1732] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                            : "bg-[#1e1732]/50 border border-[#f1c6ff]/20 text-[#e2e2e2] hover:text-[#ffddff]"
                        }`}
                      >
                        <Video className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">Virtual</div>
                      </button>

                      <button
                        onClick={() => setFormData({ ...formData, eventType: "no_definido", eventLink: "" })}
                        className={`p-4 rounded-lg font-medium transition-all ${
                          formData.eventType === "no_definido"
                            ? "bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] text-[#1e1732] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                            : "bg-[#1e1732]/50 border border-[#f1c6ff]/20 text-[#e2e2e2] hover:text-[#ffddff]"
                        }`}
                      >
                        <HelpCircle className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">No Definido</div>
                      </button>
                    </div>
                  </div>

                  {formData.eventType === "presencial" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#ffddff] mb-2">Ubicación *</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 focus:border-[#f1c6ff] transition-all text-[#ffddff] placeholder:text-[#78767b]"
                          placeholder="Ej: Centro de Convenciones, Ciudad"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#ffddff] mb-2">
                          Enlace de Google Maps (opcional)
                        </label>
                        <input
                          type="url"
                          value={formData.eventLink}
                          onChange={(e) => setFormData({ ...formData, eventLink: e.target.value })}
                          className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff] placeholder:text-[#78767b]"
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                    </>
                  )}

                  {formData.eventType === "virtual" && (
                    <div>
                      <label className="block text-sm font-medium text-[#ffddff] mb-2">
                        Enlace de Reunión (Google Meet, Zoom, etc.)
                      </label>
                      <input
                        type="url"
                        value={formData.eventLink}
                        onChange={(e) => setFormData({ ...formData, eventLink: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 text-[#ffddff] placeholder:text-[#78767b]"
                        placeholder="https://meet.google.com/... o https://zoom.us/..."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#ffddff] mb-3">Categoría *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category}
                          onClick={() => setFormData({ ...formData, category })}
                          className={`px-4 py-3 rounded-lg font-medium transition-all ${
                            formData.category === category
                              ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] shadow-[0_0_20px_rgba(241,198,255,0.5)]"
                              : "bg-[#1e1732]/50 text-[#e2e2e2] hover:text-[#ffddff] hover:bg-[#1e1732]/70"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Step 3: Settings */}
            {step === 3 && (
              <GlassCard glow="pink">
                <h2 className="text-2xl font-bold text-[#ffddff] mb-6">Configuración y Multimedia</h2>

                <div className="space-y-6">
                  <div className="space-y-6 p-6 rounded-lg bg-[#1e1732]/30 border border-[#f1c6ff]/20">
                    <h3 className="text-lg font-bold text-[#ffddff]">Multimedia del Evento</h3>

                    <ImageUploader
                      label="Imagen Principal"
                      value={formData.coverImage}
                      onChange={(url) => setFormData({ ...formData, coverImage: url })}
                      onRemove={() => setFormData({ ...formData, coverImage: "" })}
                    />

                    <GalleryUploader
                      label="Galería de Imágenes y Videos"
                      images={formData.galleryImages}
                      videos={formData.videos}
                      onImagesChange={(images) => setFormData({ ...formData, galleryImages: images })}
                      onVideosChange={(videos) => setFormData({ ...formData, videos })}
                    />

                    <JsonUploader
                      label="Mapa 3D (JSON)"
                      value={formData.mapJsonFile}
                      onChange={(json) => setFormData({ ...formData, mapJsonFile: json })}
                      onRemove={() => setFormData({ ...formData, mapJsonFile: "" })}
                      placeholder="Sube el archivo JSON del mapa 3D"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#ffddff] mb-2">Acerca del Evento</label>
                    <textarea
                      value={formData.aboutEvent}
                      onChange={(e) => setFormData({ ...formData, aboutEvent: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#1e1732]/50 border border-[#f1c6ff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1c6ff]/50 focus:border-[#f1c6ff] transition-all text-[#ffddff] placeholder:text-[#78767b] resize-none"
                      placeholder="Información adicional sobre el evento..."
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <Infinity className="w-5 h-5 text-[#f1c6ff]" />
                        <p className="font-medium text-[#ffddff]">Capacidad Ilimitada</p>
                      </div>
                      <p className="text-sm text-[#e2e2e2] mt-1">Sin límite de asistentes</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, unlimitedCapacity: !formData.unlimitedCapacity })}
                      className={`relative w-14 h-8 rounded-full transition-all ${
                        formData.unlimitedCapacity ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff]" : "bg-[#1e1732]/70"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                          formData.unlimitedCapacity ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {!formData.unlimitedCapacity && (
                    <div>
                      <label className="block text-sm font-medium text-[#ffddff] mb-2">Capacidad de Asistentes</label>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        step="10"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
                        className="w-full accent-[#f1c6ff]"
                      />
                      <div className="flex justify-between text-sm text-[#e2e2e2] mt-2">
                        <span>10</span>
                        <span className="text-2xl font-bold text-[#ffddff]">{formData.capacity}</span>
                        <span>200</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/20">
                      <div>
                        <p className="font-medium text-[#ffddff]">Evento Público</p>
                        <p className="text-sm text-[#e2e2e2]">Visible en Descubrir eventos</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          formData.isPublic ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff]" : "bg-[#1e1732]/70"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            formData.isPublic ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/20">
                      <div>
                        <p className="font-medium text-[#ffddff]">Requiere Aprobación</p>
                        <p className="text-sm text-[#e2e2e2]">Aprobar manualmente cada registro</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, requiresApproval: !formData.requiresApproval })}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          formData.requiresApproval ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff]" : "bg-[#1e1732]/70"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            formData.requiresApproval ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#1e1732]/50 border border-[#f1c6ff]/20">
                      <div>
                        <p className="font-medium text-[#ffddff]">Formulario Personalizado</p>
                        <p className="text-sm text-[#e2e2e2]">Recopilar información adicional de los asistentes</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, hasCustomForm: !formData.hasCustomForm })}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          formData.hasCustomForm ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff]" : "bg-[#1e1732]/70"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            formData.hasCustomForm ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {formData.hasCustomForm && (
                    <div className="mt-6 p-6 rounded-lg bg-[#1e1732]/30 border border-[#f1c6ff]/20">
                      <FormBuilder
                        fields={formData.customFormFields}
                        onChange={(fields) => setFormData({ ...formData, customFormFields: fields })}
                      />
                    </div>
                  )}

                  {/* Schedule Day Manager - Only show info before event creation */}
                  {durationDays > 1 && !eventId && (
                    <div className="mt-6 p-6 rounded-lg bg-[#1e1732]/30 border border-[#f1c6ff]/20">
                      <ScheduleDayManager
                        startDate={formData.startDate}
                        endDate={formData.endDate}
                        durationDays={durationDays}
                      />
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-lg border-2 border-[#f1c6ff] text-[#ffddff] hover:bg-[#f1c6ff]/10 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </button>
              )}

              <div className="ml-auto">
                {step < 3 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-medium hover:shadow-[0_0_30px_rgba(241,198,255,0.6)] transition-all flex items-center gap-2"
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732] font-medium hover:shadow-[0_0_30px_rgba(241,198,255,0.6)] transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>Creando...</>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Crear y Diseñar Mapa 3D
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </FuturisticBackground>
  )
}
