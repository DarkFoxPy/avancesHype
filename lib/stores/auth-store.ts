import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    name: string
    username: string
    role: "participant" | "coordinator"
    companyName?: string
    ruc?: string
    businessSector?: string
  }) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Login failed")
        }

        const { user } = await response.json()
        set({ user, isAuthenticated: true })
      },

      register: async (data) => {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Registration failed")
        }
      },

      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: async (data) => {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to update profile")
        }

        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },

      fetchUser: async () => {
        const response = await fetch("/api/auth/me")
        const { user } = await response.json()

        if (user) {
          set({ user, isAuthenticated: true })
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
