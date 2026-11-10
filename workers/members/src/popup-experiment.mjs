export function validPopupMeasurement(value) {
  return value?.consent === true && ["a","b"].includes(value.variant) &&
    typeof value.id === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value.id);
}

// Existing VÅRLAKS rows use a bare UUID. The location test has its own key space.
function exposureKey(experiment, id) {
  return experiment === "locations" ? `locations:${id}` : id;
}

export function popupExposure(db, experiment, measurement, day, filled) {
  return db.prepare(`INSERT INTO varlaks_popup_v1 (exposure,day,variant,filled)
    VALUES (?,?,?,?) ON CONFLICT(exposure) DO UPDATE SET filled=MAX(filled,excluded.filled)
    WHERE variant=excluded.variant`).bind(exposureKey(experiment, measurement.id), day, measurement.variant, filled ? 1 : 0);
}

// Count acquisition immediately before the subscription upsert in the same transaction.
export function countNewPopupSubscription(db, experiment, measurement, email) {
  return db.prepare(`UPDATE varlaks_popup_v1 SET acquired=1
    WHERE exposure=? AND variant=? AND acquired=0
    AND NOT EXISTS (SELECT 1 FROM newsletter_subscriptions WHERE email=?)`)
    .bind(exposureKey(experiment, measurement.id), measurement.variant, email);
}

export async function popupReport(db, since, until, experiment) {
  const { results } = await db.prepare(`SELECT variant,COUNT(*) AS shown,SUM(filled) AS filled,
    SUM(acquired) AS acquired FROM varlaks_popup_v1 WHERE day BETWEEN ? AND ?
    AND (exposure GLOB 'locations:*') = ? GROUP BY variant`).bind(since, until, experiment === "locations" ? 1 : 0).all();
  return ["a","b"].map(variant => results.find(row => row.variant === variant) ?? { variant, shown: 0, filled: 0, acquired: 0 });
}
