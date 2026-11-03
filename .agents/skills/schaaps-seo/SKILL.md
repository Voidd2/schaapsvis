---
name: schaaps-seo
description: Pas technische en lokale SEO, recepten, blogs en interne links toe binnen de bestaande Schaapsvis-site. Gebruik bij inhoudelijke of SEO-wijzigingen in dit project.
---

# Schaapsvis SEO

Lees README.md en alleen de relevante bron. Gebruik docs/project-map.md voor architectuur en docs/kwaliteit-na-76.md voor de actuele inhoudsmatrix.

- Productwaarheid: src/lib/assortiment-data.ts; vaste feestdagenprijzen/ingrediënten/allergenen: src/lib/feestdagen-producten.ts. Merchandising: seafood-catalog.ts. Wijzig geen bedragen of keurmerken op basis van een mockup.
- Locaties/openingstijden: bedrijf.ts en openingHours.ts. Herenstraat is maandag gesloten. Geen fictieve reviews, bedrijfsfoto’s of locatieclaims.
- Maak eerst een matrix van bestaande recepten op hoofdproduct én gerecht/vissoort. Vul een werkelijk ontbrekende bereiding toe, geen synoniemvariant. Hoeveelheden, porties, tijd en veiligheidsadvies moeten samen kloppen. Leg geen productlink naar een andere vis om een lege verwijzing op te vullen.
- Nieuwe inhoud krijgt NL/EN/DE via recipe-translations.ts of blog-translations.ts. Behoud de paragraafstructuur. Receptfoto’s tonen het gerecht; zonder eigen passend beeld blijft de bestaande tekstfallback geldig.
- Controleer actuele voedselveiligheid bij Voedingscentrum/NVWA. Bewaar bron, datum en toepassing in de taakdocumentatie. Certificering nooit afleiden uit alleen het merk.
- Gebruik paginaMetadata, Recipe/Article-schema en bestaande locale-hreflang. lastModified volgt aantoonbare redactionele wijzigingen; onbekend = weglaten, nooit requesttijd. Site-wachtwoord, robots en lege sitemap tijdens het slot behouden.
- Link een recept naar het werkelijke product en relevante bereidingen. Blogs ondersteunen een vraag die niet al uitgebreid is beantwoord. Geen massale lokale SEO-kopieën.
- Controleer: node scripts/check-content-integrity.mjs, betrokken vertalingen/routes en build. Bij navigatie ook node scripts/check-shop-navigation.mjs. Publicatiebewijs vereist de juiste Cloudflare-commit en echte route; Vercel-status is onvoldoende.
