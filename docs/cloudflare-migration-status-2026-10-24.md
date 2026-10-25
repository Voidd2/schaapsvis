# Cloudflare-migratie — status gecontroleerd 26 oktober 2026

Deze status is gebaseerd op het Schaapsvis-account in Cloudflare, de productie-Worker, de branch-preview en GitHub.

## Wat nu is bevestigd

- In het Schaapsvis-account staat productie-Worker `schaapsvis` met custom domain `schaapsvishandel.nl`. De Worker is aan GitHub-repository `Voidd2/schaapsvis` gekoppeld en volgt branch `main`.
- De getoonde productie-deployment is commit `2d2b67900cb7b0b09dccdea92750db9cedd94a3a`, status Ready. De Cloudflare-dashboardpagina van het eigen domein toont de volledige site binnen een beheerderssessie. De uitgelogde toegang op productie moet nog afzonderlijk worden getest.
- De productie-Worker heeft versleutelde secrets met namen `SITE_PASSWORD` en `SITE_ACCESS_TOKEN`; de waarden zijn niet uitgelezen of getoond. De actieve branch-preview heeft dezelfde geheimen als Preview secrets. De branch-preview op commit `86cf2be38bb76c8dd66d53a82a2afbd969c8517c` is met het opgegeven wachtwoord ontgrendeld en toont de volledige site; bezoekers horen de binnenkort-pagina te zien.
- De open concept-PR [#23](https://github.com/Voidd2/schaapsvis/pull/23) is nog niet samengevoegd. Productie draait dus nog op `main` commit `2d2b679`, niet op de nieuwste PR-commit `86cf2be`. De productiebuild staat ingesteld op `npm run build` plus `npx --yes cf@1.0.0-beta.18 deploy --prebuilt`; branch previews gebruiken `npx cf previews deploy`.
- In account Schaapsvis zijn R2-buckets `schaapsvis-student-proofs-preview` en `schaapsvis-student-proofs` aangemaakt. Beide zijn privé (public access uit), ingesteld op de EU-jurisdictie en leeg. Het dashboard toonde na aanmaak $0 billable usage en 0 B opgeslagen.
- De naam `STUDENT_PROOFS` is in de Member Workerconfiguratie gekoppeld aan de preview- en productie-bucket. De Worker-lijst in het account toont momenteel alleen `schaapsvis`; de afzonderlijke Member Worker en zijn runtimebindingen zijn dus nog niet in Cloudflare geverifieerd.
- De Cloudflare API-integratie van deze sessie toont alleen `Admin@haascom.com's Account`. Voor verificatie en wijzigingen in Schaapsvis is de ingelogde dashboardpagina gebruikt.
- De eigenaar noemde €10 per maand als gewenste bovengrens. Cloudflare-budgetmeldingen zijn waarschuwingen, geen harde bestedingslimiet. R2-gebruik boven de gratis bundel kan daarom meer dan €10 kosten; de eigenaar heeft R2 en mogelijke gebruikskosten geaccepteerd. Bekijk [R2-prijzen](https://developers.cloudflare.com/r2/pricing/) en [budgetmeldingen](https://developers.cloudflare.com/changelog/post/2026-06-15-budget-alerts-default-on/).
- GitHub Actions sitebuild en Member Worker tests slagen op de nieuwste PR-commit. Deze checks bevestigen geen productie-uitrol. Student-/ledenfunctionaliteit blijft uit (`MEMBERS_ENABLED=off`).

## Nog nodig voor een aantoonbaar afgeronde uitrol

1. Controleer DNS- en originrecords voor apex én `www`, exporteer de zone als herstelpunt en bevestig HTTPS/redirects.
2. Beslis en voer de PR-uitrol uit: de nieuwste code is nu een werkende branch-preview, maar staat nog niet op `main`-productie.
3. Maak de Member Worker als afzonderlijke Cloudflare-service aan of deploy hem via de goedgekeurde buildroute; controleer dan de R2-binding en D1-bindings in preview én productie. Laat `MEMBERS_ENABLED=off` totdat migraties, e-mail, goedkeuring en privacykeuzes zijn getest.
4. Test de productie-site in een uitgelogde, schone browser en bevestig dat de gate voor bezoekers werkt; test vervolgens inloggen met het beheerderswachtwoord zonder geheimen in Git of logs te zetten.
5. Test vanaf gewone browser: homepage, alle pagina's, afbeeldingen, formulieren/API's, robots/sitemap, mobiele en desktopnavigatie, apex/`www`, HTTPS en canonieke redirects.
6. Houd R2-gebruik en facturering in de gaten: €10 is geen harde Cloudflare-limiet.

Laat een beschikbare rollback naar Vercel staan totdat alle productiecontroles slagen en de eigenaar expliciet bevestigt dat die niet meer nodig is.
