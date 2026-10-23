# SEO-overhaul — voortgang en QA-checklist

Domein: https://www.schaapsvishandel.nl · Laatst bijgewerkt: 23 oktober 2026.
De huidige checkout blijft op Vercel; Cloudflare is nog niet de actieve host voor dit domein.

Dit rapport beschrijft code- en teststatus, niet een rankinggarantie. De pagina `/biologische-vis`
legt BIO, ASC en MSC naast elkaar uit. VÅRLAKS wordt niet als EU-biologisch gepresenteerd:
de actuele leveranciersinformatie die we hebben geraadpleegd spreekt over verantwoord gekweekte,
traceerbare zalm en vermeldt verschillende keurmerken, maar bevestigt geen EU-biologische certificering.
Koppel keurmerkclaims daarom alleen aan het etiket van de partij die daadwerkelijk wordt verkocht.

## Definition of Done — status

| # | Eis | Status | Toelichting |
|---|---|---|---|
| 1 | Geen externe image/video-hotlink meer (grep schoon) | ✅ | Alle hotlinks weg; alleen Vimeo-embed + tekst-attributie blijven. Zie `external-assets-report.md`. |
| 2 | Product- en receptafbeeldingen lokaal + beschrijvende alt | ✅ / ⚠️ | De assortimentcheck vindt 67 unieke lokaal gehoste productfoto's en de receptcheck 37 unieke receptfoto's. Foto's van de echte winkel, toonbank, medewerkers en marktkramen ontbreken nog (`fotos-aan-te-leveren.md`). |
| 3 | `/eerlijke-vis` → `/biologische-vis` (301) + links | ✅ | 301 in `next.config.ts` (nl/en/de + prefixloos); nav, footer, home, sitemap, blog bijgewerkt. |
| 4 | Title/H1/meta biologische-vis, VÅRLAKS, home | ✅ | Keurmerkenpagina richt zich op BIO/ASC/MSC; VÅRLAKS-pagina beschrijft herkomst en leverancierinformatie zonder de zalm EU-biologisch te noemen. |
| 5 | Eén H1 per pagina, logische koppen | ✅ | Gecontroleerd op de aangepaste pagina's. |
| 6 | LocalBusiness + Organization + Product + FAQPage + BreadcrumbList | ✅ | LocalBusiness/FoodEstablishment (bestond), **Organization** + Instagram toegevoegd, **Product (ItemList)** op assortiment, **FAQPage + BreadcrumbList** op biologische-vis (FAQ ook al op viswinkel-leiden). Valideer handmatig met Rich Results Test. |
| 7 | Volledige 301-mapping oude URL's | ⚠️ | Wayback geblokkeerd in deze omgeving, oude WordPress-site offline. Generieke mappings staan klaar (`/over-ons`, `/producten`, `/openingstijden`, …). **Definitieve lijst: exporteer GSC → "Pagina's".** Zie `redirects-report.md`. |
| 8 | Dynamische sitemap.xml + hreflang; robots verwijst ernaar | ✅ | `sitemap.ts` met `alternates.languages` (nl/en/de + x-default) per URL; `robots.ts` verwijst naar sitemap. |
| 9 | hreflang nl/en/de + x-default, in beide richtingen | ✅ | Per-pagina `alternates` (was al aanwezig) + nu ook in sitemap. |
| 10 | Indexeerbaarheid en www-canonicalisatie | ⚠️ | De productiehost staat bewust achter het wachtwoordslot; de openbare route toont “Binnenkort online” en kan dus niet normaal worden geïndexeerd. Metadata en sitemap zijn in de sitecode voorbereid; bevestig www-redirects en Search Console na de lancering. |
| 11 | Eigen, actueel assortiment en productinformatie | ⚠️ | 67 producten volgens de huidige eigenaar-assortimentcheck; beschikbaarheid en foto’s worden per product beheerd. Geen doel om een concurrent ongewijzigd in productaantal te evenaren. |
| 12 | Blogartikelen met interne links naar relevante product- en locatiepagina’s | ✅ / ⚠️ | Er zijn 18 artikelen en de technische contentcheck vindt geen ontbrekende blogfoto’s. Controleer inhoud en linkrelevantie handmatig; meer artikelen zijn niet automatisch beter. |
| 13 | Lighthouse SEO ≥ 95, performance gemeten | ⚠️ | Nog niet gemeten. De productiebuild is succesvol, maar de afgeschermde site is niet visueel of met Lighthouse op de openbare route geaudit. Meet op de preview en herhaal na het uitzetten van het slot. |
| 14 | `fotos-aan-te-leveren.md` + `lokale-seo-acties.md` opgeleverd | ✅ | Plus `external-assets-report.md`, `redirects-report.md` en dit rapport. |

