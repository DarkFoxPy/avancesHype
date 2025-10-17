import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { getDb } from "@/lib/db/client"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    const db = getDb()
    const user = db.prepare("SELECT * FROM profiles WHERE id = ?").get(session.userId) as any

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        socialLinks: user.social_links ? JSON.parse(user.social_links) : null,
        companyName: user.company_name,
        ruc: user.ruc,
        businessSector: user.business_sector,
        createdAt: user.created_at,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
