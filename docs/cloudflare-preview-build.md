# Cloudflare branch previews

Production remains on Vercel until the hosting migration is deliberately completed. Cloudflare branch previews are isolated test deployments and do not replace the live domain.

For this repository's Vite/Vinext Worker, configure Workers Builds with Preview builds enabled, leave the separate Build command empty, and use `npx cf previews deploy` as the Preview command. That command creates the preview-mode build and deploys it.

Do not use `npx cf previews deploy --prebuilt` with a production-mode artifact. A prebuilt artifact must have been produced in preview mode; otherwise `cf` rejects it instead of publishing a branch preview.

Keep access credentials out of Git. The site unlock flow requires both `SITE_PASSWORD` and `SITE_ACCESS_TOKEN` as runtime secrets in the target Worker environment. Missing either secret keeps the site locked and prevents successful unlock.
