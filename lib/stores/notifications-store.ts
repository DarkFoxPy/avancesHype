import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Notification } from "@/lib/types"

interface NotificationsState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearNotifications: () => void
  unreadCount: () => number
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "1",
          type: "registration",
          title: "Nuevo registro",
          message: "María García se ha registrado a tu evento 'Tech Summit 2025'",
          read: false,
          createdAt: new Date("2025-01-15T10:30:00"),
        },
        {
          id: "2",
          type: "event",
          title: "Evento próximo",
          message: "Tu evento 'Tech Summit 2025' comienza en 3 días",
          read: false,
          createdAt: new Date("2025-01-16T09:00:00"),
        },
        {
          id: "3",
          type: "system",
          title: "Bienvenido a HYPE",
          message: "Explora todas las funcionalidades de la plataforma",
          read: true,
          createdAt: new Date("2025-01-10T08:00:00"),
        },
      ],

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          read: false,
          createdAt: new Date(),
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
        }))
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((notif) => notif.id !== id),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      unreadCount: () => {
        return get().notifications.filter((notif) => !notif.read).length
      },
    }),
    {
      name: "notifications-storage",
    },
  ),
)
