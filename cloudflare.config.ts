import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig(() => ({
  worker: defineWorker({
    name: "schaapsvis",
    entrypoint: "vinext/server/fetch-handler",
    // Match the production date and retain its strict fetch flag, plus the
    // Node compatibility required by vinext.
    compatibilityDate: "2026-10-19",
    compatibilityFlags: [
      "global_fetch_strictly_public",
      "nodejs_compat",
      "nodejs_compat_populate_process_env",
    ],
    domains: ["schaapsvishandel.nl"],
    // Keep the existing Worker and version preview URLs reachable for QA.
    // Preview hostnames keep their own access gate in the request proxy.
    workersDev: true,
    previewUrls: true,
    observability: {
      enabled: true,
      logs: { enabled: true, invocationLogs: true, persist: true },
    },
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      SITE_PUBLIC: bindings.text("launch-approved"),
    },
  }),
}));
