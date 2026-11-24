// GitHub deploys the members Worker independently of the D1 migration runner.
const initialized = new WeakMap();
export const reviewMailSchema = [
  `CREATE TABLE IF NOT EXISTS student_review_mail (
  application_id TEXT PRIMARY KEY REFERENCES student_applications(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'nl' CHECK (locale IN ('nl', 'en', 'de')),
  due_at TEXT, attempts INTEGER NOT NULL DEFAULT 0, sent_at TEXT
)`,
  "CREATE INDEX IF NOT EXISTS student_review_mail_due ON student_review_mail(due_at) WHERE due_at IS NOT NULL",
];

export async function ensureReviewMail(db) {
  if (!initialized.has(db)) {
    const ready = Promise.resolve().then(() => db.batch(reviewMailSchema.map(sql => db.prepare(sql))));
    initialized.set(db, ready);
    ready.catch(() => initialized.delete(db));
  }
  return initialized.get(db);
}
