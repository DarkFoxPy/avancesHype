"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useEventsStore } from "@/lib/stores/events-store"
import { useRegistrationsStore } from "@/lib/stores/registrations-store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import {
  ArrowLeft,
  Search,
  Filter,
  Check,
  X,
  Download,
  Mail,
  Phone,
  Clock,
  Users,
  UserCheck,
  UserX,
} from "lucide-react"
import toast from "react-hot-toast"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const STATUS_COLORS = {
  pending: { bg: "bg-warning/20", text: "text-warning", border: "border-warning/30" },
  approved: { bg: "bg-success/20", text: "text-success", border: "border-success/30" },
  rejected: { bg: "bg-error/20", text: "text-error", border: "border-error/30" },
}

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"]

export default function GuestsPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const { getEventById } = useEventsStore()
  const { getRegistrationsByEvent, updateRegistration, deleteRegistration } = useRegistrationsStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const event = getEventById(params.id as string)
  const registrations = event ? getRegistrationsByEvent(event.id) : []

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!event) {
      router.push("/events")
      return
    }

    if (event.organizerId !== user?.id) {
      router.push(`/events/${event.id}`)
      toast.error("No tienes permisos para ver esta página")
    }
  }, [isAuthenticated, event, user, router])

  if (!event || event.organizerId !== user?.id) {
    return null
  }

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.userEmail.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || reg.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: registrations.length,
    approved: registrations.filter((r) => r.status === "approved").length,
    pending: registrations.filter((r) => r.status === "pending").length,
    rejected: registrations.filter((r) => r.status === "rejected").length,
  }

  const pieData = [
    { name: "Aprobados", value: stats.approved },
    { name: "Pendientes", value: stats.pending },
    { name: "Rechazados", value: stats.rejected },
  ]

  const handleApprove = (id: string) => {
    updateRegistration(id, { status: "approved" })
    toast.success("Registro aprobado")
  }

  const handleReject = (id: string) => {
    updateRegistration(id, { status: "rejected" })
    toast.success("Registro rechazado")
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      deleteRegistration(id)
      toast.success("Registro eliminado")
    }
  }

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ["Nombre", "Email", "Teléfono", "Estado", "Fecha de Registro"]
      const rows = filteredRegistrations.map((reg) => [
        reg.userName,
        reg.userEmail,
        reg.phone || "N/A",
        reg.status === "approved" ? "Aprobado" : reg.status === "pending" ? "Pendiente" : "Rechazado",
        new Date(reg.registeredAt).toLocaleDateString("es-ES"),
      ])

      const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute(
        "download",
        `invitados-${event.title.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`,
      )
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Lista de invitados exportada exitosamente")
    } catch (error) {
      toast.error("Error al exportar la lista")
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header />

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/events/${event.id}`}>
                <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gestión de Invitados</h1>
                <p className="text-muted">{event.title}</p>
              </div>
            </div>

            <GradientButton onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Exportar Lista
            </GradientButton>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard hover glow="primary">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary-hover">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted">Total Registros</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard hover glow="none">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-success to-success/80">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted">Aprobados</p>
                  <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard hover glow="none">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-warning to-warning/80">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted">Pendientes</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard hover glow="none">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-error to-error/80">
                  <UserX className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted">Rechazados</p>
                  <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-lg font-bold text-foreground mb-4">Distribución de Estados</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30, 27, 75, 0.9)",
                      border: "1px solid rgba(147, 51, 234, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-bold text-foreground mb-4">Capacidad del Evento</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Ocupación</span>
                    <span className="font-semibold text-foreground">
                      {stats.approved} / {event.capacity}
                    </span>
                  </div>
                  <div className="h-4 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                      style={{ width: `${(stats.approved / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 rounded-lg bg-surface/50">
                    <p className="text-3xl font-bold gradient-text">{event.capacity - stats.approved}</p>
                    <p className="text-sm text-muted mt-1">Lugares Disponibles</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-surface/50">
                    <p className="text-3xl font-bold text-foreground">
                      {Math.round((stats.approved / event.capacity) * 100)}%
                    </p>
                    <p className="text-sm text-muted mt-1">Ocupación</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <GlassCard>
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted"
                  />
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-4">
              <GlassCard>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="flex-1 bg-transparent border-none outline-none text-foreground cursor-pointer"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="approved">Aprobados</option>
                    <option value="pending">Pendientes</option>
                    <option value="rejected">Rechazados</option>
                  </select>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Registrations Table */}
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Contacto</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Fecha Registro</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Estado</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="text-muted">No se encontraron registros</div>
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((registration) => (
                      <tr
                        key={registration.id}
                        className="border-b border-border/50 hover:bg-surface/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="font-medium text-foreground">{registration.userName}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted">
                              <Mail className="w-3 h-3" />
                              {registration.userEmail}
                            </div>
                            {registration.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted">
                                <Phone className="w-3 h-3" />
                                {registration.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-muted">
                            {new Date(registration.registeredAt).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[registration.status].bg} ${STATUS_COLORS[registration.status].text} border ${STATUS_COLORS[registration.status].border}`}
                          >
                            {registration.status === "approved"
                              ? "Aprobado"
                              : registration.status === "pending"
                                ? "Pendiente"
                                : "Rechazado"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {registration.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(registration.id)}
                                  className="p-2 rounded-lg bg-success/20 hover:bg-success/30 text-success transition-all"
                                  title="Aprobar"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(registration.id)}
                                  className="p-2 rounded-lg bg-error/20 hover:bg-error/30 text-error transition-all"
                                  title="Rechazar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(registration.id)}
                              className="p-2 rounded-lg bg-surface hover:bg-surface/80 text-muted hover:text-error transition-all"
                              title="Eliminar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  )
}
