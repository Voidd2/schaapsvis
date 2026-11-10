import { signupVisitPath } from "./signup-visit-path.mjs";

export const analyticsConsentKey = "sv-analytics-consent-v2";
export const analyticsConsentEvent = "sv-analytics-consent-change";
export const journeyVersion = "journey-v1";
export const journeySources = ["facebook", "instagram", "google", "bing", "newsletter", "other", "direct_unknown"];
export const journeyIdleMs = 30 * 60 * 1000;
export const journeyMaxMs = 4 * 60 * 60 * 1000;
export const journeyMaxPages = 50;
export function journeyPath(value) {
  const standard = signupVisitPath(value);
  if (standard) return standard;
  if (typeof value !== "string" || value.length > 150) return "";
  const path = value.replace(/\/$/, "");
  return /^\/(nl|en|de)\/(barbecue-gourmet|gourmetschotel|relatiegeschenken|visschalen|feestdagen)$/.test(path) || /^\/(nl|en|de)\/feestdagen\/[a-z0-9][a-z0-9-]{0,99}$/.test(path) ? path : "";
}

export function journeySource(href, referrer, origin) {
  try {
    const tag = new URL(href, origin).searchParams.get("utm_source")?.toLowerCase();
    const aliases = { fb: "facebook", ig: "instagram", email: "newsletter", mail: "newsletter" };
    const source = aliases[tag] || tag;
    if (journeySources.includes(source) && source !== "direct_unknown") return source;
    const ref = new URL(referrer);
    if (ref.origin === origin) return "direct_unknown";
    const host = ref.hostname.toLowerCase();
    if (host === "facebook.com" || host.endsWith(".facebook.com") || host === "fb.com") return "facebook";
    if (host === "instagram.com" || host.endsWith(".instagram.com")) return "instagram";
    if (/^(www\.)?google\.[a-z.]{2,10}$/.test(host)) return "google";
    if (host === "bing.com" || host.endsWith(".bing.com")) return "bing";
    return "other";
  } catch { return "direct_unknown"; }
}

export function validJourneyId(value) {
  return typeof value === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
}

export function journeySnapshot(body) {
  if (body?.consent !== true || body.version !== journeyVersion || !validJourneyId(body.id) ||
      !journeySources.includes(body.source) || !Number.isSafeInteger(body.seq) || body.seq < 1 || body.seq > 10000 ||
      !Number.isSafeInteger(body.visibleMs) || body.visibleMs < 0 || body.visibleMs > journeyMaxMs ||
      !Array.isArray(body.pages) || !body.pages.length || body.pages.length > journeyMaxPages ||
      body.pages.some(path => !journeyPath(path) || journeyPath(path) !== path) ||
      !journeyPath(body.lastPage) || journeyPath(body.lastPage) !== body.lastPage ||
      !Number.isSafeInteger(body.views) || body.views < body.pages.length || body.views > 10000 ||
      !Number.isSafeInteger(body.clicks) || body.clicks < 0 || body.clicks > 10000) return null;
  return {
    id: body.id, seq: body.seq, source: body.source, pages: body.pages, lastPage: body.lastPage,
    views: body.views, clicks: body.clicks, visibleMs: body.visibleMs,
    emailEntered: body.emailEntered === true, draftSaved: body.draftSaved === true,
    regionSelected: body.regionSelected === true, subscribed: body.subscribed === true,
    signupError: body.signupError === true, contact: body.contact === true,
  };
}
