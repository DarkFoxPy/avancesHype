import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"

// GET /api/events/slug/[slug] - Get event by slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const event = db.prepare("SELECT * FROM events WHERE slug = ?").get(params.slug)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error("[v0] Error fetching event by slug:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}
