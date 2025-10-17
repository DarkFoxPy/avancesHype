import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"

// GET /api/events/organizer/[organizerId] - Get events by organizer
export async function GET(request: NextRequest, { params }: { params: Promise<{ organizerId: string }> }) {
  try {
    const { organizerId } = await params

    const events = db
      .prepare(
        `
      SELECT * FROM events 
      WHERE organizer_id = ? 
      ORDER BY created_at DESC
    `,
      )
      .all(organizerId)

    return NextResponse.json({ events })
  } catch (error) {
    console.error("[v0] Error fetching organizer events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
