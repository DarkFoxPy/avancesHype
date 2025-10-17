import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"
import { getUserFromRequest } from "@/lib/auth/session"

// GET /api/events/[id] - Get event by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(params.id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error("[v0] Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Updating event:", params.id, body)

    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(params.id) as any

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.organizer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updates: string[] = []
    const values: any[] = []

    if (body.title !== undefined) {
      updates.push("title = ?")
      values.push(body.title)
    }
    if (body.description !== undefined) {
      updates.push("description = ?")
      values.push(body.description)
    }
    if (body.startDate !== undefined) {
      updates.push("start_date = ?")
      values.push(body.startDate)
    }
    if (body.endDate !== undefined) {
      updates.push("end_date = ?")
      values.push(body.endDate)
    }
    if (body.location !== undefined) {
      updates.push("location = ?")
      values.push(body.location)
    }
    if (body.eventType !== undefined) {
      updates.push("event_type = ?")
      values.push(body.eventType)
    }
    if (body.eventLink !== undefined) {
      updates.push("event_link = ?")
      values.push(body.eventLink)
    }
    if (body.category !== undefined) {
      updates.push("category = ?")
      values.push(body.category)
    }
    if (body.capacity !== undefined) {
      updates.push("capacity = ?")
      values.push(body.capacity)
    }
    if (body.unlimitedCapacity !== undefined) {
      updates.push("unlimited_capacity = ?")
      values.push(body.unlimitedCapacity ? 1 : 0)
    }
    if (body.isPublic !== undefined) {
      updates.push("is_public = ?")
      values.push(body.isPublic ? 1 : 0)
    }
    if (body.requiresApproval !== undefined) {
      updates.push("requires_approval = ?")
      values.push(body.requiresApproval ? 1 : 0)
    }
    if (body.map3DConfig !== undefined) {
      updates.push("map_3d_config = ?")
      values.push(JSON.stringify(body.map3DConfig))
    }
    if (body.mapJsonFile !== undefined) {
      updates.push("map_json_file = ?")
      values.push(body.mapJsonFile)
    }
    if (body.coverImage !== undefined) {
      updates.push("cover_image = ?")
      values.push(body.coverImage)
    }
    if (body.galleryImages !== undefined) {
      updates.push("gallery_images = ?")
      values.push(JSON.stringify(body.galleryImages))
    }
    if (body.videos !== undefined) {
      updates.push("videos = ?")
      values.push(JSON.stringify(body.videos))
    }
    if (body.schedule !== undefined) {
      updates.push("schedule = ?")
      values.push(JSON.stringify(body.schedule))
    }
    if (body.scheduleJsonFile !== undefined) {
      updates.push("schedule_json_file = ?")
      values.push(body.scheduleJsonFile)
    }
    if (body.hasCustomForm !== undefined) {
      updates.push("has_custom_form = ?")
      values.push(body.hasCustomForm ? 1 : 0)
    }
    if (body.customFormFields !== undefined) {
      updates.push("custom_form_fields = ?")
      values.push(JSON.stringify(body.customFormFields))
    }
    if (body.aboutEvent !== undefined) {
      updates.push("about_event = ?")
      values.push(body.aboutEvent)
    }
    if (body.status !== undefined) {
      updates.push("status = ?")
      values.push(body.status)
    }

    updates.push("updated_at = ?")
    values.push(new Date().toISOString())

    values.push(params.id)

    const stmt = db.prepare(`UPDATE events SET ${updates.join(", ")} WHERE id = ?`)
    stmt.run(...values)

    const updatedEvent = db.prepare("SELECT * FROM events WHERE id = ?").get(params.id)
    console.log("[v0] Event updated successfully")

    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error("[v0] Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(params.id) as any

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.organizer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    db.prepare("DELETE FROM events WHERE id = ?").run(params.id)
    console.log("[v0] Event deleted successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
