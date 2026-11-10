-- Consent-based visits, separate from accounts and newsletter addresses.
-- Only a keyed random session hash; never email, full IP, referrer URL or query.
CREATE TABLE visitor_journeys (
  session_hash TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0,
  seq INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT '',
  landing TEXT NOT NULL DEFAULT '',
  last_page TEXT NOT NULL DEFAULT '',
  pages TEXT NOT NULL DEFAULT '[]',
  views INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  visible_ms INTEGER NOT NULL DEFAULT 0,
  email_entered INTEGER NOT NULL DEFAULT 0,
  draft_saved INTEGER NOT NULL DEFAULT 0,
  region_selected INTEGER NOT NULL DEFAULT 0,
  subscribed INTEGER NOT NULL DEFAULT 0,
  signup_error INTEGER NOT NULL DEFAULT 0,
  contact INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX visitor_journeys_started ON visitor_journeys(started_at DESC);
CREATE INDEX visitor_journeys_expiry ON visitor_journeys(expires_at);
