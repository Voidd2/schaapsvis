export function validPopupMeasurement(value) {
  return value?.consent === true && ["a","b"].includes(value.variant) &&
    typeof value.id === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value.id);
}

export function popupExposure(db, measurement, day, filled) {
  return db.prepare(`INSERT INTO varlaks_popup_v1 (exposure,day,variant,filled)
    VALUES (?,?,?,?) ON CONFLICT(exposure) DO UPDATE SET filled=MAX(filled,excluded.filled)
    WHERE variant=excluded.variant`).bind(measurement.id, day, measurement.variant, filled ? 1 : 0);
}

// Count acquisition immediately before the subscription upsert in the same transaction.
export function countNewPopupSubscription(db, measurement, email) {
  return db.prepare(`UPDATE varlaks_popup_v1 SET acquired=1
    WHERE exposure=? AND variant=? AND acquired=0
    AND NOT EXISTS (SELECT 1 FROM newsletter_subscriptions WHERE email=?)`)
    .bind(measurement.id, measurement.variant, email);
}

export async function popupReport(db, since, until) {
  const { results } = await db.prepare(`SELECT variant,COUNT(*) AS shown,SUM(filled) AS filled,
    SUM(acquired) AS acquired FROM varlaks_popup_v1 WHERE day BETWEEN ? AND ? GROUP BY variant`).bind(since,until).all();
  return ["a","b"].map(variant => results.find(row => row.variant === variant) ?? { variant, shown: 0, filled: 0, acquired: 0 });
}
