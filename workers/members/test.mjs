import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import { unzipSync } from "fflate";
import memberWorker from "./src/index.mjs";

// The local WebCrypto implementation accepts iteration counts production
// Workers reject. Simulate the production cap for every auth flow in this test.
const deriveBits = crypto.subtle.deriveBits.bind(crypto.subtle);
crypto.subtle.deriveBits = (algorithm, key, length) => {
  if (algorithm?.name === "PBKDF2" && algorithm.iterations > 100_000) {
    throw new DOMException("PBKDF2 exceeds the Cloudflare Workers iteration cap", "NotSupportedError");
  }
  return deriveBits(algorithm, key, length);
};

const schema = await readFile(new URL("../../migrations/0001_student_portal.sql", import.meta.url), "utf8");
const renewalMigration = await readFile(new URL("../../migrations/0002_student_pass_renewals.sql", import.meta.url), "utf8");
const proofCleanupMigration = await readFile(new URL("../../migrations/0003_student_proof_cleanup_queue.sql", import.meta.url), "utf8");
const pendingApplicationMigration = await readFile(new URL("../../migrations/0004_one_pending_student_application.sql", import.meta.url), "utf8");
const newsletterRegionMigration = await readFile(new URL("../../migrations/0005_newsletter_region_tag.sql", import.meta.url), "utf8");
const studentEmailMigration = await readFile(new URL("../../migrations/0006_student_school_email_verification.sql", import.meta.url), "utf8");
const expandedRegionsMigration = await readFile(new URL("../../migrations/0007_newsletter_regions.sql", import.meta.url), "utf8");
const newsletterDraftsMigration = await readFile(new URL("../../migrations/0008_newsletter_signup_drafts.sql", import.meta.url), "utf8");
const analyticsMigration = await readFile(new URL("../../migrations/0009_site_analytics.sql", import.meta.url), "utf8");
const customerAdminMigration = await readFile(new URL("../../migrations/0010_admin_customer_management.sql", import.meta.url), "utf8");
const proofBudgetMigration = await readFile(new URL("../../migrations/0011_r2_proof_usage_budget.sql", import.meta.url), "utf8");
const newsletterAudienceMigration = await readFile(new URL("../../migrations/0012_newsletter_audience.sql", import.meta.url), "utf8");
const simplifiedStudentSignupMigration = await readFile(new URL("../../migrations/0013_student_signup_simplification.sql", import.meta.url), "utf8");
const studentPassDisplayCodeMigration = await readFile(new URL("../../migrations/0014_student_pass_display_code.sql", import.meta.url), "utf8");
const studentWalletPassesMigration = await readFile(new URL("../../migrations/0015_student_wallet_passes.sql", import.meta.url), "utf8");
const appleWalletUpdatesMigration = await readFile(new URL("../../migrations/0016_apple_wallet_updates.sql", import.meta.url), "utf8");
const pemFixture = async (name, label) => {
  const der = (await readFile(new URL(`./test-fixtures/apple/${name}.der.b64.txt`, import.meta.url), "utf8")).trim();
  return `-----BEGIN ${label}-----\n${der.match(/.{1,64}/g).join("\n")}\n-----END ${label}-----`;
};
const appleTestSignerCert = await pemFixture("signer-cert", "CERTIFICATE");
const appleTestWwdrCert = await pemFixture("wwdr-cert", "CERTIFICATE");
const appleTestPrivateKeyDer = (await readFile(new URL("./test-fixtures/apple/signer-key.pkcs8.der.b64.txt", import.meta.url), "utf8")).trim();
const appleTestPrivateKey = `-----BEGIN PRIVATE KEY-----\n${appleTestPrivateKeyDer.match(/.{1,64}/g).join("\n")}\n-----END PRIVATE KEY-----`;
const upgradeDb = new DatabaseSync(":memory:");
upgradeDb.exec(schema);
upgradeDb.exec(`
  INSERT INTO users (id,email,full_name,password_hash,created_at,updated_at)
  VALUES ('legacy-user','legacy@example.test','Legacy User','test-hash','2026-10-01','2026-10-01');
  INSERT INTO student_applications (id,user_id,institution,education_level,proof_mime_type,proof_consent_version,proof_consent_at,status,submitted_at,reviewed_at,reviewed_by)
  VALUES ('legacy-application','legacy-user','MBO Leiden','mbo','application/pdf','test-v1','2026-10-01','approved','2026-10-01','2026-10-02','legacy-user');
  INSERT INTO student_passes (id,user_id,public_code_hash,status,issued_at,expires_at)
  VALUES ('legacy-pass','legacy-user','legacy-code-hash','active','2026-10-02','2027-10-02');
`);
upgradeDb.exec(renewalMigration);
upgradeDb.exec(proofCleanupMigration);
upgradeDb.exec(pendingApplicationMigration);
upgradeDb.exec(newsletterRegionMigration);
upgradeDb.exec(studentEmailMigration);
upgradeDb.exec(expandedRegionsMigration);
upgradeDb.exec(newsletterDraftsMigration);
upgradeDb.exec(analyticsMigration);
upgradeDb.exec(customerAdminMigration);
upgradeDb.exec(proofBudgetMigration);
upgradeDb.exec(newsletterAudienceMigration);
upgradeDb.exec(simplifiedStudentSignupMigration);
upgradeDb.exec(studentPassDisplayCodeMigration);
upgradeDb.exec(studentWalletPassesMigration);
upgradeDb.exec(appleWalletUpdatesMigration);
assert.equal(upgradeDb.prepare("SELECT application_id FROM student_passes WHERE id='legacy-pass'").get().application_id, "legacy-application", "migration associates existing student passes with their approved application");
assert.equal(upgradeDb.prepare("SELECT display_code FROM student_passes WHERE id='legacy-pass'").get().display_code, null, "legacy pass receives its display code lazily");
assert.equal(upgradeDb.prepare("SELECT COUNT(*) AS count FROM student_wallet_passes").get().count, 0, "wallet migration preserves passes and starts with an empty issuance ledger");
assert.equal(upgradeDb.prepare("SELECT COUNT(*) AS count FROM apple_wallet_registrations").get().count, 0, "Apple Wallet update migration starts without device registrations");
upgradeDb.close();
const sqlite = new DatabaseSync(":memory:");
sqlite.exec(schema);
sqlite.exec(renewalMigration);
sqlite.exec(proofCleanupMigration);
sqlite.exec(pendingApplicationMigration);
sqlite.exec(newsletterRegionMigration);
sqlite.exec(studentEmailMigration);
sqlite.exec(expandedRegionsMigration);
sqlite.exec(newsletterDraftsMigration);
sqlite.exec(analyticsMigration);
sqlite.exec(customerAdminMigration);
sqlite.exec(proofBudgetMigration);
sqlite.exec(newsletterAudienceMigration);
sqlite.exec(simplifiedStudentSignupMigration);
sqlite.exec(studentPassDisplayCodeMigration);
sqlite.exec(studentWalletPassesMigration);
sqlite.exec(appleWalletUpdatesMigration);
let simulateApplicationCommitFailure = false;
let decisionReadBarrier = null;

class D1Statement {
  constructor(sql, values = []) { this.sql = sql; this.values = values; }
  bind(...values) { return new D1Statement(this.sql, values); }
  first() {
    const result = sqlite.prepare(this.sql).get(...this.values) ?? null;
    const barrier = decisionReadBarrier;
    if (barrier && this.values[0] === barrier.applicationId && this.sql.includes("SELECT id, user_id, proof_object_key, status FROM student_applications WHERE id = ?")) {
      barrier.reads += 1;
      if (barrier.reads === 2) barrier.release();
      return barrier.promise.then(() => result);
    }
    return result;
  }
  all() { return { results: sqlite.prepare(this.sql).all(...this.values) }; }
  run() {
    const result = sqlite.prepare(this.sql).run(...this.values);
    return { meta: { changes: Number(result.changes || 0) } };
  }
}

const db = {
  prepare(sql) { return new D1Statement(sql); },
  batch(statements) {
    if (simulateApplicationCommitFailure) {
      simulateApplicationCommitFailure = false;
      throw new Error("simulated D1 application commit failure");
    }
    sqlite.exec("BEGIN");
    try {
      const results = statements.map((statement) => statement.run());
      sqlite.exec("COMMIT");
      return results;
    } catch (error) {
      sqlite.exec("ROLLBACK");
      throw error;
    }
  },
};

