-- Keep platform identifiers separate from the public student pass. This lets
-- an issued Wallet object be revoked or refreshed without recreating the
-- Schaap's account or exposing the internal pass id to the browser.
CREATE TABLE IF NOT EXISTS student_wallet_passes (
  id TEXT PRIMARY KEY NOT NULL,
  pass_id TEXT NOT NULL REFERENCES student_passes(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('apple', 'google')),
  external_id TEXT NOT NULL,
  serial_number TEXT,
  authentication_token_hash TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'error')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  revoked_at TEXT,
  UNIQUE(pass_id, platform),
  UNIQUE(platform, external_id)
);

CREATE INDEX IF NOT EXISTS student_wallet_passes_status
  ON student_wallet_passes(platform, status, updated_at);
