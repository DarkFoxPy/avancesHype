import Database from "better-sqlite3"
import path from "path"
import { initDatabase } from "./init"

let dbInstance: Database.Database | null = null
let initialized = false

export function getDb() {
  if (!dbInstance) {
    const dbPath = path.join(process.cwd(), "database.sqlite")
    dbInstance = new Database(dbPath)
    dbInstance.pragma("journal_mode = WAL")
    dbInstance.pragma("foreign_keys = ON")

    if (!initialized) {
      try {
        initDatabase()
        initialized = true
        console.log("[v0] Database auto-initialized successfully")
      } catch (error) {
        console.error("[v0] Database initialization error:", error)
      }
    }
  }
  return dbInstance
}

export function closeDb() {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
    initialized = false
  }
}

export const db = getDb()
