-- Require a separate verified school address before a student can submit proof.
-- Legacy accounts keep NULL values and can continue to sign in, but cannot
-- submit a new student application until both addresses are verified.
ALTER TABLE users ADD COLUMN school_email TEXT COLLATE NOCASE;
ALTER TABLE users ADD COLUMN school_email_verified_at TEXT;
CREATE UNIQUE INDEX users_school_email_unique
  ON users(school_email) WHERE school_email IS NOT NULL;

-- A separate token purpose keeps school-address codes from being accepted as
-- ordinary account-email confirmation tokens.
CREATE TABLE email_tokens_new (
  token_hash TEXT PRIMARY KEY NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  email TEXT COLLATE NOCASE,
  purpose TEXT NOT NULL CHECK (purpose IN ('verify_email', 'verify_school', 'password_reset', 'newsletter_confirm', 'newsletter_unsubscribe')),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  CHECK (user_id IS NOT NULL OR email IS NOT NULL)
);
INSERT INTO email_tokens_new (token_hash, user_id, email, purpose, created_at, expires_at, used_at)
SELECT token_hash, user_id, email, purpose, created_at, expires_at, used_at FROM email_tokens;
DROP TABLE email_tokens;
ALTER TABLE email_tokens_new RENAME TO email_tokens;
CREATE INDEX email_tokens_user_purpose ON email_tokens(user_id, purpose, expires_at);
CREATE INDEX email_tokens_email_purpose ON email_tokens(email, purpose, expires_at);