const objects = new Map();
const sentEmails = [];
let simulateMailFailure = false;
let simulateMarketingMailFailure = false;
let simulateDailyQuota = false;
let simulateProofDeleteFailure = false;
const env = {
  DB: db,
  MEMBERS_ENABLED: "off",
  SMTP_DIAGNOSTICS: "off",
  SMTP_TEST_TO: "owner@example.test",
  AUTH_PEPPER: "test-only-pepper-never-use-in-production",
  PASS_SIGNING_KEY: "test-only-signing-key-never-use-in-production",
  SITE_ORIGIN: "https://schaapsvishandel.nl",
  SITE_PUBLIC: "launch-approved",
  MAIL_FROM: "noreply@schaapsvishandel.nl",
  ADMIN_EMAILS: "student@example.test",
  ADMIN_IPS: "203.0.113.10,2001:db8::10",
  ANALYTICS_ENABLED: "on",
  EMAIL: { async send(message) {
    if (simulateMailFailure) throw new Error("simulated email delivery failure");
    if (simulateMarketingMailFailure && /email offers|e-maildeals|e-mail-angebote/i.test(message.subject)) throw new Error("simulated marketing email failure");
    if (simulateDailyQuota) throw Object.assign(new Error("daily quota reached"), { code: "E_DAILY_LIMIT_EXCEEDED" });
    sentEmails.push(message);
    return { messageId: `test-${sentEmails.length}` };
  } },
  STUDENT_PROOFS: {
    async put(key, stream) { objects.set(key, await new Response(stream).arrayBuffer()); },
    async get(key) { const body = objects.get(key); return body ? new Response(body) : null; },
    async delete(key) { if (simulateProofDeleteFailure) throw new Error("simulated storage failure"); objects.delete(key); },
  },
};

async function call(path, { method = "GET", body, cookie = "", contentType, headers: extraHeaders = {}, omitOrigin = false } = {}) {
  const headers = new Headers({ "CF-Connecting-IP": "203.0.113.10" });
  if (!omitOrigin) headers.set("Origin", env.SITE_ORIGIN);
  for (const [name, value] of Object.entries(extraHeaders)) headers.set(name, value);
  if (cookie) headers.set("Cookie", cookie);
  if (contentType) headers.set("Content-Type", contentType);
  let requestBody = body;
  if (body && typeof body === "object" && !(body instanceof FormData) && !(body instanceof Blob)) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }
  return memberWorker.fetch(new Request(`${env.SITE_ORIGIN}${path}`, { method, headers, body: requestBody }), env);
}

const disabledHealth = await call("/api/members/health");
assert.equal(disabledHealth.status, 503, "member API stays disabled until deliberately activated");
assert.equal((await call("/api/members/register", { method: "POST", body: { email: "locked@example.test", name: "Locked User", password: "correct horse battery" } })).status, 503, "disabled API does not register accounts");
assert.equal((await call("/api/members/newsletter/subscribe", { method: "POST", body: { email: "locked@example.test" } })).status, 503, "disabled API does not accept newsletter subscriptions");
sqlite.prepare(`INSERT INTO users (id,email,full_name,password_hash,created_at,updated_at) VALUES ('disabled-cron-admin','disabled-cron-admin@example.test','Cron Test','test','2026-10-18','2026-10-18')`).run();
const disabledProofKey = "student-proofs/disabled-cron-review";
objects.set(disabledProofKey, new ArrayBuffer(8));
sqlite.prepare(`INSERT INTO student_applications (id,user_id,institution,education_level,proof_object_key,proof_mime_type,proof_consent_version,proof_consent_at,status,submitted_at,reviewed_at,reviewed_by) VALUES ('disabled-cron-review','disabled-cron-admin','MBO Leiden','mbo',?,'application/pdf','test-v1','2026-10-18','approved','2026-10-18','2026-10-18','disabled-cron-admin')`).run(disabledProofKey);
sqlite.prepare(`INSERT INTO newsletter_subscriptions (email,user_id,status,consent_text_version,consented_at,confirmed_at,source,created_at,updated_at) VALUES ('disabled-cron@example.test','disabled-cron-admin','subscribed','test-v1','2026-10-18','2026-10-18','test','2026-10-18','2026-10-18')`).run();
sqlite.prepare(`INSERT INTO newsletter_campaigns (id,subject,body_text,status,recipient_count,created_by,created_at,queued_at) VALUES ('disabled-cron-campaign','Must not send','test','queued',1,'disabled-cron-admin','2026-10-18','2026-10-18')`).run();
sqlite.prepare(`INSERT INTO newsletter_deliveries (campaign_id,email,status,attempts,next_attempt_at) VALUES ('disabled-cron-campaign','disabled-cron@example.test','pending',0,?)`).run(new Date(Date.now() - 1000).toISOString());
sqlite.prepare(`INSERT INTO newsletter_signup_drafts (token_hash,email,created_at,expires_at) VALUES ('expired-draft-hash','expired-draft@example.test','2000-01-01','2000-01-01')`).run();
const disabledTasks = [];
await memberWorker.scheduled({}, env, { waitUntil(task) { disabledTasks.push(task); } });
assert.equal(disabledTasks.length, 1, "privacy cleanup and incomplete signup cleanup are scheduled while account features are disabled");
await Promise.all(disabledTasks);
assert.equal(objects.has(disabledProofKey), false, "privacy cleanup removes an already-reviewed proof even while accounts are disabled");
assert.equal(sqlite.prepare("SELECT proof_object_key FROM student_applications WHERE id='disabled-cron-review'").get().proof_object_key, null, "disabled-mode cleanup records successful deletion");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM newsletter_signup_drafts WHERE token_hash='expired-draft-hash'").get().count, 0, "expired temporary newsletter drafts are purged even while member services are disabled");
assert.equal(sentEmails.length, 0, "newsletter delivery stays inert while member services are disabled");
sqlite.exec(`DELETE FROM newsletter_deliveries WHERE campaign_id='disabled-cron-campaign'; DELETE FROM newsletter_campaigns WHERE id='disabled-cron-campaign'; DELETE FROM newsletter_subscriptions WHERE email='disabled-cron@example.test'; DELETE FROM users WHERE id='disabled-cron-admin';`);
env.MEMBERS_ENABLED = "on";
const health = await call("/api/members/health");
assert.equal(health.status, 200);
env.SITE_PUBLIC = "off";
env.SITE_ACCESS_TOKEN = "test-only-site-access-token";
env.SITE_ACCESS_IP_ALLOWLIST = "198.51.100.40,2001:db8::40";
assert.equal((await call("/api/members/register", { method: "POST", body: {} })).status, 403, "account API cannot bypass the site's password gate through a Worker route");
assert.equal((await call("/api/members/register", { method: "POST", body: {}, cookie: "sv_access=wrong-token" })).status, 403, "an incorrect site unlock cookie is rejected");
assert.equal((await call("/api/members/register", { method: "POST", body: {}, cookie: "sv_access=test-only-site-access-token" })).status, 400, "the site's valid unlock cookie grants access to the account API");
assert.equal((await call("/api/members/register", { method: "POST", body: {}, headers: { "CF-Connecting-IP": "198.51.100.40" } })).status, 400, "the trusted owner-IP allowlist grants access without trusting browser-supplied IP headers");
env.SITE_PUBLIC = "launch-approved";
delete env.SITE_ACCESS_TOKEN;
delete env.SITE_ACCESS_IP_ALLOWLIST;
assert.equal((await call("/api/members/admin/student-applications")).status, 403, "admin API rejects anonymous requests");
env.ANALYTICS_ENABLED = "off";
assert.equal((await call("/api/members/analytics", { method: "POST", body: { consent: true, event: "page_view", path: "/nl" } })).status, 503, "analytics is disabled by default unless explicitly enabled");
env.ANALYTICS_ENABLED = "on";
assert.equal((await call("/api/members/analytics", { method: "POST", body: { consent: false, event: "page_view", path: "/nl" } })).status, 400, "analytics rejects events without affirmative consent");
assert.equal((await call("/api/members/analytics", { method: "POST", body: { consent: true, event: "page_view", path: "/nl/account" } })).status, 400, "analytics excludes account paths");
assert.equal((await call("/api/members/analytics", { method: "POST", body: { consent: true, event: "page_view", path: "/nl/assortiment" } })).status, 202, "analytics accepts a consented public page view");
assert.equal((await call("/api/members/analytics", { method: "POST", body: { consent: true, event: "link_click", path: "/nl/varlaks", target: "https://schaapsvishandel.nl/nl/assortiment/varlaks-zalm?email=private@example.test" } })).status, 202, "analytics stores a sanitized link target");
assert.equal(sqlite.prepare("SELECT count FROM site_analytics_daily WHERE event='link_click'").get().count, 1);
assert.equal(sqlite.prepare("SELECT target FROM site_analytics_daily WHERE event='link_click'").get().target, "/nl/assortiment/varlaks-zalm", "analytics drops query strings that may contain private data");
env.SMTP_HOST = "mail.schaapsvishandel.nl";
env.SMTP_USERNAME = "schaapsv@schaapsvishandel.nl";
const sentBeforeMissingSmtpPassword = sentEmails.length;
const missingSmtpPasswordRegistration = await call("/api/members/register", {
  method: "POST",
  body: { email: "smtp-unconfigured@example.test", schoolEmail: "smtp-unconfigured@university.example.test", name: "SMTP Setup Test", password: "correct horse battery", locale: "en" },
});
assert.equal(missingSmtpPasswordRegistration.status, 503, "registration refuses to proceed while a selected SMTP transport lacks its password");
assert.equal(sentEmails.length, sentBeforeMissingSmtpPassword, "an incomplete SMTP transport never falls back to another mail provider");
delete env.SMTP_HOST;
delete env.SMTP_USERNAME;
simulateMailFailure = true;
const failedDeliveryRegistration = await call("/api/members/register", {
  method: "POST",
  body: { email: "retry@example.test", schoolEmail: "retry@university.example.test", name: "Retry Test", password: "correct horse battery", locale: "en" },
});
assert.equal(failedDeliveryRegistration.status, 503, "a real mail transport failure is reported during registration");
assert.ok(sqlite.prepare("SELECT id FROM users WHERE email='retry@example.test' AND email_verified_at IS NULL").get(), "a transient delivery failure leaves the new account eligible for code resend");
simulateMailFailure = false;
const sentBeforeRetry = sentEmails.length;
const retryDelivery = await call("/api/members/verify/resend", { method: "POST", body: { email: "retry@example.test", locale: "en" } });
assert.equal(retryDelivery.status, 202, "unverified users can recover from a transient initial mail failure");
assert.equal(sentEmails.length, sentBeforeRetry + 2, "resend delivers fresh codes to both addresses after the transport recovers");
const oversizedRegistration = await call("/api/members/register", {
  method: "POST",
  body: { email: "oversized@example.test", name: "x".repeat(40_000), password: "correct horse battery" },
});
assert.equal(oversizedRegistration.status, 400, "JSON parsing is bounded even when Content-Length is absent");

