import { create } from "zustand"
import type { Event } from "@/lib/types"

interface EventsState {
  events: Event[]
  loading: boolean
  addEvent: (
    event: Omit<Event, "id" | "createdAt" | "updatedAt" | "slug" | "visitCount" | "registrations">,
  ) => Promise<Event>
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  getEventById: (id: string) => Promise<Event | null>
  getEventBySlug: (slug: string) => Promise<Event | null>
  getEventsByOrganizer: (organizerId: string) => Promise<Event[]>
  fetchEvents: () => Promise<void>
  publishEvent: (id: string) => Promise<void>
  incrementVisitCount: (
    eventId: string,
    visitorData?: { ip?: string; userAgent?: string; userId?: string },
  ) => Promise<void>
}

function transformEvent(data: any): Event {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    durationDays: data.duration_days,
    location: data.location,
    eventType: data.event_type,
    eventLink: data.event_link,
    category: data.category,
    capacity: data.capacity,
    unlimitedCapacity: Boolean(data.unlimited_capacity),
    registrations: data.registrations || 0,
    isPublic: Boolean(data.is_public),
    requiresApproval: Boolean(data.requires_approval),
    organizerId: data.organizer_id,
    map3DConfig: typeof data.map_3d_config === "string" ? JSON.parse(data.map_3d_config) : data.map_3d_config,
    mapJsonFile: data.map_json_file,
    coverImage: data.cover_image,
    galleryImages:
      typeof data.gallery_images === "string" ? JSON.parse(data.gallery_images) : data.gallery_images || [],
    videos: typeof data.videos === "string" ? JSON.parse(data.videos) : data.videos || [],
    schedule: typeof data.schedule === "string" ? JSON.parse(data.schedule) : data.schedule || [],
    scheduleJsonFile: data.schedule_json_file,
    hasCustomForm: Boolean(data.has_custom_form),
    customFormFields:
      typeof data.custom_form_fields === "string" ? JSON.parse(data.custom_form_fields) : data.custom_form_fields || [],
    aboutEvent: data.about_event,
    visitCount: data.visit_count || 0,
    status: data.status,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  loading: false,

  addEvent: async (eventData) => {
    set({ loading: true })

    try {
      console.log("[v0] Calling API to create event:", eventData)

      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventData.title,
          description: eventData.description,
          startDate: eventData.startDate.toISOString(),
          endDate: eventData.endDate.toISOString(),
          location: eventData.location,
          eventType: eventData.eventType,
          eventLink: eventData.eventLink,
          category: eventData.category,
          capacity: eventData.capacity,
          unlimitedCapacity: eventData.unlimitedCapacity,
          isPublic: eventData.isPublic,
          requiresApproval: eventData.requiresApproval,
          map3DConfig: eventData.map3DConfig,
          mapJsonFile: eventData.mapJsonFile,
          coverImage: eventData.coverImage,
          galleryImages: eventData.galleryImages,
          videos: eventData.videos,
          schedule: eventData.schedule,
          scheduleJsonFile: eventData.scheduleJsonFile,
          hasCustomForm: eventData.hasCustomForm,
          customFormFields: eventData.customFormFields,
          aboutEvent: eventData.aboutEvent,
          status: eventData.status,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] API error response:", error)
        throw new Error(error.error || "Failed to create event")
      }

      const { event } = await response.json()
      console.log("[v0] Event created successfully:", event)

      const newEvent = transformEvent(event)

      set((state) => ({ events: [...state.events, newEvent] }))
      return newEvent
    } catch (error) {
      console.error("[v0] Error in addEvent:", error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateEvent: async (id, eventData) => {
    set({ loading: true })

    try {
      const updateData: any = {}

      if (eventData.title) updateData.title = eventData.title
      if (eventData.description) updateData.description = eventData.description
      if (eventData.startDate) updateData.startDate = eventData.startDate.toISOString()
      if (eventData.endDate) updateData.endDate = eventData.endDate.toISOString()
      if (eventData.location !== undefined) updateData.location = eventData.location
      if (eventData.eventType) updateData.eventType = eventData.eventType
      if (eventData.eventLink !== undefined) updateData.eventLink = eventData.eventLink
      if (eventData.category) updateData.category = eventData.category
      if (eventData.capacity !== undefined) updateData.capacity = eventData.capacity
      if (eventData.unlimitedCapacity !== undefined) updateData.unlimitedCapacity = eventData.unlimitedCapacity
      if (eventData.isPublic !== undefined) updateData.isPublic = eventData.isPublic
      if (eventData.requiresApproval !== undefined) updateData.requiresApproval = eventData.requiresApproval
      if (eventData.map3DConfig) updateData.map3DConfig = eventData.map3DConfig
      if (eventData.mapJsonFile !== undefined) updateData.mapJsonFile = eventData.mapJsonFile
      if (eventData.coverImage !== undefined) updateData.coverImage = eventData.coverImage
      if (eventData.galleryImages) updateData.galleryImages = eventData.galleryImages
      if (eventData.videos) updateData.videos = eventData.videos
      if (eventData.schedule) updateData.schedule = eventData.schedule
      if (eventData.scheduleJsonFile !== undefined) updateData.scheduleJsonFile = eventData.scheduleJsonFile
      if (eventData.hasCustomForm !== undefined) updateData.hasCustomForm = eventData.hasCustomForm
      if (eventData.customFormFields) updateData.customFormFields = eventData.customFormFields
      if (eventData.aboutEvent !== undefined) updateData.aboutEvent = eventData.aboutEvent
      if (eventData.status) updateData.status = eventData.status

      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, ...eventData, updatedAt: new Date() } : event,
        ),
      }))
    } finally {
      set({ loading: false })
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true })

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
      }))
    } finally {
      set({ loading: false })
    }
  },

  getEventById: async (id) => {
    try {
      const response = await fetch(`/api/events/${id}`)

      if (!response.ok) {
        return null
      }

      const { event } = await response.json()
      return transformEvent(event)
    } catch (error) {
      console.error("[v0] Error fetching event by ID:", error)
      return null
    }
  },

  getEventBySlug: async (slug) => {
    try {
      const response = await fetch(`/api/events/slug/${slug}`)

      if (!response.ok) {
        return null
      }

      const { event } = await response.json()
      return transformEvent(event)
    } catch (error) {
      console.error("[v0] Error fetching event by slug:", error)
      return null
    }
  },

  getEventsByOrganizer: async (organizerId) => {
    try {
      const response = await fetch(`/api/events/organizer/${organizerId}`)

      if (!response.ok) {
        return []
      }

      const { events } = await response.json()
      return events.map(transformEvent)
    } catch (error) {
      console.error("[v0] Error fetching organizer events:", error)
      return []
    }
  },

  fetchEvents: async () => {
    set({ loading: true })

    try {
      const response = await fetch("/api/events")

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const { events } = await response.json()
      set({ events: events.map(transformEvent) })
    } finally {
      set({ loading: false })
    }
  },

  publishEvent: async (id) => {
    set({ loading: true })

    try {
      const response = await fetch(`/api/events/${id}/publish`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to publish event")
      }

      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, status: "published", updatedAt: new Date() } : event,
        ),
      }))
    } finally {
      set({ loading: false })
    }
  },

  incrementVisitCount: async (eventId, visitorData) => {
    try {
      await fetch(`/api/events/${eventId}/visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitorData || {}),
      })
    } catch (error) {
      console.error("[v0] Failed to track visit:", error)
    }
  },
}))
