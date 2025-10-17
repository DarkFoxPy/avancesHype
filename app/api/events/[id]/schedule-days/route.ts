import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"
import { getUserFromRequest } from "@/lib/auth/session"
import { nanoid } from "nanoid"

// GET /api/events/[id]/schedule-days - Get schedule days for an event
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const scheduleDays = db
      .prepare(
        `
      SELECT * FROM schedule_days 
      WHERE event_id = ? 
      ORDER BY day_number ASC
    `,
      )
      .all(id)

    return NextResponse.json({ scheduleDays })
  } catch (error) {
    console.error("[v0] Error fetching schedule days:", error)
    return NextResponse.json({ error: "Failed to fetch schedule days" }, { status: 500 })
  }
}

// POST /api/events/[id]/schedule-days - Create schedule day
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: eventId } = await params
    const body = await request.json()

    // Verify event exists and user is organizer
    const event = db.prepare("SELECT * FROM events WHERE id = ? AND organizer_id = ?").get(eventId, user.id)
    if (!event) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 })
    }

    const id = nanoid()
    const now = new Date().toISOString()

    const stmt = db.prepare(`
      INSERT INTO schedule_days (
        id, event_id, day_number, day_date, title, description,
        map_json_file, cover_image, gallery_images, videos,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      id,
      eventId,
      body.dayNumber,
      body.dayDate,
      body.title,
      body.description || null,
      body.mapJsonFile || null,
      body.coverImage || null,
      JSON.stringify(body.galleryImages || []),
      JSON.stringify(body.videos || []),
      now,
      now,
    )

    const scheduleDay = db.prepare("SELECT * FROM schedule_days WHERE id = ?").get(id)
    return NextResponse.json({ scheduleDay })
  } catch (error) {
    console.error("[v0] Error creating schedule day:", error)
    return NextResponse.json({ error: "Failed to create schedule day" }, { status: 500 })
  }
}

// DELETE /api/events/[id]/schedule-days - Delete schedule day
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: eventId } = await params
    const { searchParams } = new URL(request.url)
    const dayId = searchParams.get("dayId")

    if (!dayId) {
      return NextResponse.json({ error: "Day ID is required" }, { status: 400 })
    }

    // Verify event exists and user is organizer
    const event = db.prepare("SELECT * FROM events WHERE id = ? AND organizer_id = ?").get(eventId, user.id)
    if (!event) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 })
    }

    // Delete the schedule day
    db.prepare("DELETE FROM schedule_days WHERE id = ? AND event_id = ?").run(dayId, eventId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting schedule day:", error)
    return NextResponse.json({ error: "Failed to delete schedule day" }, { status: 500 })
  }
}
