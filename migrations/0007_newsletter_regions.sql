-- Expand location tags for useful local segmentation without collecting exact
-- addresses. Existing values remain mapped to their current groups.
CREATE TABLE newsletter_subscriptions_new (
  email TEXT PRIMARY KEY NOT NULL COLLATE NOCASE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'subscribed', 'unsubscribed')),
  consent_text_version TEXT NOT NULL,
  consented_at TEXT NOT NULL,
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  region_tag TEXT CHECK (region_tag IS NULL OR region_tag IN ('leiden', 'voorschoten', 'wassenaar', 'leidschendam', 'regio-071', 'elders'))
);
INSERT INTO newsletter_subscriptions_new (
  email, user_id, status, consent_text_version, consented_at, confirmed_at,
  unsubscribed_at, source, created_at, updated_at, region_tag
)
SELECT email, user_id, status, consent_text_version, consented_at, confirmed_at,
  unsubscribed_at, source, created_at, updated_at,
  CASE region_tag WHEN 'anders' THEN 'elders' ELSE region_tag END
FROM newsletter_subscriptions;
DROP TABLE newsletter_subscriptions;
ALTER TABLE newsletter_subscriptions_new RENAME TO newsletter_subscriptions;
