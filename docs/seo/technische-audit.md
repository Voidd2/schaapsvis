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
| Metadata | Gecontroleerd en goed | Titels, descriptions, OG en Twitter aanwezig; geen exacte dubbelen of titels boven de ingestelde 75-tekenwaarschuwing. Semantisch bijna identieke teksten nog redactioneel beoordelen. |
| HTML / headings | Gecontroleerd en goed | Eén H1 per sitemaproute; product-/inhoudslinks en JSON-LD staan in server-HTML. Geen volledige handmatige headingaudit van 507 pagina’s geclaimd. |
| Structured data | Gecorrigeerd | Onbewezen voorraad en generiek bezorggebied verwijderd. FAQ-emissie verwijderd, zichtbare antwoorden behouden. Externe codevalidatie geldig; zie afzonderlijk rapport. |
| Interne links / redirects | Gecorrigeerd | Niet-bestaande recepten/blogs geven nu 404. Twaalf onbekende detailroutes, oude Duitse route en negen bezorgredirects gecontroleerd. Bestaande routes behouden. |
| Lokale SEO | Wacht op eigenaar | Externe telefoon- en dinsdagtijdverschillen vastgelegd. Geen bedrijfsgegevens geraden; huidige centrale bron behouden. |
| Contentkwaliteit | Gecontroleerd / nog open | Inventaris van 67 producten, 23 vaste feestdagenproducten, 40 recepten en 19 blogs. Gerichte paginarollen vastgelegd; geen massale nieuwe content. Uitputtende redactionele herbeoordeling blijft vervolgwerk. |
| Image SEO | Gecorrigeerd / wacht op eigenaar | Homepagefavorieten via responsive Image; foto’s ongewijzigd. Drie recepten missen een gerechtfoto, negen taalwaarschuwingen blijven terecht zichtbaar. |
| Performance | Gecorrigeerd / nog open | Gemeten transferreductie homepage. Lab is geen veldmeting; geen Lighthouse- of INP-score verzonnen. Zie hieronder. |
| Mobiel / tablet / desktop | Gecontroleerd en goed | Acht templates op negen gevraagde afmetingen; formulier, mandje, ankers en taalbediening getest. |
| Toegankelijkheid | Gecorrigeerd / nog open | Hoofdknopcontrast, ondersteunende tekst en footerreflow verbeterd. Vergroting van tekst getest; echte 200% browserzoom en volledige WCAG-audit nog open. |

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

Achttien metingen per ronde: drie samples op home/assortiment/feestdagen, mobiel390 en desktop1440, verse browsercontext, installed Chrome, localhost zonder netwerk-/CPU-throttling. De homepage ging mobiel van circa 7,37 MB naar 0,62 MB en desktop van 7,39 MB naar 0,74 MB aan resource-transfers. Geen originele foto vervangen.

De meetmethode registreert LCP en layoutverschuivingen, maar is **geen Lighthouse**, geen echte INP en geen CrUX/GSC-veldmeting. Cold-start en gelijktijdige builds/crawls kunnen lokale timing beïnvloeden. De ruwe samples zijn bewaard; geen mediaan presenteren als garantie voor gebruikers. Een herhaling met layoutattributie gaf homepage/assortiment CLS 0 en feestdagen 0,044 mobiel / 0,009 desktop; de mobiele verschuiving is de bestaande mandknop die plaatsmaakt voor de cookiekeuzebanner. LCP-mediannen in deze laatste localhostronde: home 968/960 ms, assortiment 1104/976 ms, feestdagen 1000/952 ms (mobiel/desktop). Dat is geen bewijs van veldprestaties. De eerdere incidentele hogere uitschieters waren niet reproduceerbaar; herbeoordelen bij geïsoleerde Lighthouse-meting na deploy.

## Nog open, in volgorde

1. PR review en na goedgekeurde merge de echte Cloudflare-commit, Ready-status, afscherming en representatieve live routes bevestigen. Deze audit opent productie niet.
2. Eigenaar: primaire telefoon, afwijkende dinsdagopening, juiste Google Bedrijfsprofielgegevens en drie gerechtfoto’s bevestigen; zie [NAP](nap-controle.md) en [recepten](recepten-matrix.md).
3. Search Console: huidige Google-aanmelding toont **“Je hebt geen toegang tot deze property”** voor `sc-domain:schaapsvishandel.nl`. Geen zoekprestaties of indexeringsdata beschikbaar. Toegang regelen vóór lancering; geen nieuwe betaalde dienst nodig.
4. Lighthouse onder reproduceerbare mobiele throttling, echte browserzoom200%, uitgebreidere toegankelijkheidscontrole en diagnose van incidentele layoutverschuivingen. Geen misleidende CWV-goedkeuring geven op localhost.
5. Redactionele vervolgcontrole: semantische description-overlap, volledige headinghiërarchie, elke voedings-/herkomstclaim en alle EN/DE hoofdteksten. Matrix is inventaris en prioritering, geen culinair certificaat.
6. Na openbare lancering de [checklist](lancering-checklist.md) en het [90-dagenplan](monitoring-90-dagen.md) uitvoeren. Het slot blijft tot afzonderlijk eigenaarsbesluit aan.

## Onderzoeksbronnen

Geraadpleegd 3 november 2026: geïnstalleerde Next16-documentatie voor metadata/sitemap; [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [robots](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions), [titels](https://developers.google.com/search/docs/appearance/title-link), [snippets](https://developers.google.com/search/docs/appearance/snippet), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) en [lokale Google-resultaten](https://support.google.com/business/answer/7091?hl=nl). Relevantie: feitelijke pagina-inhoud, crawlbare links en eenduidige paginarollen; geen ranggarantie, zoekvolume of kunstmatige AI-optimalisatie.

De specifieke schema-, lokale bron- en concurrentiebevindingen staan in [structured-data](structured-data.md), [NAP-controle](nap-controle.md) en [keywordmap](keyword-map.md).

## Gewijzigde bestanden

- `.agents/skills/schaaps-seo/SKILL.md`
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
- `scripts/audit-content-data.mjs`
- `scripts/audit-design-browser.mjs`
- `scripts/audit-lab-performance.mjs`
- `scripts/check-seo-release.mjs`
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
- `src/components/catalog/SeafoodCatalog.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/ui/Sectie.tsx`
- `src/lib/contact-validation.ts`
- `src/lib/seo.ts`
- `src/messages/de.json`
- `src/messages/en.json`
- `src/messages/nl.json`
- `src/proxy.ts`
