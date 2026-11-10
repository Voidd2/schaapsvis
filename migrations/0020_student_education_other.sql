-- Extend the education choices without losing existing applications or links.
-- D1 keeps foreign-key actions enabled during a migration. Preserve the two
-- ON DELETE SET NULL references while replacing the constrained parent table.
CREATE TABLE migration_0020_pass_links AS
  SELECT id, application_id FROM student_passes WHERE application_id IS NOT NULL;
CREATE TABLE migration_0020_audit_links AS
  SELECT id, application_id FROM admin_audit_log WHERE application_id IS NOT NULL;

CREATE TABLE student_applications_extended (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  education_level TEXT NOT NULL CHECK (education_level IN ('mbo', 'hbo', 'wo', 'other')),
  proof_object_key TEXT,
  proof_mime_type TEXT NOT NULL CHECK (proof_mime_type IN ('application/pdf', 'image/jpeg', 'image/png')),
  proof_consent_version TEXT NOT NULL,
  proof_consent_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TEXT NOT NULL,
  reviewed_at TEXT,
  reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewer_note TEXT,
  proof_deleted_at TEXT,
  study_city TEXT,
  eligibility_method TEXT NOT NULL DEFAULT 'uploaded-proof'
    CHECK (eligibility_method IN ('uploaded-proof', 'verified-school-email')),
  education_level_other TEXT,
  CHECK (education_level != 'other' OR
    (education_level_other IS NOT NULL AND length(trim(education_level_other)) BETWEEN 2 AND 120))
);
INSERT INTO student_applications_extended
  (id,user_id,institution,education_level,proof_object_key,proof_mime_type,
   proof_consent_version,proof_consent_at,status,submitted_at,reviewed_at,
   reviewed_by,reviewer_note,proof_deleted_at,study_city,eligibility_method)
SELECT id,user_id,institution,education_level,proof_object_key,proof_mime_type,
   proof_consent_version,proof_consent_at,status,submitted_at,reviewed_at,
   reviewed_by,reviewer_note,proof_deleted_at,study_city,eligibility_method
FROM student_applications;
DROP TABLE student_applications;
ALTER TABLE student_applications_extended RENAME TO student_applications;
CREATE INDEX student_applications_review_queue ON student_applications(status, submitted_at);
CREATE UNIQUE INDEX student_application_one_pending_per_user
  ON student_applications(user_id) WHERE status = 'pending';

UPDATE student_passes SET application_id=(SELECT application_id FROM migration_0020_pass_links WHERE id=student_passes.id)
  WHERE id IN (SELECT id FROM migration_0020_pass_links);
UPDATE admin_audit_log SET application_id=(SELECT application_id FROM migration_0020_audit_links WHERE id=admin_audit_log.id)
  WHERE id IN (SELECT id FROM migration_0020_audit_links);
DROP TABLE migration_0020_pass_links;
DROP TABLE migration_0020_audit_links;
