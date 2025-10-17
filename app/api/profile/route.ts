import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { getDb } from "@/lib/db/client"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const db = getDb()

    const updates: string[] = []
    const values: any[] = []

    if (data.name) {
      updates.push("name = ?")
      values.push(data.name)
    }
    if (data.username) {
      updates.push("username = ?")
      values.push(data.username)
    }
    if (data.avatar !== undefined) {
      updates.push("avatar = ?")
      values.push(data.avatar)
    }
    if (data.bio !== undefined) {
      updates.push("bio = ?")
      values.push(data.bio)
    }
    if (data.phone !== undefined) {
      updates.push("phone = ?")
      values.push(data.phone)
    }
    if (data.socialLinks) {
      updates.push("social_links = ?")
      values.push(JSON.stringify(data.socialLinks))
    }
    if (data.companyName !== undefined) {
      updates.push("company_name = ?")
      values.push(data.companyName)
    }
    if (data.ruc !== undefined) {
      updates.push("ruc = ?")
      values.push(data.ruc)
    }
    if (data.businessSector !== undefined) {
      updates.push("business_sector = ?")
      values.push(data.businessSector)
    }

    updates.push("updated_at = datetime('now')")
    values.push(session.userId)

    db.prepare(`UPDATE profiles SET ${updates.join(", ")} WHERE id = ?`).run(...values)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
