-- Keep the private student-proof buckets comfortably below Cloudflare's free
-- R2 storage and operation allowances. Preview and production each receive
-- half of the app's conservative storage ceiling.
CREATE TABLE IF NOT EXISTS r2_proof_storage_budget (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  bytes_reserved INTEGER NOT NULL DEFAULT 0 CHECK (bytes_reserved >= 0)
);
INSERT OR IGNORE INTO r2_proof_storage_budget (id, bytes_reserved) VALUES (1, 0);

-- Track every object before writing it so concurrent uploads cannot exceed
-- the storage ceiling and successful deletes can release exactly one booking.
CREATE TABLE IF NOT EXISTS r2_proof_objects (
  object_key TEXT PRIMARY KEY NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
  created_at TEXT NOT NULL
);

-- A per-environment 400k put / 4m get monthly ceiling keeps both configured
-- environments below the account's standard R2 free-operation allowances.
-- Daily ceilings also keep the D1 accounting writes bounded.
CREATE TABLE IF NOT EXISTS r2_proof_operation_budget (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  month TEXT NOT NULL,
  day TEXT NOT NULL,
  put_ops INTEGER NOT NULL DEFAULT 0 CHECK (put_ops >= 0),
  get_ops INTEGER NOT NULL DEFAULT 0 CHECK (get_ops >= 0),
  day_put_ops INTEGER NOT NULL DEFAULT 0 CHECK (day_put_ops >= 0),
  day_get_ops INTEGER NOT NULL DEFAULT 0 CHECK (day_get_ops >= 0)
);
INSERT OR IGNORE INTO r2_proof_operation_budget (id, month, day) VALUES (1, strftime('%Y-%m', 'now'), strftime('%Y-%m-%d', 'now'));
