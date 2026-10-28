const COOKIE = "sv_member";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;
const EMAIL_TOKEN_MS = 60 * 60 * 1000;
const VERIFICATION_CODE_MS = 10 * 60 * 1000;
// Cloudflare Workers caps WebCrypto PBKDF2 at 100,000 iterations.
const PASSWORD_ITERATIONS = 100_000;
const DUMMY_PASSWORD_HASH = "pbkdf2-sha256$100000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const MAX_PROOF_BYTES = 8 * 1024 * 1024;
const MAX_PROOF_STORAGE_BYTES = 4_000_000_000;
const MAX_PROOF_PUTS_PER_MONTH = 400_000;
const MAX_PROOF_GETS_PER_MONTH = 4_000_000;
const MAX_PROOF_PUTS_PER_DAY = 10_000;
const MAX_PROOF_GETS_PER_DAY = 50_000;
const PROOF_CONSENT_VERSION = "student-proof-2026-10";
const NEWSLETTER_CONSENT_VERSION = "customer-offers-2026-10";
const LOCALES = new Set(["nl", "en", "de"]);
const ACCOUNT_COPY = {
  nl: {
    verifySubject: "Bevestig uw persoonlijke e-mailadres — Schaap's Vishandel", verifyIntro: "Uw persoonlijke verificatiecode voor uw Schaap's-account is:", verifyLinkIntro: "Klik hieronder om uw e-mailadres voor uw Schaap's-account te bevestigen.", schoolVerifySubject: "Bevestig uw school-e-mailadres — Schaap's Vishandel", schoolVerifyIntro: "Uw verificatiecode voor uw school-e-mailadres is:", verifyButton: "E-mailadres bevestigen", verifyExpiredTitle: "Bevestigingslink verlopen", verifyExpired: "Vraag in uw account opnieuw een e-mailbevestiging aan.", usedExpired: "Deze link is al gebruikt of verlopen.",
    resetSubject: "Wachtwoord opnieuw instellen", resetIntro: "Stel uw wachtwoord opnieuw in via deze link:", resetTitle: "Wachtwoord instellen", resetLabel: "Nieuw wachtwoord (minimaal 12 tekens)", resetButton: "Wachtwoord opslaan", resetExpiredTitle: "Resetlink verlopen", resetExpired: "Deze link is al gebruikt of verlopen.",
    newsletterSubject: "Bevestig uw e-maildeals", newsletterIntro: "Bevestig dat Schaap's Vishandel u e-maildeals mag sturen.", newsletterButton: "E-maildeals bevestigen", newsletterTitle: "E-maildeals bevestigen", newsletterExpiredTitle: "Aanmeldlink verlopen", newsletterExpired: "Deze link is al gebruikt of verlopen.",
    unsubscribeTitle: "Afmelden voor e-maildeals", unsubscribeIntro: "U ontvangt daarna geen aanbiedingen per e-mail meer.", unsubscribeButton: "Afmelden", unsubscribeExpiredTitle: "Afmeldlink verlopen", unsubscribeExpired: "Deze afmeldlink is verlopen.", unsubscribeDoneTitle: "Afgemeld", unsubscribeDone: "U ontvangt geen e-maildeals meer van Schaap's Vishandel.",
    newsletterConfirmedSubject: "U ontvangt nu aanbiedingen van Schaap's Vishandel", newsletterConfirmedIntro: "Bedankt voor uw bevestiging. U ontvangt onze aanbiedingen wanneer we iets moois te delen hebben.", unsubscribeLink: "Afmelden voor e-maildeals",
    registrationGeneric: "Als dit een nieuw account is, ontvangt u twee codes: één op uw persoonlijke e-mailadres en één op uw schoolmail.", invalidRegistration: "Vul uw naam en twee verschillende geldige e-mailadressen in. Kies een wachtwoord van 12 tot 128 tekens.", verificationFailed: "Uw account is aangemaakt, maar een of beide e-mails konden niet worden verstuurd. Vraag de codes opnieuw aan.", resendGeneric: "Als er een onbevestigd account bij dit adres hoort, sturen we de verificatiecodes opnieuw.", resetGeneric: "Als er een account bij dit adres hoort, ontvangt u een e-mail.", alreadySubscribed: "U bent al aangemeld.", newsletterCheck: "Controleer uw e-mail om uw aanmelding te bevestigen.",
  },
  en: {
    verifySubject: "Verify your personal email — Schaap's Vishandel", verifyIntro: "Your personal verification code for your Schaap's account is:", verifyLinkIntro: "Click below to verify the email address for your Schaap's account.", schoolVerifySubject: "Verify your school email — Schaap's Vishandel", schoolVerifyIntro: "Your verification code for your school email address is:", verifyButton: "Verify email address", verifyExpiredTitle: "Verification link expired", verifyExpired: "Request a new verification email from your account.", usedExpired: "This link has already been used or has expired.",
    resetSubject: "Reset your password", resetIntro: "Reset your password using this link:", resetTitle: "Set a new password", resetLabel: "New password (at least 12 characters)", resetButton: "Save password", resetExpiredTitle: "Reset link expired", resetExpired: "This link has already been used or has expired.",
    newsletterSubject: "Confirm your email offers", newsletterIntro: "Confirm that Schaap's Vishandel may send you email offers.", newsletterButton: "Confirm email offers", newsletterTitle: "Confirm email offers", newsletterExpiredTitle: "Subscription link expired", newsletterExpired: "This link has already been used or has expired.",
    unsubscribeTitle: "Unsubscribe from email offers", unsubscribeIntro: "You will no longer receive offers by email.", unsubscribeButton: "Unsubscribe", unsubscribeExpiredTitle: "Unsubscribe link expired", unsubscribeExpired: "This unsubscribe link has expired.", unsubscribeDoneTitle: "Unsubscribed", unsubscribeDone: "You will no longer receive email offers from Schaap's Vishandel.",
    newsletterConfirmedSubject: "You are subscribed to offers from Schaap's Vishandel", newsletterConfirmedIntro: "Thanks for confirming. You will hear from us when we have something worth sharing.", unsubscribeLink: "Unsubscribe from email offers",
    registrationGeneric: "If this is a new account, we will send two codes: one to your personal email and one to your school email.", invalidRegistration: "Enter your name and two different valid email addresses. Choose a password of 12 to 128 characters.", verificationFailed: "Your account was created, but one or both emails could not be sent. Request new codes.", resendGeneric: "If this address belongs to an unverified account, we will resend the verification codes.", resetGeneric: "If an account exists for this address, you will receive an email.", alreadySubscribed: "You are already subscribed.", newsletterCheck: "Check your email to confirm your subscription.",
  },
  de: {
    verifySubject: "Private E-Mail bestätigen — Schaap's Vishandel", verifyIntro: "Ihr persönlicher Bestätigungscode für Ihr Schaap's-Konto lautet:", verifyLinkIntro: "Klicken Sie unten, um die E-Mail-Adresse für Ihr Schaap's-Konto zu bestätigen.", schoolVerifySubject: "Schul-E-Mail bestätigen — Schaap's Vishandel", schoolVerifyIntro: "Ihr Bestätigungscode für Ihre Schul-E-Mail-Adresse lautet:", verifyButton: "E-Mail-Adresse bestätigen", verifyExpiredTitle: "Bestätigungslink abgelaufen", verifyExpired: "Fordern Sie in Ihrem Konto eine neue Bestätigungs-E-Mail an.", usedExpired: "Dieser Link wurde bereits verwendet oder ist abgelaufen.",
    resetSubject: "Passwort zurücksetzen", resetIntro: "Setzen Sie Ihr Passwort über diesen Link zurück:", resetTitle: "Neues Passwort festlegen", resetLabel: "Neues Passwort (mindestens 12 Zeichen)", resetButton: "Passwort speichern", resetExpiredTitle: "Link zum Zurücksetzen abgelaufen", resetExpired: "Dieser Link wurde bereits verwendet oder ist abgelaufen.",
    newsletterSubject: "E-Mail-Angebote bestätigen", newsletterIntro: "Bestätigen Sie, dass Schaap's Vishandel Ihnen E-Mail-Angebote senden darf.", newsletterButton: "E-Mail-Angebote bestätigen", newsletterTitle: "E-Mail-Angebote bestätigen", newsletterExpiredTitle: "Anmeldelink abgelaufen", newsletterExpired: "Dieser Link wurde bereits verwendet oder ist abgelaufen.",
    unsubscribeTitle: "E-Mail-Angebote abbestellen", unsubscribeIntro: "Sie erhalten danach keine Angebote per E-Mail mehr.", unsubscribeButton: "Abbestellen", unsubscribeExpiredTitle: "Abmeldelink abgelaufen", unsubscribeExpired: "Dieser Abmeldelink ist abgelaufen.", unsubscribeDoneTitle: "Abgemeldet", unsubscribeDone: "Sie erhalten keine E-Mail-Angebote mehr von Schaap's Vishandel.",
    newsletterConfirmedSubject: "Sie erhalten jetzt Angebote von Schaap's Vishandel", newsletterConfirmedIntro: "Vielen Dank für Ihre Bestätigung. Sie hören von uns, wenn wir etwas Schönes zu teilen haben.", unsubscribeLink: "E-Mail-Angebote abbestellen",
    registrationGeneric: "Wenn dies ein neues Konto ist, senden wir zwei Codes: einen an Ihre private E-Mail und einen an Ihre Schul-E-Mail.", invalidRegistration: "Geben Sie Ihren Namen und zwei verschiedene gültige E-Mail-Adressen ein. Das Passwort muss 12 bis 128 Zeichen lang sein.", verificationFailed: "Ihr Konto wurde erstellt, aber eine oder beide E-Mails konnten nicht gesendet werden. Fordern Sie neue Codes an.", resendGeneric: "Wenn diese Adresse zu einem unbestätigten Konto gehört, senden wir die Bestätigungscodes erneut.", resetGeneric: "Wenn es ein Konto zu dieser Adresse gibt, erhalten Sie eine E-Mail.", alreadySubscribed: "Sie haben den E-Mail-Angeboten bereits zugestimmt.", newsletterCheck: "Prüfen Sie Ihre E-Mails, um die Anmeldung zu bestätigen.",
  },
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function nowIso() {
  return new Date().toISOString();
}

async function reserveProofObject(env, objectKey, sizeBytes) {
  const reserved = await env.DB.prepare(`UPDATE r2_proof_storage_budget
    SET bytes_reserved = bytes_reserved + ?
    WHERE id = 1 AND bytes_reserved + ? <= ?`).bind(sizeBytes, sizeBytes, MAX_PROOF_STORAGE_BYTES).run();
  if (Number(reserved?.meta?.changes || 0) !== 1) return false;
  try {
    await env.DB.prepare(`INSERT INTO r2_proof_objects (object_key, size_bytes, created_at) VALUES (?, ?, ?)`)
      .bind(objectKey, sizeBytes, nowIso()).run();
    return true;
  } catch (error) {
    await env.DB.prepare(`UPDATE r2_proof_storage_budget SET bytes_reserved = MAX(0, bytes_reserved - ?) WHERE id = 1`).bind(sizeBytes).run();
    throw error;
  }
}

async function releaseProofObject(env, objectKey) {
  // Couple releasing the byte reservation to deleting its object ledger row;
  // retries and simultaneous cleanup paths therefore cannot double-decrement.
  await env.DB.batch([
    env.DB.prepare(`UPDATE r2_proof_storage_budget SET bytes_reserved = MAX(0, bytes_reserved - (
      SELECT size_bytes FROM r2_proof_objects WHERE object_key = ?
    )) WHERE id = 1 AND EXISTS (SELECT 1 FROM r2_proof_objects WHERE object_key = ?)`)
      .bind(objectKey, objectKey),
    env.DB.prepare(`DELETE FROM r2_proof_objects WHERE object_key = ?`).bind(objectKey),
  ]);
}

async function deleteStudentProof(env, objectKey) {
  await env.STUDENT_PROOFS.delete(objectKey);
  await releaseProofObject(env, objectKey);
}

async function allowProofOperation(env, operation) {
  const period = nowIso();
  const month = period.slice(0, 7);
  const day = period.slice(0, 10);
  await env.DB.prepare(`INSERT INTO r2_proof_operation_budget (id, month, day, put_ops, get_ops, day_put_ops, day_get_ops)
    VALUES (1, ?, ?, 0, 0, 0, 0)
    ON CONFLICT(id) DO UPDATE SET
      put_ops = CASE WHEN month <> excluded.month THEN 0 ELSE put_ops END,
      get_ops = CASE WHEN month <> excluded.month THEN 0 ELSE get_ops END,
      day_put_ops = CASE WHEN day <> excluded.day OR month <> excluded.month THEN 0 ELSE day_put_ops END,
      day_get_ops = CASE WHEN day <> excluded.day OR month <> excluded.month THEN 0 ELSE day_get_ops END,
      month = excluded.month,
      day = excluded.day`).bind(month, day).run();

  const isPut = operation === "put";
  const monthlyColumn = isPut ? "put_ops" : "get_ops";
  const dailyColumn = isPut ? "day_put_ops" : "day_get_ops";
  const monthlyLimit = isPut ? MAX_PROOF_PUTS_PER_MONTH : MAX_PROOF_GETS_PER_MONTH;
  const dailyLimit = isPut ? MAX_PROOF_PUTS_PER_DAY : MAX_PROOF_GETS_PER_DAY;
  const result = await env.DB.prepare(`UPDATE r2_proof_operation_budget
    SET ${monthlyColumn} = ${monthlyColumn} + 1, ${dailyColumn} = ${dailyColumn} + 1
    WHERE id = 1 AND month = ? AND day = ? AND ${monthlyColumn} < ? AND ${dailyColumn} < ?`)
    .bind(month, day, monthlyLimit, dailyLimit).run();
  return Number(result?.meta?.changes || 0) === 1;
}

function localeFrom(value) {
  const locale = String(value || "").trim().toLowerCase().split(/[,-]/, 1)[0];
  return LOCALES.has(locale) ? locale : "nl";
}

function requestLocale(request, fallback = "") {
  const queryLocale = new URL(request.url).searchParams.get("locale");
  return localeFrom(queryLocale || fallback || request.headers.get("Accept-Language"));
}

function emailUrl(env, path, token, locale) {
  const url = new URL(path, env.SITE_ORIGIN);
  url.searchParams.set("token", token);
  url.searchParams.set("locale", localeFrom(locale));
  return url.toString();
}

function oneStudyYearFrom(value) {
  const date = new Date(value);
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return date.toISOString();
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function accountMessage(locale, title, message, token, action, button) {
  return html(`<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title><body style="font:16px system-ui;max-width:38rem;margin:8vh auto;padding:1.5rem;color:#102f42"><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><form method="post" action="${action}"><input type="hidden" name="token" value="${escapeHtml(token)}"><input type="hidden" name="locale" value="${locale}"><button style="background:#087fa8;color:white;border:0;border-radius:.5rem;padding:.85rem 1.2rem;font:inherit;font-weight:700">${escapeHtml(button)}</button></form></main></body></html>`);
}

function accountResultPage(locale, title, message, status = 410) {
  return html(`<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title><main style="font:16px system-ui;max-width:38rem;margin:8vh auto;padding:1.5rem;color:#102f42"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p></main>`, status);
}

function redirect(location, headers = {}) {
  return new Response(null, { status: 303, headers: { Location: location, "Cache-Control": "no-store", ...headers } });
}

function cookieValue(request) {
  const cookie = request.headers.get("Cookie") || "";
  for (const part of cookie.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === COOKIE) return value.join("=");
  }
  return "";
}

function sessionCookie(token, maxAge = 60 * 60 * 24 * 30) {
  // Host-only cookies keep preview and production sessions isolated, even
  // when both hosts are subdomains of the same site.
  return `${COOKIE}=${token}; Path=/api/members; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

function sameOrigin(request, env) {
  const origin = request.headers.get("Origin");
  return Boolean(origin && origin === env.SITE_ORIGIN);
}

function sameOriginFormNavigation(request, env) {
  if (sameOrigin(request, env)) return true;
  // Chrome may omit Origin on a top-level form POST from one of our
  // no-referrer confirmation pages. Sec-Fetch-* headers are controlled by
  // the browser, and the single-use token remains required by every handler.
  let requestOrigin = "";
  try { requestOrigin = new URL(request.url).origin; } catch { return false; }
  return requestOrigin === env.SITE_ORIGIN
    && request.headers.get("Sec-Fetch-Site") === "same-origin"
    && request.headers.get("Sec-Fetch-Mode") === "navigate"
    && request.headers.get("Sec-Fetch-Dest") === "document";
}

function base64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64url(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function digest(value) {
  return base64url(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}

function safeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string" || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function requestCookie(request, name) {
  for (const part of String(request.headers.get("Cookie") || "").split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    return part.slice(separator + 1).trim();
  }
  return "";
}

function siteAccessAllowed(request, env) {
  if (env.SITE_PUBLIC === "launch-approved") return true;

  const accessToken = String(env.SITE_ACCESS_TOKEN || "");
  const accessCookie = requestCookie(request, "sv_access");
  if (accessToken && safeEqual(accessCookie, accessToken)) return true;

  const clientIp = String(request.headers.get("CF-Connecting-IP") || "").trim().toLowerCase();
  const allowedIps = String(env.SITE_ACCESS_IP_ALLOWLIST || "").split(",").map((ip) => ip.trim().toLowerCase()).filter(Boolean);
  return Boolean(clientIp && allowedIps.includes(clientIp));
}

async function randomToken() {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}

async function passwordHash(password, pepper) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey("raw", encoder.encode(`${password}${pepper}`), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PASSWORD_ITERATIONS }, material, 256);
  return `pbkdf2-sha256$${PASSWORD_ITERATIONS}$${base64url(salt)}$${base64url(new Uint8Array(bits))}`;
}

async function verifyPassword(password, stored, pepper) {
  const [algorithm, iterationText, saltText, expectedText] = String(stored).split("$");
  const iterations = Number(iterationText);
  if (algorithm !== "pbkdf2-sha256" || iterations !== PASSWORD_ITERATIONS) return false;
  const material = await crypto.subtle.importKey("raw", encoder.encode(`${password}${pepper}`), "PBKDF2", false, ["deriveBits"]);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromBase64url(saltText), iterations }, material, 256));
  const expected = fromBase64url(expectedText);
  if (bits.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < bits.length; index++) difference |= bits[index] ^ expected[index];
  return difference === 0;
}

async function rateLimit(db, key, limit, windowMs) {
  const now = nowIso();
  const row = await db.prepare(`
    INSERT INTO auth_rate_limits (rate_key, attempts, window_started_at, updated_at)
    VALUES (?, 1, ?, ?)
    ON CONFLICT(rate_key) DO UPDATE SET
      attempts = CASE WHEN julianday(?) - julianday(auth_rate_limits.window_started_at) > ? THEN 1 ELSE auth_rate_limits.attempts + 1 END,
      window_started_at = CASE WHEN julianday(?) - julianday(auth_rate_limits.window_started_at) > ? THEN ? ELSE auth_rate_limits.window_started_at END,
      updated_at = excluded.updated_at
    RETURNING attempts
  `).bind(key, now, now, now, windowMs / 86_400_000, now, windowMs / 86_400_000, now).first();
  return Number(row?.attempts || 1) <= limit;
}

async function rateLimitIdentity(db, pepper, scope, ip, identity, ipLimit, identityLimit, windowMs) {
  const [ipKey, identityKey] = await Promise.all([
    hmac(pepper, `${scope}:ip:${ip}`),
    hmac(pepper, `${scope}:identity:${identity}`),
  ]);
  const [ipAllowed, identityAllowed] = await Promise.all([
    rateLimit(db, ipKey, ipLimit, windowMs),
    rateLimit(db, identityKey, identityLimit, windowMs),
  ]);
  return ipAllowed && identityAllowed;
}

function isMailConfigured(env) {
  const smtpSelected = Boolean(env.SMTP_HOST || env.SMTP_USERNAME || env.SMTP_PASSWORD);
  if (smtpSelected) {
    return Boolean(env.MAIL_FROM && env.SMTP_HOST && env.SMTP_USERNAME && env.SMTP_PASSWORD);
  }
  return Boolean(env.MAIL_FROM && env.EMAIL);
}

async function sendMail(env, to, subject, text, htmlBody) {
  if (!isMailConfigured(env)) throw new Error("mail-not-configured");
  const smtpSelected = Boolean(env.SMTP_HOST || env.SMTP_USERNAME || env.SMTP_PASSWORD);
  if (smtpSelected) {
    const smtp = await import("./smtp-worker.mjs");
    return smtp.sendSmtpMail(env, { to, subject, text, html: htmlBody });
  }
  return env.EMAIL.send({ from: env.MAIL_FROM, to, subject, text, html: htmlBody });
}

async function issueEmailToken(env, { userId = null, email = null, purpose, ttlMs = EMAIL_TOKEN_MS }) {
  const token = await randomToken();
  const expiry = new Date(Date.now() + ttlMs).toISOString();
  await env.DB.prepare(`INSERT INTO email_tokens (token_hash, user_id, email, purpose, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(await digest(token), userId, email, purpose, nowIso(), expiry).run();
  return token;
}

async function issueVerificationCode(env, { userId, email, purpose }) {
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  const expiry = new Date(Date.now() + VERIFICATION_CODE_MS).toISOString();
  await env.DB.prepare(`INSERT INTO email_tokens (token_hash, user_id, email, purpose, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(await hmac(env.AUTH_PEPPER, `verification-code:${userId}:${purpose}:${code}`), userId, email, purpose, nowIso(), expiry).run();
  return code;
}

async function sessionUser(request, env) {
  const token = cookieValue(request);
  if (!token) return null;
  const row = await env.DB.prepare(`
    SELECT u.id, u.email, u.full_name, u.email_verified_at, u.account_status
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ?
  `).bind(await digest(token), nowIso()).first();
  if (!row || !row.email_verified_at || row.account_status !== "active") return null;
  return row;
}

async function requireAdmin(request, env) {
  const user = await sessionUser(request, env);
  const allowlist = String(env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const allowedIps = String(env.ADMIN_IPS || "").split(",").map((ip) => ip.trim().toLowerCase()).filter(Boolean);
  const clientIp = String(request.headers.get("CF-Connecting-IP") || "").trim().toLowerCase();
  if (!user || !allowlist.includes(user.email.toLowerCase()) || !clientIp || !allowedIps.includes(clientIp)) return null;
  return user;
}

function publicAnalyticsPath(value) {
  if (typeof value !== "string" || value.length > 180 || !/^\/(nl|en|de)(?:\/[^?#]*)?$/.test(value)) return "";
  const path = value.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/nl";
  if (/^\/(nl|en|de)\/(account|beheer|studentenkorting|kortingsbon)(?:\/|$)/.test(path)) return "";
  return path;
}

function analyticsTarget(value, origin) {
  if (typeof value !== "string" || value.length > 500) return "";
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin) return `external:${url.hostname.toLowerCase()}`.slice(0, 180);
    return publicAnalyticsPath(url.pathname);
  } catch { return ""; }
}

async function collectAnalytics(request, env) {
  if (env.ANALYTICS_ENABLED !== "on" || !sameOrigin(request, env)) return json({ error: "analytics_unavailable" }, 503);
  const body = await readJson(request);
  if (body?.consent !== true || !["page_view", "link_click"].includes(body?.event)) return json({ error: "invalid_event" }, 400);
  const path = publicAnalyticsPath(body.path);
  if (!path) return json({ error: "invalid_path" }, 400);
  const target = body.event === "link_click" ? analyticsTarget(body.target, env.SITE_ORIGIN) : "";
  if (body.event === "link_click" && !target) return json({ error: "invalid_target" }, 400);
  if (!env.AUTH_PEPPER) return json({ error: "analytics_unavailable" }, 503);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = await hmac(env.AUTH_PEPPER, `analytics:ip:${ip}`);
  if (!await rateLimit(env.DB, key, 240, 15 * 60 * 1000)) return json({ error: "rate_limited" }, 429);
  const date = new Date().toISOString().slice(0, 10);
  await env.DB.prepare(`INSERT INTO site_analytics_daily (day, event, path, target, count, updated_at)
    VALUES (?, ?, ?, ?, 1, ?)
    ON CONFLICT(day, event, path, target) DO UPDATE SET count=count+1, updated_at=excluded.updated_at`)
    .bind(date, body.event, path, target, nowIso()).run();
  return json({ ok: true }, 202);
}

async function adminAnalytics(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const daysValue = Number(new URL(request.url).searchParams.get("days") || 30);
  const days = Number.isInteger(daysValue) ? Math.min(90, Math.max(1, daysValue)) : 30;
  const since = new Date(Date.now() - (days - 1) * 86_400_000).toISOString().slice(0, 10);
  const rows = await env.DB.prepare(`SELECT day, event, path, target, count FROM site_analytics_daily WHERE day >= ? ORDER BY day DESC, count DESC LIMIT 2000`).bind(since).all();
  return json({ since, days, rows: rows.results || [] });
}

async function adminCustomers(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const url = new URL(request.url);
  const cursorValue = String(url.searchParams.get("cursor") || "");
  let cursor = null;
  if (cursorValue) {
    if (cursorValue.length > 500) return json({ error: "invalid_cursor" }, 400);
    try {
      const decoded = JSON.parse(decoder.decode(fromBase64url(cursorValue)));
      if (typeof decoded?.createdAt !== "string" || decoded.createdAt.length > 40 || typeof decoded?.id !== "string" || decoded.id.length > 128) {
        return json({ error: "invalid_cursor" }, 400);
      }
      cursor = decoded;
    } catch {
      return json({ error: "invalid_cursor" }, 400);
    }
  }
  const result = await env.DB.prepare(`
    SELECT u.id, u.full_name, u.email, u.email_verified_at IS NOT NULL AS email_verified, u.account_status, u.created_at,
      COALESCE(n.status, 'not-subscribed') AS newsletter_status,
      (SELECT p.status FROM student_passes p WHERE p.user_id = u.id ORDER BY p.issued_at DESC LIMIT 1) AS student_pass_status
    FROM users u
    LEFT JOIN newsletter_subscriptions n ON n.email = u.email
    WHERE u.account_status IN ('active', 'locked')
      AND (? IS NULL OR u.created_at < ? OR (u.created_at = ? AND u.id < ?))
    ORDER BY u.created_at DESC, u.id DESC
    LIMIT 101
  `).bind(cursor?.createdAt ?? null, cursor?.createdAt ?? null, cursor?.createdAt ?? null, cursor?.id ?? "").all();
  const rows = result.results || [];
  const hasMore = rows.length > 100;
  const customers = rows.slice(0, 100);
  const last = customers[customers.length - 1];
  const nextCursor = hasMore && last ? base64url(encoder.encode(JSON.stringify({ createdAt: last.created_at, id: last.id }))) : null;
  return json({ customers, hasMore, nextCursor });
}

async function adminCustomerStatus(request, env, customerId) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const body = await readJson(request);
  const status = body?.status;
  if (!["active", "locked"].includes(status)) return json({ error: "invalid_status" }, 400);
  const customer = await env.DB.prepare(`SELECT id, email, account_status FROM users WHERE id = ? AND account_status IN ('active', 'locked')`).bind(customerId).first();
  if (!customer) return json({ error: "customer_not_found" }, 404);
  const adminEmails = String(env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (adminEmails.includes(String(customer.email).toLowerCase())) return json({ error: "administrator_protected" }, 409);
  if (customer.account_status === status) return json({ ok: true, status, unchanged: true });

  const now = nowIso();
  const action = status === "locked" ? "account_locked" : "account_restored";
  const statements = [
    env.DB.prepare(`UPDATE users SET account_status = ?, updated_at = ? WHERE id = ? AND account_status = ?`)
      .bind(status, now, customer.id, customer.account_status),
    env.DB.prepare(`INSERT INTO admin_customer_audit (id, admin_user_id, customer_user_id, action, from_status, to_status, occurred_at)
      SELECT ?, ?, ?, ?, ?, ?, ? WHERE changes() = 1`)
      .bind(crypto.randomUUID(), admin.id, customer.id, action, customer.account_status, status, now),
  ];
  if (status === "locked") {
    statements.push(env.DB.prepare(`UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL`).bind(now, customer.id));
  }
  const result = await env.DB.batch(statements);
  if (Number(result?.[0]?.meta?.changes || 0) !== 1) return json({ error: "customer_changed" }, 409);
  if (Number(result?.[1]?.meta?.changes || 0) !== 1) return json({ error: "audit_failed" }, 503);
  return json({ ok: true, status });
}

async function createSession(env, userId) {
  const token = await randomToken();
  const created = nowIso();
  const expires = new Date(Date.now() + SESSION_MS).toISOString();
  await env.DB.prepare(`INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)`)
    .bind(await digest(token), userId, created, expires).run();
  return token;
}

function normalizeEmail(value) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email;
}

async function readLimitedBytes(request, maxBytes) {
  const reader = request.body?.getReader();
  if (!reader) return { bytes: new Uint8Array() };
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        try { await reader.cancel(); } catch { /* Reject the oversized payload either way. */ }
        return { tooLarge: true };
      }
      chunks.push(value);
    }
    const body = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { bytes: body };
  } catch {
    try { await reader.cancel(); } catch { /* The request stream may already be closed. */ }
    return { invalid: true };
  }
}

async function readJson(request) {
  const result = await readLimitedBytes(request, 32_000);
  if (!result.bytes) return null;
  try { return JSON.parse(decoder.decode(result.bytes)); } catch { return null; }
}

async function readLimitedFormData(request, maxBytes) {
  const result = await readLimitedBytes(request, maxBytes);
  if (result.tooLarge) return { tooLarge: true };
  if (!result.bytes) return { invalid: true };
  try {
    const boundedRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: result.bytes,
    });
    return { form: await boundedRequest.formData() };
  } catch {
    return { invalid: true };
  }
}

async function register(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  if (!env.AUTH_PEPPER || !env.SITE_ORIGIN || !isMailConfigured(env)) return json({ error: "registration_unavailable" }, 503);
  const body = await readJson(request);
  const locale = localeFrom(body?.locale);
  const copy = ACCOUNT_COPY[locale];
  const email = normalizeEmail(body?.email);
  const schoolEmail = normalizeEmail(body?.schoolEmail);
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim().replace(/\s+/g, " ").slice(0, 60) : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim().replace(/\s+/g, " ").slice(0, 80) : "";
  // Accept the previous single-name payload during the two-Worker rollout so
  // an older cached page never breaks registration between deployments.
  const legacyName = typeof body?.name === "string" ? body.name.trim().replace(/\s+/g, " ").slice(0, 120) : "";
  const name = firstName && lastName ? `${firstName} ${lastName}` : legacyName;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !schoolEmail || email === schoolEmail || name.length < 2 || (!legacyName && (!firstName || !lastName)) || password.length < 12 || password.length > 128) {
    return json({ error: "invalid_input", message: copy.invalidRegistration }, 400);
  }
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const limitKey = await hmac(env.AUTH_PEPPER, `register:${ip}`);
  if (!await rateLimit(env.DB, limitKey, 8, 60 * 60 * 1000)) return json({ error: "rate_limited" }, 429);
  const userId = crypto.randomUUID();
  const created = nowIso();
  const passwordDigest = await passwordHash(password, env.AUTH_PEPPER);
  const schoolTaken = await env.DB.prepare(`SELECT 1 AS present FROM users WHERE school_email = ? AND account_status != 'deleted' LIMIT 1`).bind(schoolEmail).first();
  if (schoolTaken) return json({ ok: true, message: copy.registrationGeneric }, 202);
  let inserted;
  try {
    inserted = await env.DB.prepare(`INSERT INTO users (id, email, school_email, full_name, first_name, last_name, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(email) DO NOTHING`)
      .bind(userId, email, schoolEmail, name, firstName || null, lastName || null, passwordDigest, created, created).run();
  } catch { return json({ ok: true, message: copy.registrationGeneric }, 202); }
  if (!inserted.meta?.changes) return json({ ok: true, message: copy.registrationGeneric }, 202);

  const personalCode = await issueVerificationCode(env, { userId, email, purpose: "verify_email" });
  const schoolCode = await issueVerificationCode(env, { userId, email: schoolEmail, purpose: "verify_school" });
  try {
    const validity = locale === "nl" ? "De code is 10 minuten geldig." : locale === "de" ? "Der Code ist 10 Minuten gültig." : "The code is valid for 10 minutes.";
    await Promise.all([
      sendMail(env, email, copy.verifySubject, `${copy.verifyIntro}\n${personalCode}\n${validity}`, `<p>${copy.verifyIntro}</p><p style="font-size:2rem;font-weight:700;letter-spacing:.2em">${personalCode}</p><p>${validity}</p>`),
      sendMail(env, schoolEmail, copy.schoolVerifySubject, `${copy.schoolVerifyIntro}\n${schoolCode}\n${validity}`, `<p>${copy.schoolVerifyIntro}</p><p style="font-size:2rem;font-weight:700;letter-spacing:.2em">${schoolCode}</p><p>${validity}</p>`),
    ]);
  } catch {
    return json({ error: "verification_email_failed", message: copy.verificationFailed }, 503);
  }

  if (body.marketingConsent === true) {
    try {
      const consentAt = nowIso();
      await env.DB.batch([
        env.DB.prepare(`INSERT INTO consent_events (id, user_id, consent_type, granted, text_version, source, recorded_at) VALUES (?, ?, 'marketing_email', 1, ?, 'account-registration', ?)`)
          .bind(crypto.randomUUID(), userId, NEWSLETTER_CONSENT_VERSION, consentAt),
        env.DB.prepare(`INSERT INTO newsletter_subscriptions (email, user_id, status, consent_text_version, consented_at, source, created_at, updated_at) VALUES (?, ?, 'pending', ?, ?, 'account-registration', ?, ?) ON CONFLICT(email) DO UPDATE SET user_id=excluded.user_id, status='pending', consent_text_version=excluded.consent_text_version, consented_at=excluded.consented_at, confirmed_at=NULL, unsubscribed_at=NULL, source=excluded.source, updated_at=excluded.updated_at`)
          .bind(email, userId, NEWSLETTER_CONSENT_VERSION, consentAt, consentAt, consentAt),
      ]);
    } catch {
      // Optional marketing consent must never make a successfully created
      // account look like a failed registration.
    }
  }
  return json({ ok: true, message: copy.registrationGeneric }, 202);
}

async function registerAdministrator(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  if (!env.AUTH_PEPPER || !env.SITE_ORIGIN || !isMailConfigured(env)) return json({ error: "registration_unavailable" }, 503);
  const clientIp = String(request.headers.get("CF-Connecting-IP") || "").trim().toLowerCase();
  const allowedIps = String(env.ADMIN_IPS || "").split(",").map((ip) => ip.trim().toLowerCase()).filter(Boolean);
  if (!clientIp || !allowedIps.includes(clientIp)) return json({ error: "forbidden" }, 403);

  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  const adminEmails = String(env.ADMIN_EMAILS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  if (!email || !adminEmails.includes(email)) return json({ error: "forbidden" }, 403);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const locale = localeFrom(body?.locale);
  if (name.length < 2 || password.length < 12 || password.length > 128) return json({ error: "invalid_input" }, 400);
  if (!await rateLimitIdentity(env.DB, env.AUTH_PEPPER, "admin-register", clientIp, email, 4, 4, 60 * 60 * 1000)) {
    return json({ error: "rate_limited" }, 429);
  }

  const userId = crypto.randomUUID();
  const created = nowIso();
  const passwordDigest = await passwordHash(password, env.AUTH_PEPPER);
  const inserted = await env.DB.prepare(`INSERT INTO users (id, email, full_name, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(email) DO NOTHING`)
    .bind(userId, email, name, passwordDigest, created, created).run();
  let verificationUserId = userId;
  if (!inserted.meta?.changes) {
    const existing = await env.DB.prepare(`SELECT id, email_verified_at, account_status FROM users WHERE email = ?`).bind(email).first();
    if (!existing || existing.email_verified_at || existing.account_status !== "active") return json({ ok: true }, 202);
    verificationUserId = existing.id;
    await env.DB.batch([
      env.DB.prepare(`UPDATE users SET full_name = ?, password_hash = ?, updated_at = ? WHERE id = ? AND email_verified_at IS NULL AND account_status = 'active'`)
        .bind(name, passwordDigest, created, verificationUserId),
      env.DB.prepare(`UPDATE email_tokens SET used_at = ? WHERE user_id = ? AND purpose = 'verify_email' AND used_at IS NULL`)
        .bind(created, verificationUserId),
    ]);
  }

  const token = await issueEmailToken(env, { userId: verificationUserId, email, purpose: "verify_email" });
  const link = emailUrl(env, "/api/members/verify", token, locale);
  const copy = ACCOUNT_COPY[locale];
  try {
    await sendMail(env, email, copy.verifySubject, `${copy.verifyLinkIntro}\n${link}`, `<p>${copy.verifyLinkIntro}</p><p><a href="${link}">${copy.verifyButton}</a></p>`);
  } catch {
    return json({ error: "verification_email_failed" }, 503);
  }
  return json({ ok: true }, 202);
}

async function resendVerification(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  if (!env.AUTH_PEPPER || !isMailConfigured(env) || !env.SITE_ORIGIN) return json({ error: "verification_unavailable" }, 503);
  const body = await readJson(request);
  const locale = localeFrom(body?.locale);
  const copy = ACCOUNT_COPY[locale];
  const email = normalizeEmail(body?.email);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!await rateLimitIdentity(env.DB, env.AUTH_PEPPER, "verify-resend", ip, email || "invalid", 12, 4, 60 * 60 * 1000)) return json({ error: "rate_limited" }, 429);
  const user = email ? await env.DB.prepare(`SELECT id, email, school_email FROM users WHERE email = ? AND (email_verified_at IS NULL OR school_email_verified_at IS NULL) AND account_status = 'active'`).bind(email).first() : null;
  if (user) {
    const time = nowIso();
    await env.DB.prepare(`UPDATE email_tokens SET used_at = ? WHERE user_id = ? AND purpose IN ('verify_email','verify_school') AND used_at IS NULL`).bind(time, user.id).run();
    try {
      if (user.school_email) {
        const personalCode = await issueVerificationCode(env, { userId: user.id, email: user.email, purpose: "verify_email" });
        const schoolCode = await issueVerificationCode(env, { userId: user.id, email: user.school_email, purpose: "verify_school" });
        const validity = locale === "nl" ? "De code is 10 minuten geldig." : locale === "de" ? "Der Code ist 10 Minuten gültig." : "The code is valid for 10 minutes.";
        await Promise.all([
          sendMail(env, user.email, copy.verifySubject, `${copy.verifyIntro}\n${personalCode}\n${validity}`, `<p>${copy.verifyIntro}</p><p><strong>${personalCode}</strong></p><p>${validity}</p>`),
          sendMail(env, user.school_email, copy.schoolVerifySubject, `${copy.schoolVerifyIntro}\n${schoolCode}\n${validity}`, `<p>${copy.schoolVerifyIntro}</p><p><strong>${schoolCode}</strong></p><p>${validity}</p>`),
        ]);
      } else {
        const token = await issueEmailToken(env, { userId: user.id, email: user.email, purpose: "verify_email" });
        const link = emailUrl(env, "/api/members/verify", token, locale);
        await sendMail(env, user.email, copy.verifySubject, `${copy.verifyLinkIntro}\n${link}`, `<p>${copy.verifyLinkIntro}</p><p><a href="${link}">${copy.verifyButton}</a></p>`);
      }
    } catch {
      return json({ error: "verification_email_failed" }, 503);
    }
  }
  return json({ ok: true, message: copy.resendGeneric }, 202);
}

async function verifyRegistrationCodes(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  if (!env.AUTH_PEPPER) return json({ error: "verification_unavailable" }, 503);
  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  const personalCode = typeof body?.personalCode === "string" ? body.personalCode.trim() : "";
  const schoolCode = typeof body?.schoolCode === "string" ? body.schoolCode.trim() : "";
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!await rateLimitIdentity(env.DB, env.AUTH_PEPPER, "verify-codes", ip, email || "invalid", 20, 8, 60 * 60 * 1000)) return json({ error: "rate_limited" }, 429);
  if (!email || !/^\d{6}$/.test(personalCode) || !/^\d{6}$/.test(schoolCode)) return json({ error: "invalid_codes" }, 400);
  const user = await env.DB.prepare(`SELECT id, email, school_email FROM users WHERE email = ? AND account_status = 'active'`).bind(email).first();
  if (!user?.school_email || user.email === user.school_email) return json({ error: "invalid_codes" }, 400);
  const [personal, school] = await Promise.all([
    env.DB.prepare(`SELECT token_hash FROM email_tokens WHERE user_id=? AND email=? AND purpose='verify_email' AND token_hash=? AND used_at IS NULL AND expires_at>?`).bind(user.id, user.email, await hmac(env.AUTH_PEPPER, `verification-code:${user.id}:verify_email:${personalCode}`), nowIso()).first(),
    env.DB.prepare(`SELECT token_hash FROM email_tokens WHERE user_id=? AND email=? AND purpose='verify_school' AND token_hash=? AND used_at IS NULL AND expires_at>?`).bind(user.id, user.school_email, await hmac(env.AUTH_PEPPER, `verification-code:${user.id}:verify_school:${schoolCode}`), nowIso()).first(),
  ]);
  if (!personal || !school) return json({ error: "invalid_codes" }, 400);
  const time = nowIso();
  await env.DB.batch([
    env.DB.prepare(`UPDATE users SET email_verified_at=COALESCE(email_verified_at, ?), school_email_verified_at=COALESCE(school_email_verified_at, ?), updated_at=? WHERE id=?`).bind(time, time, time, user.id),
    env.DB.prepare(`UPDATE email_tokens SET used_at=? WHERE user_id=? AND purpose IN ('verify_email','verify_school') AND used_at IS NULL`).bind(time, user.id),
    env.DB.prepare(`UPDATE newsletter_subscriptions SET status='subscribed', confirmed_at=COALESCE(confirmed_at, ?), unsubscribed_at=NULL, updated_at=? WHERE user_id=? AND email=? AND source='account-registration' AND status='pending'`).bind(time, time, user.id, user.email),
  ]);
  const token = await createSession(env, user.id);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token) });
}

async function verifyEmailPage(request, env) {
  const locale = requestLocale(request);
  const copy = ACCOUNT_COPY[locale];
  const token = new URL(request.url).searchParams.get("token") || "";
  const row = await env.DB.prepare(`SELECT token_hash FROM email_tokens WHERE token_hash = ? AND purpose = 'verify_email' AND used_at IS NULL AND expires_at > ?`)
    .bind(await digest(token), nowIso()).first();
  if (!row) return accountResultPage(locale, copy.verifyExpiredTitle, copy.verifyExpired);
  return accountMessage(locale, copy.verifyButton, copy.verifyLinkIntro, token, "/api/members/verify", copy.verifyButton);
}

async function verifyEmail(request, env) {
  if (!sameOriginFormNavigation(request, env)) return json({ error: "origin" }, 403);
  const parsed = await readLimitedFormData(request, 16_000);
  if (parsed.tooLarge) return json({ error: "form_too_large" }, 413);
  if (!parsed.form) return json({ error: "invalid_form" }, 400);
  const form = parsed.form;
  const locale = localeFrom(form.get("locale"));
  const token = String(form.get("token") || "");
  const tokenHash = await digest(token);
  const row = await env.DB.prepare(`SELECT user_id FROM email_tokens WHERE token_hash = ? AND purpose = 'verify_email' AND used_at IS NULL AND expires_at > ?`)
    .bind(tokenHash, nowIso()).first();
  if (!row?.user_id) return accountResultPage(locale, ACCOUNT_COPY[locale].verifyExpiredTitle, ACCOUNT_COPY[locale].usedExpired);
  const time = nowIso();
  await env.DB.batch([
    env.DB.prepare(`UPDATE users SET email_verified_at = COALESCE(email_verified_at, ?), updated_at = ? WHERE id = ?`).bind(time, time, row.user_id),
    env.DB.prepare(`UPDATE email_tokens SET used_at = ? WHERE token_hash = ? AND used_at IS NULL`).bind(time, tokenHash),
  ]);
  return redirect(`${env.SITE_ORIGIN}/${locale}/account?verified=1`);
}

async function login(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  if (!env.AUTH_PEPPER) return json({ error: "login_unavailable" }, 503);
  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || password.length > 128) return json({ error: "invalid_credentials" }, 401);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!await rateLimitIdentity(env.DB, env.AUTH_PEPPER, "login", ip, email, 30, 8, 15 * 60 * 1000)) return json({ error: "rate_limited" }, 429);
  const user = await env.DB.prepare(`SELECT id, email, password_hash, email_verified_at, account_status FROM users WHERE email = ?`).bind(email).first();
  // Always pay the PBKDF2 cost, including for missing or inactive accounts, to
  // avoid exposing account existence through login response timing.
  const passwordMatches = await verifyPassword(password, user?.password_hash || DUMMY_PASSWORD_HASH, env.AUTH_PEPPER);
  const valid = Boolean(user && user.account_status === "active" && passwordMatches);
  if (!valid) return json({ error: "invalid_credentials" }, 401);
  if (!user.email_verified_at) return json({ error: "email_unverified", message: "Bevestig eerst uw e-mailadres." }, 403);
  const token = await createSession(env, user.id);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token) });
}

async function logout(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const token = cookieValue(request);
  if (token) await env.DB.prepare(`UPDATE sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL`).bind(nowIso(), await digest(token)).run();
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
}

async function me(request, env) {
  const user = await sessionUser(request, env);
  if (!user) return json({ user: null }, 401);
  const allowedEmails = String(env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const allowedIps = String(env.ADMIN_IPS || "").split(",").map((ip) => ip.trim().toLowerCase()).filter(Boolean);
  const clientIp = String(request.headers.get("CF-Connecting-IP") || "").trim().toLowerCase();
  const isAdmin = allowedEmails.includes(user.email.toLowerCase()) && Boolean(clientIp && allowedIps.includes(clientIp));
  const [application, pass] = await Promise.all([
    env.DB.prepare(`SELECT status, education_level, institution, study_city, submitted_at, reviewed_at FROM student_applications WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1`).bind(user.id).first(),
    env.DB.prepare(`SELECT p.id, p.status, p.issued_at, p.expires_at FROM student_passes p JOIN student_applications a ON a.id = p.application_id WHERE p.user_id = ? AND p.status = 'active' AND p.revoked_at IS NULL AND a.status = 'approved' ORDER BY a.reviewed_at DESC, p.issued_at DESC LIMIT 1`).bind(user.id).first(),
  ]);
  let discountPass = null;
  if (pass && env.PASS_SIGNING_KEY && (!pass.expires_at || pass.expires_at > nowIso())) {
    const code = `${pass.id}.${await hmac(env.PASS_SIGNING_KEY, pass.id)}`;
    discountPass = { code, issuedAt: pass.issued_at, expiresAt: pass.expires_at };
  }
  const subscription = await env.DB.prepare(`SELECT status FROM newsletter_subscriptions WHERE email = ?`).bind(user.email).first();
  return json({ user: { id: user.id, name: user.full_name, email: user.email }, isAdmin, studentApplication: application || null, discountPass, newsletter: subscription?.status || "not-subscribed" });
}

async function requestPasswordReset(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  if (!isMailConfigured(env) || !env.SITE_ORIGIN) return json({ error: "reset_unavailable" }, 503);
  if (!env.AUTH_PEPPER) return json({ error: "reset_unavailable" }, 503);
  const body = await readJson(request);
  const locale = localeFrom(body?.locale);
  const copy = ACCOUNT_COPY[locale];
  const email = normalizeEmail(body?.email);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!await rateLimitIdentity(env.DB, env.AUTH_PEPPER, "reset", ip, email || "invalid", 15, 5, 60 * 60 * 1000)) return json({ error: "rate_limited" }, 429);
  if (email) {
    const user = await env.DB.prepare(`SELECT id FROM users WHERE email = ? AND email_verified_at IS NOT NULL AND account_status = 'active'`).bind(email).first();
    if (user) {
      const token = await issueEmailToken(env, { userId: user.id, email, purpose: "password_reset" });
      const link = emailUrl(env, "/api/members/password-reset/confirm", token, locale);
      try {
        const note = locale === "nl" ? "De link is één uur geldig. Heeft u dit niet aangevraagd? Negeer deze e-mail." : locale === "de" ? "Der Link ist eine Stunde gültig. Wenn Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail." : "The link is valid for one hour. If you did not request this, ignore this email.";
        await sendMail(env, email, copy.resetSubject, `${copy.resetIntro}\n${link}\n${note}`, `<p>${copy.resetIntro}</p><p><a href="${link}">${copy.resetButton}</a></p><p>${note}</p>`);
      } catch { /* Keep the response identical for existing and unknown addresses. */ }
    }
  }
  return json({ ok: true, message: copy.resetGeneric }, 202);
}

async function passwordResetPage(request, env) {
  const locale = requestLocale(request);
  const copy = ACCOUNT_COPY[locale];
  const token = new URL(request.url).searchParams.get("token") || "";
  const row = await env.DB.prepare(`SELECT token_hash FROM email_tokens WHERE token_hash = ? AND purpose = 'password_reset' AND used_at IS NULL AND expires_at > ?`)
    .bind(await digest(token), nowIso()).first();
  if (!row) return accountResultPage(locale, copy.resetExpiredTitle, copy.resetExpired);
  return html(`<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(copy.resetTitle)}</title><body style="font:16px system-ui;max-width:38rem;margin:8vh auto;padding:1.5rem;color:#102f42"><main><h1>${escapeHtml(copy.resetTitle)}</h1><form method="post" action="/api/members/password-reset/confirm"><input type="hidden" name="token" value="${escapeHtml(token)}"><input type="hidden" name="locale" value="${locale}"><label>${escapeHtml(copy.resetLabel)}<input name="password" type="password" minlength="12" maxlength="128" required autocomplete="new-password"></label><button>${escapeHtml(copy.resetButton)}</button></form></main></body></html>`);
}

async function confirmPasswordReset(request, env) {
  if (!sameOriginFormNavigation(request, env)) return json({ error: "origin" }, 403);
  const parsed = await readLimitedFormData(request, 16_000);
  if (parsed.tooLarge) return json({ error: "form_too_large" }, 413);
  if (!parsed.form) return json({ error: "invalid_form" }, 400);
  const form = parsed.form;
  const locale = localeFrom(form.get("locale"));
  const tokenHash = await digest(String(form.get("token") || ""));
  const password = String(form.get("password") || "");
  if (password.length < 12 || password.length > 128 || !env.AUTH_PEPPER) return json({ error: "invalid_password" }, 400);
  const token = await env.DB.prepare(`SELECT user_id FROM email_tokens WHERE token_hash = ? AND purpose = 'password_reset' AND used_at IS NULL AND expires_at > ?`).bind(tokenHash, nowIso()).first();
  if (!token?.user_id) return accountResultPage(locale, ACCOUNT_COPY[locale].resetExpiredTitle, ACCOUNT_COPY[locale].usedExpired);
  const time = nowIso();
  const newHash = await passwordHash(password, env.AUTH_PEPPER);
  await env.DB.batch([
    env.DB.prepare(`UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`).bind(newHash, time, token.user_id),
    env.DB.prepare(`UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL`).bind(time, token.user_id),
    env.DB.prepare(`UPDATE email_tokens SET used_at = ? WHERE token_hash = ? AND used_at IS NULL`).bind(time, tokenHash),
  ]);
  return redirect(`${env.SITE_ORIGIN}/${locale}/account?password-reset=1`);
}

function proofMime(file) {
  if (!file || file.size < 8 || file.size > MAX_PROOF_BYTES) return "";
  return file.type === "application/pdf" || file.type === "image/jpeg" || file.type === "image/png" ? file.type : "";
}

async function validProofBytes(file, mime) {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (mime === "application/pdf") return decoder.decode(head.slice(0, 5)) === "%PDF-";
  if (mime === "image/png") return head[0] === 0x89 && decoder.decode(head.slice(1, 4)) === "PNG";
  if (mime === "image/jpeg") return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  return false;
}

async function submitStudentApplication(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const user = await sessionUser(request, env);
  if (!user) return json({ error: "authentication_required" }, 401);
  const verifiedAddresses = await env.DB.prepare(`SELECT school_email, school_email_verified_at FROM users WHERE id=?`).bind(user.id).first();
  if (!verifiedAddresses?.school_email || !verifiedAddresses.school_email_verified_at) return json({ error: "student_emails_unverified" }, 403);
  if (!env.AUTH_PEPPER) return json({ error: "application_unavailable" }, 503);
  const applicationLimitKey = await hmac(env.AUTH_PEPPER, `student-application:${user.id}`);
  if (!await rateLimit(env.DB, applicationLimitKey, 4, 24 * 60 * 60 * 1000)) return json({ error: "rate_limited" }, 429);
  const parsed = await readLimitedFormData(request, 64_000);
  if (parsed.tooLarge) return json({ error: "form_too_large" }, 413);
  if (!parsed.form) return json({ error: "invalid_form" }, 400);
  const form = parsed.form;
  const institution = String(form.get("institution") || "").trim().slice(0, 180);
  const level = String(form.get("educationLevel") || "");
  const studyCity = String(form.get("studyCity") || "").trim().replace(/\s+/g, " ").slice(0, 120);
  if (!institution || !studyCity || !["mbo", "hbo", "wo"].includes(level)) {
    return json({ error: "invalid_application", message: "Controleer uw onderwijsinstelling, opleidingsniveau en studiestad." }, 400);
  }
  const existing = await env.DB.prepare(`SELECT status FROM student_applications WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1`).bind(user.id).first();
  if (existing?.status === "pending") return json({ error: "application_exists" }, 409);
  if (existing?.status === "approved") {
    const currentPass = await env.DB.prepare(`SELECT expires_at FROM student_passes WHERE user_id = ? AND status = 'active' AND revoked_at IS NULL ORDER BY issued_at DESC LIMIT 1`).bind(user.id).first();
    if (!currentPass?.expires_at || currentPass.expires_at > nowIso()) return json({ error: "application_exists" }, 409);
  }

  const id = crypto.randomUUID();
  const submittedAt = nowIso();
  try {
    await env.DB.prepare(`INSERT INTO student_applications (id, user_id, institution, education_level, study_city, eligibility_method, proof_object_key, proof_mime_type, proof_consent_version, proof_consent_at, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, 'verified-school-email', NULL, 'application/pdf', 'not-applicable-school-email-v1', ?, 'pending', ?)`)
      .bind(id, user.id, institution, level, studyCity, submittedAt, submittedAt).run();
  } catch {
    return json({ error: "application_unavailable" }, 503);
  }
  return json({ ok: true, status: "pending" }, 202);
}

async function adminQueue(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const rows = await env.DB.prepare(`SELECT a.id, a.institution, a.education_level, a.study_city, a.submitted_at, a.proof_object_key IS NOT NULL AS has_proof, u.full_name, u.email FROM student_applications a JOIN users u ON u.id=a.user_id WHERE a.status='pending' ORDER BY a.submitted_at ASC LIMIT 100`).all();
  return json({ applications: rows.results || [] });
}

async function adminProof(request, env, applicationId) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const application = await env.DB.prepare(`SELECT id, proof_object_key, proof_mime_type FROM student_applications WHERE id = ? AND status = 'pending'`).bind(applicationId).first();
  if (!application?.proof_object_key) return json({ error: "proof_not_found" }, 404);
  try {
    if (!await allowProofOperation(env, "get")) return json({ error: "proof_storage_usage_limit_reached" }, 429);
  } catch {
    return json({ error: "proof_storage_unavailable" }, 503);
  }
  const object = await env.STUDENT_PROOFS.get(application.proof_object_key);
  if (!object) return json({ error: "proof_not_found" }, 404);
  await env.DB.prepare(`INSERT INTO admin_audit_log (id, reviewer_user_id, action, application_id, occurred_at) VALUES (?, ?, 'proof_viewed', ?, ?)`)
    .bind(crypto.randomUUID(), admin.id, application.id, nowIso()).run();
  return new Response(object.body, { headers: {
    "Content-Type": application.proof_mime_type,
    "Content-Disposition": `attachment; filename="studentbewijs-${application.id}.${application.proof_mime_type === "application/pdf" ? "pdf" : application.proof_mime_type === "image/png" ? "png" : "jpg"}"`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  } });
}

async function adminDecision(request, env, applicationId) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const body = await readJson(request);
  const decision = body?.decision;
  if (decision !== "approved" && decision !== "rejected") return json({ error: "invalid_decision" }, 400);
  const application = await env.DB.prepare(`SELECT id, user_id, proof_object_key, status FROM student_applications WHERE id = ?`).bind(applicationId).first();
  if (!application || application.status !== "pending") return json({ error: "application_not_pending" }, 409);
  const time = nowIso();
  const expiresAt = decision === "approved" ? oneStudyYearFrom(time) : null;
  const passId = decision === "approved" ? crypto.randomUUID() : null;
  const passCode = passId && env.PASS_SIGNING_KEY ? `${passId}.${await hmac(env.PASS_SIGNING_KEY, passId)}` : null;
  if (decision === "approved" && !passCode) return json({ error: "pass_signing_unavailable" }, 503);
  const statements = [
    env.DB.prepare(`UPDATE student_applications SET status = ?, reviewed_at = ?, reviewed_by = ?, reviewer_note = ? WHERE id = ? AND status = 'pending'`)
      .bind(decision, time, admin.id, String(body?.note || "").trim().slice(0, 500) || null, applicationId),
  ];
  if (passId && passCode) statements.push(env.DB.prepare(`INSERT INTO student_passes (id, user_id, application_id, public_code_hash, status, issued_at, expires_at) SELECT ?, user_id, id, ?, 'active', ?, ? FROM student_applications WHERE id = ? AND status = 'approved' AND reviewed_by = ? AND reviewed_at = ?`)
    .bind(passId, await digest(passCode), time, expiresAt, applicationId, admin.id, time));
  statements.push(env.DB.prepare(`INSERT INTO admin_audit_log (id, reviewer_user_id, action, application_id, occurred_at)
    SELECT ?, ?, ?, ?, ? WHERE EXISTS (
      SELECT 1 FROM student_applications WHERE id = ? AND status = ? AND reviewed_by = ? AND reviewed_at = ?
    )`)
    .bind(crypto.randomUUID(), admin.id, decision === "approved" ? "application_approved" : "application_rejected", applicationId, time, applicationId, decision, admin.id, time));
  let results;
  try { results = await env.DB.batch(statements); } catch { return json({ error: "decision_not_saved" }, 409); }
  // Another reviewer may have decided after our initial pending-state read.
  // The conditional audit insert and pass creation stay in the same atomic
  // batch; report conflict rather than a false success for the losing review.
  if (Number(results?.[0]?.meta?.changes || 0) !== 1) return json({ error: "application_not_pending" }, 409);

  let proofDeleted = !application.proof_object_key;
  if (application.proof_object_key) {
    try {
      await deleteStudentProof(env, application.proof_object_key);
      await env.DB.prepare(`UPDATE student_applications SET proof_object_key = NULL, proof_deleted_at = ? WHERE id = ?`).bind(nowIso(), applicationId).run();
      proofDeleted = true;
    } catch { /* Keep the key private so an admin can retry cleanup; never grant access after review. */ }
  }
  return json({ ok: true, decision, proofDeleted });
}

async function verifyPass(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const body = await readJson(request);
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (code.length > 160 || !code.includes(".") || !env.PASS_SIGNING_KEY) return json({ valid: false }, 400);
  const [id, signature] = code.split(".", 2);
  if (!id || !signature || !safeEqual(signature, await hmac(env.PASS_SIGNING_KEY, id))) return json({ valid: false });
  const pass = await env.DB.prepare(`SELECT p.status, p.expires_at, p.revoked_at, a.status AS application_status, u.full_name FROM student_passes p JOIN users u ON u.id=p.user_id JOIN student_applications a ON a.id=p.application_id AND a.user_id=p.user_id WHERE p.id = ?`)
    .bind(id).first();
  const valid = pass?.status === "active" && !pass.revoked_at && pass.application_status === "approved" && (!pass.expires_at || pass.expires_at > nowIso());
  if (!valid) return json({ valid: false });
  const storedCode = await env.DB.prepare(`SELECT public_code_hash FROM student_passes WHERE id = ?`).bind(id).first();
  if (!safeEqual(await digest(code), storedCode?.public_code_hash)) return json({ valid: false });
  return json({ valid: true, name: pass.full_name, discountPercent: 10, eligibleProducts: ["assortiment"] });
}

async function subscribeNewsletter(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  if (!isMailConfigured(env) || !env.SITE_ORIGIN) return json({ error: "newsletter_unavailable" }, 503);
  const body = await readJson(request);
  const locale = localeFrom(body?.locale);
  const copy = ACCOUNT_COPY[locale];
  const email = normalizeEmail(body?.email);
  const regionTag = String(body?.regionTag || "");
  const draftToken = typeof body?.draftToken === "string" ? body.draftToken : "";
  if (!email || body?.consent !== true || !["leiden", "voorschoten", "wassenaar", "leidschendam", "regio-071", "elders"].includes(regionTag)) return json({ error: "consent_required" }, 400);
  if (!env.AUTH_PEPPER) return json({ error: "newsletter_unavailable" }, 503);
  if (draftToken) {
    const draft = await env.DB.prepare(`SELECT email FROM newsletter_signup_drafts WHERE token_hash=? AND expires_at>?`).bind(await digest(draftToken), nowIso()).first();
    if (!draft || draft.email !== email) return json({ error: "signup_expired" }, 410);
  }
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!await rateLimitIdentity(env.DB, env.AUTH_PEPPER, "newsletter", ip, email, 12, 4, 60 * 60 * 1000)) return json({ error: "rate_limited" }, 429);
  const at = nowIso();
  const user = await sessionUser(request, env);
  await env.DB.prepare(`INSERT INTO newsletter_subscriptions (email, user_id, status, consent_text_version, consented_at, confirmed_at, source, created_at, updated_at, region_tag) VALUES (?, ?, 'subscribed', ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET user_id=COALESCE(excluded.user_id, newsletter_subscriptions.user_id), status='subscribed', consent_text_version=excluded.consent_text_version, consented_at=excluded.consented_at, confirmed_at=excluded.confirmed_at, unsubscribed_at=NULL, source=excluded.source, updated_at=excluded.updated_at, region_tag=excluded.region_tag`)
    .bind(email, user?.email === email ? user.id : null, NEWSLETTER_CONSENT_VERSION, at, at, user ? "account" : "newsletter-form", at, at, regionTag).run();
  if (draftToken) await env.DB.prepare(`DELETE FROM newsletter_signup_drafts WHERE token_hash=?`).bind(await digest(draftToken)).run();
  return json({ ok: true, message: copy.alreadySubscribed }, 202);
}

async function startNewsletterSignup(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  if (!env.AUTH_PEPPER || !isMailConfigured(env) || !env.SITE_ORIGIN) return json({ error: "newsletter_unavailable" }, 503);
  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  if (!email) return json({ error: "invalid_email" }, 400);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (!await rateLimitIdentity(env.DB, env.AUTH_PEPPER, "newsletter-draft", ip, email, 12, 5, 60 * 60 * 1000)) return json({ error: "rate_limited" }, 429);
  const token = await randomToken();
  const now = nowIso();
  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  await env.DB.prepare(`INSERT INTO newsletter_signup_drafts (token_hash, email, created_at, expires_at) VALUES (?, ?, ?, ?)`)
    .bind(await digest(token), email, now, expires).run();
  return json({ ok: true, draftToken: token, expiresAt: expires }, 201);
}

async function newsletterConfirmPage(request, env) {
  const locale = requestLocale(request);
  const copy = ACCOUNT_COPY[locale];
  const token = new URL(request.url).searchParams.get("token") || "";
  const row = await env.DB.prepare(`SELECT token_hash FROM email_tokens WHERE token_hash = ? AND purpose = 'newsletter_confirm' AND used_at IS NULL AND expires_at > ?`)
    .bind(await digest(token), nowIso()).first();
  if (!row) return accountResultPage(locale, copy.newsletterExpiredTitle, copy.newsletterExpired);
  return accountMessage(locale, copy.newsletterTitle, copy.newsletterIntro, token, "/api/members/newsletter/confirm", copy.newsletterButton);
}

async function confirmNewsletter(request, env) {
  if (!sameOriginFormNavigation(request, env)) return json({ error: "origin" }, 403);
  const parsed = await readLimitedFormData(request, 16_000);
  if (parsed.tooLarge) return json({ error: "form_too_large" }, 413);
  if (!parsed.form) return json({ error: "invalid_form" }, 400);
  const form = parsed.form;
  const locale = localeFrom(form.get("locale"));
  const copy = ACCOUNT_COPY[locale];
  const tokenHash = await digest(String(form.get("token") || ""));
  const token = await env.DB.prepare(`SELECT email FROM email_tokens WHERE token_hash = ? AND purpose = 'newsletter_confirm' AND used_at IS NULL AND expires_at > ?`).bind(tokenHash, nowIso()).first();
  if (!token?.email) return accountResultPage(locale, copy.newsletterExpiredTitle, copy.usedExpired);
  const time = nowIso();
  await env.DB.batch([
    env.DB.prepare(`UPDATE newsletter_subscriptions SET status='subscribed', confirmed_at=?, updated_at=? WHERE email=? AND status='pending'`).bind(time, time, token.email),
    env.DB.prepare(`UPDATE email_tokens SET used_at=? WHERE token_hash=? AND used_at IS NULL`).bind(time, tokenHash),
  ]);
  // Legacy double-opt-in links remain valid, but no standalone confirmation
  // or unsubscribe email is sent. Every campaign creates its own opt-out link.
  return redirect(`${env.SITE_ORIGIN}/${locale}/account?newsletter=confirmed`);
}

async function unsubscribePage(request, env) {
  const locale = requestLocale(request);
  const copy = ACCOUNT_COPY[locale];
  const token = new URL(request.url).searchParams.get("token") || "";
  const row = await env.DB.prepare(`SELECT token_hash FROM email_tokens WHERE token_hash = ? AND purpose='newsletter_unsubscribe' AND used_at IS NULL AND expires_at > ?`).bind(await digest(token), nowIso()).first();
  if (!row) return accountResultPage(locale, copy.unsubscribeExpiredTitle, copy.unsubscribeExpired);
  return accountMessage(locale, copy.unsubscribeTitle, copy.unsubscribeIntro, token, "/api/members/newsletter/unsubscribe", copy.unsubscribeButton);
}

async function unsubscribeNewsletter(request, env) {
  if (!sameOriginFormNavigation(request, env)) return json({ error: "origin" }, 403);
  const parsed = await readLimitedFormData(request, 16_000);
  if (parsed.tooLarge) return json({ error: "form_too_large" }, 413);
  if (!parsed.form) return json({ error: "invalid_form" }, 400);
  const form = parsed.form;
  const locale = localeFrom(form.get("locale"));
  const copy = ACCOUNT_COPY[locale];
  const tokenHash = await digest(String(form.get("token") || ""));
  const token = await env.DB.prepare(`SELECT email FROM email_tokens WHERE token_hash = ? AND purpose='newsletter_unsubscribe' AND used_at IS NULL AND expires_at > ?`).bind(tokenHash, nowIso()).first();
  if (!token?.email) return accountResultPage(locale, copy.unsubscribeExpiredTitle, copy.usedExpired);
  const time = nowIso();
  await env.DB.batch([
    env.DB.prepare(`UPDATE newsletter_subscriptions SET status='unsubscribed', unsubscribed_at=?, updated_at=? WHERE email=?`).bind(time, time, token.email),
    env.DB.prepare(`UPDATE email_tokens SET used_at=? WHERE token_hash=? AND used_at IS NULL`).bind(time, tokenHash),
  ]);
  return accountResultPage(locale, copy.unsubscribeDoneTitle, copy.unsubscribeDone, 200);
}

async function adminNewsletterCampaigns(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const campaigns = await env.DB.prepare(`
    SELECT id, subject, audience, status, recipient_count, sent_count, failed_count, created_at, queued_at, completed_at
    FROM newsletter_campaigns ORDER BY created_at DESC LIMIT 50
  `).all();
  const subscriberCount = await env.DB.prepare(`SELECT COUNT(*) AS count FROM newsletter_subscriptions WHERE status = 'subscribed'`).first();
  const studentSubscriberCount = await env.DB.prepare(`SELECT COUNT(*) AS count FROM newsletter_subscriptions n WHERE n.status='subscribed' AND EXISTS (
    SELECT 1 FROM users u JOIN student_passes p ON p.user_id=u.id JOIN student_applications a ON a.id=p.application_id AND a.user_id=u.id
    WHERE u.id=n.user_id AND u.email=n.email AND u.account_status='active' AND u.email_verified_at IS NOT NULL
      AND p.status='active' AND p.revoked_at IS NULL AND p.expires_at>? AND a.status='approved'
  )`).bind(nowIso()).first();
  const subscriberRegions = await env.DB.prepare(`SELECT region_tag, COUNT(*) AS count FROM newsletter_subscriptions WHERE status = 'subscribed' GROUP BY region_tag ORDER BY region_tag`).all();
  return json({ campaigns: campaigns.results || [], subscriberCount: Number(subscriberCount?.count || 0), studentSubscriberCount: Number(studentSubscriberCount?.count || 0), subscriberRegions: subscriberRegions.results || [] });
}

async function createNewsletterCampaign(request, env) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const body = await readJson(request);
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const content = typeof body?.body === "string" ? body.body.trim() : "";
  const audience = body?.audience;
  if (!subject || subject.length > 140 || /[\r\n]/.test(subject) || !content || content.length > 3000 || !["all", "students"].includes(audience)) {
    return json({ error: "invalid_campaign" }, 400);
  }
  const id = crypto.randomUUID();
  const at = nowIso();
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO newsletter_campaigns (id, subject, body_text, audience, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(id, subject, content, audience, admin.id, at),
    env.DB.prepare(`INSERT INTO admin_audit_log (id, reviewer_user_id, action, occurred_at) VALUES (?, ?, 'newsletter_campaign_created', ?)`)
      .bind(crypto.randomUUID(), admin.id, at),
  ]);
  return json({ ok: true, id }, 201);
}

async function sendNewsletterCampaign(request, env, campaignId) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const campaign = await env.DB.prepare(`SELECT id, status, audience FROM newsletter_campaigns WHERE id = ?`).bind(campaignId).first();
  if (!campaign || campaign.status !== "draft") return json({ error: "campaign_not_draft" }, 409);
  const queuedAt = nowIso();
  const studentFilter = campaign.audience === "students" ? `AND EXISTS (
    SELECT 1 FROM users u JOIN student_passes p ON p.user_id=u.id JOIN student_applications a ON a.id=p.application_id AND a.user_id=u.id
    WHERE u.id=n.user_id AND u.email=n.email AND u.account_status='active' AND u.email_verified_at IS NOT NULL
      AND p.status='active' AND p.revoked_at IS NULL AND p.expires_at>'${queuedAt}' AND a.status='approved'
  )` : "";
  const recipients = `SELECT n.email FROM newsletter_subscriptions n WHERE n.status='subscribed' ${studentFilter}`;
  let results;
  try {
    results = await env.DB.batch([
      env.DB.prepare(`UPDATE newsletter_campaigns SET
        status=CASE WHEN EXISTS (${recipients}) THEN 'queued' ELSE 'sent' END,
        recipient_count=(SELECT COUNT(*) FROM (${recipients})),
        queued_at=?, completed_at=CASE WHEN EXISTS (${recipients}) THEN NULL ELSE ? END
        WHERE id=? AND status='draft'`).bind(queuedAt, queuedAt, campaignId),
      env.DB.prepare(`INSERT INTO newsletter_deliveries (campaign_id, email, status, next_attempt_at)
        SELECT ?, n.email, 'pending', ? FROM newsletter_subscriptions n
        WHERE n.status='subscribed' ${studentFilter} AND EXISTS (SELECT 1 FROM newsletter_campaigns WHERE id=? AND status='queued')`)
        .bind(campaignId, queuedAt, campaignId),
    ]);
  } catch {
    return json({ error: "campaign_not_draft" }, 409);
  }
  if (!Number(results[0]?.meta?.changes || 0)) return json({ error: "campaign_not_draft" }, 409);
  const recipientCount = Number(results[1]?.meta?.changes || 0);
  await env.DB.prepare(`INSERT INTO admin_audit_log (id, reviewer_user_id, action, occurred_at) VALUES (?, ?, 'newsletter_campaign_sent', ?)`)
    .bind(crypto.randomUUID(), admin.id, queuedAt).run();
  return json({ ok: true, recipientCount, status: recipientCount ? "queued" : "sent" }, 202);
}

async function sendSmtpDiagnostic(request, env) {
  if (env.SMTP_DIAGNOSTICS !== "on" || !env.SMTP_TEST_TO) return json({ error: "not_found" }, 404);
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const ip = String(request.headers.get("CF-Connecting-IP") || "").trim().toLowerCase();
  const allowedIps = String(env.ADMIN_IPS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  if (!ip || !allowedIps.includes(ip)) return json({ error: "forbidden" }, 403);
  if (!isMailConfigured(env) || !env.DB) return json({ error: "mail_unavailable" }, 503);
  const recipient = String(env.SMTP_TEST_TO).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) return json({ error: "mail_unavailable" }, 503);
  if (!await rateLimit(env.DB, `smtp-diagnostic:${ip}:${await digest(recipient)}`, 1, 24 * 60 * 60 * 1000)) {
    return json({ error: "rate_limited" }, 429);
  }
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  try {
    await sendMail(env, recipient, "Testmail Schaap’s Vishandel",
      `Dit is de eenmalige SMTP-bezorgtest. Tijdelijke testcode: ${code}. Deze code is geen account- of inlogcode.`,
      `<p>Dit is de eenmalige SMTP-bezorgtest.</p><p>Tijdelijke testcode: <strong>${code}</strong></p><p>Deze code is geen account- of inlogcode.</p>`);
    return json({ ok: true }, 202);
  } catch {
    return json({ error: "mail_delivery_failed" }, 502);
  }
}

async function checkSmtpAuthentication(request, env) {
  if (env.SMTP_DIAGNOSTICS !== "on") return json({ error: "not_found" }, 404);
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const clientIp = String(request.headers.get("CF-Connecting-IP") || "").trim().toLowerCase();
  const allowedIps = String(env.ADMIN_IPS || "").split(",").map((ip) => ip.trim().toLowerCase()).filter(Boolean);
  if (!clientIp || !allowedIps.includes(clientIp)) return json({ error: "forbidden" }, 403);
  if (!env.AUTH_PEPPER || !env.DB || !env.SMTP_HOST || !env.SMTP_USERNAME || !env.SMTP_PASSWORD || !env.MAIL_FROM) {
    return json({ error: "smtp_not_configured" }, 503);
  }
  if (!await rateLimitIdentity(env.DB, env.AUTH_PEPPER, "smtp-auth-diagnostic", clientIp, "knoth", 1, 1, 60 * 60 * 1000)) {
    return json({ error: "rate_limited" }, 429);
  }
  try {
    const smtp = await import("./smtp-worker.mjs");
    await smtp.verifySmtpAuthentication(env);
    return json({ ok: true, status: "authenticated" }, 200, { "Cache-Control": "no-store" });
  } catch (error) {
    const detail = typeof error?.message === "string" && /^smtp-check-[a-z0-9-]{1,120}$/.test(error.message)
      ? error.message
      : "smtp-check-failed";
    return json({ ok: false, error: detail }, 503, { "Cache-Control": "no-store" });
  }
}

async function processNewsletterDeliveries(env) {
  if (!isMailConfigured(env) || !env.SITE_ORIGIN) return;
  const now = new Date();
  const nowText = now.toISOString();
  const staleBefore = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
  const pending = await env.DB.prepare(`
    SELECT d.campaign_id, d.email, d.attempts, c.subject, c.body_text, c.audience
    FROM newsletter_deliveries d JOIN newsletter_campaigns c ON c.id=d.campaign_id
    WHERE c.status='queued' AND d.attempts < 5 AND (
      (d.status='pending' AND d.next_attempt_at <= ?) OR
      (d.status='sending' AND d.claimed_at <= ?)
    )
    ORDER BY d.next_attempt_at ASC LIMIT 10
  `).bind(nowText, staleBefore).all();

  for (const delivery of pending.results || []) {
    const claimed = await env.DB.prepare(`UPDATE newsletter_deliveries SET status='sending', attempts=attempts+1, claimed_at=? WHERE campaign_id=? AND email=? AND attempts < 5 AND ((status='pending' AND next_attempt_at <= ?) OR (status='sending' AND claimed_at <= ?)) RETURNING attempts`)
      .bind(nowText, delivery.campaign_id, delivery.email, nowText, staleBefore).first();
    if (!claimed) continue;
    try {
      const subscription = await env.DB.prepare(`SELECT status FROM newsletter_subscriptions WHERE email = ?`).bind(delivery.email).first();
      if (subscription?.status !== "subscribed") {
        await env.DB.prepare(`UPDATE newsletter_deliveries SET status='suppressed', claimed_at=NULL WHERE campaign_id=? AND email=?`)
          .bind(delivery.campaign_id, delivery.email).run();
        continue;
      }
      if (delivery.audience === "students") {
        const eligible = await env.DB.prepare(`SELECT 1 AS eligible FROM newsletter_subscriptions n WHERE n.email=? AND EXISTS (
          SELECT 1 FROM users u JOIN student_passes p ON p.user_id=u.id JOIN student_applications a ON a.id=p.application_id AND a.user_id=u.id
          WHERE u.id=n.user_id AND u.email=n.email AND u.account_status='active' AND u.email_verified_at IS NOT NULL
            AND p.status='active' AND p.revoked_at IS NULL AND p.expires_at>? AND a.status='approved'
        )`).bind(delivery.email, nowIso()).first();
        if (!eligible) {
          await env.DB.prepare(`UPDATE newsletter_deliveries SET status='suppressed', claimed_at=NULL WHERE campaign_id=? AND email=?`)
            .bind(delivery.campaign_id, delivery.email).run();
          continue;
        }
      }
      const token = await issueEmailToken(env, {
        email: delivery.email,
        purpose: "newsletter_unsubscribe",
        ttlMs: 10 * 365 * 24 * 60 * 60 * 1000,
      });
      const unsubscribeUrl = `${env.SITE_ORIGIN}/api/members/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
      const bodyHtml = escapeHtml(delivery.body_text).replace(/\n/g, "<br>");
      await sendMail(
        env,
        delivery.email,
        delivery.subject,
        `${delivery.body_text}\n\nU ontvangt dit bericht omdat u zich heeft aangemeld voor e-maildeals. Afmelden: ${unsubscribeUrl}`,
        `<main>${bodyHtml}</main><hr><p>U ontvangt dit bericht omdat u zich heeft aangemeld voor e-maildeals.</p><p><a href="${unsubscribeUrl}">Afmelden</a></p>`,
      );
      await env.DB.batch([
        env.DB.prepare(`UPDATE newsletter_deliveries SET status='sent', sent_at=?, claimed_at=NULL, last_error=NULL WHERE campaign_id=? AND email=?`).bind(nowText, delivery.campaign_id, delivery.email),
        env.DB.prepare(`UPDATE newsletter_campaigns SET sent_count=sent_count+1 WHERE id=?`).bind(delivery.campaign_id),
      ]);
    } catch (error) {
      const attempts = Number(claimed.attempts);
      const errorCode = String(error?.code || "delivery_failed").slice(0, 80);
      const dailyQuotaReached = errorCode === "E_DAILY_LIMIT_EXCEEDED";
      const retryAt = dailyQuotaReached
        ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString()
        : new Date(now.getTime() + Math.min(60, 2 ** attempts) * 60_000).toISOString();
      await env.DB.batch([
        env.DB.prepare(`UPDATE newsletter_deliveries SET status=?, attempts=CASE WHEN ? THEN MAX(0, attempts-1) ELSE attempts END, next_attempt_at=?, claimed_at=NULL, last_error=? WHERE campaign_id=? AND email=?`)
          .bind(attempts >= 5 && !dailyQuotaReached ? "failed" : "pending", dailyQuotaReached ? 1 : 0, retryAt, errorCode, delivery.campaign_id, delivery.email),
        ...(attempts >= 5 && !dailyQuotaReached ? [env.DB.prepare(`UPDATE newsletter_campaigns SET failed_count=failed_count+1 WHERE id=?`).bind(delivery.campaign_id)] : []),
      ]);
    }
  }

  await env.DB.prepare(`UPDATE newsletter_campaigns SET status=CASE WHEN EXISTS (SELECT 1 FROM newsletter_deliveries d WHERE d.campaign_id=newsletter_campaigns.id AND d.status IN ('pending','sending')) THEN 'queued' WHEN failed_count > 0 THEN 'partial_failure' ELSE 'sent' END, completed_at=CASE WHEN EXISTS (SELECT 1 FROM newsletter_deliveries d WHERE d.campaign_id=newsletter_campaigns.id AND d.status IN ('pending','sending')) THEN NULL ELSE COALESCE(completed_at, ?) END WHERE status='queued'`)
    .bind(nowText).run();
}

async function cleanupAnalytics(env) {
  if (!env.DB) return;
  const cutoff = new Date(Date.now() - 395 * 86_400_000).toISOString().slice(0, 10);
  try {
    await env.DB.prepare(`DELETE FROM site_analytics_daily WHERE day < ?`).bind(cutoff).run();
    await env.DB.prepare(`DELETE FROM auth_rate_limits WHERE updated_at < ?`).bind(new Date(Date.now() - 30 * 86_400_000).toISOString()).run();
  } catch { /* A later scheduled run retries retention cleanup. */ }
}

function routeApplicationPath(pathname) {
  const match = pathname.match(/^\/api\/members\/admin\/student-applications\/([0-9a-f-]+)(?:\/(proof|decision|cleanup))?$/i);
  return match ? { id: match[1], action: match[2] || "" } : null;
}

function routeCampaignPath(pathname) {
  const match = pathname.match(/^\/api\/members\/admin\/newsletter-campaigns\/([0-9a-f-]+)\/send$/i);
  return match?.[1] || "";
}

const memberWorker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";
    const method = request.method.toUpperCase();
    if (path === "/api/members/health" && method === "GET") {
      const enabled = env.MEMBERS_ENABLED === "on";
      return json({ status: enabled ? "ok" : "disabled" }, enabled ? 200 : 503);
    }
    if (env.MEMBERS_ENABLED !== "on") return json({ error: "members_disabled" }, 503);
    // Cloudflare Worker routes run before the site's page middleware. Until the
    // public launch flag is set, require the site's own unlock cookie or its
    // platform-trusted owner-IP allowlist before exposing any account endpoint.
    if (!siteAccessAllowed(request, env)) return json({ error: "site_access_required" }, 403);
    if (path === "/api/members/analytics" && method === "POST") return collectAnalytics(request, env);
    if (path === "/api/members/register" && method === "POST") return register(request, env);
    if (path === "/api/members/admin/register" && method === "POST") return registerAdministrator(request, env);
    if (path === "/api/members/verify/resend" && method === "POST") return resendVerification(request, env);
    if (path === "/api/members/verify" && method === "GET") return verifyEmailPage(request, env);
    if (path === "/api/members/verify" && method === "POST") return verifyEmail(request, env);
    if (path === "/api/members/verify-codes" && method === "POST") return verifyRegistrationCodes(request, env);
    if (path === "/api/members/login" && method === "POST") return login(request, env);
    if (path === "/api/members/logout" && method === "POST") return logout(request, env);
    if (path === "/api/members/me" && method === "GET") return me(request, env);
    if (path === "/api/members/password-reset" && method === "POST") return requestPasswordReset(request, env);
    if (path === "/api/members/password-reset/confirm" && method === "GET") return passwordResetPage(request, env);
    if (path === "/api/members/password-reset/confirm" && method === "POST") return confirmPasswordReset(request, env);
    if (path === "/api/members/student-application" && method === "POST") return submitStudentApplication(request, env);
    if (path === "/api/members/admin/smtp-test" && method === "POST") return sendSmtpDiagnostic(request, env);
    if (path === "/api/members/admin/smtp-check" && method === "POST") return checkSmtpAuthentication(request, env);
    if (path === "/api/members/admin/student-applications" && method === "GET") return adminQueue(request, env);
    if (path === "/api/members/admin/analytics" && method === "GET") return adminAnalytics(request, env);
    if (path === "/api/members/admin/customers" && method === "GET") return adminCustomers(request, env);
    const customerStatusMatch = path.match(/^\/api\/members\/admin\/customers\/([0-9a-f-]{36})\/status$/i);
    if (customerStatusMatch && method === "POST") return adminCustomerStatus(request, env, customerStatusMatch[1]);
    if (path === "/api/members/admin/pass/verify" && method === "POST") return verifyPass(request, env);
    if (path === "/api/members/admin/newsletter-campaigns" && method === "GET") return adminNewsletterCampaigns(request, env);
    if (path === "/api/members/admin/newsletter-campaigns" && method === "POST") return createNewsletterCampaign(request, env);
    if (path === "/api/members/newsletter/start" && method === "POST") return startNewsletterSignup(request, env);
    if (path === "/api/members/newsletter/subscribe" && method === "POST") return subscribeNewsletter(request, env);
    if (path === "/api/members/newsletter/confirm" && method === "GET") return newsletterConfirmPage(request, env);
    if (path === "/api/members/newsletter/confirm" && method === "POST") return confirmNewsletter(request, env);
    if (path === "/api/members/newsletter/unsubscribe" && method === "GET") return unsubscribePage(request, env);
    if (path === "/api/members/newsletter/unsubscribe" && method === "POST") return unsubscribeNewsletter(request, env);
    const applicationRoute = routeApplicationPath(path);
    if (applicationRoute?.action === "proof" && method === "GET") return adminProof(request, env, applicationRoute.id);
    if (applicationRoute?.action === "decision" && method === "POST") return adminDecision(request, env, applicationRoute.id);
    if (applicationRoute?.action === "cleanup" && method === "POST") return cleanupReviewedProof(request, env, applicationRoute.id);
    const campaignId = routeCampaignPath(path);
    if (campaignId && method === "POST") return sendNewsletterCampaign(request, env, campaignId);
    return json({ error: "not_found" }, 404);
  },
  async scheduled(_controller, env, context) {
    // Privacy cleanup keeps running even while the account features are off.
    // Newsletter delivery remains inert until the owner deliberately enables it.
    const tasks = [cleanupReviewedStudentProofs(env), cleanupOrphanStudentProofs(env), cleanupNewsletterDrafts(env)];
    const scheduledAt = new Date(_controller?.scheduledTime || Date.now());
    if (scheduledAt.getUTCHours() === 2 && scheduledAt.getUTCMinutes() === 0) tasks.push(cleanupAnalytics(env));
    if (env.MEMBERS_ENABLED === "on") tasks.push(processNewsletterDeliveries(env));
    context.waitUntil(Promise.allSettled(tasks));
  },
};

