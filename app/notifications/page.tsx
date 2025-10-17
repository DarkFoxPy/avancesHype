"use client"

import { useState } from "react"
import { useNotificationsStore } from "@/lib/stores/notifications-store"
import { FuturisticBackground } from "@/components/futuristic-background"
import { Sidebar } from "@/components/layout/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle2, Calendar, Users, AlertCircle, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationsStore()
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "registration":
        return <Users className="w-5 h-5" />
      case "event":
        return <Calendar className="w-5 h-5" />
      case "system":
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "registration":
        return "from-[#f1c6ff] to-[#f1c6ff]/50"
      case "event":
        return "from-[#ffddff] to-[#ffddff]/50"
      case "system":
        return "from-[#78767b] to-[#78767b]/50"
      default:
        return "from-[#f1c6ff] to-[#ffddff]"
    }
  }

  return (
    <FuturisticBackground>
      <Sidebar />

      <div className="min-h-screen p-6 lg:pl-72">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-[#ffddff]">Notificaciones</h1>
              {unreadCount > 0 && (
                <Badge variant="outline" className="bg-[#f1c6ff]/10 text-[#f1c6ff] border-[#f1c6ff]/30">
                  {unreadCount} sin leer
                </Badge>
              )}
            </div>
            <p className="text-[#e2e2e2]">Mantente al día con tus eventos y registros</p>
          </div>

          {/* Actions */}
          <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    filter === "all"
                      ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                      : "bg-[#2a1f3d]/50 text-[#e2e2e2] hover:text-[#ffddff]"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    filter === "unread"
                      ? "bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                      : "bg-[#2a1f3d]/50 text-[#e2e2e2] hover:text-[#ffddff]"
                  }`}
                >
                  Sin leer
                </button>
              </div>

              {unreadCount > 0 && (
                <Button
                  size="sm"
                  onClick={markAllAsRead}
                  className="gap-2 bg-gradient-to-r from-[#f1c6ff] to-[#ffddff] text-[#1e1732]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-[#1e1732]/80 backdrop-blur-sm border border-[#f1c6ff]/30 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#f1c6ff]/10 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-[#f1c6ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#ffddff]">No hay notificaciones</h3>
              <p className="text-[#e2e2e2]">
                {filter === "unread"
                  ? "No tienes notificaciones sin leer"
                  : "Cuando recibas notificaciones, aparecerán aquí"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-[#1e1732]/80 backdrop-blur-sm border rounded-xl p-4 transition-all hover:scale-[1.02] ${
                    !notification.read ? "border-[#f1c6ff]/50" : "border-[#f1c6ff]/30"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center flex-shrink-0 ${
                        !notification.read ? "shadow-lg shadow-[#f1c6ff]/50" : ""
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-semibold ${!notification.read ? "text-[#ffddff]" : "text-[#e2e2e2]"}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && <div className="w-2 h-2 rounded-full bg-[#f1c6ff] flex-shrink-0 mt-2" />}
                      </div>
                      <p className="text-sm text-[#e2e2e2] mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#78767b]">
                          {format(new Date(notification.createdAt), "PPp", { locale: es })}
                        </span>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-[#f1c6ff] hover:underline"
                            >
                              Marcar como leída
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-400 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Eliminar
                          </button>
                        </div>
                      </div>
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
