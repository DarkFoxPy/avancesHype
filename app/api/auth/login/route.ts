import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/client"
import bcrypt from "bcryptjs"
import { createSession } from "@/lib/auth/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const db = getDb()
    const user = db.prepare("SELECT * FROM profiles WHERE email = ?").get(email) as any

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

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
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
