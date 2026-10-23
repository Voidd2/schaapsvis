-- Audit trail for staff actions on customer accounts. Account deletion remains
-- a separate privacy workflow; the portal only supports temporary lock/restore.
CREATE TABLE IF NOT EXISTS admin_customer_audit (
  id TEXT PRIMARY KEY NOT NULL,
  admin_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  customer_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action IN ('account_locked', 'account_restored')),
  from_status TEXT NOT NULL CHECK (from_status IN ('active', 'locked')),
  to_status TEXT NOT NULL CHECK (to_status IN ('active', 'locked')),
  occurred_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_customer_audit_customer
  ON admin_customer_audit(customer_user_id, occurred_at);