const sentBeforeRegistration = sentEmails.length;
const registration = await call("/api/members/register", {
  method: "POST",
  body: { email: "student@example.test", schoolEmail: "student@university.example.test", firstName: "Test", lastName: "Student", password: "correct horse battery", locale: "en" },
});
assert.equal(registration.status, 202);
assert.equal(sentEmails.length, sentBeforeRegistration + 2, "registration sends separate verification codes to both addresses");
const registrationEmailOffset = sentBeforeRegistration;
assert.match(sentEmails[registrationEmailOffset].text, /\b\d{6}\b/);
assert.match(sentEmails[registrationEmailOffset + 1].text, /\b\d{6}\b/);
assert.match(sentEmails[registrationEmailOffset].html, /Schaap’s Vishandel/);
assert.match(sentEmails[registrationEmailOffset].html, /background:#075c7c/);
assert.notEqual(sentEmails[registrationEmailOffset].to, sentEmails[registrationEmailOffset + 1].to, "personal and school emails must be different");
const registeredName = sqlite.prepare("SELECT first_name, last_name, full_name FROM users WHERE email='student@example.test'").get();
assert.equal(registeredName.first_name, "Test");
assert.equal(registeredName.last_name, "Student");
assert.equal(registeredName.full_name, "Test Student", "registration stores first and last name separately while retaining the display name");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM newsletter_subscriptions WHERE email='student@example.test'").get().count, 0, "account creation does not subscribe to marketing by default");
const consentedMailOffset = sentEmails.length;
const consentedRegistration = await call("/api/members/register", {
  method: "POST", headers: { "CF-Connecting-IP": "198.51.100.60" },
  body: { email: "consented@example.test", schoolEmail: "consented@university.example.test", name: "Consented Student", password: "correct horse battery", locale: "en", marketingConsent: true },
});
assert.equal(consentedRegistration.status, 202);
const consentedRegistrationResponse = await consentedRegistration.json();
assert.equal(sentEmails.length, consentedMailOffset + 2, "student opt-in sends only the two necessary verification codes");
assert.equal(sqlite.prepare("SELECT status FROM newsletter_subscriptions WHERE email='consented@example.test'").get().status, "pending", "student opt-in activates only after the personal email is verified");
simulateMarketingMailFailure = true;
const failedMarketingMailOffset = sentEmails.length;
const marketingFailureRegistration = await call("/api/members/register", {
  method: "POST", headers: { "CF-Connecting-IP": "198.51.100.60" },
  body: { email: "marketing-retry@example.test", schoolEmail: "marketing-retry@university.example.test", name: "Marketing Retry", password: "correct horse battery", locale: "en", marketingConsent: true },
});
simulateMarketingMailFailure = false;
assert.equal(marketingFailureRegistration.status, 202, "a failed optional marketing mail does not invalidate student account creation");
assert.deepEqual(await marketingFailureRegistration.json(), consentedRegistrationResponse, "marketing delivery failures cannot reveal whether an account was created");
assert.equal(sentEmails.length, failedMarketingMailOffset + 2, "both account verification codes are still delivered");
assert.ok(sqlite.prepare("SELECT id FROM users WHERE email='marketing-retry@example.test'").get(), "student account survives optional marketing mail failure");
assert.equal(sqlite.prepare("SELECT status FROM newsletter_subscriptions WHERE email='marketing-retry@example.test'").get().status, "pending", "marketing consent waits for address verification without sending another email");
const duplicateRegistration = await call("/api/members/register", {
  method: "POST", headers: { "CF-Connecting-IP": "198.51.100.60" },
  body: { email: "consented@example.test", schoolEmail: "different@university.example.test", name: "Consented Student", password: "correct horse battery", locale: "en", marketingConsent: true },
});
assert.equal(duplicateRegistration.status, 202);
assert.deepEqual(await duplicateRegistration.json(), consentedRegistrationResponse, "an existing account gets the same response as a new student account");
const unknownAccountLogin = await call("/api/members/login", {
  method: "POST",
  body: { email: "unknown@example.test", password: "correct horse battery" },
});
assert.equal(unknownAccountLogin.status, 401, "unknown accounts receive the same generic login failure as wrong passwords");
const registeredUser = sqlite.prepare("SELECT password_hash FROM users WHERE email='student@example.test'").get();
sqlite.prepare(`INSERT INTO users (id,email,full_name,password_hash,account_status,created_at,updated_at) VALUES ('locked-user','locked@example.test','Locked User',?,'locked','2026-10-18','2026-10-18')`).run(registeredUser.password_hash);
const lockedAccountLogin = await call("/api/members/login", {
  method: "POST",
  body: { email: "locked@example.test", password: "correct horse battery" },
});
assert.equal(lockedAccountLogin.status, 401, "locked accounts also receive a generic login failure");
const personalCode = sentEmails[registrationEmailOffset].text.match(/\b(\d{6})\b/)[1];
const schoolCode = sentEmails[registrationEmailOffset + 1].text.match(/\b(\d{6})\b/)[1];
assert.match(sentEmails[registrationEmailOffset].subject, /personal email/i, "personal address receives its own code");
assert.match(sentEmails[registrationEmailOffset + 1].subject, /school email/i, "school address receives its own code");
const invalidVerification = await call("/api/members/verify-codes", { method: "POST", body: { email: "student@example.test", personalCode, schoolCode: "000000" } });
assert.equal(invalidVerification.status, 400, "both codes must match before either email is verified");
assert.equal(sqlite.prepare("SELECT email_verified_at FROM users WHERE email='student@example.test'").get().email_verified_at, null, "failed verification does not partially verify the account");
const verificationResult = await call("/api/members/verify-codes", { method: "POST", body: { email: "student@example.test", personalCode, schoolCode } });
assert.equal(verificationResult.status, 200);
assert.match(verificationResult.headers.get("Set-Cookie") || "", /sv_member=/, "successful code verification signs the new member in immediately");
assert.equal(sqlite.prepare("SELECT email_verified_at, school_email_verified_at FROM users WHERE email='student@example.test'").get().school_email_verified_at !== null, true, "both email addresses are verified");
const reusedCodes = await call("/api/members/verify-codes", { method: "POST", body: { email: "student@example.test", personalCode, schoolCode } });
assert.equal(reusedCodes.status, 400, "verification codes are single-use");

const login = await call("/api/members/login", {
  method: "POST",
  body: { email: "student@example.test", password: "correct horse battery" },
});
assert.equal(login.status, 200);
assert.doesNotMatch(login.headers.get("Set-Cookie"), /Domain=/i, "sessions use host-only cookies to isolate preview and production");
const sessionCookie = login.headers.get("Set-Cookie").split(";")[0];
assert.equal((await call("/api/members/me", { cookie: sessionCookie })).status, 200);
assert.equal((await call("/api/members/admin/analytics?days=7", { cookie: sessionCookie, headers: { "CF-Connecting-IP": "198.51.100.5" } })).status, 403, "admin analytics requires the server-side IP allowlist");
const analyticsReport = await call("/api/members/admin/analytics?days=7", { cookie: sessionCookie });
assert.equal(analyticsReport.status, 200, "allowlisted admin can view aggregate analytics");
assert.equal((await analyticsReport.json()).rows.length, 2);
assert.equal((await call("/api/members/admin/customers")).status, 403, "customer listing rejects anonymous requests");
assert.equal((await call("/api/members/admin/customers", { cookie: sessionCookie, headers: { "CF-Connecting-IP": "198.51.100.5" } })).status, 403, "customer listing requires the server-side IP allowlist");
const managedCustomerId = "123e4567-e89b-12d3-a456-426614174000";
sqlite.prepare(`INSERT INTO users (id,email,full_name,password_hash,email_verified_at,account_status,created_at,updated_at) VALUES (?, 'customer@example.test', 'Customer Example', ?, '2026-10-18', 'active', '2026-10-18', '2026-10-18')`).run(managedCustomerId, registeredUser.password_hash);
sqlite.prepare(`INSERT INTO sessions (token_hash,user_id,created_at,expires_at) VALUES ('managed-customer-session',?,'2026-10-18','2030-10-18')`).run(managedCustomerId);
const customerList = await call("/api/members/admin/customers", { cookie: sessionCookie });
assert.equal(customerList.status, 200, "allowlisted administrator can list customer accounts");
const customerPage = await customerList.json();
const customerRows = customerPage.customers;
const customerRow = customerRows.find((row) => row.id === managedCustomerId);
assert.ok(customerRow, "allowlisted administrator can find the newly created customer account");
assert.equal(customerRow.email, "customer@example.test");
assert.equal(customerRow.email_verified, 1);
assert.equal(customerPage.hasMore, false);
assert.equal(customerPage.nextCursor, null);
assert.ok(customerRows.every((row) => !("password_hash" in row)), "customer directory never returns password hashes");
assert.ok(customerRows.every((row) => !("school_email" in row)), "customer directory omits school email addresses");
assert.equal((await call("/api/members/admin/customers?cursor=not-a-cursor", { cookie: sessionCookie })).status, 400, "invalid pagination cursors are rejected");
const lockedCustomer = await call(`/api/members/admin/customers/${managedCustomerId}/status`, { method: "POST", cookie: sessionCookie, body: { status: "locked" } });
assert.equal(lockedCustomer.status, 200, "allowlisted administrator can suspend a customer account");
assert.equal(sqlite.prepare("SELECT account_status FROM users WHERE id=?").get(managedCustomerId).account_status, "locked");
assert.notEqual(sqlite.prepare("SELECT revoked_at FROM sessions WHERE token_hash='managed-customer-session'").get().revoked_at, null, "suspending a customer revokes every active session");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM admin_customer_audit WHERE customer_user_id=? AND action='account_locked'").get(managedCustomerId).count, 1, "suspension is recorded in the administrator audit trail");
const protectedAdminId = sqlite.prepare("SELECT id FROM users WHERE email='student@example.test'").get().id;
assert.equal((await call(`/api/members/admin/customers/${protectedAdminId}/status`, { method: "POST", cookie: sessionCookie, body: { status: "locked" } })).status, 409, "administrator accounts cannot be suspended through customer management");
assert.equal((await call(`/api/members/admin/customers/${managedCustomerId}/status`, { method: "POST", cookie: sessionCookie, body: { status: "deleted" } })).status, 400, "customer management does not expose irreversible deletion");
assert.equal((await call(`/api/members/admin/customers/${managedCustomerId}/status`, { method: "POST", cookie: sessionCookie, headers: { Origin: "https://attacker.example" }, body: { status: "active" } })).status, 403, "customer status changes require same-origin requests");
const restoredCustomer = await call(`/api/members/admin/customers/${managedCustomerId}/status`, { method: "POST", cookie: sessionCookie, body: { status: "active" } });
assert.equal(restoredCustomer.status, 200, "administrator can restore a suspended customer account");
assert.equal(sqlite.prepare("SELECT account_status FROM users WHERE id=?").get(managedCustomerId).account_status, "active");
assert.equal(sqlite.prepare("SELECT revoked_at FROM sessions WHERE token_hash='managed-customer-session'").get().revoked_at !== null, true, "restoring an account does not revive old sessions");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM admin_customer_audit WHERE customer_user_id=?").get(managedCustomerId).count, 2, "both status changes are audited");

for (let attempt = 0; attempt < 7; attempt++) {
  const blockedLogin = await call("/api/members/login", {
    method: "POST",
    body: { email: "student@example.test", password: "wrong password" },
    headers: { "CF-Connecting-IP": `198.51.100.${attempt + 1}` },
  });
  assert.equal(blockedLogin.status, 401, "account-specific login attempts remain possible up to the configured limit");
}
assert.equal((await call("/api/members/login", {
  method: "POST",
  body: { email: "student@example.test", password: "correct horse battery" },
  headers: { "CF-Connecting-IP": "203.0.113.99" },
})).status, 429, "changing IP addresses cannot bypass the account-specific login limit");

const secondarySchoolForm = new FormData();
secondarySchoolForm.set("institution", "Leidse middelbare school");
secondarySchoolForm.set("educationLevel", "secondary");
secondarySchoolForm.set("studyCity", "Den Haag");
assert.equal((await call("/api/members/student-application", { method: "POST", body: secondarySchoolForm, cookie: sessionCookie })).status, 400, "secondary-school applicants are not eligible");
assert.equal(objects.size, 0, "student applications no longer upload proof objects");
const applicationForm = new FormData();
applicationForm.set("institution", "MBO Rijnland");
applicationForm.set("educationLevel", "mbo");
applicationForm.set("studyCity", "Alphen aan den Rijn");
const applicationResponse = await call("/api/members/student-application", { method: "POST", body: applicationForm, cookie: sessionCookie });
assert.equal(applicationResponse.status, 202);
assert.equal(objects.size, 0, "school-email applications never write to R2");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM consent_events WHERE user_id=(SELECT id FROM users WHERE email='student@example.test') AND consent_type='student_proof_processing'").get().count, 0, "no proof-processing consent is collected when no proof is requested");
const activeApplication = sqlite.prepare("SELECT id, proof_object_key, study_city, eligibility_method FROM student_applications WHERE status='pending'").get();
assert.equal(activeApplication.proof_object_key, null);
assert.equal(activeApplication.study_city, "Alphen aan den Rijn", "study city replaces the former Leiden-only checkbox");
assert.equal(activeApplication.eligibility_method, "verified-school-email");
assert.throws(() => sqlite.prepare(`INSERT INTO student_applications (id,user_id,institution,education_level,proof_mime_type,proof_consent_version,proof_consent_at,status,submitted_at) VALUES ('duplicate-pending','${sqlite.prepare("SELECT id FROM users WHERE email='student@example.test'").get().id}','MBO Leiden','mbo','application/pdf','test-v1','2026-10-18','pending','2026-10-18')`).run(), /UNIQUE constraint failed/, "database prevents concurrent duplicate pending applications for one account");
assert.equal((await call("/api/members/admin/student-applications")).status, 403);
const queue = await call("/api/members/admin/student-applications", { cookie: sessionCookie });
assert.equal(queue.status, 200);
const application = (await queue.json()).applications[0];
assert.equal(application.email, "student@example.test");
assert.equal(application.school_email, "student@university.example.test", "reviewers can inspect the verified school address before approval");
assert.equal(application.study_city, "Alphen aan den Rijn");
assert.equal(application.has_proof, 0, "new applications tell the admin UI there is no proof link");
const decision = await call(`/api/members/admin/student-applications/${application.id}/decision`, {
  method: "POST", cookie: sessionCookie, body: { decision: "approved" },
});
assert.equal(decision.status, 200);
assert.equal((await decision.json()).proofDeleted, true, "proof-free applications need no cleanup retry");
const account = await call("/api/members/me", { cookie: sessionCookie });
const accountData = await account.json();
const pass = accountData.discountPass;
assert.ok(pass?.code);
assert.equal(accountData.wallet.google.available, false, "Google Wallet stays hidden until every issuer credential is configured");
assert.equal(accountData.wallet.apple.available, false, "Apple Wallet stays hidden until its signing flow is available");
assert.match(pass?.displayCode || "", /^SV-[A-Z0-9]{4}-[A-Z0-9]{4}$/, "approved pass exposes a short staff lookup code");
assert.ok(pass.expiresAt, "an approved student pass expires after one study year");
const expectedPassExpiry = new Date(pass.issuedAt);
expectedPassExpiry.setUTCFullYear(expectedPassExpiry.getUTCFullYear() + 1);
assert.equal(pass.expiresAt, expectedPassExpiry.toISOString(), "pass expires exactly one calendar year after approval");
const passCheck = await call("/api/members/admin/pass/verify", { method: "POST", cookie: sessionCookie, body: { code: pass.code } });
const verifiedPass = await passCheck.json();
assert.equal(verifiedPass.valid, true);
assert.deepEqual(verifiedPass.eligibleProducts, ["assortiment"], "student discount applies to the entire assortment");
const shortPassCheck = await call("/api/members/admin/pass/verify", { method: "POST", cookie: sessionCookie, body: { code: pass.displayCode.toLowerCase() } });
const shortVerifiedPass = await shortPassCheck.json();
assert.equal(shortVerifiedPass.valid, true, "staff can verify the short display code case-insensitively");
assert.equal(shortVerifiedPass.name, "Test Student", "short-code lookup returns the pass holder name");
assert.equal((await call("/api/members/wallet/google", { method: "POST", cookie: sessionCookie })).status, 503, "Wallet issuance fails closed without issuer credentials");
assert.equal((await call("/api/members/wallet/apple", { method: "POST", cookie: sessionCookie })).status, 503, "Apple Wallet issuance fails closed without its certificate chain");
const walletKeys = generateKeyPairSync("rsa", { modulusLength: 2048 });
env.GOOGLE_WALLET_ISSUER_ID = "3388000000000000000";
env.GOOGLE_WALLET_CLASS_ID = "3388000000000000000.schaapsvis_student";
env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL = "wallet-test@example.test";
env.GOOGLE_WALLET_PRIVATE_KEY = walletKeys.privateKey.export({ type: "pkcs8", format: "pem" });
const walletAccount = await call("/api/members/me", { cookie: sessionCookie });
assert.equal((await walletAccount.json()).wallet.google.available, true, "Google Wallet becomes visible only with a complete issuer configuration");
const googleWallet = await call("/api/members/wallet/google?locale=nl", { method: "POST", cookie: sessionCookie });
assert.equal(googleWallet.status, 303, "an approved student can request a Google Wallet pass");
const walletLocation = googleWallet.headers.get("location") || "";
assert.ok(walletLocation.startsWith("https://pay.google.com/gp/v/save/"), "Wallet issuance redirects to Google's official save URL");
const walletJwt = walletLocation.split("/").at(-1);
const walletClaims = JSON.parse(Buffer.from(walletJwt.split(".")[1], "base64url").toString("utf8"));
const walletObject = walletClaims.payload.genericObjects[0];
assert.equal(walletObject.header.defaultValue.value, "Test Student", "Wallet pass shows the account holder's full name");
assert.equal(walletObject.logo.sourceUri.uri, `${env.SITE_ORIGIN}/og-image.png`, "Wallet pass includes Schaap's public brand image");
assert.equal(walletObject.barcode.value, pass.displayCode, "Wallet QR uses the same short staff verification code");
assert.equal(walletObject.subheader.defaultValue.value, "10% studentenkorting", "Wallet pass states the correct discount");
assert.equal(sqlite.prepare("SELECT platform FROM student_wallet_passes WHERE pass_id=(SELECT id FROM student_passes WHERE display_code=?)").get(pass.displayCode).platform, "google", "issued Wallet objects are recorded against the internal student pass");
env.APPLE_WALLET_PASS_TYPE_ID = "pass.nl.schaapsvishandel.student.test";
env.APPLE_WALLET_TEAM_ID = "TESTTEAM01";
env.APPLE_WALLET_SIGNER_CERT = appleTestSignerCert;
env.APPLE_WALLET_WWDR_CERT = appleTestWwdrCert;
env.APPLE_WALLET_PRIVATE_KEY = appleTestPrivateKey;
const appleWalletAccount = await call("/api/members/me", { cookie: sessionCookie });
assert.equal((await appleWalletAccount.json()).wallet.apple.available, true, "Apple Wallet becomes visible only with a complete certificate chain");
const appleWallet = await call("/api/members/wallet/apple?locale=nl", { method: "POST", cookie: sessionCookie });
assert.equal(appleWallet.status, 200, "an approved student can download an Apple Wallet pass");
assert.equal(appleWallet.headers.get("content-type"), "application/vnd.apple.pkpass", "Apple Wallet uses the official pkpass content type");
assert.match(appleWallet.headers.get("content-disposition") || "", /schaapsvis-studentenpas\.pkpass/, "Apple Wallet returns a recognizable filename");
assert.equal(appleWallet.headers.get("cache-control"), "private, no-store", "personalized Apple Wallet passes are never cached");
const appleFiles = unzipSync(new Uint8Array(await appleWallet.arrayBuffer()));
assert.ok(appleFiles["manifest.json"], "Apple Wallet package contains the required manifest");
assert.ok(appleFiles.signature?.byteLength > 100, "Apple Wallet package contains a detached CMS signature");
assert.ok(appleFiles["icon@2x.png"]?.byteLength > 1000, "Apple Wallet package embeds the owner's Schaap's badge");
assert.ok(appleFiles["logo@2x.png"]?.byteLength > 1000, "Apple Wallet pass visibly embeds the Schaap's badge as its logo");
const applePass = JSON.parse(new TextDecoder().decode(appleFiles["pass.json"]));
assert.equal(applePass.storeCard.primaryFields[0].value, "10%", "Apple Wallet pass states the correct discount");
assert.equal(applePass.storeCard.secondaryFields[0].value, "Test Student", "Apple Wallet pass shows the account holder's full name");
assert.equal(applePass.barcodes[0].message, pass.displayCode, "Apple Wallet QR uses the same short staff verification code");
assert.equal(applePass.sharingProhibited, true, "the personalized Apple Wallet pass cannot be shared from Wallet");
assert.equal(applePass.webServiceURL, `${env.SITE_ORIGIN}/api/members/wallet/apple`, "Apple Wallet pass points to the members update service");
assert.ok(applePass.authenticationToken?.length >= 32, "Apple Wallet pass contains a stable per-pass update secret");
assert.equal(applePass.voided, false, "a valid student pass is not voided in Apple Wallet");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM student_wallet_passes WHERE pass_id=(SELECT id FROM student_passes WHERE display_code=?) AND platform='apple' AND serial_number IS NOT NULL").get(pass.displayCode).count, 1, "Apple issuance is recorded with its stable serial number");
assert.notEqual(sqlite.prepare("SELECT authentication_token_hash FROM student_wallet_passes WHERE pass_id=(SELECT id FROM student_passes WHERE display_code=?) AND platform='apple'").get(pass.displayCode).authentication_token_hash, applePass.authenticationToken, "the Apple update secret is not stored in plaintext");

const walletDevice = "test-device-library-identifier-2026";
const walletPushToken = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const walletPassType = encodeURIComponent(env.APPLE_WALLET_PASS_TYPE_ID);
const walletSerial = encodeURIComponent(applePass.serialNumber);
const walletAuthorization = { Authorization: `ApplePass ${applePass.authenticationToken}` };
const walletRegistrationPath = `/api/members/wallet/apple/v1/devices/${encodeURIComponent(walletDevice)}/registrations/${walletPassType}/${walletSerial}`;
const priorSitePublic = env.SITE_PUBLIC;
env.SITE_PUBLIC = "password-gated";
assert.equal((await call(walletRegistrationPath, { method: "POST", body: { pushToken: walletPushToken }, headers: walletAuthorization })).status, 201, "Apple Wallet can register a device for pass updates");
assert.equal((await call(walletRegistrationPath, { method: "POST", body: { pushToken: walletPushToken }, headers: walletAuthorization })).status, 200, "Apple Wallet registration is idempotent");
const storedWalletDevice = sqlite.prepare("SELECT device_hash, push_token_ciphertext, push_token_iv FROM apple_wallet_devices").get();
assert.notEqual(storedWalletDevice.device_hash, walletDevice, "the Apple device library identifier is stored only as a keyed hash");
assert.notEqual(storedWalletDevice.push_token_ciphertext, walletPushToken, "the APNs push token is encrypted at rest");
assert.ok(storedWalletDevice.push_token_iv, "the encrypted APNs token has its own random IV");
assert.equal((await call(walletRegistrationPath, { method: "POST", body: { pushToken: walletPushToken }, headers: { Authorization: "ApplePass wrong" } })).status, 401, "Apple Wallet registration rejects the wrong pass secret");

const walletUpdatesPath = `/api/members/wallet/apple/v1/devices/${encodeURIComponent(walletDevice)}/registrations/${walletPassType}`;
const firstWalletUpdates = await call(walletUpdatesPath);
assert.equal(firstWalletUpdates.status, 200, "registered devices can request their updated serial numbers");
const firstWalletUpdateData = await firstWalletUpdates.json();
assert.deepEqual(firstWalletUpdateData.serialNumbers, [applePass.serialNumber]);
assert.ok(firstWalletUpdateData.lastUpdated);
const updatedWalletPassPath = `/api/members/wallet/apple/v1/passes/${walletPassType}/${walletSerial}`;
const updatedWalletPass = await call(updatedWalletPassPath, { headers: walletAuthorization });
assert.equal(updatedWalletPass.status, 200, "Apple Wallet can fetch a freshly signed update");
const updateLastModified = updatedWalletPass.headers.get("last-modified");
const updatedWalletFiles = unzipSync(new Uint8Array(await updatedWalletPass.arrayBuffer()));
assert.equal(JSON.parse(new TextDecoder().decode(updatedWalletFiles["pass.json"])).voided, false, "the refreshed pass retains its active status");
assert.equal((await call(updatedWalletPassPath, { headers: { ...walletAuthorization, "If-Modified-Since": updateLastModified } })).status, 304, "Apple Wallet update download honors If-Modified-Since");

sqlite.prepare("UPDATE student_passes SET revoked_at=? WHERE id=?").run(new Date().toISOString(), applePass.serialNumber);
const revokedWalletUpdates = await call(`${walletUpdatesPath}?passesUpdatedSince=${encodeURIComponent(firstWalletUpdateData.lastUpdated)}`);
assert.equal(revokedWalletUpdates.status, 200, "revocation marks the installed pass as changed");
const revokedWalletPass = await call(updatedWalletPassPath, { headers: walletAuthorization });
const revokedWalletFiles = unzipSync(new Uint8Array(await revokedWalletPass.arrayBuffer()));
assert.equal(JSON.parse(new TextDecoder().decode(revokedWalletFiles["pass.json"])).voided, true, "a revoked Schaap's pass is returned as voided to Apple Wallet");
assert.equal((await call(walletRegistrationPath, { method: "DELETE", headers: walletAuthorization })).status, 200, "Apple Wallet can unregister a removed pass");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM apple_wallet_registrations").get().count, 0, "unregistration removes the device-pass mapping");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM apple_wallet_devices").get().count, 0, "an orphaned Apple Wallet device record is removed");
env.SITE_PUBLIC = priorSitePublic;
sqlite.prepare("UPDATE student_passes SET revoked_at=NULL WHERE id=?").run(applePass.serialNumber);
sqlite.prepare("UPDATE student_wallet_passes SET status='active', revoked_at=NULL, updated_at=? WHERE pass_id=? AND platform='apple'").run(new Date().toISOString(), applePass.serialNumber);
delete env.GOOGLE_WALLET_ISSUER_ID;
delete env.GOOGLE_WALLET_CLASS_ID;
delete env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL;
delete env.GOOGLE_WALLET_PRIVATE_KEY;
delete env.APPLE_WALLET_PASS_TYPE_ID;
delete env.APPLE_WALLET_TEAM_ID;
delete env.APPLE_WALLET_SIGNER_CERT;
delete env.APPLE_WALLET_WWDR_CERT;
delete env.APPLE_WALLET_PRIVATE_KEY;
sqlite.prepare("UPDATE student_passes SET expires_at='2000-01-01T00:00:00.000Z' WHERE user_id=(SELECT id FROM users WHERE email='student@example.test')").run();
const expiredAccount = await call("/api/members/me", { cookie: sessionCookie });
assert.equal((await expiredAccount.json()).discountPass, null, "expired pass is no longer shown as usable");
const renewalForm = new FormData();
renewalForm.set("institution", "MBO Leiden");
renewalForm.set("educationLevel", "mbo");
renewalForm.set("studyCity", "Leiden");
assert.equal((await call("/api/members/student-application", { method: "POST", body: renewalForm, cookie: sessionCookie })).status, 202, "student can reapply after the pass expires");
const renewalQueue = await call("/api/members/admin/student-applications", { cookie: sessionCookie });
const renewalApplication = (await renewalQueue.json()).applications[0];
let releaseDecisionReads;
decisionReadBarrier = {
  applicationId: renewalApplication.id,
  reads: 0,
  promise: new Promise((resolve) => { releaseDecisionReads = resolve; }),
  release() { releaseDecisionReads(); },
};
const competingDecisions = await Promise.all([
  call(`/api/members/admin/student-applications/${renewalApplication.id}/decision`, { method: "POST", cookie: sessionCookie, body: { decision: "approved" } }),
  call(`/api/members/admin/student-applications/${renewalApplication.id}/decision`, { method: "POST", cookie: sessionCookie, body: { decision: "rejected" } }),
]);
assert.equal(decisionReadBarrier.reads, 2, "both administrators read the pending application before either decision is committed");
decisionReadBarrier = null;
const competingStatuses = await Promise.all(competingDecisions.map((response) => response.status));
assert.deepEqual([...competingStatuses].sort((a, b) => a - b), [200, 409], "only one competing decision succeeds; the other receives a conflict");
let winningDecision = competingStatuses[0] === 200 ? "approved" : "rejected";
assert.equal(sqlite.prepare("SELECT status FROM student_applications WHERE id=?").get(renewalApplication.id).status, winningDecision, "the saved review matches the only successful response");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM admin_audit_log WHERE application_id=? AND action IN ('application_approved','application_rejected')").get(renewalApplication.id).count, 1, "a race records exactly one review decision");
if (winningDecision === "rejected") {
  const retryForm = new FormData();
  retryForm.set("institution", "MBO Leiden");
  retryForm.set("educationLevel", "mbo");
  retryForm.set("studyCity", "Leiden");
  assert.equal((await call("/api/members/student-application", { method: "POST", body: retryForm, cookie: sessionCookie })).status, 202, "a student can submit again after a rejected renewal");
  const retryQueue = await call("/api/members/admin/student-applications", { cookie: sessionCookie });
  const retryApplication = (await retryQueue.json()).applications[0];
  const retryDecision = await call(`/api/members/admin/student-applications/${retryApplication.id}/decision`, { method: "POST", cookie: sessionCookie, body: { decision: "approved" } });
  assert.equal(retryDecision.status, 200, "a new renewal can be approved after a rejected application");
}
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM student_passes WHERE user_id=(SELECT id FROM users WHERE email='student@example.test')").get().count, 2, "renewal preserves the old pass record and issues a new one");
const renewedAccount = await call("/api/members/me", { cookie: sessionCookie });
const renewedPass = (await renewedAccount.json()).discountPass;
assert.ok(renewedPass?.code && renewedPass.code !== pass.code, "the account shows the new pass after renewal");
const renewedCheck = await call("/api/members/admin/pass/verify", { method: "POST", cookie: sessionCookie, body: { code: renewedPass.code } });
assert.equal((await renewedCheck.json()).valid, true, "the renewed pass verifies against its own approved application");
const expiredPassCheck = await call("/api/members/admin/pass/verify", { method: "POST", cookie: sessionCookie, body: { code: pass.code } });
assert.equal((await expiredPassCheck.json()).valid, false, "the expired former pass cannot be used after renewal");

