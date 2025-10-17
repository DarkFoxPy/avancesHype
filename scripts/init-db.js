const Database = require("better-sqlite3")
const path = require("path")
const { nanoid } = require("nanoid")

const dbPath = path.join(process.cwd(), "database.sqlite")
const db = new Database(dbPath)

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

// Create profiles table
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('participant', 'coordinator')),
    avatar TEXT,
    bio TEXT,
    phone TEXT,
    social_links TEXT,
    company_name TEXT,
    ruc TEXT,
    business_sector TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
  CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
`)

// Create events table
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    duration_days INTEGER GENERATED ALWAYS AS (
      CAST((julianday(end_date) - julianday(start_date)) AS INTEGER) + 1
    ) STORED,
    location TEXT,
    event_type TEXT NOT NULL CHECK(event_type IN ('presencial', 'virtual', 'no-definido')),
    event_link TEXT,
    category TEXT NOT NULL,
    capacity INTEGER DEFAULT 200,
    unlimited_capacity INTEGER DEFAULT 0,
    registrations INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 1,
    requires_approval INTEGER DEFAULT 0,
    organizer_id TEXT NOT NULL,
    map_3d_config TEXT,
    map_json_file TEXT,
    cover_image TEXT,
    gallery_images TEXT,
    videos TEXT,
    schedule TEXT,
    schedule_json_file TEXT,
    has_custom_form INTEGER DEFAULT 0,
    custom_form_fields TEXT,
    about_event TEXT,
    visit_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'cancelled', 'completed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (organizer_id) REFERENCES profiles(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
  CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
  CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
  CREATE INDEX IF NOT EXISTS idx_events_public ON events(is_public);
`)

// Create registrations table
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    user_id TEXT,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'cancelled')),
    time_slot TEXT,
    custom_answers TEXT,
    qr_code TEXT,
    registered_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
  CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
  CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(user_email);
`)

// Create event_visits table
db.exec(`
  CREATE TABLE IF NOT EXISTS event_visits (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    visitor_ip TEXT,
    visitor_user_agent TEXT,
    user_id TEXT,
    visited_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_visits_event ON event_visits(event_id);
  CREATE INDEX IF NOT EXISTS idx_visits_user ON event_visits(user_id);
`)

// Create form_responses table
db.exec(`
  CREATE TABLE IF NOT EXISTS form_responses (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    registration_id TEXT,
    user_id TEXT,
    responses TEXT NOT NULL,
    submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_form_responses_event ON form_responses(event_id);
  CREATE INDEX IF NOT EXISTS idx_form_responses_registration ON form_responses(registration_id);
`)

// Create triggers
db.exec(`
  CREATE TRIGGER IF NOT EXISTS increment_registrations
  AFTER INSERT ON registrations
  BEGIN
    UPDATE events SET registrations = registrations + 1 WHERE id = NEW.event_id;
  END;

  CREATE TRIGGER IF NOT EXISTS decrement_registrations
  AFTER DELETE ON registrations
  BEGIN
    UPDATE events SET registrations = registrations - 1 WHERE id = OLD.event_id;
  END;

  CREATE TRIGGER IF NOT EXISTS increment_visits
  AFTER INSERT ON event_visits
  BEGIN
    UPDATE events SET visit_count = visit_count + 1 WHERE id = NEW.event_id;
  END;
`)

db.close()
console.log("✅ Database initialized successfully at database.sqlite")
