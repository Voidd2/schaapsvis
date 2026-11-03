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

## Gecontroleerde masteraudit — 3 november 2026

- Start voor SEO bij `docs/seo/technische-audit.md`; gebruik keyword-map, nap-controle, structured-data, recepten-matrix, lancering-checklist en monitoring-90-dagen. Visuele testdekking staat in `docs/design/visuele-eindcontrole.md`.
- Scheid besloten runtime van lokale publieke simulatie. Productie blijft op slot tot expliciet eigenaarsbesluit; ook toegelaten preview-HTML krijgt noindex. Verander SITE_PUBLIC of secrets niet om tests groen te krijgen.
- Gebruik `node scripts/audit-content-data.mjs` voor de actuele broninventaris en geïsoleerde contacttests. Daarna `check-seo-release.mjs <local-origin> <report.json>` voor openbare simulatie, of met `--locked` voor het slotprofiel. Test ook de gebouwde Cloudflare/Vinext-runtime: Next alleen bewijst geen edgegedrag.
- Controleer hreflang via HTML-attributen onafhankelijk van attribuutvolgorde. Next en Vinext renderen niet noodzakelijk dezelfde volgorde.
- Vaste Product-prijzen moeten met de bron overeenkomen. Geen InStock/LimitedAvailability zonder voorraadbewijs; optionele validatorwaarschuwingen zijn geen reden beoordelingen of voorraad te verzinnen. Geen onbevestigd areaServed.
- Google FAQ-rich-results worden sinds 7 mei 2026 niet meer getoond (actuele Search Central-updates). Zichtbare FAQ behouden, geen FAQ-markup voor een rich-resultbelofte. Google heeft geen llms.txt nodig voor Search/AI-resultaten.
- Recipe vereist voor Google een gerechtfoto. Drie recepten missen die nog: haringsalade-appel-biet, haring-komkommer-borrelhapjes, makreel-aardappel-ovenschotel. Behoud tekstfallback tot een echt passend beeld bestaat.
- Onbekende blog-/receptslugs geven 404; bestaande expliciete oude redirects blijven behouden. Reviewdatums worden al als absolute maand/jaar gelokaliseerd.
- Performance: responsive Image voor dezelfde homepagefoto's scheelt lokaal circa 91,6% resourcebytes mobiel. Geen Lighthouse-/INP-/veldscore afleiden uit localhost. Registreer cold-start, meetomstandigheden en layoutverschuivingen.
- Huidige Google-aanmelding heeft geen toegang tot GSC-domeinproperty. Geen posities, zoekvolumes of klikcijfers verzinnen. Telefoon- en dinsdagtijdverschillen in externe gidsen eerst door eigenaar laten bevestigen.
