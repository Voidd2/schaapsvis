import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig(({ mode }) => ({
  worker: defineWorker({
    name: "schaapsvis",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-18",
    compatibilityFlags: ["nodejs_compat", "nodejs_compat_populate_process_env"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      // Only local Vite development is public for page-by-page QA. A production
      // or deployed preview build gets no SITE_PUBLIC binding and stays locked
      // unless the owner explicitly configures its runtime variables/secrets.
      ...(mode === "development" ? { SITE_PUBLIC: bindings.text("launch-approved") } : {}),
    },
  }),
}));
