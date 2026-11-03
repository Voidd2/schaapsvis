# Masteraudit — 3 november 2026

Deze ronde levert de aangetoonde P0-correcties en belangrijkste P1-verbeteringen. Dit is geen verklaring dat alle SEO, toegankelijkheid of live Core Web Vitals volledig afgerond zijn. Basis: `b60f56e` (main na PR #79/#80), eigen branch `codex/master-seo-design-audit`. Productgegevens en het besloten karakter blijven behouden.

## Scorecard

| Onderdeel | Status | Bewijs / beperking |
|---|---|---|
| Crawlbaarheid | Gecontroleerd en goed | 507 sitemaproutes, 519 interne doelen en 153 lokale beeldbestanden op Next én lokale Cloudflare/Vinext-runtime. Geen kapotte doelen. |
| Indexeerbaarheid | Gecorrigeerd | Besloten profiel: slot, noindex, robots Disallow, lege sitemap. Extra noindex-header voor toegelaten previewbezoekers. Publieke simulatie uitsluitend lokaal. |
| Canonicals | Gecontroleerd en goed | Eén eigen productiecanonical per sitemaproute, queryparameters uitgesloten. Domeinredirects live na merge opnieuw controleren. |
| Hreflang | Gecontroleerd en goed | NL/EN/DE en x-default verwijzen wederkerig naar bestaande canonieke routes. HTML-taal klopt. |
| Sitemap | Gecontroleerd en goed | 507 publieke canonieke routes; account, beheer en bestellen uitgesloten. Datums niet op verzoekmoment gezet. |
| Metadata | Gecorrigeerd | Titels, descriptions, OG en Twitter aanwezig. Metadata staat nu ook in de initiële documentkop op Vinext. Receptdescription noemt het gerecht in NL/EN/DE. Overlapkandidaten beoordeeld; echte productvarianten blijven apart. |
| HTML / headings | Gecontroleerd en goed | 507 server-HTML-outlines: één H1, geen overgeslagen niveaus; inhoud/links/JSON-LD server-side aanwezig. Geen volledige handmatige redactionele keuring van 507 pagina’s geclaimd. |
| Structured data | Gecorrigeerd | Onbewezen voorraad en generiek bezorggebied verwijderd. FAQ-emissie verwijderd, zichtbare antwoorden behouden. Externe codevalidatie geldig; zie afzonderlijk rapport. |
| Interne links / redirects | Gecorrigeerd | Niet-bestaande recepten/blogs geven nu 404. Twaalf onbekende detailroutes, oude Duitse route en negen bezorgredirects gecontroleerd. Bestaande routes behouden. |
| Lokale SEO | Wacht op eigenaar | Externe telefoon- en dinsdagtijdverschillen vastgelegd. Geen bedrijfsgegevens geraden; huidige centrale bron behouden. |
| Contentkwaliteit | Gecontroleerd / nog open | Inventaris van 67 producten, 23 vaste feestdagenproducten, 40 recepten en 19 blogs. Gerichte paginarollen vastgelegd; geen massale nieuwe content. Uitputtende redactionele herbeoordeling blijft vervolgwerk. |
| Image SEO | Gecorrigeerd / wacht op eigenaar | Homepagefavorieten via responsive Image; foto’s ongewijzigd. Drie recepten missen een gerechtfoto, negen taalwaarschuwingen blijven terecht zichtbaar. |
| Performance | Gecorrigeerd / nog open | Gratis statische homepagevarianten werken ook op Cloudflare: 98,5% minder beeldbytes mobiel. Lighthouse mobiel72–76/desktop92–94; geen veldmeting. Zie meetcondities hieronder. |
| Mobiel / tablet / desktop | Gecontroleerd en goed | Acht templates op negen gevraagde afmetingen; formulier, mandje, ankers en taalbediening getest. |
| Toegankelijkheid | Gecorrigeerd | Echte Chrome200%-zoom op acht templates. Vier templates × mobiel/desktop scoren100 in Lighthouse-accessibility na correcties aan contrast, menu-raakvlakken en toegankelijke namen. Geen WCAG-certificering. |

## Gevonden fouten en uitgevoerde correcties

| Ernst | Bevinding | Correctie |
|---|---|---|
| Hoog | Contactaanvraag kon zonder bruikbaar antwoordkanaal worden ingestuurd | Telefoonveld, e-mail OF telefoon verplicht; dezelfde validatie client/server. Negen handlergevallen met mocktransport en drie talen in browser getest. |
| Middel | Onbekende recept-/blogslug leidde naar index in plaats van echte 404 | `notFound()`; bestaande expliciete redirects behouden. |
| Middel | Alle vaste producten kregen onbewezen LimitedAvailability | Weggelaten; echte Offer-prijzen blijven staan en worden met de broninventaris vergeleken. |
| Middel | Schema suggereerde onbevestigde bezorggemeenten | Generieke areaServed verwijderd; winkeladres en tijden behouden. |
| Middel | Previewbezoekers met toegang hadden geen expliciete crawlerheader op alle normale responses | Noindex/nofollow toegevoegd aan de normale middleware-response zolang op slot. Geen authenticatiewijziging. |
| Middel | Witte normale knoptekst op helderblauw had circa 3,48:1 contrast | Bestaande donkerdere kleur: 5,14:1; hover 7,43:1. |
| Middel | Vergrote tekst liet footerlinks overlappen | Kolommen reageren op tekstruimte, links kunnen afbreken, informatiebalk kan omlopen. |
| Middel | Homepage laadde twee zware oorspronkelijke favoriete productbeelden | Bestaande beelden via responsive Next Image; circa 7,37 MB naar 0,62 MB mobiel in lokale meting. |
| Laag | Lange feestdagenpagina had geen compacte categorieoriëntatie | Vijf vertaalde ankerlinks, 44px bediening en scroll-margin. |
| Laag | Kleine categorieën/bijschriften/acties | Grotere, donkerdere ondersteunende tekst met behoud van hiërarchie. |
| Middel | Vinext liet description buiten de documentkop staan | `htmlLimitedBots: /.*/` schakelt metadata-streaming uit; lokale contentmetadata staat nu direct in HEAD. Crawl controleert dit expliciet. |
| Middel | Cloudflare viel bij Next Image terug op zware originelen | 28 lokale WebP-varianten van zeven bestaande homepagefoto’s; browser kiest via picture/srcset. Originele SHA256 gecontroleerd; geen betaalde beeldservice. |
| Middel | Smalle menu-uitklappers en te lichte kruimelpaden | Minimaal28px breed/44px hoog, donker-kruimeltekst opacity0,85. |
| Laag | Zichtbare fotolabels en mobiele beltekst kwamen niet overeen met de toegankelijke naam | Aria-label bevat nu het zichtbare label in alle talen. |
| Laag | Korte receptdescriptions maakten ongerelateerde gerechten nauwelijks onderscheidbaar | Lokale zichtbare gerechtnaam vóór de bestaande ondertitel; geen nieuwe voedingsclaim. |

De gevraagde Bitter-koppen en absolute reviewdatums waren op de actuele main al aanwezig. Daarom niet opnieuw herschreven. Reviewauteurs, beoordelingen, prijzen, porties, ingrediënten, foto's, studenten- en accountlogica zijn niet aangepast. Er zijn geen echte aanvragen of berichten verstuurd.

## Uitgevoerde controles

- Next productiebuild en Cloudflare/Vinext-build slagen. Next genereert 572 routes inclusief private/functionele routes.
- Typegen, TypeScript en gerichte ESLint slagen.
- Contentcheck: 67 producten, 40 recepten, 515 gelijke vertaalkeys. Dit bewijst geen volledige vertaalkwaliteit.
- Shopcheck: twaalf vaste schaalvarianten, 23 productroutes, zes hoofdkeuzes, drie talen, prijs-/selectie-/opslagcontrole en 65 datum-/tijdzonegevallen.
- Bestaande mand-browseracceptatie A–J geslaagd: aantallen, subtotaal, ongeprijsde salades, herladen/terug, datum, maatwerk, vertalingen en focus. Achttien extra route/breedtecombinaties.
- Designbrowser: 72 pagina/schermcombinaties, aanvullend 200% tekstvergroting op 683px. Geen overflow of pageerrors; NL/EN/DE contactvalidatie en vijf feestdagenankers; nul verzonden aanvragen.
- Publieke SEO-simulatie onder Next én Cloudflare: 507 pagina’s, 519 links, 153 bronbeelden, geen fouten; alleen negen bekende ontbrekende gerechtfoto-waarschuwingen.
- Besloten lokale profielen onder Next én Cloudflare: slot/noindex/robots/lege sitemap; ook toegelaten dummy-cookie-response noindex. Dummywaarden blijven lokaal.
- Schema.org en Google Rich Results-codevalidatie daadwerkelijk uitgevoerd; resultaten in [structured-data](structured-data.md).

Compact bewijs en route-inventaris staan ook in `audit-results.json` en `route-inventory.csv` in deze map. Ruwe resultaten staan naast de repository onder `../design-preview/master-audit/`: `seo-public.json`, `seo-cloudflare.json` (route-inventaris met taal/status/title/description/canonical/alternates/H1), `seo-locked.json`, browserresultaten, buildlogs en screenshots. De lokale Cloudflare-simulatie gebruikte alleen een tijdelijke binding in het genegeerde buildartefact. Geen productievariabele of secret aangepast.

## Performance: wat de cijfers wel en niet zeggen

Achttien metingen per ronde: drie samples op home/assortiment/feestdagen, mobiel390 en desktop1440, verse browsercontext, installed Chrome, localhost zonder netwerk-/CPU-throttling. Onder Next ging de homepage mobiel van circa 7,37 MB naar 0,62 MB en desktop van 7,39 MB naar 0,74 MB aan resource-transfers. Geen originele foto vervangen.

De meetmethode registreert LCP en layoutverschuivingen, maar is **geen Lighthouse**, geen echte INP en geen CrUX/GSC-veldmeting. Cold-start en gelijktijdige builds/crawls kunnen lokale timing beïnvloeden. De ruwe samples zijn bewaard; geen mediaan presenteren als garantie voor gebruikers. Een herhaling met layoutattributie gaf homepage/assortiment CLS 0 en feestdagen 0,044 mobiel / 0,009 desktop; de mobiele verschuiving is de bestaande mandknop die plaatsmaakt voor de cookiekeuzebanner. LCP-mediannen in deze laatste localhostronde: home 968/960 ms, assortiment 1104/976 ms, feestdagen 1000/952 ms (mobiel/desktop). Dat is geen bewijs van veldprestaties. De eerdere incidentele hogere uitschieters waren niet reproduceerbaar; herbeoordelen bij geïsoleerde Lighthouse-meting na deploy.

### Belangrijk runtimeverschil bij beelden

De aanvullende mobiele browsercontrole op de gebouwde Cloudflare-runtime slaagt op home/contact/feestdagen (geladen beelden en geen pageerrors). Daarbij is vastgesteld dat `/_next/image` met302 naar het oorspronkelijke bestand doorverwijst: de huidige `vinext()`-configuratie heeft geen optimizeradapter. De geïnstalleerde `vinext/dist/image/image-adapters-virtual.d.ts` en `vinext/dist/check.js` bevestigen dat een IMAGES-binding alleen niet voldoende is. **De 91,6% besparing geldt voor Next, niet als bewezen Cloudflare-winst.**

Dit runtimeverschil is inmiddels voor de homepage opgelost met kostenvrije build-time varianten (`build-static-images.mjs`, manifest en `StaticResponsiveImage`). Zeven originele foto’s leveren28 WebP-bestanden. SHA256 bewaakt ongewijzigde originelen; CI controleert manifest, resolutie en bestanden. De Cloudflare-browser laadt alleen de gekozen varianten: **101.092 bytes mobiel390, 251.948 bytes desktop1440**, tegenover6.965.315 bytes aan dezelfde zeven originelen (**98,5% / 96,4% minder beeldbytes**). Dit betreft beeldbestanden, niet de totale pagina. Bewijs: `static-images-cloudflare.json`; geen betaalde adapter geactiveerd.

### Lighthouse en echte zoom, aanvullende ronde

Lighthouse13.6.0 CLI, geïnstalleerd buiten de repo; Chrome headless, lokale gebouwde Cloudflare-runtime, mobiele standaard simulatie en desktop preset. HTML/JSON-rapporten: `../design-preview/master-audit/lh-final-*.report.*`. Lokale server zonder productiecompressie; CPU- en andere lokale activiteit kunnen timing beïnvloeden. Geen CrUX/INP-veldresultaat.

| Template | Performance mobiel / desktop | Gesimuleerde LCP mobiel / desktop | CLS mobiel / desktop |
|---|---|---|---|
| Home | 76 / 94 | 6,49s / 1,60s | 0 / 0 |
| Assortiment | 73 / 92 | 9,43s / 1,82s | 0 / 0 |
| Visschalen | 72 / 94 | 12,68s / 1,67s | 0,044 / 0,010 |
| Contact | 75 / 93 | 8,17s / 1,72s | 0 / 0 |

Alle acht audits: accessibility100 en best-practices100. SEO92 door productiecanonical versus de lokale testhost, niet door een foutieve productiecanonical; de eigen507-routecontrole valideert canonical/hreflang tegen het echte domein. Back-forward-cache beperkt door huidige frameworkverbindingen. Hero nu eager/high-priority en direct vindbaar in HTML. Restpunten: gedeelde CSS/JS en prestaties op de echte edge, vóór publieke lancering opnieuw meten. Een voldoende mobiele veld-LCP is dus **niet bewezen**.

Echte Chrome-pagezoom200% via nieuw geïsoleerd testprofiel: DPR2, fysiek1366px venster, CSS-viewport675px inclusief scrollbar, ongewijzigd17px rootfont. Acht templates zonder overflow of pageerrors; CDP-screenshots in `zoom/`. Dit vervangt de eerdere beperking van alleen CSS-tekstvergroting.

### Heading- en descriptioncontrole

Alle507 server-outlines bevatten headings, geen sprongen in niveau. Per taal metadata-overlapkandidaten gezocht met token-Jaccard>0,70 (geen SEO-score): kleine/grote trio’s, zalm/tonijn en schaalformaten delen terecht feitelijke samenstellingswoorden. Hun prijzen/hoeveelheden en eigen routes blijven behouden. De generieke EN/DE-taglines voor zalmsalade/schol zijn verholpen door de gerechtnaam in alle receptdescriptions op te nemen. Ruw besluitbewijs: `editorial-outline-review.json`. Dit vervangt geen volledige voedselveiligheids- of vertaalreview.

## Nog open, in volgorde

1. PR review en na goedgekeurde merge de echte Cloudflare-commit, Ready-status, afscherming en representatieve live routes bevestigen. Deze audit opent productie niet.
2. Eigenaar: primaire telefoon, afwijkende dinsdagopening, juiste Google Bedrijfsprofielgegevens en drie gerechtfoto’s bevestigen; zie [NAP](nap-controle.md) en [recepten](recepten-matrix.md).
3. Search Console: huidige Google-aanmelding toont **“Je hebt geen toegang tot deze property”** voor `sc-domain:schaapsvishandel.nl`. Geen zoekprestaties of indexeringsdata beschikbaar. Toegang regelen vóór lancering; geen nieuwe betaalde dienst nodig.
4. Performance op de echte edge opnieuw meten na deploy; mobiel lab is nog onvoldoende bewijs voor goede veld-LCP. Lokale beeldvarianten, Lighthouse en echte browserzoom zijn uitgevoerd. Geen misleidende CWV-goedkeuring geven op localhost.
5. Redactionele vervolgcontrole: elke voedings-/herkomstclaim en alle EN/DE hoofdteksten. Metadata-overlap en headinghiërarchie zijn aanvullend gecontroleerd. Matrix blijft inventaris en prioritering, geen culinair certificaat.
6. Na openbare lancering de [checklist](lancering-checklist.md) en het [90-dagenplan](monitoring-90-dagen.md) uitvoeren. Het slot blijft tot afzonderlijk eigenaarsbesluit aan.

## Onderzoeksbronnen

Geraadpleegd 3 november 2026: geïnstalleerde Next16-documentatie voor metadata/sitemap; [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [robots](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions), [titels](https://developers.google.com/search/docs/appearance/title-link), [snippets](https://developers.google.com/search/docs/appearance/snippet), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) en [lokale Google-resultaten](https://support.google.com/business/answer/7091?hl=nl). Relevantie: feitelijke pagina-inhoud, crawlbare links en eenduidige paginarollen; geen ranggarantie, zoekvolume of kunstmatige AI-optimalisatie.

De specifieke schema-, lokale bron- en concurrentiebevindingen staan in [structured-data](structured-data.md), [NAP-controle](nap-controle.md) en [keywordmap](keyword-map.md).

## Gewijzigde bestanden

- `.agents/skills/schaaps-seo/SKILL.md`
- `.github/workflows/build-validation.yml`
- `CODEX_PROGRESS.md`
- `docs/design/visuele-eindcontrole.md`
- `docs/seo/audit-results.json`
- `docs/seo/content-inventory.json`
- `docs/seo/keyword-map.md`
- `docs/seo/lancering-checklist.md`
- `docs/seo/monitoring-90-dagen.md`
- `docs/seo/nap-controle.md`
- `docs/seo/recepten-matrix.md`
- `docs/seo/route-inventory.csv`
- `docs/seo/structured-data.md`
- `docs/seo/technische-audit.md`
- `next.config.ts`
- `public/images/responsive/coquilles-vlees-895f3886eda1-1280.webp`
- `public/images/responsive/coquilles-vlees-895f3886eda1-320.webp`
- `public/images/responsive/coquilles-vlees-895f3886eda1-640.webp`
- `public/images/responsive/coquilles-vlees-895f3886eda1-960.webp`
- `public/images/responsive/haring-98f6369c0585-1280.webp`
- `public/images/responsive/haring-98f6369c0585-320.webp`
- `public/images/responsive/haring-98f6369c0585-640.webp`
- `public/images/responsive/haring-98f6369c0585-960.webp`
- `public/images/responsive/hollandse-garnalen-solt-935777210211-1280.webp`
- `public/images/responsive/hollandse-garnalen-solt-935777210211-320.webp`
- `public/images/responsive/hollandse-garnalen-solt-935777210211-640.webp`
- `public/images/responsive/hollandse-garnalen-solt-935777210211-960.webp`
- `public/images/responsive/kibbeling-schaapstray-86e128880cb1-1280.webp`
- `public/images/responsive/kibbeling-schaapstray-86e128880cb1-320.webp`
- `public/images/responsive/kibbeling-schaapstray-86e128880cb1-640.webp`
- `public/images/responsive/kibbeling-schaapstray-86e128880cb1-960.webp`
- `public/images/responsive/scholfilet-8e3ada79b862-1280.webp`
- `public/images/responsive/scholfilet-8e3ada79b862-320.webp`
- `public/images/responsive/scholfilet-8e3ada79b862-640.webp`
- `public/images/responsive/scholfilet-8e3ada79b862-960.webp`
- `public/images/responsive/varlaks-zalm-rauw-ai-541621dcf5fc-1280.webp`
- `public/images/responsive/varlaks-zalm-rauw-ai-541621dcf5fc-320.webp`
- `public/images/responsive/varlaks-zalm-rauw-ai-541621dcf5fc-640.webp`
- `public/images/responsive/varlaks-zalm-rauw-ai-541621dcf5fc-960.webp`
- `public/images/responsive/zalm-citroen-dille-2f1ea1f890f5-1280.webp`
- `public/images/responsive/zalm-citroen-dille-2f1ea1f890f5-320.webp`
- `public/images/responsive/zalm-citroen-dille-2f1ea1f890f5-640.webp`
- `public/images/responsive/zalm-citroen-dille-2f1ea1f890f5-960.webp`
- `scripts/audit-content-data.mjs`
- `scripts/audit-design-browser.mjs`
- `scripts/audit-lab-performance.mjs`
- `scripts/build-static-images.mjs`
- `scripts/check-browser-zoom.mjs`
- `scripts/check-seo-release.mjs`
- `scripts/check-static-images-browser.mjs`
- `src/app/[locale]/barbecue-gourmet/page.tsx`
- `src/app/[locale]/bezorgen/[gemeente]/page.tsx`
- `src/app/[locale]/bezorgen/page.tsx`
- `src/app/[locale]/biologische-vis/page.tsx`
- `src/app/[locale]/blog/[slug]/page.tsx`
- `src/app/[locale]/contact/ContactFormulier.tsx`
- `src/app/[locale]/feestdagen/[slug]/page.tsx`
- `src/app/[locale]/feestdagen/page.tsx`
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/recepten/[slug]/page.tsx`
- `src/app/[locale]/viskalender/page.tsx`
- `src/app/[locale]/visschalen/page.tsx`
- `src/app/[locale]/viswinkel-voorschoten/page.tsx`
- `src/app/api/bericht/route.ts`
- `src/app/globals.css`
- `src/components/LocalLandingPage.tsx`
- `src/components/StaticResponsiveImage.tsx`
- `src/components/catalog/CatalogPhoto.tsx`
- `src/components/catalog/SeafoodCatalog.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/ui/Sectie.tsx`
- `src/lib/contact-validation.ts`
- `src/lib/seo.ts`
- `src/lib/static-image-variants.json`
- `src/messages/de.json`
- `src/messages/en.json`
- `src/messages/nl.json`
- `src/proxy.ts`
