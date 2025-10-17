import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

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

    const { data: event } = await supabase
      .from("events")
      .select("organizer_id, custom_form_fields, title")
      .eq("id", eventId)
      .single()

    if (!event || event.organizer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get all responses
    const { data: responses, error } = await supabase
      .from("form_responses")
      .select("*")
      .eq("event_id", eventId)
      .order("submitted_at", { ascending: true })

    if (error) throw error

    // Generate CSV
    const formFields = event.custom_form_fields || []
    const headers = ["Fecha de envío", ...formFields.map((f: any) => f.label)]

    const rows = responses.map((response: any) => {
      const row = [new Date(response.submitted_at).toLocaleString("es-ES")]
      formFields.forEach((field: any) => {
        const value = response.response_data[field.id]
        if (Array.isArray(value)) {
          row.push(value.join(", "))
        } else {
          row.push(value || "")
        }
      })
      return row
    })

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="respuestas-${event.title.replace(/[^a-z0-9]/gi, "-")}-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error exporting form responses:", error)
    return NextResponse.json({ error: "Failed to export form responses" }, { status: 500 })
  }
}
