import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";

const source = await fs.readFile("src/lib/siteAccess.ts", "utf8");
const cloudflareConfig = await fs.readFile("cloudflare.config.ts", "utf8");
const compatibilityFlags = cloudflareConfig.match(/compatibilityFlags:\s*\[([^\]]*)\]/)?.[1];
assert.ok(compatibilityFlags, "Cloudflare Worker compatibility flags must be configured");
assert.match(compatibilityFlags, /"nodejs_compat"/, "Cloudflare Worker must enable Node.js compatibility");
assert.match(
  compatibilityFlags,
  /"nodejs_compat_populate_process_env"/,
  "Cloudflare Worker secrets must be exposed to process.env for the site-access gate",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exports = {};
new Function("exports", "process", compiled)(exports, process);

const original = process.env.SITE_PUBLIC;
const originalIpAllowlist = process.env.SITE_ACCESS_IP_ALLOWLIST;
try {
  delete process.env.SITE_ACCESS_IP_ALLOWLIST;
  assert.equal(exports.heeftToegestaanIp("192.0.2.1"), false, "an unset allowlist grants no IP access");
  process.env.SITE_ACCESS_IP_ALLOWLIST = "198.51.100.1, 2001:db8::1";
  assert.equal(exports.heeftToegestaanIp("198.51.100.1"), true, "an exact allowlisted IPv4 address is accepted");
  assert.equal(exports.heeftToegestaanIp("2001:db8::1"), true, "an exact allowlisted IPv6 address is accepted");
  assert.equal(exports.heeftToegestaanIp("198.51.100.1, 192.0.2.1"), false, "forwarded IP chains are not accepted");
  assert.equal(exports.heeftToegestaanIp(undefined), false, "a missing client IP is never accepted");
  const cloudflareHeaders = new Headers({ "cf-connecting-ip": "198.51.100.1", "x-forwarded-for": "198.51.100.1" });
  assert.equal(exports.ipVanVertrouwdeProxy(cloudflareHeaders, "cloudflare"), "198.51.100.1", "Cloudflare uses its edge-provided CF-Connecting-IP");
  const vercelHeaders = new Headers({ "x-vercel-forwarded-for": "192.0.2.1", "x-forwarded-for": "198.51.100.1" });
  assert.equal(exports.ipVanVertrouwdeProxy(vercelHeaders, "vercel"), "192.0.2.1", "Vercel uses its platform-specific client-IP header");
  assert.equal(exports.ipVanVertrouwdeProxy(new Headers({ "x-forwarded-for": "198.51.100.1" }), "cloudflare"), undefined, "browser-supplied X-Forwarded-For cannot grant access");
  for (const value of [undefined, "", "off", "on", "true"]) {
    if (value === undefined) delete process.env.SITE_PUBLIC;
    else process.env.SITE_PUBLIC = value;
    assert.equal(exports.siteIsOpenbaar(), false, `${String(value)} must keep the site locked`);
    assert.equal(exports.siteOpSlot(), true, `${String(value)} must keep the lock enabled`);
  }
  process.env.SITE_PUBLIC = "launch-approved";
  assert.equal(exports.siteIsOpenbaar(), true, "explicit launch approval opens the site");
  assert.equal(exports.siteOpSlot(), false, "explicit launch approval disables the lock");
} finally {
  if (original === undefined) delete process.env.SITE_PUBLIC;
  else process.env.SITE_PUBLIC = original;
  if (originalIpAllowlist === undefined) delete process.env.SITE_ACCESS_IP_ALLOWLIST;
  else process.env.SITE_ACCESS_IP_ALLOWLIST = originalIpAllowlist;
}

console.log("Site access gate passed: Cloudflare runtime secrets, launch policy and exact-IP allowlist checks passed.");


