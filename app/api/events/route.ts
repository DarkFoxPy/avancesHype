import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"
import { getUserFromRequest } from "@/lib/auth/session"
import { nanoid } from "nanoid"

// GET /api/events - Fetch all public events
export async function GET() {
  try {
    const events = db
      .prepare(
        `
      SELECT * FROM events 
      WHERE is_public = 1 
      ORDER BY created_at DESC
    `,
      )
      .all()

    return NextResponse.json({ events })
  } catch (error) {
    console.error("[v0] Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Creating event with data:", body)

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const id = nanoid()
    const now = new Date().toISOString()

    const stmt = db.prepare(`
      INSERT INTO events (
        id, slug, title, description, start_date, end_date,
        location, event_type, event_link, category, capacity, unlimited_capacity,
        is_public, requires_approval, organizer_id, map_3d_config, map_json_file,
        cover_image, gallery_images, videos, schedule, schedule_json_file,
        has_custom_form, custom_form_fields, about_event, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      id,
      slug,
      body.title,
      body.description,
      body.startDate,
      body.endDate,
      body.location || null,
      body.eventType,
      body.eventLink || null,
      body.category,
      body.capacity,
      body.unlimitedCapacity ? 1 : 0,
      body.isPublic ? 1 : 0,
      body.requiresApproval ? 1 : 0,
      user.id,
      JSON.stringify(body.map3DConfig),
      body.mapJsonFile || null,
      body.coverImage || null,
      JSON.stringify(body.galleryImages || []),
      JSON.stringify(body.videos || []),
      JSON.stringify(body.schedule || []),
      body.scheduleJsonFile || null,
      body.hasCustomForm ? 1 : 0,
      JSON.stringify(body.customFormFields || []),
      body.aboutEvent || null,
      body.status || "draft",
      now,
      now,
    )

    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(id)
    console.log("[v0] Event created successfully:", event)

    return NextResponse.json({ event })
  } catch (error) {
    console.error("[v0] Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event", details: String(error) }, { status: 500 })
  }
}