Legenda: ✅ klaar · ⚠️ gedeeltelijk / actie bij Lucas of hosting.

## Wat is gewijzigd (samenvatting)
1. **Eigen afbeeldingen i.p.v. externe hotlinks + Biologische Vis hub** — workstream B + D.
2. **JSON-LD uitbreiding, hreflang in sitemap, Varlaks H1** — workstream A + C.
3. **Content & rapporten** — blogartikelen, assortimentscontrole, redirects en SEO-documentatie.

## Belangrijkste resterende acties voor Lucas
1. **Google Search Console** koppelen → "Pagina's" exporteren → oude URL's aanvullen in
   `next.config.ts` `redirects()` (zie `redirects-report.md`).
2. **Echte foto's** aanleveren (`fotos-aan-te-leveren.md`). Een raster `og-image.png` van 1200×630 bestaat al; controleer de uiteindelijke weergave bij delen op sociale media.
3. **Lokale SEO** uitvoeren (`lokale-seo-acties.md`): Google Bedrijfsprofiel, NAP-consistentie, reviews, backlinks.
4. **non-www → www** redirect op de Vercel-domeininstellingen bevestigen.
5. (Optioneel) Assortiment verder uitbreiden richting volledige Hartevelt-breedte.
6. Draai **Lighthouse** op de openbaar toegankelijke preview en valideer de relevante JSON-LD met Rich Results Test.

## Laatste lokale verificatie

- `next build --webpack` op 23 oktober 2026 is geslaagd; Next.js genereerde 476 routes. Volledige ESLint slaagde.
- De vertaal-/rendercheck controleerde 411 routes in NL/EN/DE: 559 UI-sleutels en alle verwachte vertaalde product-, recept-, blog-, locatie- en visschalenteksten werden gevonden. De controle gebruikt voor visschalen nu de werkelijke teksten en namen van de huidige WhatsApp-aanvraagkaarten; de vorige check controleerde daar ten onrechte teksten van de ongebruikte configurator.
- De eigenaar-assortimentcheck controleerde 201 productpagina’s, 135 expliciet passende product-receptlinks en 87 unieke gekoppelde receptpagina’s, zonder fouten. De afbeeldingscontrole vond 67/67 unieke, lokaal gehoste productfoto’s.
- PR #18 met de recente navigatie-, producttekst-, student/account- en contentupdates is naar GitHub gepusht maar staat nog open, niet gemerged. Beide Vercel-statussen op commit `11f77557a270c7b9619fbba6963536f50a14d1ec` falen met `build-rate-limit`; er is dus geen nieuwe deployment van deze PR bevestigd. De live `.nl`-site draait nog op Vercel en blijft achter het toegangsslot.
- Deze geautomatiseerde controles bewijzen technische dekking en rendering, geen menselijke moedertaalredactie van iedere alinea of een bepaalde Google-ranking.
- De publieke site is nog met een toegangsslot afgeschermd. Zolang dat zo is, kunnen zoekmachines de pagina’s niet normaal indexeren.
- Echte foto’s van de winkel, toonbank, medewerkers en marktkramen ontbreken nog; zie `fotos-aan-te-leveren.md`.

