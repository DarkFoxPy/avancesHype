"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FuturisticBackground } from "@/components/futuristic-background"
import { VenueViewer } from "@/components/3d/venue-viewer"
import { RegistrationModal } from "@/components/modals/registration-modal"
import { ScheduleDisplay } from "@/components/schedule/schedule-display"
import { FormRenderer } from "@/components/forms/form-renderer"
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  Share2,
  UserPlus,
  ExternalLink,
  CalendarDays,
  ImageIcon,
  Video,
  Info,
} from "lucide-react"
import toast from "react-hot-toast"

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const { getEventById, incrementVisitCount } = useEventsStore()
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvent = async () => {
      const eventData = await getEventById(params.id as string)
      setEvent(eventData)
      setLoading(false)

      if (eventData) {
        await incrementVisitCount(eventData.id, {
          userId: user?.id,
          userAgent: navigator.userAgent,
        })
      }
    }

    loadEvent()
  }, [params.id, user])

  if (loading) {
    return (
      <FuturisticBackground>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted">Cargando evento...</p>
          </div>
        </div>
      </FuturisticBackground>
    )
  }

  if (!event) {
    return (
      <FuturisticBackground>
        <div className="flex min-h-screen items-center justify-center">
          <GlassCard className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Evento no encontrado</h2>
            <p className="text-muted mb-4">El evento que buscas no existe o ha sido eliminado</p>
            <Link href="/discover">
              <GradientButton>Explorar Eventos</GradientButton>
            </Link>
          </GlassCard>
        </div>
      </FuturisticBackground>
    )
  }

  const isOrganizer = event.organizerId === user?.id
  const availableSpots = event.capacity - event.registrations
  const eventEnded = new Date(event.endDate) < new Date()
  const eventDurationDays = Math.ceil(
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Enlace copiado al portapapeles")
  }

  return (
    <FuturisticBackground>
      <div className="flex min-h-screen">
        {isAuthenticated && <Sidebar />}

        <div className={`flex-1 ${isAuthenticated ? "lg:ml-64" : ""}`}>
          {isAuthenticated && <Header />}

          <main className="p-6 space-y-6">
            {/* Hero Section */}
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img
                src={
                  event.coverImage ||
                  `/placeholder.svg?height=400&width=1200&query=${encodeURIComponent(event.title) || "/placeholder.svg"}`
                }
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                        {event.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === "published"
                            ? "bg-success/20 text-success border border-success/30"
                            : "bg-warning/20 text-warning border border-warning/30"
                        }`}
                      >
                        {event.status === "published" ? "Publicado" : "Borrador"}
                      </span>
                      {eventEnded && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-error/20 text-error border border-error/30">
                          Finalizado
                        </span>
                      )}
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">{event.title}</h1>
                    <p className="text-muted max-w-2xl">{event.description}</p>
                  </div>

                  <div className="flex gap-2">
                    {isOrganizer && (
                      <Link href={`/events/${event.slug}/${event.id}/edit-map`}>
                        <GradientButton className="gap-2">
                          <Edit className="w-4 h-4" />
                          Editar Mapa
                        </GradientButton>
                      </Link>
                    )}
                    <GradientButton variant="outline" onClick={handleShare} glow={false} className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Compartir
                    </GradientButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <GlassCard hover>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary-hover">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Fecha Inicio</p>
                    <p className="font-semibold text-foreground">
                      {new Date(event.startDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard hover>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-secondary to-secondary-hover">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Fecha Fin</p>
                    <p className="font-semibold text-foreground">
                      {new Date(event.endDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard hover>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-accent-pink to-accent-orange">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Ubicación</p>
                    <p className="font-semibold text-foreground line-clamp-1">{event.location}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard hover>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-accent-lime to-success">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Disponibles</p>
                    <p className="font-semibold text-foreground">
                      {availableSpots} / {event.capacity}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {event.aboutEvent && (
              <GlassCard>
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold gradient-text">Acerca del Evento</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-muted">Tipo de Evento:</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary/20 text-primary border border-primary/30">
                      {event.eventType === "presencial"
                        ? "Presencial"
                        : event.eventType === "virtual"
                          ? "Virtual"
                          : "No Definido"}
                    </span>
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{event.aboutEvent}</p>
                </div>
              </GlassCard>
            )}

            {event.eventType === "presencial" && event.eventLink && (
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Ubicación en Google Maps</h3>
                    <p className="text-sm text-muted">Encuentra cómo llegar al evento</p>
                  </div>
                  <a href={event.eventLink} target="_blank" rel="noopener noreferrer">
                    <GradientButton className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Ver en Maps
                    </GradientButton>
                  </a>
                </div>
              </GlassCard>
            )}

            {event.eventType === "virtual" && event.eventLink && (
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Enlace de Reunión Virtual</h3>
                    <p className="text-sm text-muted">Únete al evento en línea</p>
                  </div>
                  <a href={event.eventLink} target="_blank" rel="noopener noreferrer">
                    <GradientButton className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Unirse
                    </GradientButton>
                  </a>
                </div>
              </GlassCard>
            )}

            {((event.galleryImages && event.galleryImages.length > 0) || (event.videos && event.videos.length > 0)) && (
              <GlassCard>
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold gradient-text">Galería</h2>
                </div>

                {event.galleryImages && event.galleryImages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Imágenes
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {event.galleryImages.map((img: string, index: number) => (
                        <div
                          key={index}
                          className="relative group overflow-hidden rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                        >
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {event.videos && event.videos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Videos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.videos.map((video: string, index: number) => (
                        <div key={index} className="relative overflow-hidden rounded-lg border border-border/50">
                          <video src={video} controls className="w-full h-64 object-cover bg-black" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            )}

            {event.hasCustomForm && event.customFormFields && event.customFormFields.length > 0 && (
              <FormRenderer
                fields={event.customFormFields}
                eventId={event.id}
                eventEnded={eventEnded}
                onSubmit={() => {
                  toast.success("Formulario enviado exitosamente")
                }}
              />
            )}

            {event.schedule && event.schedule.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold gradient-text">Cronograma del Evento</h2>
                  </div>
                  {isOrganizer && (
                    <Link href={`/events/${event.slug}/${event.id}/schedule`}>
                      <GradientButton variant="outline" glow={false} className="gap-2">
                        <Edit className="w-4 h-4" />
                        Editar Cronograma
                      </GradientButton>
                    </Link>
                  )}
                </div>
                <ScheduleDisplay schedule={event.schedule} eventDurationDays={eventDurationDays} />
              </div>
            )}

            {/* 3D Venue Viewer */}
            <GlassCard className="p-0 overflow-hidden">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-2xl font-bold gradient-text">Explora el Espacio en 3D</h2>
                <p className="text-muted mt-1">Visualización inmersiva del venue del evento</p>
              </div>

              <div className="h-[600px] p-6">
                <VenueViewer markers={event.map3DConfig.markers} />
              </div>
            </GlassCard>

            {/* Registration CTA */}
            {!isOrganizer && !eventEnded && (
              <GlassCard className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent-pink/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">¿Listo para asistir?</h3>
                    <p className="text-muted">
                      Regístrate ahora y asegura tu lugar en este increíble evento. Quedan {availableSpots} lugares
                      disponibles.
                    </p>
                  </div>
                  <GradientButton
                    size="lg"
                    className="gap-2"
                    onClick={() => (isAuthenticated ? setShowRegisterModal(true) : router.push("/login"))}
                  >
                    <UserPlus className="w-5 h-5" />
                    Registrarse Ahora
                  </GradientButton>
                </div>
              </GlassCard>
            )}

            {/* Organizer Actions */}
            {isOrganizer && (
              <GlassCard>
                <h3 className="text-xl font-bold text-foreground mb-4">Acciones del Organizador</h3>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/events/${event.slug}/${event.id}/guests`}>
                    <GradientButton variant="secondary" className="gap-2">
                      <Users className="w-4 h-4" />
                      Gestionar Invitados ({event.registrations})
                    </GradientButton>
                  </Link>
                  <Link href={`/events/${event.slug}/${event.id}/schedule`}>
                    <GradientButton variant="secondary" className="gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Gestionar Cronograma
                    </GradientButton>
                  </Link>
                  {event.hasCustomForm && (
                    <Link href={`/events/${event.slug}/${event.id}/form-responses`}>
                      <GradientButton variant="secondary" className="gap-2">
                        <Users className="w-4 h-4" />
                        Ver Respuestas del Formulario
                      </GradientButton>
                    </Link>
                  )}
                  <Link href={`/events/${event.slug}/${event.id}/edit`}>
                    <GradientButton variant="outline" glow={false} className="gap-2">
                      <Edit className="w-4 h-4" />
                      Editar Evento
                    </GradientButton>
                  </Link>
                  <div className="ml-auto text-sm text-muted flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {event.visitCount} visitas
                  </div>
                </div>
              </GlassCard>
            )}
          </main>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <RegistrationModal
          event={event}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            router.refresh()
          }}
        />
      )}
    </FuturisticBackground>
  )
}
