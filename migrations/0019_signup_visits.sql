CREATE TABLE IF NOT EXISTS signup_visits (
  token_hash TEXT PRIMARY KEY,
  consent_version TEXT NOT NULL,
  granted_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  email TEXT COLLATE NOCASE UNIQUE REFERENCES newsletter_subscriptions(email) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
  signup_at TEXT,
  capture_id TEXT,
  ip TEXT,
  city TEXT,
  pages TEXT NOT NULL DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS signup_visits_expiry ON signup_visits(expires_at);
CREATE TRIGGER IF NOT EXISTS discard_unsubscribed_visit AFTER UPDATE OF status ON newsletter_subscriptions
WHEN NEW.status = 'unsubscribed'
BEGIN
  DELETE FROM signup_visits WHERE email = NEW.email;
END;
