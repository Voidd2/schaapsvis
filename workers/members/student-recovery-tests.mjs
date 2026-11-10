import assert from "node:assert/strict";

// Runs entirely against the in-memory database and captured mail transport.
export async function checkStudentRecovery({ call, sqlite, sentEmails, responseCookie }) {
  for (const proofMethod of ["school-email", "document"]) {
    const email = `recovery-${proofMethod}@example.test`;
    const schoolEmail = proofMethod === "school-email" ? "recovery@school.example.test" : undefined;
    const password = "original test password only";
    const headers = { "CF-Connecting-IP": proofMethod === "school-email" ? "192.0.2.151" : "192.0.2.152" };
    const body = { email, schoolEmail, proofMethod, firstName: "Recovery", lastName: "Test", password };
    const request = (path, body, extra = {}) => call(`/api/members/${path}`, { method: "POST", headers, body, ...extra });
    const mailOffset = sentEmails.length;
    assert.equal((await request("register", body)).status, 202);
    const saved = { ...sqlite.prepare("SELECT * FROM users WHERE email=?").get(email) };
    const codes = sentEmails.slice(mailOffset).map(mail => mail.text.match(/\b(\d{6})\b/)[1]);
    const expectedMails = schoolEmail ? 2 : 1;
    assert.equal(codes.length, expectedMails);
    for (const duplicate of [
      { ...body, email: email.toUpperCase(), password: "replacement must never be saved" },
      ...(schoolEmail ? [{ ...body, email: "different-person@example.test", schoolEmail: schoolEmail.toUpperCase() }] : []),
    ]) {
      const result = await request("register", duplicate);
      assert.equal(result.status, 409);
      assert.equal((await result.json()).error, "account_exists");
    }
    assert.deepEqual({ ...sqlite.prepare("SELECT * FROM users WHERE email=?").get(email) }, saved, "duplicate cannot change the original password or account");
    assert.equal(sentEmails.length, mailOffset + expectedMails, "duplicate registration sends no extra mail");
    assert.equal((await request("login", { email, password: "wrong test password" })).status, 401);
    const resume = await request("login", { email, password });
    assert.equal(resume.status, 403);
    assert.deepEqual(await resume.json(), { error: "email_unverified", proofMethod });
    assert.equal(resume.headers.get("Set-Cookie"), null, "recovery does not bypass verification");
    assert.equal(sentEmails.length, mailOffset + expectedMails, "login does not unexpectedly send codes");

    assert.equal((await request("password-reset", { email, locale: "en" })).status, 202);
    assert.equal(sentEmails.length, mailOffset + expectedMails + 1, "unverified account can reset its password");
    const reset = new URL(sentEmails.at(-1).text.match(/https:\/\/[^\s]+/)[0]);
    const form = new FormData();
    form.set("token", reset.searchParams.get("token"));
    form.set("password", "new recovery test password");
    form.set("passwordConfirm", "new recovery test password");
    assert.equal((await call(reset.pathname, { method: "POST", headers, body: form })).status, 303);
    assert.equal(sqlite.prepare("SELECT email_verified_at FROM users WHERE id=?").get(saved.id).email_verified_at, null);
    assert.equal((await request("login", { email, password })).status, 401, "old password is invalid after reset");
    const afterReset = await request("login", { email, password: "new recovery test password" });
    assert.equal(afterReset.status, 403);
    assert.equal((await afterReset.json()).proofMethod, proofMethod);

    sqlite.prepare("UPDATE email_tokens SET expires_at='2000-01-01' WHERE user_id=? AND purpose IN ('verify_email','verify_school')").run(saved.id);
    assert.equal((await request("verify-codes", { email, personalCode: codes[0], schoolCode: codes[1] })).status, 400);
    const newMailOffset = sentEmails.length;
    assert.equal((await request("verify/resend", { email })).status, 202);
    const newCodes = sentEmails.slice(newMailOffset).map(mail => mail.text.match(/\b(\d{6})\b/)[1]);
    assert.equal(newCodes.length, expectedMails);
    const verified = await request("verify-codes", { email, personalCode: newCodes[0], schoolCode: newCodes[1] });
    assert.equal(verified.status, 200);
    const cookie = responseCookie(verified, "sv_member");
    assert.ok(cookie);
    assert.equal((await request("login", { email, password: "new recovery test password" })).status, 200);
    assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM users WHERE email=?").get(email).n, 1);

    const application = new FormData();
    for (const [key, value] of Object.entries({ institution: "Test institution", studyCity: "Test city", educationLevel: "other" })) application.set(key, value);
    if (!schoolEmail) {
      application.set("proofConsent", "true");
      application.set("proof", new Blob(["%PDF-test-only-enrolment"], { type: "application/pdf" }), "test-proof.pdf");
    }
    assert.equal((await request("student-application", application, { cookie })).status, 400, "other level must be specified");
    application.set("educationLevelOther", "   ");
    assert.equal((await request("student-application", application, { cookie })).status, 400, "whitespace is not a level");
    application.set("educationLevelOther", "A".repeat(121));
    assert.equal((await request("student-application", application, { cookie })).status, 400, "long level is rejected, not truncated");
    application.set("educationLevelOther", "  International   diploma  ");
    assert.equal((await request("student-application", application, { cookie })).status, 202);
    const stored = sqlite.prepare("SELECT education_level,education_level_other,status FROM student_applications WHERE user_id=?").get(saved.id);
    assert.deepEqual({ ...stored }, { education_level: "other", education_level_other: "International diploma", status: "pending" });
    const profile = await (await call("/api/members/me", { cookie })).json();
    assert.equal(profile.studentApplication.education_level_other, "International diploma");
  }
}
