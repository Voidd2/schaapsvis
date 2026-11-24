-- A new queue, with no backfill of historical decisions.
CREATE TABLE IF NOT EXISTS student_review_mail (
  application_id TEXT PRIMARY KEY REFERENCES student_applications(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'nl' CHECK (locale IN ('nl', 'en', 'de')),
  due_at TEXT, attempts INTEGER NOT NULL DEFAULT 0, sent_at TEXT
);
CREATE INDEX IF NOT EXISTS student_review_mail_due ON student_review_mail(due_at) WHERE due_at IS NOT NULL;
