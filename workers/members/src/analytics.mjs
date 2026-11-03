// Only public, predictable route names belong in aggregate analytics.
export function publicAnalyticsPath(value) {
  if (typeof value !== "string" || value.length > 180 || !/^\/(nl|en|de)(?:\/[a-z0-9-]+)*\/?$/.test(value)) return "";
  const path = value.replace(/\/$/, "");
  if (/^\/(nl|en|de)\/(account|beheer|studentenkorting|kortingsbon|bestellen)(?:\/|$)/.test(path)) return "";
  return path;
}

export function analyticsTarget(value, origin) {
  if (typeof value !== "string" || value.length > 500) return "";
  try {
    const url = new URL(value, origin);
    if (url.protocol === "tel:") return "contact:phone";
    if (url.protocol === "mailto:") return "contact:email";
    if (!["https:", "http:"].includes(url.protocol)) return "";
    if (["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname.toLowerCase())) return "contact:whatsapp";
    if (url.origin !== origin) return `external:${url.hostname.toLowerCase()}`.slice(0, 180);
    return publicAnalyticsPath(url.pathname);
  } catch { return ""; }
}

export async function analyticsReport(env, days, now = new Date()) {
  const until = now.toISOString().slice(0, 10);
  const since = new Date(now.getTime() - (days - 1) * 86400000).toISOString().slice(0, 10);
  const where = "FROM site_analytics_daily WHERE day >= ? AND day <= ?";
  const metrics = "COALESCE(SUM(CASE WHEN event='page_view' THEN count ELSE 0 END),0) AS views, COALESCE(SUM(CASE WHEN event='link_click' THEN count ELSE 0 END),0) AS clicks";
  // Aggregate before limiting rankings: totals must not silently stop at 2,000 rows.
  const [summary, daily, pages, destinations, legacy] = await env.DB.batch([
    env.DB.prepare(`SELECT ${metrics}, COALESCE(SUM(CASE WHEN event='link_click' AND target IN ('contact:whatsapp','external:wa.me','external:api.whatsapp.com','external:web.whatsapp.com') THEN count ELSE 0 END),0) AS whatsapp, COALESCE(SUM(CASE WHEN target='contact:phone' THEN count ELSE 0 END),0) AS phone, MAX(updated_at) AS lastEventAt ${where}`).bind(since, until),
    env.DB.prepare(`SELECT day, ${metrics} ${where} GROUP BY day ORDER BY day`).bind(since, until),
    env.DB.prepare(`SELECT path, ${metrics} ${where} GROUP BY path ORDER BY views DESC, clicks DESC, path LIMIT 30`).bind(since, until),
    env.DB.prepare(`SELECT path, target, SUM(count) AS count ${where} AND event='link_click' GROUP BY path, target ORDER BY count DESC, path, target LIMIT 30`).bind(since, until),
    // Compatibility for already-open pages during the independent site/API rollout.
    env.DB.prepare(`SELECT day, event, path, target, count ${where} ORDER BY day DESC, count DESC LIMIT 2000`).bind(since, until),
  ]);
  const byDay = new Map((daily.results || []).map(row => [row.day, row]));
  return {
    enabled: env.ANALYTICS_ENABLED === "on", since, until, days, timezone: "UTC", generatedAt: now.toISOString(),
    summary: summary.results[0], pages: pages.results || [], destinations: destinations.results || [], rows: legacy.results || [],
    daily: Array.from({ length: days }, (_, i) => {
      const day = new Date(Date.parse(`${since}T00:00:00Z`) + i * 86400000).toISOString().slice(0, 10);
      return byDay.get(day) || { day, views: 0, clicks: 0 };
    }),
  };
}
