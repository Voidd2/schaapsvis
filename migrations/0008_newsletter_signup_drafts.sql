-- A first step can temporarily hold an email while the visitor chooses a
-- region and makes an explicit marketing choice. Expired drafts are purged by
-- the scheduled cleanup; drafts are never eligible for campaign delivery.
CREATE TABLE newsletter_signup_drafts (
  token_hash TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX newsletter_signup_drafts_expiry
  ON newsletter_signup_drafts(expires_at);
