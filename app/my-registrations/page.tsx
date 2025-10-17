"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { useRegistrationsStore } from "@/lib/stores/registrations-store"
import { FuturisticBackground } from "@/components/futuristic-background"
import { Sidebar } from "@/components/layout/sidebar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Search, ExternalLink, CheckCircle2, Clock, XCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function MyRegistrationsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { events } = useEventsStore()
  const { registrations } = useRegistrationsStore()
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrar registros del usuario actual
  const myRegistrations = registrations.filter((reg) => reg.userId === user?.id)

  // Obtener eventos con sus registros
  const registeredEvents = myRegistrations
    .map((reg) => {
      const event = events.find((e) => e.id === reg.eventId)
      return { ...reg, event }
    })
    .filter((item) => item.event)

  // Filtrar por búsqueda
  const filteredRegistrations = registeredEvents.filter(
    (item) =>
      item.event?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.event?.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Estadísticas
  const stats = {
    total: myRegistrations.length,
    approved: myRegistrations.filter((r) => r.status === "approved").length,
    pending: myRegistrations.filter((r) => r.status === "pending").length,
    rejected: myRegistrations.filter((r) => r.status === "rejected").length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/30"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/30"
      default:
        return ""
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobado"
      case "pending":
        return "Pendiente"
      case "rejected":
        return "Rechazado"
      default:
        return status
    }
  }

  return (
    <FuturisticBackground>
      <Sidebar />

      <div className="min-h-screen p-6 lg:pl-72">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-[#ffddff]">Mis Registros</h1>
            <p className="text-[#e2e2e2]">Eventos a los que te has registrado</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#f1c6ff]">{stats.total}</div>
              <div className="text-sm text-[#e2e2e2]">Total</div>
            </div>
            <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
              <div className="text-sm text-[#e2e2e2]">Aprobados</div>
            </div>
            <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-[#e2e2e2]">Pendientes</div>
            </div>
            <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
              <div className="text-sm text-[#e2e2e2]">Rechazados</div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78767b]" />
              <Input
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#2a1f3d]/50 border-[#f1c6ff]/20 text-[#ffddff]"
              />
            </div>
          </div>

          {/* Registrations List */}
          {filteredRegistrations.length === 0 ? (
            <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#f1c6ff]/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-[#f1c6ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#ffddff]">No hay registros</h3>
              <p className="text-[#e2e2e2] mb-6">
                {searchQuery
                  ? "No se encontraron eventos con ese criterio"
                  : "Aún no te has registrado a ningún evento"}
              </p>
              <Button
                onClick={() => router.push("/discover")}
                className="bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
              >
                Descubrir Eventos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-6 hover:scale-[1.02] transition-transform"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Event Image */}
                    <div className="w-full md:w-48 h-32 rounded-lg bg-gradient-to-br from-[#f1c6ff]/20 to-[#ffddff]/20 flex-shrink-0" />

                    {/* Event Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1 text-[#ffddff]">{item.event?.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className={getStatusColor(item.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(item.status)}
                                {getStatusText(item.status)}
                              </span>
                            </Badge>
                            <Badge variant="outline" className="border-[#f1c6ff]/30 text-[#f1c6ff]">
                              {item.event?.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-[#e2e2e2]">
                          <Calendar className="w-4 h-4" />
                          <span>{item.event?.date && format(new Date(item.event.date), "PPP", { locale: es })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#e2e2e2]">
                          <MapPin className="w-4 h-4" />
                          <span>{item.event?.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#e2e2e2]">
                          <Users className="w-4 h-4" />
                          <span>Registrado el {format(new Date(item.registeredAt), "PP", { locale: es })}</span>
                        </div>
                      </div>

                      {item.status === "approved" && (
                        <div className="pt-3 border-t border-[#f1c6ff]/20">
                          <Button
                            size="sm"
                            onClick={() => router.push(`/events/${item.event?.slug}/${item.eventId}`)}
                            className="gap-2 bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                          >
                            Ver Evento
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FuturisticBackground>
  )
}
