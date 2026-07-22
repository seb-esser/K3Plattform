CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('editor', 'admin')),
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id                            INTEGER PRIMARY KEY AUTOINCREMENT,
  organizer                     TEXT NOT NULL,
  start_date                    TEXT NOT NULL,
  start_time                    TEXT NOT NULL,
  end_date                      TEXT NOT NULL,
  end_time                      TEXT NOT NULL,
  publish_date                  TEXT NOT NULL,
  lat                           REAL,
  lng                           REAL,
  status                        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  newsletter_title              TEXT,
  newsletter_description        TEXT,
  newsletter_distribute_private INTEGER NOT NULL DEFAULT 0,
  newsletter_distribute_public  INTEGER NOT NULL DEFAULT 0,
  instagram_caption             TEXT,
  instagram_crosspost_facebook  INTEGER NOT NULL DEFAULT 0,
  whatsapp_caption              TEXT,
  editor_notes                  TEXT,
  reviewed_by_user_id           INTEGER REFERENCES users(id),
  reviewed_at                   TEXT,
  created_at                    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at                    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);

CREATE TABLE IF NOT EXISTS event_attachments (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id          INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  channel           TEXT NOT NULL CHECK (channel IN ('newsletter', 'instagram', 'whatsapp')),
  filename          TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type         TEXT NOT NULL,
  size_bytes        INTEGER NOT NULL,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_attachments_event ON event_attachments(event_id);
