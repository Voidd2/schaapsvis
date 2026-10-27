# Schaap's Vishandel

Website en ledenomgeving voor de viswinkel en marktkramen in Leiden en Voorschoten. Productie draait op **Cloudflare Workers**; Knoth beheert de `.nl`-registratie en zakelijke mailbox. GitHub `main` bouwt de site-Worker `schaapsvis` en de leden-Worker `schaapsvis-members`. De nog aanwezige Vercel-projecten zijn geen bewijs van de live versie.

## Waar staat wat?

| Onderwerp | Bron |
| --- | --- |
| Actuele architectuur, bewezen status en open werk | [Projectkaart](docs/project-map.md) |
| Bedrijfsdoel en goedgekeurde richting | [Platformstrategie](docs/bedrijfsdoel-en-platformstrategie.md) |
| Leden-API, privacygrenzen en tests | [Leden-Worker](workers/members/README.md) |
| Sitepagina's | `src/app/[locale]/` |
| Assortiment, recepten en productteksten | `src/lib/` |
| Leden-API en database | `workers/members/src/`, `migrations/` |
| Site-uitrol | `cloudflare.config.ts`, `vite.config.ts` |
| Ledenuitrol | `workers/members/wrangler.jsonc` |

Lees alleen de bron die bij de taak hoort. Gebruik `rg` om een concreet component of endpoint te vinden; oude voortgangsdocumenten kunnen achterhaald zijn.

## Gerichte controles

- Leden-API of e-mail: `node workers/members/test.mjs` en `node workers/members/smtp-test.mjs`.
- Assortiment of recepten: `node scripts/check-content-integrity.mjs`.
- Sitebouw of routering: `npm run build` en `npm run build:cloudflare`.

Gebruik lokaal alleen testgeheimen. Productiegeheimen staan als versleutelde Cloudflare-variabelen en horen niet in Git, logs of documentatie.