async function cleanupNewsletterDrafts(env) {
  if (!env.DB) return;
  try {
    await env.DB.prepare(`DELETE FROM newsletter_signup_drafts WHERE expires_at <= ?`).bind(nowIso()).run();
  } catch { /* A later scheduled run retries expired draft cleanup. */ }
}

export default memberWorker;

async function cleanupReviewedProof(request, env, applicationId) {
  if (!sameOrigin(request, env)) return json({ error: "origin" }, 403);
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: "forbidden" }, 403);
  const application = await env.DB.prepare(`SELECT status, proof_object_key FROM student_applications WHERE id = ?`).bind(applicationId).first();
  if (!application || application.status === "pending") return json({ error: "not_reviewed" }, 409);
  if (!application.proof_object_key) return json({ ok: true, alreadyDeleted: true });
  try {
    await deleteStudentProof(env, application.proof_object_key);
    await env.DB.prepare(`UPDATE student_applications SET proof_object_key=NULL, proof_deleted_at=? WHERE id=?`).bind(nowIso(), applicationId).run();
    await env.DB.prepare(`INSERT INTO admin_audit_log (id, reviewer_user_id, action, application_id, occurred_at) VALUES (?, ?, 'proof_deleted', ?, ?)`)
      .bind(crypto.randomUUID(), admin.id, applicationId, nowIso()).run();
    return json({ ok: true, deleted: true });
  } catch {
    return json({ ok: false, error: "proof_cleanup_failed" }, 503);
  }
}

