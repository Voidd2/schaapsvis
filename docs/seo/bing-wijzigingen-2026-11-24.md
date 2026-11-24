# Bing — wijzigingen en terugdraaien, 24 november 2026

## Nulmeting

Bing Search Performance, 24 augustus t/m 23 november 2026, filter All: 40 vertoningen, 1 klik, CTR 2,5%. Dit is een kleine steekproef. Sitemaps vóór wijziging: hoofddomein 444 ontdekte URLs, laatst gelezen 10 november; www-variant 441, laatst gelezen 19 november. Beide status Success, geen sitemapwaarschuwingen. De aantallen zijn geen aantallen unieke geïndexeerde pagina’s.

Bing Recommendations: IndexNow ontbreekt, weinig kwalitatieve externe verwijzingen, twee korte meta descriptions. Betrokken routes /nl/viskalender en /nl/recepten/teriyaki-zalm-rijst.

Eigen livecontrole van 441 sitemap-URLs: alle HTTP 200 zonder redirect, alle met description en canonical, geen noindex aangetroffen. Ruwe nulmeting en screenshots staan buiten de repository in bewijs/bing-2026-11-24.

## Wijzigingen

- Hoofdsitemap opnieuw ingediend in Bing. Bing bevestigde ontvangst voor verwerking.
- Twee Nederlandse zoekresultaatbeschrijvingen uitgebreid met bestaande paginainformatie. Oude en nieuwe tekst staan in tekstwijzigingen.md.
- IndexNow-eigendomsbestand toegevoegd. Deze sleutel is een openbaar bewijsbestand, geen accountwachtwoord.
- scripts/submit-indexnow.mjs controleert eigendomsbestand, sitemap, HTTP 200 en indexeerbaarheid vóór aanmelden. Alleen publieke canonieke taal-URLs zonder queryparameters worden toegelaten.
- GitHub-actie Notify IndexNow after publication kan na een gecontroleerde livegang worden gestart met de gewijzigde URLs. Dit is een handmatige publicatiestap. Geen periodieke bulkherindiening.

## Volgende publicaties

Na bevestigde Cloudflare-uitrol en controle van de livepagina’s: voer node scripts/submit-indexnow.mjs uit met uitsluitend de gewijzigde publieke canonieke URLs, of start de GitHub-actie. Het resultaat wordt als JSON gelogd. HTTP 200 betekent ontvangen; HTTP 202 betekent dat sleutelcontrole nog loopt. Beide bewijzen geen indexering of hogere positie.

## Evaluatie

Vergelijk na 28 volledige dagen de perioden 27 oktober–23 november en 25 november–22 december in Bing, met dezelfde filters, afzonderlijk voor de twee gewijzigde pagina’s en lokale zoekwoorden. Noteer klikken, vertoningen, CTR en gemiddelde positie. Bekijk indexstatus en crawldatum apart. Beoordeel beschrijvingen pas na een nieuwe crawl en voldoende vertoningen. Bij weinig verkeer is een verschil nog geen bewijs van effect.

## Terugdraaien

Basisversie vóór deze wijzigingen is d41559aaad7256a219bf5bfc0b758c1e257e423d. Draai alleen de Bing-wijzigingen terug met een nieuwe Git-revert via een PR, zodat later werk behouden blijft. Voor alleen de teksten staan de exacte oude waarden in tekstwijzigingen.md. IndexNow kan los worden gestopt door de GitHub-actie niet uit te voeren en het script/eigendomsbestand te verwijderen in een nieuwe PR. Een al ontvangen crawlmelding kan niet worden ingetrokken; meld de herstelde pagina opnieuw aan.

## Beperkingen en vervolg

Bing Site Scan toont nul pagina’s quotum. Geen scan gestart. Screenshots documenteren deze blokkade. Externe verwijzingen vergen echte links van relevante bedrijven, leveranciers of lokale organisaties; dit kan niet met een instelling worden opgelost. Er zijn geen externe berichten verzonden.
