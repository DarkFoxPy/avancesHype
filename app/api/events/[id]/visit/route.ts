import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"
import { nanoid } from "nanoid"

// POST /api/events/[id]/visit - Track event visit
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const stmt = db.prepare(`
      INSERT INTO event_visits (id, event_id, visitor_ip, visitor_user_agent, user_id, visited_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      nanoid(),
      params.id,
      body.ip || null,
      body.userAgent || null,
      body.userId || null,
      new Date().toISOString(),
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error tracking visit:", error)
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
  }
}