const signupStart = await call("/api/members/newsletter/start", { method: "POST", body: { email: "staged-deals@example.test" } });
assert.equal(signupStart.status, 201, "email-first signup stores a short-lived draft immediately");
const signupState = await signupStart.json();
assert.ok(signupState.draftToken, "the browser receives only an unguessable short-lived continuation token");
assert.equal(sqlite.prepare("SELECT email FROM newsletter_signup_drafts WHERE token_hash=?").get(await (async () => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(signupState.draftToken));
  return Buffer.from(bytes).toString("base64url");
})()).email, "staged-deals@example.test", "email is persisted before the region and marketing-consent step");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM newsletter_subscriptions WHERE email='staged-deals@example.test'").get().count, 0, "a saved draft is not an active or pending marketing subscription");
const stagedFinish = await call("/api/members/newsletter/subscribe", {
  method: "POST", body: { email: "staged-deals@example.test", draftToken: signupState.draftToken, consent: true, locale: "nl", regionTag: "regio-071" },
});
assert.equal(stagedFinish.status, 202);
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM newsletter_signup_drafts WHERE email='staged-deals@example.test'").get().count, 0, "completed signup removes its temporary draft");
assert.equal(sqlite.prepare("SELECT status FROM newsletter_subscriptions WHERE email='staged-deals@example.test'").get().status, "subscribed", "explicit form consent activates the subscription without another email");
assert.equal(sqlite.prepare("SELECT region_tag FROM newsletter_subscriptions WHERE email='staged-deals@example.test'").get().region_tag, "regio-071", "region tag is attached after explicit consent");
assert.equal((await call("/api/members/newsletter/subscribe", { method: "POST", body: { email: "staged-deals@example.test", draftToken: signupState.draftToken, consent: true, regionTag: "regio-071" } })).status, 410, "signup continuation tokens are one-use");

