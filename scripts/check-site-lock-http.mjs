import assert from "node:assert/strict";

const origin = process.argv[2] || "http://localhost:3105";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
  throw new Error("Site-lock checks are restricted to a local server.");
}

const password = process.env.SITE_PASSWORD;
const token = process.env.SITE_ACCESS_TOKEN;
if (!password || !token) throw new Error("Set local dummy SITE_PASSWORD and SITE_ACCESS_TOKEN values.");

const locked = await fetch(`${origin}/nl/assortiment`, { redirect: "manual" });
assert.equal(locked.status, 200, "locked page is rewritten to the coming-soon screen");
assert.match(locked.headers.get("x-robots-tag") || "", /noindex, nofollow/i);
assert.match(await locked.text(), /We werken aan onze nieuwe website/);

const lockedAdmin = await fetch(`${origin}/admin`, { redirect: "manual" });
assert.equal(lockedAdmin.status, 200, "legacy admin route must remain behind the site lock");
assert.match(lockedAdmin.headers.get("x-robots-tag") || "", /noindex, nofollow/i);
assert.match(await lockedAdmin.text(), /We werken aan onze nieuwe website/);

const searchConsoleVerification = await fetch(`${origin}/googlee89efce6ff6c8463.html`);
assert.equal(searchConsoleVerification.status, 200, "Search Console's ownership proof stays reachable while the site is locked");
assert.equal((await searchConsoleVerification.text()).trim(), "google-site-verification: googlee89efce6ff6c8463.html");

const badForm = new FormData();
badForm.set("password", "incorrect-test-password");
const sameOriginHeaders = { origin };
const badLogin = await fetch(`${origin}/api/unlock`, { method: "POST", headers: sameOriginHeaders, body: badForm, redirect: "manual" });
assert.equal(badLogin.status, 303, "incorrect password returns to the error page");
assert.equal(new URL(badLogin.headers.get("location"), origin).pathname + new URL(badLogin.headers.get("location"), origin).search, "/coming-soon?error=1");
assert.ok(!badLogin.headers.get("set-cookie"), "incorrect password must not set an access cookie");
await badLogin.arrayBuffer();

const goodForm = new FormData();
goodForm.set("password", password);
const goodLogin = await fetch(`${origin}/api/unlock`, { method: "POST", headers: sameOriginHeaders, body: goodForm, redirect: "manual" });
assert.equal(goodLogin.status, 303, "correct password grants access");
const setCookie = goodLogin.headers.get("set-cookie") || "";
assert.ok(setCookie.startsWith(`sv_access=${token};`), "correct password sets the expected cookie");
assert.match(setCookie, /httponly/i);
assert.match(setCookie, /samesite=lax/i);
assert.match(setCookie, /path=\//i);
await goodLogin.arrayBuffer();

const crossOriginForm = new FormData();
crossOriginForm.set("password", password);
const crossOriginLogin = await fetch(`${origin}/api/unlock`, {
  method: "POST",
  headers: { origin: "https://attacker.example" },
  body: crossOriginForm,
  redirect: "manual",
});
assert.equal(crossOriginLogin.status, 403, "cross-origin form submissions are rejected");
assert.ok(!crossOriginLogin.headers.get("set-cookie"), "cross-origin submissions cannot set an access cookie");
await crossOriginLogin.arrayBuffer();

const oversizedForm = new FormData();
oversizedForm.set("password", "x".repeat(9 * 1024));
const oversizedLogin = await fetch(`${origin}/api/unlock`, {
  method: "POST",
  headers: sameOriginHeaders,
  body: oversizedForm,
  redirect: "manual",
});
assert.equal(oversizedLogin.status, 413, "oversized login bodies are rejected before form parsing");
assert.ok(!oversizedLogin.headers.get("set-cookie"), "oversized requests cannot set an access cookie");
await oversizedLogin.arrayBuffer();

const access = await fetch(`${origin}/nl/assortiment`, {
  headers: { cookie: `sv_access=${token}` },
  redirect: "manual",
});
assert.equal(access.status, 200);
assert.doesNotMatch(await access.text(), /We werken aan onze nieuwe website/);

const admin = await fetch(`${origin}/admin`, {
  headers: { cookie: `sv_access=${token}` },
  redirect: "manual",
});
assert.equal(admin.status, 308, "legacy admin route redirects only after site access is granted");
assert.equal(new URL(admin.headers.get("location"), origin).pathname, "/nl/beheer/studenten");
await admin.arrayBuffer();

const logout = await fetch(`${origin}/api/logout`, {
  headers: { cookie: `sv_access=${token}` },
  redirect: "manual",
});
assert.equal(logout.status, 303);
assert.match(logout.headers.get("set-cookie") || "", /sv_access=;/);
assert.match(logout.headers.get("set-cookie") || "", /max-age=0/i);
await logout.arrayBuffer();

const relocked = await fetch(`${origin}/nl/assortiment`, { redirect: "manual" });
assert.match(await relocked.text(), /We werken aan onze nieuwe website/);

console.log("Local site lock passed: public content and admin hidden, wrong password denied, right password grants HttpOnly session, admin redirects to the protected review portal, logout relocks.");
