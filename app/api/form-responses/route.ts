import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { eventId, responseData } = await request.json()

    // Get current user (optional - can be anonymous)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Insert form response
    const { data, error } = await supabase
      .from("form_responses")
      .insert({
        event_id: eventId,
        user_id: user?.id || null,
        response_data: responseData,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error submitting form response:", error)
    return NextResponse.json({ error: "Failed to submit form response" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    if (!eventId) {
      return NextResponse.json({ error: "Event ID required" }, { status: 400 })
    }

    // Verify user is the event organizer
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: event } = await supabase.from("events").select("organizer_id").eq("id", eventId).single()

    if (!event || event.organizer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get all responses for this event
    const { data: responses, error } = await supabase
      .from("form_responses")
      .select("*")
      .eq("event_id", eventId)
      .order("submitted_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ responses })
  } catch (error) {
    console.error("[v0] Error fetching form responses:", error)
    return NextResponse.json({ error: "Failed to fetch form responses" }, { status: 500 })
  }
}
