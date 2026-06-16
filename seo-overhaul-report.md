# SEO-overhaul — eindrapport & QA-checklist

Werkbranch: `claude/practical-bell-vrtx59` · Domein: https://www.schaapsvishandel.nl
Build: `npm run build -- --webpack` slaagt (geen TypeScript-/lintfouten).

Strategische kern: **"biologische vis / biologische zalm Leiden"** is lokaal vrijwel
onbezet. De hele overhaul is erop gericht die niche te claimen (eigen route
`/biologische-vis`, Varlaks als biologische-zalm-money-page, eerlijke keurmerk-uitleg),
zonder de bestaande sterke structuur te slopen.

## Definition of Done — status

| # | Eis | Status | Toelichting |
|---|---|---|---|
| 1 | Geen externe image/video-hotlink meer (grep schoon) | ✅ | Alle hotlinks weg; alleen Vimeo-embed + tekst-attributie blijven. Zie `external-assets-report.md`. |
| 2 | Alle images lokaal + beschrijvende/lokale alt | ✅ / ⚠️ | Eigen SVG's met goede alt. Nog **geen raster WebP** — die volgen met echte foto's (`fotos-aan-te-leveren.md`). |
| 3 | `/eerlijke-vis` → `/biologische-vis` (301) + links | ✅ | 301 in `next.config.ts` (nl/en/de + prefixloos); nav, footer, home, sitemap, blog bijgewerkt. |
| 4 | Title/H1/meta biologische-vis, varlaks, home | ✅ | H1 "Biologische vis in Leiden"; Varlaks H1 met "Biologische zalm uit Noord-Noorwegen"; home-title was al sterk. |
| 5 | Eén H1 per pagina, logische koppen | ✅ | Gecontroleerd op de aangepaste pagina's. |
| 6 | LocalBusiness + Organization + Product + FAQPage + BreadcrumbList | ✅ | LocalBusiness/FoodEstablishment (bestond), **Organization** + Instagram toegevoegd, **Product (ItemList)** op assortiment, **FAQPage + BreadcrumbList** op biologische-vis (FAQ ook al op viswinkel-leiden). Valideer handmatig met Rich Results Test. |
| 7 | Volledige 301-mapping oude URL's | ⚠️ | Wayback geblokkeerd in deze omgeving, oude WordPress-site offline. Generieke mappings staan klaar (`/over-ons`, `/producten`, `/openingstijden`, …). **Definitieve lijst: exporteer GSC → "Pagina's".** Zie `redirects-report.md`. |
| 8 | Dynamische sitemap.xml + hreflang; robots verwijst ernaar | ✅ | `sitemap.ts` met `alternates.languages` (nl/en/de + x-default) per URL; `robots.ts` verwijst naar sitemap. |
| 9 | hreflang nl/en/de + x-default, in beide richtingen | ✅ | Per-pagina `alternates` (was al aanwezig) + nu ook in sitemap. |
| 10 | Geen noindex; www-canonicalisatie | ✅ / ⚠️ | `robots: index,follow`, `metadataBase` = www. **non-www → www** moet op hosting/DNS (Vercel domain) staan; `/` → `/nl` is nu 301 (`vercel.json`). |
| 11 | Assortiment richting Hartevelt-breedte, eigen teksten | ⚠️ | +14 producten (nu 73), eigen beschrijvingen + Latijnse namen + allergenen, bestaand format behouden. Nog niet de volle ~153 van Hartevelt — uit te breiden. |
| 12 | 4–6 blogartikelen met interne links naar money-pages | ✅ | Er waren al 8 artikelen; +1 nieuw money-keyword-artikel ("Waar koop je biologische vis in Leiden?"); interne links wijzen naar `/biologische-vis` en `/varlaks`. |
| 13 | Lighthouse SEO ≥ 95, performance gemeten | ⚠️ | Niet uitvoerbaar in deze omgeving (geen browser). Aanbeveling: draai Lighthouse op de Vercel-preview. Site is licht (SVG i.p.v. zware externe foto's) wat CWV ten goede komt. |
| 14 | `fotos-aan-te-leveren.md` + `lokale-seo-acties.md` opgeleverd | ✅ | Plus `external-assets-report.md`, `redirects-report.md` en dit rapport. |

Legenda: ✅ klaar · ⚠️ gedeeltelijk / actie bij Lucas of hosting.

## Wat is gewijzigd (samenvatting per commit)
1. **Eigen afbeeldingen i.p.v. externe hotlinks + Biologische Vis hub** — workstream B + D.
2. **JSON-LD uitbreiding, hreflang in sitemap, Varlaks H1** — workstream A + C.
3. **Content & rapporten** — blogartikel, assortimentsuitbreiding, vercel 301, rapporten.

## Belangrijkste resterende acties voor Lucas
1. **Google Search Console** koppelen → "Pagina's" exporteren → oude URL's aanvullen in
   `next.config.ts` `redirects()` (zie `redirects-report.md`).
2. **Echte foto's** aanleveren (`fotos-aan-te-leveren.md`) + een raster `og-image.png` (1200×630).
3. **Lokale SEO** uitvoeren (`lokale-seo-acties.md`): Google Bedrijfsprofiel, NAP-consistentie, reviews, backlinks.
4. **non-www → www** redirect op de Vercel-domeininstellingen bevestigen.
5. (Optioneel) Assortiment verder uitbreiden richting volledige Hartevelt-breedte.
6. Draai **Lighthouse** op de preview en valideer alle JSON-LD met de Rich Results Test.
