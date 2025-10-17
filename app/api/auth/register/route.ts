import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/client"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, username, role, companyName, ruc, businessSector } = await request.json()

    const db = getDb()

    // Check if user already exists
    const existing = db.prepare("SELECT id FROM profiles WHERE email = ? OR username = ?").get(email, username)

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const userId = nanoid()
    db.prepare(
      `INSERT INTO profiles (id, email, password_hash, name, username, role, company_name, ruc, business_sector)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(userId, email, passwordHash, name, username, role, companyName || null, ruc || null, businessSector || null)

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
