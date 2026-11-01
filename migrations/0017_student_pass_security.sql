-- Privacy-respecting device recognition, long-lived revocable sessions,
-- explainable security events and administrator-led extra verification.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS member_devices (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  installation_hash TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('smartphone', 'tablet', 'desktop', 'unknown')),
  operating_system TEXT NOT NULL,
  browser TEXT NOT NULL,
  device_model TEXT,
  access_context TEXT NOT NULL CHECK (access_context IN ('browser', 'standalone', 'unknown')),
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  rule_exemptions_json TEXT NOT NULL DEFAULT '[]',
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  revoked_at TEXT,
  UNIQUE (user_id, installation_hash)
);
CREATE INDEX IF NOT EXISTS member_devices_user_activity
  ON member_devices(user_id, last_seen_at DESC);

ALTER TABLE sessions ADD COLUMN device_id TEXT REFERENCES member_devices(id) ON DELETE SET NULL;
ALTER TABLE sessions ADD COLUMN last_seen_at TEXT;
ALTER TABLE sessions ADD COLUMN absolute_expires_at TEXT;
ALTER TABLE sessions ADD COLUMN access_context TEXT NOT NULL DEFAULT 'unknown'
  CHECK (access_context IN ('browser', 'standalone', 'unknown'));
CREATE INDEX IF NOT EXISTS sessions_device_active
  ON sessions(device_id, expires_at) WHERE revoked_at IS NULL;

UPDATE sessions
SET last_seen_at = COALESCE(last_seen_at, created_at),
    absolute_expires_at = COALESCE(absolute_expires_at, expires_at);

CREATE TABLE IF NOT EXISTS security_events (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT REFERENCES member_devices(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'new_device', 'device_threshold', 'repeated_devices', 'concurrent_devices',
    'revoked_session_attempt', 'login_rate_limited', 'qr_rate_limited',
    'verification_requested', 'verification_completed', 'verification_rate_limited', 'manual_note'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'high')),
  risk_points INTEGER NOT NULL DEFAULT 0 CHECK (risk_points BETWEEN 0 AND 100),
  reason TEXT NOT NULL,
  context_json TEXT NOT NULL DEFAULT '{}',
  occurrence_count INTEGER NOT NULL DEFAULT 1 CHECK (occurrence_count > 0),
  first_occurred_at TEXT NOT NULL,
  last_occurred_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),
  resolved_at TEXT,
  resolved_by TEXT REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS security_events_review_queue
  ON security_events(status, severity, last_occurred_at DESC);
CREATE INDEX IF NOT EXISTS security_events_user_activity
  ON security_events(user_id, last_occurred_at DESC);

CREATE TABLE IF NOT EXISTS security_verification_requests (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_by TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  method TEXT NOT NULL CHECK (method IN ('email_code', 'student_status', 'in_person')),
  reason TEXT NOT NULL,
  pass_policy TEXT NOT NULL DEFAULT 'keep_active' CHECK (pass_policy IN ('keep_active', 'suspend')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'expired')),
  token_hash TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  completed_by TEXT REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS security_verification_open
  ON security_verification_requests(status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS security_verification_one_pending
  ON security_verification_requests(user_id) WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS security_admin_audit (
  id TEXT PRIMARY KEY NOT NULL,
  admin_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  target_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT REFERENCES member_devices(id) ON DELETE SET NULL,
  session_token_hash TEXT,
  verification_request_id TEXT REFERENCES security_verification_requests(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN (
    'event_marked_safe', 'device_revoked', 'session_revoked', 'all_sessions_revoked',
    'pass_suspended', 'pass_restored', 'verification_requested',
    'verification_completed', 'verification_cancelled', 'rule_exemption_changed', 'settings_updated'
  )),
  detail_json TEXT NOT NULL DEFAULT '{}',
  occurred_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS security_admin_audit_target
  ON security_admin_audit(target_user_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS security_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  new_device_warning_count INTEGER NOT NULL DEFAULT 3 CHECK (new_device_warning_count BETWEEN 2 AND 10),
  new_device_window_days INTEGER NOT NULL DEFAULT 7 CHECK (new_device_window_days BETWEEN 1 AND 30),
  concurrent_device_minutes INTEGER NOT NULL DEFAULT 10 CHECK (concurrent_device_minutes BETWEEN 2 AND 120),
  qr_issue_limit INTEGER NOT NULL DEFAULT 30 CHECK (qr_issue_limit BETWEEN 5 AND 120),
  qr_check_limit INTEGER NOT NULL DEFAULT 25 CHECK (qr_check_limit BETWEEN 5 AND 120),
  updated_at TEXT NOT NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL
);
INSERT OR IGNORE INTO security_settings (id,updated_at) VALUES (1,datetime('now'));

CREATE TABLE IF NOT EXISTS pass_qr_tokens (
  token_hash TEXT PRIMARY KEY NOT NULL,
  pass_id TEXT NOT NULL REFERENCES student_passes(id) ON DELETE CASCADE,
  device_id TEXT REFERENCES member_devices(id) ON DELETE SET NULL,
  issued_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT
);
CREATE INDEX IF NOT EXISTS pass_qr_tokens_expiry ON pass_qr_tokens(expires_at);

-- Keep short-lived passwordless sign-in tokens separate from the existing
-- verification/newsletter token table. This avoids rebuilding a live table
-- merely to extend its purpose CHECK constraint.
CREATE TABLE IF NOT EXISTS member_login_tokens (
  token_hash TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT
);
CREATE INDEX IF NOT EXISTS member_login_tokens_user_expiry
  ON member_login_tokens(user_id, expires_at DESC);