async function cleanupReviewedStudentProofs(env) {
  if (!env.DB || !env.STUDENT_PROOFS) return;
  let rows;
  try {
    rows = await env.DB.prepare(`SELECT id, proof_object_key FROM student_applications
      WHERE status IN ('approved','rejected') AND proof_object_key IS NOT NULL
      ORDER BY reviewed_at ASC LIMIT 20`).all();
  } catch {
    return;
  }
  for (const application of rows.results || []) {
    try {
      // R2 deletion is idempotent, so a retry is safe if the object was removed
      // but recording proof_deleted_at failed on the previous cron run.
      await deleteStudentProof(env, application.proof_object_key);
      await env.DB.prepare(`UPDATE student_applications
        SET proof_object_key=NULL, proof_deleted_at=?
        WHERE id=? AND status IN ('approved','rejected') AND proof_object_key=?`)
        .bind(nowIso(), application.id, application.proof_object_key).run();
    } catch {
      // Leave the key in D1; the next scheduled invocation will retry it.
    }
  }
}

async function cleanupOrphanStudentProofs(env) {
  if (!env.DB || !env.STUDENT_PROOFS) return;
  // Give slow uploads and their D1 commit a full hour before considering a
  // queue entry abandoned. Successful submissions remove the row atomically.
  const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  let rows;
  try {
    rows = await env.DB.prepare(`SELECT object_key FROM student_proof_cleanup_queue
      WHERE queued_at < ? ORDER BY queued_at ASC LIMIT 20`).bind(cutoff).all();
  } catch {
    return;
  }
  for (const row of rows.results || []) {
    try {
      // Claim the stale queue row atomically only while no application refers
      // to it. Submissions require this same row in their insert transaction,
      // so cleanup cannot race a successful application commit.
      const claim = await env.DB.prepare(`DELETE FROM student_proof_cleanup_queue
        WHERE object_key=? AND queued_at < ?
          AND NOT EXISTS (SELECT 1 FROM student_applications WHERE proof_object_key=?)`)
        .bind(row.object_key, cutoff, row.object_key).run();
      if (Number(claim?.meta?.changes || 0) === 1) {
        await deleteStudentProof(env, row.object_key);
      } else {
        const linked = await env.DB.prepare(`SELECT 1 AS present FROM student_applications WHERE proof_object_key=? LIMIT 1`).bind(row.object_key).first();
        if (linked) await env.DB.prepare(`DELETE FROM student_proof_cleanup_queue WHERE object_key=? AND EXISTS (SELECT 1 FROM student_applications WHERE proof_object_key=?)`).bind(row.object_key, row.object_key).run();
      }
    } catch {
      // Keep the durable queue row so the next scheduled run retries safely.
    }
  }
}

