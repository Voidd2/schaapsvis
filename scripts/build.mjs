import { spawnSync } from "node:child_process";

// Cloudflare Workers Builds sets WORKERS_CI=1. Keep the default Next.js build
// for Vercel, while making the same `npm run build` command produce the Vite /
// vinext Worker bundle when Cloudflare invokes this repository.
const isWorkersBuild = process.env.WORKERS_CI === "1" || process.env.WORKERS_CI === "true";
const target = isWorkersBuild
  ? { name: "Cloudflare Worker (Vite)", args: ["node_modules/vite/bin/vite.js", "build"] }
  : { name: "Vercel (Next.js)", args: ["node_modules/next/dist/bin/next", "build"] };

if (process.argv.includes("--print-target")) {
  console.log(target.name);
  process.exit(0);
}

console.log(`Building ${target.name}...`);

const result = spawnSync(process.execPath, target.args, {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(`Unable to start ${target.name} build:`, result.error);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}