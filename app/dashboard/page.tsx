"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FuturisticBackground } from "@/components/futuristic-background"
import { Calendar, Users, TrendingUp, Plus, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { events } = useEventsStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const myEvents = events.filter((event) => event.organizerId === user?.id)
  const upcomingEvents = myEvents.filter((event) => new Date(event.startDate) > new Date())

  const stats = [
    {
      label: "Eventos Creados",
      value: myEvents.length,
      icon: Calendar,
      color: "from-[#f1c6ff] to-[#ffddff]",
      glow: "glow-primary" as const,
    },
    {
      label: "Próximos Eventos",
      value: upcomingEvents.length,
      icon: TrendingUp,
      color: "from-[#ffddff] to-[#f1c6ff]",
      glow: "glow-secondary" as const,
    },
    {
      label: "Total Asistentes",
      value: myEvents.reduce((acc, event) => acc + event.registrations, 0),
      icon: Users,
      color: "from-[#f1c6ff] to-[#ffddff]",
      glow: "glow-pink" as const,
    },
  ]

  return (
    <FuturisticBackground>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 lg:ml-64">
          <Header />

          <main className="p-6 space-y-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f1c6ff]/20 via-[#ffddff]/20 to-[#f1c6ff]/20 blur-3xl" />
              <GlassCard className="relative" glow="primary">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#e2e2e2] mb-2">¡Bienvenido, {user?.name}! 👋</h1>
                    <p className="text-[#78767b]">Gestiona tus eventos con visualización 3D inmersiva</p>
                  </div>
                  <Link href="/events/create">
                    <GradientButton size="lg" className="gap-2">
                      <Plus className="w-5 h-5" />
                      Crear Evento
                    </GradientButton>
                  </Link>
                </div>
              </GlassCard>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <GlassCard key={stat.label} hover glow={stat.glow} className="relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#78767b] mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold text-[#e2e2e2]">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-[#1e1732]" />
                    </div>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                </GlassCard>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Events */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#e2e2e2]">Eventos Recientes</h2>
                  <Link href="/events" className="text-sm text-[#f1c6ff] hover:text-[#ffddff] transition-colors">
                    Ver todos
                  </Link>
                </div>

                {myEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f1c6ff]/20 to-[#ffddff]/20 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-[#78767b]" />
                    </div>
                    <p className="text-[#78767b] mb-4">Aún no has creado eventos</p>
                    <Link href="/events/create">
                      <GradientButton size="sm">Crear tu primer evento</GradientButton>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myEvents.slice(0, 3).map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}/${event.id}`}
                        className="block p-4 rounded-lg bg-[#2a2440]/50 hover:bg-[#2a2440] transition-all border border-[#f1c6ff]/20 hover:border-[#f1c6ff]/50"
                      >
                        <h3 className="font-semibold text-[#e2e2e2] mb-1">{event.title}</h3>
                        <p className="text-sm text-[#78767b]">
                          {new Date(event.startDate).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Getting Started */}
              <GlassCard className="bg-gradient-to-br from-[#f1c6ff]/10 to-[#ffddff]/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#f1c6ff] to-[#ffddff] glow-primary">
                    <Sparkles className="w-6 h-6 text-[#1e1732]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#e2e2e2] mb-2">Comienza con HYPE</h2>
                    <ul className="space-y-2 text-sm text-[#78767b] mb-4">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#f1c6ff]" />
                        Crea tu primer evento
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ffddff]" />
                        Diseña el espacio en 3D
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#f1c6ff]" />
                        Comparte con asistentes
                      </li>
                    </ul>
                    <Link href="/events/create">
                      <GradientButton size="sm">Empezar ahora</GradientButton>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </div>
          </main>
        </div>
      </div>
    </FuturisticBackground>
  )
}