const subscription = await call("/api/members/newsletter/subscribe", {
  method: "POST", body: { email: "deals@example.test", consent: true, locale: "de", regionTag: "leiden" },
});
assert.equal(subscription.status, 202);
assert.equal(sqlite.prepare("SELECT status FROM newsletter_subscriptions WHERE email='deals@example.test'").get().status, "subscribed");
assert.equal(sqlite.prepare("SELECT region_tag FROM newsletter_subscriptions WHERE email='deals@example.test'").get().region_tag, "leiden", "newsletter stores the subscriber's chosen local-area tag");

assert.equal((await call("/api/members/admin/newsletter-campaigns", { method: "POST", cookie: sessionCookie, body: { subject: "Missing audience", body: "Test" } })).status, 400, "campaign creation requires an explicit audience");
const studentSubscription = await call("/api/members/newsletter/subscribe", {
  method: "POST", cookie: sessionCookie, body: { email: "student@example.test", consent: true, locale: "nl", regionTag: "leiden" },
});
assert.equal(studentSubscription.status, 202);
assert.equal(sqlite.prepare("SELECT status FROM newsletter_subscriptions WHERE email='student@example.test'").get().status, "subscribed");
const segmentOverview = await call("/api/members/admin/newsletter-campaigns", { cookie: sessionCookie });
assert.equal((await segmentOverview.json()).studentSubscriberCount, 1, "only confirmed subscribers with an active approved pass are in the student audience");
const studentDraft = await call("/api/members/admin/newsletter-campaigns", {
  method: "POST", cookie: sessionCookie, body: { subject: "Studentenaanbieding", body: "Alleen voor studenten.", audience: "students" },
});
assert.equal(studentDraft.status, 201);
const studentCampaignId = (await studentDraft.json()).id;
const studentQueue = await call(`/api/members/admin/newsletter-campaigns/${studentCampaignId}/send`, { method: "POST", cookie: sessionCookie });
assert.equal((await studentQueue.json()).recipientCount, 1, "a student campaign excludes ordinary subscribers");
assert.equal(sqlite.prepare("SELECT email FROM newsletter_deliveries WHERE campaign_id=?").get(studentCampaignId).email, "student@example.test");
let studentJob;
await memberWorker.scheduled({}, env, { waitUntil(promise) { studentJob = promise; } });
await studentJob;
assert.equal(sqlite.prepare("SELECT status FROM newsletter_deliveries WHERE campaign_id=?").get(studentCampaignId).status, "sent");
const expiryDraft = await call("/api/members/admin/newsletter-campaigns", {
  method: "POST", cookie: sessionCookie, body: { subject: "Verlopen studentenactie", body: "Dit mag niet aankomen.", audience: "students" },
});
const expiryCampaignId = (await expiryDraft.json()).id;
await call(`/api/members/admin/newsletter-campaigns/${expiryCampaignId}/send`, { method: "POST", cookie: sessionCookie });
sqlite.prepare("UPDATE student_passes SET expires_at='2000-01-01T00:00:00.000Z' WHERE user_id=(SELECT id FROM users WHERE email='student@example.test')").run();
const mailCountBeforeExpiry = sentEmails.length;
await memberWorker.scheduled({}, env, { waitUntil(promise) { studentJob = promise; } });
await studentJob;
assert.equal(sqlite.prepare("SELECT status FROM newsletter_deliveries WHERE campaign_id=?").get(expiryCampaignId).status, "suppressed", "a pass expiring after queueing suppresses delivery");
assert.equal(sentEmails.length, mailCountBeforeExpiry, "expired student passes do not receive student campaigns");
sqlite.prepare("UPDATE newsletter_subscriptions SET status='unsubscribed' WHERE email='student@example.test'").run();

