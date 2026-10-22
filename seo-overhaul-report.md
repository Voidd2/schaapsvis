# SEO-overhaul — voortgang en QA-checklist

Domein: https://www.schaapsvishandel.nl · Laatst bijgewerkt: 22 oktober 2026.
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
| 2 | Alle images lokaal + beschrijvende/lokale alt | ✅ / ⚠️ | Eigen SVG's met goede alt. Nog **geen raster WebP** — die volgen met echte foto's (`fotos-aan-te-leveren.md`). |
| 3 | `/eerlijke-vis` → `/biologische-vis` (301) + links | ✅ | 301 in `next.config.ts` (nl/en/de + prefixloos); nav, footer, home, sitemap, blog bijgewerkt. |
| 4 | Title/H1/meta biologische-vis, VÅRLAKS, home | ✅ | Keurmerkenpagina richt zich op BIO/ASC/MSC; VÅRLAKS-pagina beschrijft herkomst en leverancierinformatie zonder de zalm EU-biologisch te noemen. |
| 5 | Eén H1 per pagina, logische koppen | ✅ | Gecontroleerd op de aangepaste pagina's. |
| 6 | LocalBusiness + Organization + Product + FAQPage + BreadcrumbList | ✅ | LocalBusiness/FoodEstablishment (bestond), **Organization** + Instagram toegevoegd, **Product (ItemList)** op assortiment, **FAQPage + BreadcrumbList** op biologische-vis (FAQ ook al op viswinkel-leiden). Valideer handmatig met Rich Results Test. |
| 7 | Volledige 301-mapping oude URL's | ⚠️ | Wayback geblokkeerd in deze omgeving, oude WordPress-site offline. Generieke mappings staan klaar (`/over-ons`, `/producten`, `/openingstijden`, …). **Definitieve lijst: exporteer GSC → "Pagina's".** Zie `redirects-report.md`. |
| 8 | Dynamische sitemap.xml + hreflang; robots verwijst ernaar | ✅ | `sitemap.ts` met `alternates.languages` (nl/en/de + x-default) per URL; `robots.ts` verwijst naar sitemap. |
| 9 | hreflang nl/en/de + x-default, in beide richtingen | ✅ | Per-pagina `alternates` (was al aanwezig) + nu ook in sitemap. |
| 10 | Geen noindex; www-canonicalisatie | ✅ / ⚠️ | `robots: index,follow`, `metadataBase` = www. **non-www → www** moet op hosting/DNS (Vercel domain) staan; `/` → `/nl` is nu 301 (`vercel.json`). |
| 11 | Eigen, actueel assortiment en productinformatie | ⚠️ | 67 producten volgens de huidige eigenaar-assortimentcheck; beschikbaarheid en foto’s worden per product beheerd. Geen doel om een concurrent ongewijzigd in productaantal te evenaren. |
| 12 | 4–6 blogartikelen met interne links naar money-pages | ✅ | Er waren al 8 artikelen; +1 nieuw money-keyword-artikel ("Waar koop je biologische vis in Leiden?"); interne links wijzen naar `/biologische-vis` en `/varlaks`. |
| 13 | Lighthouse SEO ≥ 95, performance gemeten | ⚠️ | Niet uitvoerbaar in deze omgeving (geen browser). Aanbeveling: draai Lighthouse op de Vercel-preview. Site is licht (SVG i.p.v. zware externe foto's) wat CWV ten goede komt. |
| 14 | `fotos-aan-te-leveren.md` + `lokale-seo-acties.md` opgeleverd | ✅ | Plus `external-assets-report.md`, `redirects-report.md` en dit rapport. |

Legenda: ✅ klaar · ⚠️ gedeeltelijk / actie bij Lucas of hosting.

## Wat is gewijzigd (samenvatting)
1. **Eigen afbeeldingen i.p.v. externe hotlinks + Biologische Vis hub** — workstream B + D.
2. **JSON-LD uitbreiding, hreflang in sitemap, Varlaks H1** — workstream A + C.
3. **Content & rapporten** — blogartikelen, assortimentscontrole, redirects en SEO-documentatie.

## Belangrijkste resterende acties voor Lucas
1. **Google Search Console** koppelen → "Pagina's" exporteren → oude URL's aanvullen in
   `next.config.ts` `redirects()` (zie `redirects-report.md`).
2. **Echte foto's** aanleveren (`fotos-aan-te-leveren.md`) + een raster `og-image.png` (1200×630).
3. **Lokale SEO** uitvoeren (`lokale-seo-acties.md`): Google Bedrijfsprofiel, NAP-consistentie, reviews, backlinks.
4. **non-www → www** redirect op de Vercel-domeininstellingen bevestigen.
5. (Optioneel) Assortiment verder uitbreiden richting volledige Hartevelt-breedte.
6. Draai **Lighthouse** op de openbaar toegankelijke preview en valideer de relevante JSON-LD met Rich Results Test.

## Laatste lokale verificatie

- `next build` op 22 oktober 2026 is geslaagd; Next.js genereerde 473 routes.
- De geautomatiseerde SEO-release-, vertaalstructuur-, eigenaar-assortiment-, afbeeldings- en orderchecks zijn eerder uitgevoerd; deze bewijzen technische dekking, geen menselijke eindredactie van iedere alinea.
- De meest recente commit is naar GitHub `main` gepusht. De gekoppelde Vercel-statussen stonden bij de controle nog op `pending`; controleer de deployment opnieuw voordat wijzigingen als live worden beschouwd.
- De publieke site is nog met een toegangsslot afgeschermd. Zolang dat zo is, kunnen zoekmachines de pagina’s niet normaal indexeren.
- Echte foto’s van de winkel, toonbank, medewerkers en marktkramen ontbreken nog; zie `fotos-aan-te-leveren.md`.

