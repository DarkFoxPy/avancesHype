"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FuturisticBackground } from "@/components/futuristic-background"
import { ScheduleManager } from "@/components/schedule/schedule-manager"
import { ArrowLeft, Save } from "lucide-react"
import toast from "react-hot-toast"
import type { ScheduleItem } from "@/lib/types"

export default function EventSchedulePage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const { getEventById, updateEvent } = useEventsStore()
  const [event, setEvent] = useState<any>(null)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      const eventData = await getEventById(params.id as string)
      if (eventData) {
        setEvent(eventData)
        setSchedule(eventData.schedule || [])
      }
      setLoading(false)
    }

    if (isAuthenticated) {
      loadEvent()
    } else {
      router.push("/login")
    }
  }, [params.id, isAuthenticated])

  const handleSave = async () => {
    if (!event) return

    setSaving(true)
    try {
      await updateEvent(event.id, { schedule })
      toast.success("Cronograma guardado exitosamente")
      router.push(`/events/${event.slug}/${event.id}`)
    } catch (error) {
      toast.error("Error al guardar el cronograma")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <FuturisticBackground>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted">Cargando...</p>
          </div>
        </div>
      </FuturisticBackground>
    )
  }

  if (!event || event.organizerId !== user?.id) {
    return (
      <FuturisticBackground>
        <div className="flex min-h-screen items-center justify-center">
          <GlassCard className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Acceso denegado</h2>
            <p className="text-muted mb-4">No tienes permiso para editar este evento</p>
            <GradientButton onClick={() => router.back()}>Volver</GradientButton>
          </GlassCard>
        </div>
      </FuturisticBackground>
    )
  }

  return (
    <FuturisticBackground>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 lg:ml-64">
          <Header />

          <main className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/events/${event.slug}/${event.id}`)}
                  className="p-2 hover:bg-surface rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Gestionar Cronograma</h1>
                  <p className="text-muted">{event.title}</p>
                </div>
              </div>

              <GradientButton onClick={handleSave} loading={saving} className="gap-2">
                <Save className="w-4 h-4" />
                Guardar Cronograma
              </GradientButton>
            </div>

            {/* Info Card */}
            <GlassCard glow="primary">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Save className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2">Formato JSON para importar</h3>
                  <p className="text-sm text-muted mb-3">Puedes importar un archivo JSON con el siguiente formato:</p>
                  <pre className="bg-surface/50 p-4 rounded-lg text-xs text-muted overflow-x-auto">
                    {`[
  {
    "day": 1,
    "time": "09:00",
    "title": "Registro y bienvenida",
    "description": "Recepción de asistentes",
    "location": "Hall Principal",
    "speaker": "Equipo organizador"
  },
  {
    "day": 1,
    "time": "10:00",
    "title": "Conferencia inaugural",
    "description": "Presentación del evento",
    "location": "Auditorio",
    "speaker": "Dr. Juan Pérez"
  }
]`}
                  </pre>
                </div>
              </div>
            </GlassCard>

            {/* Schedule Manager */}
            <ScheduleManager schedule={schedule} onChange={setSchedule} eventDurationDays={event.durationDays || 1} />
          </main>
        </div>
      </div>
    </FuturisticBackground>
  )
}
