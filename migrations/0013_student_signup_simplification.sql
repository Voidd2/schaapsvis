-- Split new member names into reusable fields and replace the Leiden/proof
-- requirement with a school-email based eligibility check plus study city.
-- Legacy full_name and proof metadata remain for backwards compatibility and
-- cleanup of already uploaded private objects.
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;

ALTER TABLE student_applications ADD COLUMN study_city TEXT;
ALTER TABLE student_applications ADD COLUMN eligibility_method TEXT NOT NULL DEFAULT 'uploaded-proof'
  CHECK (eligibility_method IN ('uploaded-proof', 'verified-school-email'));

