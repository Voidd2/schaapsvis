-- Give every student pass a short, human-readable lookup code. Existing passes
-- receive their deterministic code the next time the owner opens the account.
ALTER TABLE student_passes ADD COLUMN display_code TEXT;
CREATE UNIQUE INDEX student_passes_display_code_unique
  ON student_passes(display_code) WHERE display_code IS NOT NULL;
