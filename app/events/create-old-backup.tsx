"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import toast from "react-hot-toast"
import type { Event, Map3DConfig } from "@/lib/types"
import { FuturisticBackground } from "@/components/futuristic-background"

const CATEGORIES = ["Conferencia", "Concierto", "Exposición", "Networking", "Taller", "Deportivo", "Cultural", "Otro"]

const SPACE_TYPES = [
  { value: "room", label: "Sala", icon: "🏢" },
  { value: "auditorium", label: "Auditorio", icon: "🎭" },
  { value: "gallery", label: "Galería", icon: "🖼️" },
  { value: "outdoor", label: "Exterior", icon: "🌳" },
] as const

export default function CreateEventPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { addEvent } = useEventsStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    capacity: 100,
    isPublic: true,
    requiresApproval: false,
    spaceType: "room" as const,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const map3DConfig: Map3DConfig = {
        id: Date.now().toString(),
        markers: [],
        lighting: { ambient: 0.5, directional: 0.8 },
        viewAngles: [],
        spaceType: formData.spaceType,
      }

      const newEvent: Event = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        location: formData.location,
        category: formData.category,
        capacity: formData.capacity,
        registrations: 0,
        isPublic: formData.isPublic,
        requiresApproval: formData.requiresApproval,
        organizerId: user!.id,
        map3DConfig,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      addEvent(newEvent)
      toast.success("Evento creado exitosamente")
      router.push(`/events/${newEvent.id}/edit-map`)
    } catch (error) {
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
    }
    if (step === 2) {
      if (!formData.location || !formData.category) {
        toast.error("Por favor completa todos los campos")
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
              <button onClick={() => router.back()} className="p-2 hover:bg-surface rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Crear Evento</h1>
                <p className="text-muted">Paso {step} de 3</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    s <= step ? "bg-gradient-to-r from-primary to-secondary glow-primary" : "bg-surface"
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <GlassCard glow="primary">
                <h2 className="text-2xl font-bold text-foreground mb-6">Información Básica</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nombre del Evento *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted"
                      placeholder="Ej: Conferencia Tech 2025"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Descripción *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted resize-none"
                      placeholder="Describe tu evento..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Fecha Inicio *</label>
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Fecha Fin *</label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Step 2: Location & Category */}
            {step === 2 && (
              <GlassCard glow="secondary">
                <h2 className="text-2xl font-bold text-foreground mb-6">Ubicación y Categoría</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Ubicación *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-foreground placeholder:text-muted"
                      placeholder="Ej: Centro de Convenciones, Ciudad"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Categoría *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category}
                          onClick={() => setFormData({ ...formData, category })}
                          className={`px-4 py-3 rounded-lg font-medium transition-all ${
                            formData.category === category
                              ? "bg-gradient-to-r from-secondary to-accent-pink text-white glow-secondary"
                              : "bg-surface/50 text-muted hover:text-foreground hover:bg-surface"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Tipo de Espacio</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {SPACE_TYPES.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setFormData({ ...formData, spaceType: type.value })}
                          className={`p-4 rounded-lg font-medium transition-all ${
                            formData.spaceType === type.value
                              ? "bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary text-foreground"
                              : "bg-surface/50 border border-border/50 text-muted hover:text-foreground"
                          }`}
                        >
                          <div className="text-3xl mb-2">{type.icon}</div>
                          <div className="text-sm">{type.label}</div>
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
                <h2 className="text-2xl font-bold text-foreground mb-6">Configuración</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Capacidad de Asistentes</label>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted mt-2">
                      <span>10</span>
                      <span className="text-2xl font-bold text-foreground">{formData.capacity}</span>
                      <span>1000</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-surface/50">
                      <div>
                        <p className="font-medium text-foreground">Evento Público</p>
                        <p className="text-sm text-muted">Visible para todos los usuarios</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          formData.isPublic ? "bg-gradient-to-r from-primary to-secondary" : "bg-surface"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            formData.isPublic ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-surface/50">
                      <div>
                        <p className="font-medium text-foreground">Requiere Aprobación</p>
                        <p className="text-sm text-muted">Aprobar manualmente cada registro</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, requiresApproval: !formData.requiresApproval })}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          formData.requiresApproval ? "bg-gradient-to-r from-primary to-secondary" : "bg-surface"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            formData.requiresApproval ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <GradientButton variant="outline" onClick={prevStep} glow={false} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </GradientButton>
              )}

              <div className="ml-auto">
                {step < 3 ? (
                  <GradientButton onClick={nextStep} className="gap-2">
                    Siguiente
                    <ArrowRight className="w-4 h-4" />
                  </GradientButton>
                ) : (
                  <GradientButton onClick={handleSubmit} loading={loading} className="gap-2">
                    <Check className="w-4 h-4" />
                    Crear y Diseñar Mapa 3D
                  </GradientButton>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </FuturisticBackground>
  )
}
