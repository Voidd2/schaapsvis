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

Next/GitHub-build en de daadwerkelijke Cloudflare-publicatie worden na het pushen vastgelegd. Site blijft besloten; de tijdelijke lokale testbinding wordt vóór publicatie verwijderd. Dit is geen bewijs van echte gebruikers-CWV; de overige eigenaarafhankelijkheden uit de masteraudit blijven gelden.
