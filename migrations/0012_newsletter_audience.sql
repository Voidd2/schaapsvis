-- Keep the audience on each draft so student-only offers cannot be sent to
-- the general list by accident. Existing drafts retain their original scope.
ALTER TABLE newsletter_campaigns ADD COLUMN audience TEXT NOT NULL DEFAULT 'all'
  CHECK (audience IN ('all', 'students'));
