-- Track an upload before it reaches R2 so a failed D1 commit cannot leave an
-- unreferenced student proof with no cleanup handle.
CREATE TABLE IF NOT EXISTS student_proof_cleanup_queue (
  object_key TEXT PRIMARY KEY NOT NULL,
  application_id TEXT NOT NULL,
  queued_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS student_proof_cleanup_queue_age
  ON student_proof_cleanup_queue(queued_at);
