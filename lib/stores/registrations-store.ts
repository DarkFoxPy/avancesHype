import { create } from "zustand"
import type { Registration } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface RegistrationsState {
  registrations: Registration[]
  loading: boolean
  addRegistration: (registration: Omit<Registration, "id" | "registeredAt">) => Promise<Registration>
  updateRegistration: (id: string, data: Partial<Registration>) => Promise<void>
  deleteRegistration: (id: string) => Promise<void>
  getRegistrationsByEvent: (eventId: string) => Promise<Registration[]>
  fetchRegistrations: () => Promise<void>
}

export const useRegistrationsStore = create<RegistrationsState>((set, get) => ({
  registrations: [],
  loading: false,

  addRegistration: async (registrationData) => {
    const supabase = createClient()
    set({ loading: true })

    try {
      const { data, error } = await supabase
        .from("registrations")
        .insert({
          event_id: registrationData.eventId,
          user_id: registrationData.userId,
          user_name: registrationData.userName,
          user_email: registrationData.userEmail,
          phone: registrationData.phone,
          status: registrationData.status,
          time_slot: registrationData.timeSlot,
          custom_answers: registrationData.customAnswers,
          qr_code: registrationData.qrCode,
        })
        .select()
        .single()

      if (error) throw error

      const newRegistration: Registration = {
        id: data.id,
        eventId: data.event_id,
        userId: data.user_id,
        userName: data.user_name,
        userEmail: data.user_email,
        phone: data.phone,
        status: data.status,
        timeSlot: data.time_slot,
        customAnswers: data.custom_answers,
        qrCode: data.qr_code,
        registeredAt: new Date(data.registered_at),
      }

      // Update event registrations count
      await supabase.rpc("increment_event_registrations", {
        event_id: registrationData.eventId,
      })

      set((state) => ({
        registrations: [...state.registrations, newRegistration],
      }))

      return newRegistration
    } finally {
      set({ loading: false })
    }
  },

  updateRegistration: async (id, registrationData) => {
    const supabase = createClient()
    set({ loading: true })

    try {
      const updateData: any = {}

      if (registrationData.status) updateData.status = registrationData.status
      if (registrationData.timeSlot !== undefined) updateData.time_slot = registrationData.timeSlot
      if (registrationData.customAnswers) updateData.custom_answers = registrationData.customAnswers
      if (registrationData.qrCode !== undefined) updateData.qr_code = registrationData.qrCode

      const { error } = await supabase.from("registrations").update(updateData).eq("id", id)

      if (error) throw error

      set((state) => ({
        registrations: state.registrations.map((reg) => (reg.id === id ? { ...reg, ...registrationData } : reg)),
      }))
    } finally {
      set({ loading: false })
    }
  },

  deleteRegistration: async (id) => {
    const supabase = createClient()
    set({ loading: true })

    try {
      const registration = get().registrations.find((r) => r.id === id)

      const { error } = await supabase.from("registrations").delete().eq("id", id)

      if (error) throw error

      // Decrement event registrations count
      if (registration) {
        await supabase.rpc("decrement_event_registrations", {
          event_id: registration.eventId,
        })
      }

      set((state) => ({
        registrations: state.registrations.filter((reg) => reg.id !== id),
      }))
    } finally {
      set({ loading: false })
    }
  },

  getRegistrationsByEvent: async (eventId) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", eventId)
      .order("registered_at", { ascending: false })

    if (error) return []

    return data.map((reg) => ({
      id: reg.id,
      eventId: reg.event_id,
      userId: reg.user_id,
      userName: reg.user_name,
      userEmail: reg.user_email,
      phone: reg.phone,
      status: reg.status,
      timeSlot: reg.time_slot,
      customAnswers: reg.custom_answers,
      qrCode: reg.qr_code,
      registeredAt: new Date(reg.registered_at),
    }))
  },

  fetchRegistrations: async () => {
    const supabase = createClient()
    set({ loading: true })

    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("registered_at", { ascending: false })

      if (error) throw error

      const registrations: Registration[] = data.map((reg) => ({
        id: reg.id,
        eventId: reg.event_id,
        userId: reg.user_id,
        userName: reg.user_name,
        userEmail: reg.user_email,
        phone: reg.phone,
        status: reg.status,
        timeSlot: reg.time_slot,
        customAnswers: reg.custom_answers,
        qrCode: reg.qr_code,
        registeredAt: new Date(reg.registered_at),
      }))

      set({ registrations })
    } finally {
      set({ loading: false })
    }
  },
}))
