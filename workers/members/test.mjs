import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import memberWorker from "./src/index.mjs";

const schema = await readFile(new URL("../../migrations/0001_student_portal.sql", import.meta.url), "utf8");
const renewalMigration = await readFile(new URL("../../migrations/0002_student_pass_renewals.sql", import.meta.url), "utf8");
const proofCleanupMigration = await readFile(new URL("../../migrations/0003_student_proof_cleanup_queue.sql", import.meta.url), "utf8");
const pendingApplicationMigration = await readFile(new URL("../../migrations/0004_one_pending_student_application.sql", import.meta.url), "utf8");
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
assert.equal(upgradeDb.prepare("SELECT application_id FROM student_passes WHERE id='legacy-pass'").get().application_id, "legacy-application", "migration associates existing student passes with their approved application");
upgradeDb.close();
const sqlite = new DatabaseSync(":memory:");
sqlite.exec(schema);
sqlite.exec(renewalMigration);
sqlite.exec(proofCleanupMigration);
sqlite.exec(pendingApplicationMigration);
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
let simulateDailyQuota = false;
let simulateProofDeleteFailure = false;
const env = {
  DB: db,
  MEMBERS_ENABLED: "off",
  AUTH_PEPPER: "test-only-pepper-never-use-in-production",
  PASS_SIGNING_KEY: "test-only-signing-key-never-use-in-production",
  SITE_ORIGIN: "https://www.schaapsvishandel.nl",
  MAIL_FROM: "noreply@schaapsvishandel.nl",
  ADMIN_EMAILS: "student@example.test",
  EMAIL: { async send(message) {
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

async function call(path, { method = "GET", body, cookie = "", contentType, headers: extraHeaders = {} } = {}) {
  const headers = new Headers({ Origin: env.SITE_ORIGIN });
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
const disabledTasks = [];
await memberWorker.scheduled({}, env, { waitUntil(task) { disabledTasks.push(task); } });
assert.equal(disabledTasks.length, 1, "privacy cleanup remains scheduled while account features are disabled");
await Promise.all(disabledTasks);
assert.equal(objects.has(disabledProofKey), false, "privacy cleanup removes an already-reviewed proof even while accounts are disabled");
assert.equal(sqlite.prepare("SELECT proof_object_key FROM student_applications WHERE id='disabled-cron-review'").get().proof_object_key, null, "disabled-mode cleanup records successful deletion");
assert.equal(sentEmails.length, 0, "newsletter delivery stays inert while member services are disabled");
sqlite.exec(`DELETE FROM newsletter_deliveries WHERE campaign_id='disabled-cron-campaign'; DELETE FROM newsletter_campaigns WHERE id='disabled-cron-campaign'; DELETE FROM newsletter_subscriptions WHERE email='disabled-cron@example.test'; DELETE FROM users WHERE id='disabled-cron-admin';`);
env.MEMBERS_ENABLED = "on";
const health = await call("/api/members/health");
assert.equal(health.status, 200);
assert.equal((await call("/api/members/admin/student-applications")).status, 403, "admin API rejects anonymous requests");
const oversizedRegistration = await call("/api/members/register", {
  method: "POST",
  body: { email: "oversized@example.test", name: "x".repeat(40_000), password: "correct horse battery" },
});
assert.equal(oversizedRegistration.status, 400, "JSON parsing is bounded even when Content-Length is absent");

const registration = await call("/api/members/register", {
  method: "POST",
  body: { email: "student@example.test", name: "Test Student", password: "correct horse battery", locale: "en" },
});
assert.equal(registration.status, 202);
assert.equal(sentEmails.length, 1, "registration sends verification email");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM newsletter_subscriptions WHERE email='student@example.test'").get().count, 0, "account creation does not subscribe to marketing by default");
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
const verificationUrl = sentEmails[0].text.match(/https:\/\/[^\s]+/)[0];
assert.match(sentEmails[0].subject, /Verify your email address/, "verification subject uses the selected language");
const verification = new URL(verificationUrl);
assert.equal(verification.searchParams.get("locale"), "en");
const verificationPage = await call(`${verification.pathname}${verification.search}`);
assert.match(await verificationPage.text(), /<html lang="en">/);
const verifyToken = verification.searchParams.get("token");
const verifyForm = new FormData();
verifyForm.set("token", verifyToken);
verifyForm.set("locale", "en");
const verificationResult = await call("/api/members/verify", { method: "POST", body: verifyForm });
assert.equal(verificationResult.status, 303);
assert.equal(verificationResult.headers.get("Location"), "https://www.schaapsvishandel.nl/en/account?verified=1");

const login = await call("/api/members/login", {
  method: "POST",
  body: { email: "student@example.test", password: "correct horse battery" },
});
assert.equal(login.status, 200);
assert.doesNotMatch(login.headers.get("Set-Cookie"), /Domain=/i, "sessions use host-only cookies to isolate preview and production");
const sessionCookie = login.headers.get("Set-Cookie").split(";")[0];
assert.equal((await call("/api/members/me", { cookie: sessionCookie })).status, 200);
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

const proof = new File(["%PDF-1.7\nstudent enrollment proof"], "bewijs.pdf", { type: "application/pdf" });
const missingConsentForm = new FormData();
missingConsentForm.set("institution", "MBO Leiden");
missingConsentForm.set("educationLevel", "mbo");
missingConsentForm.set("studiesInLeiden", "true");
missingConsentForm.set("proof", proof);
assert.equal((await call("/api/members/student-application", { method: "POST", body: missingConsentForm, cookie: sessionCookie })).status, 400, "proof processing requires its own explicit consent");
assert.equal(objects.size, 0, "proof is not uploaded without processing consent");
const secondarySchoolForm = new FormData();
secondarySchoolForm.set("institution", "Leidse middelbare school");
secondarySchoolForm.set("educationLevel", "secondary");
secondarySchoolForm.set("studiesInLeiden", "true");
secondarySchoolForm.set("proofConsent", "true");
secondarySchoolForm.set("proof", proof);
assert.equal((await call("/api/members/student-application", { method: "POST", body: secondarySchoolForm, cookie: sessionCookie })).status, 400, "secondary-school applicants are not eligible");
assert.equal(objects.size, 0, "ineligible proof is not uploaded");
const applicationForm = new FormData();
applicationForm.set("institution", "MBO Leiden");
applicationForm.set("educationLevel", "mbo");
applicationForm.set("studiesInLeiden", "true");
applicationForm.set("proofConsent", "true");
applicationForm.set("proof", proof);
simulateApplicationCommitFailure = true;
simulateProofDeleteFailure = true;
assert.equal((await call("/api/members/student-application", { method: "POST", body: applicationForm, cookie: sessionCookie })).status, 503);
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM student_applications").get().count, 0, "failed application commit leaves no database reference");
assert.equal(objects.size, 1, "if both the database commit and R2 delete fail, the object remains private until scheduled cleanup");
const failedUpload = sqlite.prepare("SELECT object_key FROM student_proof_cleanup_queue").get();
assert.ok(failedUpload?.object_key && objects.has(failedUpload.object_key), "the failed upload retains its durable cleanup handle");
sqlite.prepare("UPDATE student_proof_cleanup_queue SET queued_at=? WHERE object_key=?").run("2000-01-01T00:00:00.000Z", failedUpload.object_key);
simulateProofDeleteFailure = false;
const orphanCleanupTasks = [];
await memberWorker.scheduled({}, env, { waitUntil(task) { orphanCleanupTasks.push(task); } });
await Promise.all(orphanCleanupTasks);
assert.equal(objects.has(failedUpload.object_key), false, "scheduled cleanup removes an old unlinked proof after R2 recovers");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM student_proof_cleanup_queue").get().count, 0, "successful orphan cleanup clears its queue row");
const applicationResponse = await call("/api/members/student-application", { method: "POST", body: applicationForm, cookie: sessionCookie });
assert.equal(applicationResponse.status, 202);
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM consent_events WHERE user_id=(SELECT id FROM users WHERE email='student@example.test') AND consent_type='student_proof_processing'").get().count, 1, "proof consent is committed with the application");
const activeApplication = sqlite.prepare("SELECT id, proof_object_key FROM student_applications WHERE status='pending'").get();
assert.throws(() => sqlite.prepare(`INSERT INTO student_applications (id,user_id,institution,education_level,proof_mime_type,proof_consent_version,proof_consent_at,status,submitted_at) VALUES ('duplicate-pending','${sqlite.prepare("SELECT id FROM users WHERE email='student@example.test'").get().id}','MBO Leiden','mbo','application/pdf','test-v1','2026-10-18','pending','2026-10-18')`).run(), /UNIQUE constraint failed/, "database prevents concurrent duplicate pending applications for one account");
sqlite.prepare("INSERT INTO student_proof_cleanup_queue (object_key, application_id, queued_at) VALUES (?, ?, ?)").run(activeApplication.proof_object_key, activeApplication.id, "2000-01-01T00:00:00.000Z");
const linkedCleanupTasks = [];
await memberWorker.scheduled({}, env, { waitUntil(task) { linkedCleanupTasks.push(task); } });
await Promise.all(linkedCleanupTasks);
assert.equal(objects.has(activeApplication.proof_object_key), true, "orphan cleanup never deletes proof objects linked to a pending application");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM student_proof_cleanup_queue WHERE object_key=?").get(activeApplication.proof_object_key).count, 0, "a stale queue row for an already-linked proof is discarded safely");
sqlite.exec("DELETE FROM auth_rate_limits"); // Keep later size-limit assertions independent of the per-user submission cap.
const oversizedForm = new FormData();
oversizedForm.set("institution", "MBO Leiden");
oversizedForm.set("educationLevel", "mbo");
oversizedForm.set("studiesInLeiden", "true");
oversizedForm.set("proofConsent", "true");
oversizedForm.set("proof", new File([new Uint8Array(8 * 1024 * 1024 + 64_001)], "bewijs.pdf", { type: "application/pdf" }));
assert.equal((await call("/api/members/student-application", { method: "POST", body: oversizedForm, cookie: sessionCookie })).status, 413, "streaming cap rejects oversized multipart uploads even without Content-Length");
assert.equal((await call("/api/members/admin/student-applications")).status, 403);
const queue = await call("/api/members/admin/student-applications", { cookie: sessionCookie });
assert.equal(queue.status, 200);
const application = (await queue.json()).applications[0];
assert.equal(application.email, "student@example.test");
assert.equal((await call(`/api/members/admin/student-applications/${application.id}/proof`, { cookie: sessionCookie })).status, 200);

simulateProofDeleteFailure = true;
const decision = await call(`/api/members/admin/student-applications/${application.id}/decision`, {
  method: "POST", cookie: sessionCookie, body: { decision: "approved" },
});
assert.equal(decision.status, 200);
assert.equal((await decision.json()).proofDeleted, false, "review result makes a failed proof deletion visible to the administrator");
assert.equal(objects.size, 1, "failed deletion does not silently lose the private proof key");
assert.equal((await call(`/api/members/admin/student-applications/${application.id}/cleanup`, { method: "POST", cookie: sessionCookie })).status, 503, "failed cleanup can be retried and remains explicit");
simulateProofDeleteFailure = false;
assert.equal((await call(`/api/members/admin/student-applications/${application.id}/cleanup`, { method: "POST", cookie: sessionCookie })).status, 200);
assert.equal(objects.size, 0, "approved proof is removed from private R2 after retry");
const account = await call("/api/members/me", { cookie: sessionCookie });
const pass = (await account.json()).discountPass;
assert.ok(pass?.code);
assert.ok(pass.expiresAt, "an approved student pass expires after one study year");
const expectedPassExpiry = new Date(pass.issuedAt);
expectedPassExpiry.setUTCFullYear(expectedPassExpiry.getUTCFullYear() + 1);
assert.equal(pass.expiresAt, expectedPassExpiry.toISOString(), "pass expires exactly one calendar year after approval");
const passCheck = await call("/api/members/admin/pass/verify", { method: "POST", cookie: sessionCookie, body: { code: pass.code } });
const verifiedPass = await passCheck.json();
assert.equal(verifiedPass.valid, true);
assert.deepEqual(verifiedPass.eligibleProducts, ["kibbeling", "haring", "broodje-haring", "drinks"], "discount eligibility is restricted to the agreed products");
sqlite.prepare("UPDATE student_passes SET expires_at='2000-01-01T00:00:00.000Z' WHERE user_id=(SELECT id FROM users WHERE email='student@example.test')").run();
const expiredAccount = await call("/api/members/me", { cookie: sessionCookie });
assert.equal((await expiredAccount.json()).discountPass, null, "expired pass is no longer shown as usable");
const renewalForm = new FormData();
renewalForm.set("institution", "MBO Leiden");
renewalForm.set("educationLevel", "mbo");
renewalForm.set("studiesInLeiden", "true");
renewalForm.set("proofConsent", "true");
renewalForm.set("proof", proof);
assert.equal((await call("/api/members/student-application", { method: "POST", body: renewalForm, cookie: sessionCookie })).status, 202, "student can submit new proof after the pass expires");
const renewalQueue = await call("/api/members/admin/student-applications", { cookie: sessionCookie });
const renewalApplication = (await renewalQueue.json()).applications[0];
let releaseDecisionReads;
decisionReadBarrier = {
  applicationId: renewalApplication.id,
  reads: 0,
  promise: new Promise((resolve) => { releaseDecisionReads = resolve; }),
  release() { releaseDecisionReads(); },
};
simulateProofDeleteFailure = true;
const competingDecisions = await Promise.all([
  call(`/api/members/admin/student-applications/${renewalApplication.id}/decision`, { method: "POST", cookie: sessionCookie, body: { decision: "approved" } }),
  call(`/api/members/admin/student-applications/${renewalApplication.id}/decision`, { method: "POST", cookie: sessionCookie, body: { decision: "rejected" } }),
]);
simulateProofDeleteFailure = false;
assert.equal(decisionReadBarrier.reads, 2, "both administrators read the pending application before either decision is committed");
decisionReadBarrier = null;
const competingStatuses = await Promise.all(competingDecisions.map((response) => response.status));
assert.deepEqual([...competingStatuses].sort((a, b) => a - b), [200, 409], "only one competing decision succeeds; the other receives a conflict");
let winningDecision = competingStatuses[0] === 200 ? "approved" : "rejected";
assert.equal(sqlite.prepare("SELECT status FROM student_applications WHERE id=?").get(renewalApplication.id).status, winningDecision, "the saved review matches the only successful response");
assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM admin_audit_log WHERE application_id=? AND action IN ('application_approved','application_rejected')").get(renewalApplication.id).count, 1, "a race records exactly one review decision");
const unresolvedProof = sqlite.prepare("SELECT proof_object_key FROM student_applications WHERE id=?").get(renewalApplication.id);
assert.ok(unresolvedProof?.proof_object_key && objects.has(unresolvedProof.proof_object_key), "a failed immediate deletion leaves the reviewed proof queued for cleanup");
const scheduledTasks = [];
await memberWorker.scheduled({}, env, { waitUntil(task) { scheduledTasks.push(task); } });
await Promise.all(scheduledTasks);
assert.equal(objects.has(unresolvedProof.proof_object_key), false, "the scheduled retry deletes a reviewed proof after storage recovers");
assert.equal(sqlite.prepare("SELECT proof_object_key FROM student_applications WHERE id=?").get(renewalApplication.id).proof_object_key, null, "the scheduled retry clears the stored key after deletion");
if (winningDecision === "rejected") {
  const retryForm = new FormData();
  retryForm.set("institution", "MBO Leiden");
  retryForm.set("educationLevel", "mbo");
  retryForm.set("studiesInLeiden", "true");
  retryForm.set("proofConsent", "true");
  retryForm.set("proof", proof);
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

const subscription = await call("/api/members/newsletter/subscribe", {
  method: "POST", body: { email: "deals@example.test", consent: true, locale: "de" },
});
assert.equal(subscription.status, 202);
const confirmationUrl = sentEmails.at(-1).text.match(/https:\/\/[^\s]+/)[0];
const confirmation = new URL(confirmationUrl);
assert.equal(sentEmails.at(-1).subject, "E-Mail-Angebote bestätigen", "newsletter confirmation email is localized");
assert.equal(confirmation.searchParams.get("locale"), "de");
const confirmationPage = await call(`${confirmation.pathname}${confirmation.search}`);
assert.equal(confirmationPage.status, 200);
assert.match(await confirmationPage.text(), /<html lang="de">/);
const confirmationForm = new FormData();
confirmationForm.set("token", confirmation.searchParams.get("token"));
confirmationForm.set("locale", "de");
const confirmationResult = await call(confirmation.pathname, { method: "POST", body: confirmationForm });
assert.equal(confirmationResult.status, 303);
assert.equal(confirmationResult.headers.get("Location"), "https://www.schaapsvishandel.nl/de/account?newsletter=confirmed");
assert.equal(sentEmails.at(-1).subject, "Sie erhalten jetzt E-Mail-Angebote von Schaap's Vishandel");
assert.match(sentEmails.at(-1).text, /locale=de/);
assert.equal(sqlite.prepare("SELECT status FROM newsletter_subscriptions WHERE email='deals@example.test'").get().status, "subscribed");

const draft = await call("/api/members/admin/newsletter-campaigns", {
  method: "POST", cookie: sessionCookie, body: { subject: "Weekdeal test", body: "Alleen voor de test." },
});
assert.equal(draft.status, 201);
const campaignId = (await draft.json()).id;
const queued = await call(`/api/members/admin/newsletter-campaigns/${campaignId}/send`, { method: "POST", cookie: sessionCookie });
assert.equal((await queued.json()).recipientCount, 1);
let job;
await memberWorker.scheduled({}, env, { waitUntil(promise) { job = promise; } });
await job;
assert.equal(sqlite.prepare("SELECT status FROM newsletter_campaigns WHERE id=?").get(campaignId).status, "sent");
const marketingEmail = sentEmails.at(-1);
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
  method: "POST", body: { email: "quota@example.test", consent: true },
});
assert.equal(dailyLimitSubscription.status, 202);
const quotaConfirmationUrl = sentEmails.at(-1).text.match(/https:\/\/[^\s]+/)[0];
const quotaConfirmation = new URL(quotaConfirmationUrl);
const quotaForm = new FormData();
quotaForm.set("token", quotaConfirmation.searchParams.get("token"));
assert.equal((await call(quotaConfirmation.pathname, { method: "POST", body: quotaForm })).status, 303);
const quotaDraft = await call("/api/members/admin/newsletter-campaigns", {
  method: "POST", cookie: sessionCookie, body: { subject: "Quota test", body: "Test quota" },
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
const resetForm = new FormData();
resetForm.set("token", resetUrl.searchParams.get("token"));
resetForm.set("locale", "en");
resetForm.set("password", "updated secure password");
const resetResult = await call(resetUrl.pathname, { method: "POST", body: resetForm });
assert.equal(resetResult.status, 303);
assert.equal(resetResult.headers.get("Location"), "https://www.schaapsvishandel.nl/en/account?password-reset=1");

console.log("Account worker integration tests passed: email verification, login, proof upload and orphan cleanup retries, private proof review, student pass renewal, newsletter double opt-in, campaign delivery, unsubscribe and daily quota recovery.");
