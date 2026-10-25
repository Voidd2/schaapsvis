import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

function buildTarget(workersCi) {
  const env = { ...process.env };
  if (workersCi === undefined) delete env.WORKERS_CI;
  else env.WORKERS_CI = workersCi;

  const result = spawnSync(process.execPath, ["scripts/build.mjs", "--print-target"], {
    encoding: "utf8",
    env,
  });

  assert.equal(result.status, 0, result.stderr || "Build-target selection command failed");
  return result.stdout.trim();
}

assert.equal(buildTarget(undefined), "Vercel (Next.js)");
assert.equal(buildTarget("1"), "Cloudflare Worker (Vite)");
assert.equal(buildTarget("true"), "Cloudflare Worker (Vite)");
assert.equal(buildTarget("0"), "Vercel (Next.js)");

console.log("Build target selection passed for Vercel and Cloudflare Workers Builds.");

