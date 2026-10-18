-- A renewed study-year application must receive its own pass while the older
-- pass remains auditable. Tie each pass to exactly one approved application.
CREATE TABLE student_passes_renewable (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id TEXT UNIQUE REFERENCES student_applications(id) ON DELETE SET NULL,
  public_code_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired')),
  issued_at TEXT NOT NULL,
  expires_at TEXT,
  revoked_at TEXT
);

INSERT INTO student_passes_renewable
  (id, user_id, application_id, public_code_hash, status, issued_at, expires_at, revoked_at)
SELECT
  p.id,
  p.user_id,
  (SELECT a.id FROM student_applications a
   WHERE a.user_id = p.user_id AND a.status = 'approved'
   ORDER BY a.reviewed_at DESC, a.submitted_at DESC LIMIT 1),
  p.public_code_hash,
  p.status,
  p.issued_at,
  p.expires_at,
  p.revoked_at
FROM student_passes p;

DROP TABLE student_passes;
ALTER TABLE student_passes_renewable RENAME TO student_passes;
CREATE INDEX student_passes_user_latest ON student_passes(user_id, issued_at DESC);