const draft = await call("/api/members/admin/newsletter-campaigns", {
  method: "POST", cookie: sessionCookie, body: { subject: "Weekdeal test", body: "Alleen voor de test.", audience: "all" },
});
assert.equal(draft.status, 201);
const campaignId = (await draft.json()).id;
const queued = await call(`/api/members/admin/newsletter-campaigns/${campaignId}/send`, { method: "POST", cookie: sessionCookie });
assert.equal((await queued.json()).recipientCount, 2, "single-opt-in subscribers are immediately eligible for a general campaign");
let job;
await memberWorker.scheduled({}, env, { waitUntil(promise) { job = promise; } });
await job;
assert.equal(sqlite.prepare("SELECT status FROM newsletter_campaigns WHERE id=?").get(campaignId).status, "sent");
const marketingEmail = sentEmails.findLast((message) => message.to === "deals@example.test");
assert.match(marketingEmail.html, /Speciaal voor klanten van Schaap’s Vishandel/);
assert.match(marketingEmail.html, /Herenstraat 48, Leiden/);
assert.match(marketingEmail.listUnsubscribeUrl, /\/api\/members\/newsletter\/unsubscribe-one-click\?token=/);
const oneClickEmail = sentEmails.findLast((message) => message.to === "staged-deals@example.test");
const oneClickUrl = new URL(oneClickEmail.listUnsubscribeUrl);
const oneClickResult = await call(`${oneClickUrl.pathname}${oneClickUrl.search}`, {
  method: "POST", body: "List-Unsubscribe=One-Click", contentType: "application/x-www-form-urlencoded", omitOrigin: true,
});
assert.equal(oneClickResult.status, 204, "mail clients can unsubscribe with the RFC 8058 one-click request without a browser session");
assert.equal(sqlite.prepare("SELECT status FROM newsletter_subscriptions WHERE email='staged-deals@example.test'").get().status, "unsubscribed");
const unsubscribeUrl = marketingEmail.html.match(/https:\/\/[^\"]+/)[0];
const unsubscribe = new URL(unsubscribeUrl);
const unsubscribePage = await call(`${unsubscribe.pathname}${unsubscribe.search}`, { headers: { "Accept-Language": "de-DE,de;q=0.9,en;q=0.8" } });
assert.equal(unsubscribePage.status, 200);
assert.match(await unsubscribePage.text(), /<html lang="de">/);
const unsubscribeForm = new FormData();
unsubscribeForm.set("token", unsubscribe.searchParams.get("token"));
unsubscribeForm.set("locale", "de");
const unsubscribeResult = await call(unsubscribe.pathname, { method: "POST", body: unsubscribeForm });
assert.equal(unsubscribeResult.status, 200);
assert.match(await unsubscribeResult.text(), /<html lang="de">/);
assert.equal(sqlite.prepare("SELECT status FROM newsletter_subscriptions WHERE email='deals@example.test'").get().status, "unsubscribed");

const dailyLimitSubscription = await call("/api/members/newsletter/subscribe", {
  method: "POST", body: { email: "quota@example.test", consent: true, regionTag: "voorschoten" },
});
assert.equal(dailyLimitSubscription.status, 202);
const quotaDraft = await call("/api/members/admin/newsletter-campaigns", {
  method: "POST", cookie: sessionCookie, body: { subject: "Quota test", body: "Test quota", audience: "all" },
});
const quotaCampaignId = (await quotaDraft.json()).id;
await call(`/api/members/admin/newsletter-campaigns/${quotaCampaignId}/send`, { method: "POST", cookie: sessionCookie });
simulateDailyQuota = true;
await memberWorker.scheduled({}, env, { waitUntil(promise) { job = promise; } });
await job;
assert.equal(sqlite.prepare("SELECT status FROM newsletter_campaigns WHERE id=?").get(quotaCampaignId).status, "queued", "daily quota keeps delivery queued");
assert.equal(sqlite.prepare("SELECT attempts FROM newsletter_deliveries WHERE campaign_id=?").get(quotaCampaignId).attempts, 0, "daily quota does not consume retry attempts");
assert.equal(sqlite.prepare("SELECT last_error FROM newsletter_deliveries WHERE campaign_id=?").get(quotaCampaignId).last_error, "E_DAILY_LIMIT_EXCEEDED");
simulateDailyQuota = false;
sqlite.prepare("UPDATE newsletter_deliveries SET next_attempt_at=? WHERE campaign_id=?").run(new Date().toISOString(), quotaCampaignId);
await memberWorker.scheduled({}, env, { waitUntil(promise) { job = promise; } });
await job;
assert.equal(sqlite.prepare("SELECT status FROM newsletter_campaigns WHERE id=?").get(quotaCampaignId).status, "sent", "queued delivery resumes when quota is available");

const resetRequest = await call("/api/members/password-reset", { method: "POST", body: { email: "student@example.test", locale: "en" } });
assert.equal(resetRequest.status, 202);
assert.equal(sentEmails.at(-1).subject, "Reset your password");
const resetUrl = new URL(sentEmails.at(-1).text.match(/https:\/\/[^\s]+/)[0]);
assert.equal(resetUrl.searchParams.get("locale"), "en");
const resetPage = await call(`${resetUrl.pathname}${resetUrl.search}`);
const resetPageHtml = await resetPage.text();
assert.match(resetPageHtml, /<html lang="en">/);
assert.match(resetPageHtml, /New password \(at least 12 characters\)/);
assert.match(resetPageHtml, /Repeat the new password/);
assert.match(resetPageHtml, /Show passwords/);
assert.match(resetPage.headers.get("Content-Security-Policy"), /script-src 'nonce-[a-f0-9]+'/);
assert.match(sentEmails.at(-1).html, /Schaap’s Vishandel/);
assert.match(sentEmails.at(-1).html, /background:#075c7c/);
const mismatchForm = new FormData();
mismatchForm.set("token", resetUrl.searchParams.get("token"));
mismatchForm.set("locale", "en");
mismatchForm.set("password", "updated secure password");
mismatchForm.set("passwordConfirm", "different secure password");
const mismatchResult = await call(resetUrl.pathname, { method: "POST", body: mismatchForm });
assert.equal(mismatchResult.status, 400, "mismatched passwords are rejected server-side");
assert.match(await mismatchResult.text(), /passwords do not match/i);
const resetForm = new FormData();
resetForm.set("token", resetUrl.searchParams.get("token"));
resetForm.set("locale", "en");
resetForm.set("password", "updated secure password");
resetForm.set("passwordConfirm", "updated secure password");
const resetResult = await call(resetUrl.pathname, { method: "POST", body: resetForm });
assert.equal(resetResult.status, 303);
assert.equal(resetResult.headers.get("Location"), "https://schaapsvishandel.nl/en/account?password-reset=1");

env.MEMBERS_ENABLED = "on";
const diagnosticDisabled = await call("/api/members/admin/smtp-test", { method: "POST" });
assert.equal(diagnosticDisabled.status, 404, "SMTP diagnostic is hidden when disabled");
env.SMTP_DIAGNOSTICS = "on";
env.SMTP_TEST_TO = "owner@example.test";
const beforeDiagnostic = sentEmails.length;
const beforeDiagnosticUsers = Number(sqlite.prepare("SELECT COUNT(*) AS count FROM users").get().count);
const beforeDiagnosticApplications = Number(sqlite.prepare("SELECT COUNT(*) AS count FROM student_applications").get().count);
const diagnostic = await call("/api/members/admin/smtp-test", { method: "POST" });
assert.equal(diagnostic.status, 202, "allowlisted owner can request one SMTP diagnostic");
assert.equal(sentEmails.length, beforeDiagnostic + 1);
assert.equal(sentEmails.at(-1).to, "owner@example.test", "recipient is fixed by Worker configuration");
assert.match(sentEmails.at(-1).text, /Tijdelijke testcode: \d{6}/);
const limitedDiagnostic = await call("/api/members/admin/smtp-test", { method: "POST" });
assert.equal(limitedDiagnostic.status, 429, "diagnostic is rate limited");
const rejectedDiagnostic = await call("/api/members/admin/smtp-test", { method: "POST", headers: { "CF-Connecting-IP": "203.0.113.99" } });
assert.equal(rejectedDiagnostic.status, 403, "non-allowlisted IP cannot use diagnostic");
assert.equal(Number(sqlite.prepare("SELECT COUNT(*) AS count FROM users").get().count), beforeDiagnosticUsers, "diagnostic creates no user");
assert.equal(Number(sqlite.prepare("SELECT COUNT(*) AS count FROM student_applications").get().count), beforeDiagnosticApplications, "diagnostic creates no student application");
env.SMTP_DIAGNOSTICS = "off";
assert.equal((await call("/api/members/admin/smtp-check", { method: "POST" })).status, 404, "SMTP authentication diagnostic is hidden when disabled");
env.SMTP_DIAGNOSTICS = "on";
assert.equal((await call("/api/members/admin/smtp-check", { method: "POST", headers: { "CF-Connecting-IP": "198.51.100.2" } })).status, 403, "SMTP authentication diagnostic rejects non-admin IPs");
assert.equal((await call("/api/members/admin/smtp-check", { method: "POST" })).status, 503, "SMTP authentication diagnostic reports missing SMTP without sending email");
env.SMTP_DIAGNOSTICS = "off";
env.MEMBERS_ENABLED = "off";

env.MEMBERS_ENABLED = "on";
env.ADMIN_EMAILS = "student@example.test,owner@example.test";
const ownerDetails = { email: "owner@example.test", name: "Shop Owner", password: "owner test password 2026", locale: "en" };
assert.equal((await call("/api/members/admin/register", { method: "POST", body: ownerDetails, headers: { "CF-Connecting-IP": "198.51.100.5" } })).status, 403, "admin registration requires the owner IP");
assert.equal((await call("/api/members/admin/register", { method: "POST", body: { ...ownerDetails, email: "other@example.test" } })).status, 403, "admin registration requires an allowlisted business address");
assert.equal((await call("/api/members/admin/register", { method: "POST", body: { ...ownerDetails, password: "short" } })).status, 400, "admin password must meet the normal account standard");
const ownerMailOffset = sentEmails.length;
assert.equal((await call("/api/members/admin/register", { method: "POST", body: ownerDetails })).status, 202, "owner can start a dedicated account without a school address");
assert.equal(sentEmails.length, ownerMailOffset + 1, "owner receives one verification email at the allowlisted business address");
assert.equal(sentEmails.at(-1).to, ownerDetails.email);
assert.match(sentEmails.at(-1).text, /Click below to verify the email address/, "link-based owner mail does not introduce a missing verification code");
assert.doesNotMatch(sentEmails.at(-1).text, /verification code/i, "link-based owner mail is distinct from student code mail");
const firstOwnerVerificationUrl = new URL(sentEmails.at(-1).text.match(/https:\/\/[^\s]+/)[0]);
assert.equal(sqlite.prepare("SELECT school_email FROM users WHERE email='owner@example.test'").get().school_email, null, "admin account does not fabricate a student school address");
assert.equal(sqlite.prepare("SELECT email_verified_at FROM users WHERE email='owner@example.test'").get().email_verified_at, null, "admin email is unverified until the owner follows the link");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM newsletter_subscriptions WHERE email='owner@example.test'").get().count, 0, "admin registration never subscribes the owner to marketing");
const retriedOwnerDetails = { ...ownerDetails, name: "Shop Owner Updated", password: "owner retry password 2026" };
assert.equal((await call("/api/members/admin/register", { method: "POST", body: retriedOwnerDetails })).status, 202, "an unverified owner can retry registration after a delivery problem");
assert.equal(sentEmails.length, ownerMailOffset + 2, "retrying an unverified owner sends one fresh verification message");
const expiredOwnerVerificationForm = new FormData();
expiredOwnerVerificationForm.set("token", firstOwnerVerificationUrl.searchParams.get("token"));
expiredOwnerVerificationForm.set("locale", "en");
assert.equal((await call(firstOwnerVerificationUrl.pathname, { method: "POST", body: expiredOwnerVerificationForm })).status, 410, "retry invalidates the earlier owner verification link");
const ownerVerificationUrl = new URL(sentEmails.at(-1).text.match(/https:\/\/[^\s]+/)[0]);
assert.equal((await call(`${ownerVerificationUrl.pathname}${ownerVerificationUrl.search}`)).status, 200);
const ownerVerificationForm = new FormData();
ownerVerificationForm.set("token", ownerVerificationUrl.searchParams.get("token"));
ownerVerificationForm.set("locale", "en");
assert.equal((await call(ownerVerificationUrl.pathname, {
  method: "POST",
  body: ownerVerificationForm,
  omitOrigin: true,
  headers: { "Sec-Fetch-Site": "same-origin", "Sec-Fetch-Mode": "navigate", "Sec-Fetch-Dest": "document" },
})).status, 303, "same-origin browser form navigation activates the owner account when Chrome omits Origin");
const forgedVerificationForm = new FormData();
forgedVerificationForm.set("token", "forged-token");
forgedVerificationForm.set("locale", "en");
assert.equal((await call(ownerVerificationUrl.pathname, {
  method: "POST",
  body: forgedVerificationForm,
  omitOrigin: true,
  headers: { "Sec-Fetch-Site": "cross-site", "Sec-Fetch-Mode": "navigate", "Sec-Fetch-Dest": "document" },
})).status, 403, "cross-site form navigation remains rejected without an approved Origin");
assert.equal((await call("/api/members/login", { method: "POST", body: { email: ownerDetails.email, password: ownerDetails.password } })).status, 401, "retry replaces the unverified owner password instead of keeping a lost password");
const ownerLogin = await call("/api/members/login", { method: "POST", body: { email: ownerDetails.email, password: retriedOwnerDetails.password } });
assert.equal(ownerLogin.status, 200, "owner can log in after email verification");
const ownerMailCountAfterVerification = sentEmails.length;
assert.equal((await call("/api/members/admin/register", { method: "POST", body: ownerDetails })).status, 202, "a verified owner registration keeps the generic response");
assert.equal(sentEmails.length, ownerMailCountAfterVerification, "a verified owner cannot trigger another verification message");
const ownerSession = ownerLogin.headers.get("Set-Cookie").split(";")[0];
assert.equal((await (await call("/api/members/me", { cookie: ownerSession })).json()).isAdmin, true, "owner sees admin navigation on the trusted network");
assert.equal((await (await call("/api/members/me", { cookie: ownerSession, headers: { "CF-Connecting-IP": "198.51.100.5" } })).json()).isAdmin, false, "admin navigation is hidden outside the trusted network");
assert.equal((await call("/api/members/admin/newsletter-campaigns", { cookie: ownerSession })).status, 200, "owner session and IP can manage email campaigns");
assert.equal((await call("/api/members/admin/student-applications", { cookie: ownerSession })).status, 200, "owner session and IP can review student applications");
assert.equal((await call("/api/members/admin/newsletter-campaigns", { cookie: ownerSession, headers: { "CF-Connecting-IP": "198.51.100.5" } })).status, 403, "owner session is not enough from an untrusted IP");

console.log("Account worker integration tests passed: email verification with immediate login, proof-free student applications, student pass renewal, newsletter single opt-in, campaign delivery, unsubscribe and daily quota recovery.");

