export function validPopupMeasurement(value, experiment) {
  const validVariants = experiment === "sitewide" ? ["a","b","c"] : ["a","b"];
  return value?.consent === true && validVariants.includes(value.variant) &&
    typeof value.id === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value.id);
}

// Existing VÅRLAKS rows use a bare UUID. The location test has its own key space.
function exposureKey(experiment, id) {
  return experiment === "locations" ? `locations:${id}` : experiment === "sitewide" ? `sitewide:${id}` : id;
}

function popupTable(experiment) {
  return experiment === "sitewide" ? "sitewide_popup_v1" : "varlaks_popup_v1";
}

export function popupExposure(db, experiment, measurement, day, filled) {
  return db.prepare(`INSERT INTO ${popupTable(experiment)} (exposure,day,variant,filled)
    VALUES (?,?,?,?) ON CONFLICT(exposure) DO UPDATE SET filled=MAX(filled,excluded.filled)
    WHERE variant=excluded.variant`).bind(exposureKey(experiment, measurement.id), day, measurement.variant, filled ? 1 : 0);
}

// Count acquisition immediately before the subscription upsert in the same transaction.
export function countNewPopupSubscription(db, experiment, measurement, email) {
  return db.prepare(`UPDATE ${popupTable(experiment)} SET acquired=1
    WHERE exposure=? AND variant=? AND acquired=0
    AND NOT EXISTS (SELECT 1 FROM newsletter_subscriptions WHERE email=?)`)
    .bind(exposureKey(experiment, measurement.id), measurement.variant, email);
}

export async function popupReport(db, since, until, experiment) {
  const table = popupTable(experiment);
  const query = experiment === "sitewide"
    ? `SELECT variant,COUNT(*) AS shown,SUM(filled) AS filled,SUM(acquired) AS acquired FROM ${table} WHERE day BETWEEN ? AND ? GROUP BY variant`
    : `SELECT variant,COUNT(*) AS shown,SUM(filled) AS filled,SUM(acquired) AS acquired FROM ${table} WHERE day BETWEEN ? AND ? AND (exposure GLOB 'locations:*') = ? GROUP BY variant`;
  const { results } = await (experiment === "sitewide" ? db.prepare(query).bind(since, until) : db.prepare(query).bind(since, until, experiment === "locations" ? 1 : 0)).all();
  const variants = experiment === "sitewide" ? ["a","b","c"] : ["a","b"];
  return variants.map(variant => results.find(row => row.variant === variant) ?? { variant, shown: 0, filled: 0, acquired: 0 });
}
