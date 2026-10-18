import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";

const source = await fs.readFile("src/lib/siteAccess.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exports = {};
new Function("exports", "process", compiled)(exports, process);

const original = process.env.SITE_PUBLIC;
const originalIpAllowlist = process.env.SITE_ACCESS_IP_ALLOWLIST;
try {
  delete process.env.SITE_ACCESS_IP_ALLOWLIST;
  assert.equal(exports.heeftToegestaanIp("212.120.114.226"), false, "an unset allowlist grants no IP access");
  process.env.SITE_ACCESS_IP_ALLOWLIST = "198.51.100.1, 212.120.114.226";
  assert.equal(exports.heeftToegestaanIp("212.120.114.226"), true, "an exact allowlisted IP is accepted");
  assert.equal(exports.heeftToegestaanIp("212.120.114.226, 198.51.100.1"), false, "forwarded IP chains are not accepted");
  assert.equal(exports.heeftToegestaanIp(undefined), false, "a missing client IP is never accepted");
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

console.log("Site access gate passed: launch policy and exact-IP allowlist checks passed.");

