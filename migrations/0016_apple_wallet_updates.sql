-- Apple Wallet update registrations deliberately keep the device library
-- identifier out of D1. A keyed hash is sufficient for lookups; the APNs
-- push token is encrypted before storage so a database read does not expose
-- a usable device token.
ALTER TABLE student_wallet_passes ADD COLUMN locale TEXT NOT NULL DEFAULT 'nl'
  CHECK (locale IN ('nl', 'en', 'de'));

CREATE TABLE IF NOT EXISTS apple_wallet_devices (
  device_hash TEXT PRIMARY KEY NOT NULL,
  push_token_ciphertext TEXT NOT NULL,
  push_token_iv TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS apple_wallet_registrations (
  device_hash TEXT NOT NULL REFERENCES apple_wallet_devices(device_hash) ON DELETE CASCADE,
  wallet_pass_id TEXT NOT NULL REFERENCES student_wallet_passes(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (device_hash, wallet_pass_id)
);

CREATE INDEX IF NOT EXISTS apple_wallet_registrations_pass
  ON apple_wallet_registrations(wallet_pass_id, updated_at);
