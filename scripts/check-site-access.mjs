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
try {
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
}

console.log("Site access gate passed: missing, off and legacy values stay locked; only launch-approved opens the site.");
