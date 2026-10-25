# Cloudflare branch previews

De productiehost is inmiddels de Cloudflare Worker `schaapsvis` op `https://schaapsvishandel.nl`; de actuele live-status en open migratiepunten staan in [`cloudflare-migration-status-2026-10-24.md`](./cloudflare-migration-status-2026-10-24.md). De apex geeft nu nog `noindex` en `www.schaapsvishandel.nl` heeft nog geen DNS-record. Branch previews zijn afzonderlijke testdeployments en vervangen de productiehost niet.

For this repository's Vite/Vinext Worker, enable Preview builds, leave the separate Build command empty, and use `npx cf previews deploy` as the Preview command. Apply and verify this in the settings of the specific branch preview as well as the base preview configuration: an explicit per-branch command can continue overriding the base setting. A successful build should show Build command `None` and Deploy command `npx cf previews deploy`.

Do not use `npx cf previews deploy --prebuilt` with a production-mode artifact. A prebuilt artifact must have been produced in preview mode; otherwise `cf` rejects it instead of publishing a branch preview.

Keep access credentials out of Git. The site unlock flow requires both `SITE_PASSWORD` and `SITE_ACCESS_TOKEN` as runtime secrets in the target Worker environment. Missing either secret keeps the site locked and prevents successful unlock.
