-- Cloudflare D1 schema for accounts, email verification, newsletter consent,
-- student applications and staff-reviewed discount passes.
-- No student proof is stored in D1; the object belongs in a private R2 bucket.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  email_verified_at TEXT,
  account_status TEXT NOT NULL DEFAULT 'active'
    CHECK (account_status IN ('active', 'locked', 'deleted')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS sessions_user_active
  ON sessions(user_id, expires_at) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS email_tokens (
  token_hash TEXT PRIMARY KEY NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  email TEXT COLLATE NOCASE,
  purpose TEXT NOT NULL CHECK (purpose IN ('verify_email', 'password_reset', 'newsletter_confirm', 'newsletter_unsubscribe')),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  CHECK (user_id IS NOT NULL OR email IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS email_tokens_user_purpose
  ON email_tokens(user_id, purpose, expires_at);
CREATE INDEX IF NOT EXISTS email_tokens_email_purpose
  ON email_tokens(email, purpose, expires_at);

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  email TEXT PRIMARY KEY NOT NULL COLLATE NOCASE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'subscribed', 'unsubscribed')),
  consent_text_version TEXT NOT NULL,
  consented_at TEXT NOT NULL,
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Campaigns are explicitly drafted and sent by a person; weekly sending is not
-- automatic. Delivery is paced by the Worker cron and always includes opt-out.
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id TEXT PRIMARY KEY NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'sent', 'partial_failure')),
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TEXT NOT NULL,
  queued_at TEXT,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS newsletter_deliveries (
  campaign_id TEXT NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'suppressed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT NOT NULL,
  claimed_at TEXT,
  sent_at TEXT,
  last_error TEXT,
  PRIMARY KEY (campaign_id, email)
);
CREATE INDEX IF NOT EXISTS newsletter_deliveries_queue
  ON newsletter_deliveries(status, next_attempt_at, claimed_at);

CREATE TABLE IF NOT EXISTS student_applications (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  education_level TEXT NOT NULL CHECK (education_level IN ('mbo', 'hbo', 'wo')),
  proof_object_key TEXT,
  proof_mime_type TEXT NOT NULL CHECK (proof_mime_type IN ('application/pdf', 'image/jpeg', 'image/png')),
  proof_consent_version TEXT NOT NULL,
  proof_consent_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TEXT NOT NULL,
  reviewed_at TEXT,
  reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewer_note TEXT,
  proof_deleted_at TEXT
);
CREATE INDEX IF NOT EXISTS student_applications_review_queue
  ON student_applications(status, submitted_at);
CREATE UNIQUE INDEX IF NOT EXISTS student_application_one_pending_per_user
  ON student_applications(user_id) WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS student_passes (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  public_code_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired')),
  issued_at TEXT NOT NULL,
  expires_at TEXT,
  revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS consent_events (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('marketing_email', 'student_proof_processing')),
  granted INTEGER NOT NULL CHECK (granted IN (0, 1)),
  text_version TEXT NOT NULL,
  source TEXT NOT NULL,
  recorded_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS consent_events_user
  ON consent_events(user_id, consent_type, recorded_at);

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  rate_key TEXT PRIMARY KEY NOT NULL,
  attempts INTEGER NOT NULL,
  window_started_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id TEXT PRIMARY KEY NOT NULL,
  reviewer_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action IN ('proof_viewed', 'proof_deleted', 'application_approved', 'application_rejected', 'pass_suspended', 'pass_restored', 'newsletter_campaign_created', 'newsletter_campaign_sent')),
  application_id TEXT REFERENCES student_applications(id) ON DELETE SET NULL,
  occurred_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_audit_log_reviewed
  ON admin_audit_log(application_id, occurred_at);
