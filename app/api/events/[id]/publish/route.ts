import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"
import { getUserFromRequest } from "@/lib/auth/session"

// POST /api/events/[id]/publish - Publish event
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(id) as any

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.organizer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    db.prepare("UPDATE events SET status = ?, updated_at = ? WHERE id = ?").run(
      "published",
      new Date().toISOString(),
      id,
    )

    const updatedEvent = db.prepare("SELECT * FROM events WHERE id = ?").get(id)
    console.log("[v0] Event published successfully")

    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error("[v0] Error publishing event:", error)
    return NextResponse.json({ error: "Failed to publish event" }, { status: 500 })
  }
}
