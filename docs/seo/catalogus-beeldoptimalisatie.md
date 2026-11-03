# Catalogusbeelden — vervolg op masteraudit

3 november 2026, basis main `060f883`, branch `codex/catalog-image-performance`.

De live masteraudit liet circa 4,94 MB mobiele resources op het assortiment zien. Cloudflare heeft geen runtimebeeldoptimizer: de homepage gebruikte al lokale kleinere bestanden, maar de catalogus nog niet. Deze ronde past dezelfde bestaande `StaticResponsiveImage` toe op assortiment, productdetails, schaalkaarten en relevante gedeelde beelden.

## Wat is veranderd

- 91 bestaande bronnen, 364 lokale WebP-varianten (320/640/960/1280 waar de bron groot genoeg is). Geen nieuwe foto's, andere composities, uitsnedes of betaalde service.
- De bestaande afbeeldingspaden, bronbestanden, alt-teksten, prijzen, porties, ingrediënten, routes en accountlogica blijven behouden. De bron-SHA en variantdimensies worden door de bestaande CI-check gecontroleerd.
- Kaarten en productdetails kiezen een passende variant via `picture/srcset`. De schaalfotovergroting gebruikt expliciet de originele foto.
- Ingeklapte productgroepen blijven lazy-loaded. De browsertest opent die groepen voordat hij geladen foto's controleert.

## Gemeten op de lokale Cloudflare-runtime

Alleen unieke gekozen beeldvarianten tegenover hun overeenkomstige originelen, na scrollen/uitklappen; dit is geen totale paginatransfer of snelheidspercentage. Geïsoleerde Chrome, DPR1; andere schermdichtheden kunnen grotere varianten kiezen.

| Pagina | Mobiel 390px | Minder beeldbytes | Desktop 1440px | Minder beeldbytes |
|---|---:|---:|---:|---:|
| Homepage, 8 beelden | 143.592 B | 98,0% | 328.882 B | 95,4% |
| Assortiment, 18/19 varianten | 588.036 B | 95,0% | 670.084 B | 94,4% |
| Visschalen, 26 varianten | 893.066 B | 79,9% | 930.466 B | 79,1% |
| Feestdagen, 26 varianten | 893.066 B | 79,9% | 930.466 B | 79,1% |
| Kabeljauwdetail | 9.616 B | 91,6% | 9.616 B | 91,6% |
| Klein schaalproduct + gerelateerde beelden | 183.508 B | 78,7% | 214.980 B | 75,1% |

## Controles

Cloudflare-build, Next typegen, TypeScript, gerichte ESLint, content-integriteit en winkelcontroles slagen. Oude gegenereerde route-typen zijn met de gebruikelijke typegen opnieuw opgebouwd; geen typefout in de applicatie. Browser: twaalf route/breedtecombinaties, geladen bronnen, geen overflow/pageerrors, originele fotovergroting en Escape. Geen echte berichten of aanvragen. Bewijs naast de repo: `design-preview/master-audit/catalog-images-browser.json` en bijbehorende screenshots.

## Live vervolg PR #83 — 3 november 2026

[PR83](https://github.com/Voidd2/schaapsvis/pull/83) is samengevoegd als `d10e4f9238c30d93ee45ce74b3b7967d9343893a`. Cloudflare-build `b9ea130a-fa31-4625-ba20-ba8ce77d791b` is Ready; siteversie `18603304` bedient 100% van het verkeer. Geen leden-Worker, database, secrets of toegang aangepast. De tijdelijke lokale publieke binding is verwijderd.

GitHub Build239 op main slaagt, inclusief Next/Cloudflare-build, content/shop- en beeldintegriteit. Twaalf lokale beeld-browsercombinaties en twintig live route/schermcombinaties slagen; geen pageerrors, overflow of verzonden aanvragen. Originele schaalfotovergroting blijft behouden. Livebewijs: `design-preview/master-audit/live-release-catalog.json`, baseline `live-release.json` en twintig screenshots naast de repo.

Dezelfde ongethrottelde Chrome-routecontrole vóór en na, met verse contexten op het vertrouwde netwerk, meet onderstaande geladen resources. Dit zijn bytes gedurende die test, geen snelheidspercentage, volledige download van elk verborgen product of veld-CWV.

| Pagina | Breedte | Vóór PR83 | Na PR83 | Minder resources |
|---|---:|---:|---:|---:|
| Homepage | 390 | 842.628 B | 689.752 B | 18,1% |
| Assortiment | 390 | 4.939.382 B | 1.059.949 B | 78,5% |
| Visschalen | 390 | 1.068.787 B | 586.395 B | 45,1% |
| Homepage | 1440 | 1.134.907 B | 1.016.317 B | 10,4% |
| Assortiment | 1440 | 5.652.724 B | 1.396.287 B | 75,3% |
| Visschalen | 1440 | 2.096.147 B | 991.862 B | 52,7% |

### Onafhankelijke controle van het sitewachtwoord

GitHub-hosted Ubuntu, zonder cookies/secrets: vijf routes (NL-home, EN-assortiment, DE-feestdagen, account, beheer) tonen het wachtwoordformulier en noindex/no-store; robots blokkeert en sitemap is leeg. [Build239](https://github.com/Voidd2/schaapsvis/actions/runs/41692559624), job126114601503, 18:19:06 UTC, geslaagd. Ook de PR-run slaagde. Deze run startte tijdens de uitrol; het bewijs betreft het live slot, niet een verklaring over de exacte runtimeversie op die seconde. Authenticatie wijzigde niet in PR83.

De nieuwe CI-job `locked-site` herhaalt dit met uitsluitend GET-verzoeken. Repositoryvariabele `SITE_PUBLIC=launch-approved` stopt alleen deze gesloten-siteverwachting bij een apart goedgekeurde openbare lancering en opent de site zelf niet. Actuele eigenaargegevens en veldmetingen blijven afzonderlijke open punten; de eerdere Lighthouse-cijfers zijn van PR81, niet opnieuw gemeten voor PR83.
