# Statistieken — 4 november 2026

## Uitvoering
- Eigen meting via de bestaande Cloudflare leden-Worker/D1: productie `ANALYTICS_ENABLED=on`, alleen na cookie-toestemming; preview blijft uit.
- Beheeroverzicht: 7/30/90 dagen, serverstatus, vier totalen, daggrafiek plus toegankelijke tabel, top 30 pagina's/klikdoelen en verversen. Datumgrenzen UTC, inclusief onvolledige huidige dag.
- Totalen en dagcijfers worden over alle rijen berekend; alleen ranglijsten worden beperkt. Oude response `rows` behouden voor al geopende pagina's tijdens uitrol.
- WhatsApp, bellen en e-mail krijgen vaste categorieën zonder telefoonnummers, ontvangers of berichttekst. Bestel-, account-, beheer-, studenten- en kortingsbonroutes uitgesloten. Querystrings, hashes, vreemde protocols en ongeldige paden worden niet opgeslagen.
- NL/EN/DE uitgewerkt; privacytekst aangepast naar de actieve meting. Geen nieuwe persoonsgegevens of externe trackers toegevoegd.

## Bronrapporten
De beheerpagina biedt directe, geverifieerde rapportlinks naar de juiste GSC-domeinproperty en het Cloudflare-account Schaapsvis. Dit is geen automatische import van externe cijfers. Er is geen GSC OAuth-client/service-account of geschikt Cloudflare-leestoken in deze runtime geconfigureerd. Automatische import zou een afzonderlijke, beperkte API-autorisatie vereisen; bestaande browsercookies worden daar niet voor gebruikt.

Chromecontrole 4 november:
- GSC zoekprestaties: Web, 3 maanden, diagram 2 augustus–1 november 2026; 201 klikken, 9.680 vertoningen, CTR 2,1%, gemiddelde positie 17,2. Overzicht: 12 geïndexeerd / 79 niet-geïndexeerd. Geen verzonden sitemap in deze domeinproperty. Dit blijft een momentopname; geen productie-dashboardgetallen hardgecodeerd.
- Site blijft besloten. Geen verzoek tot indexering of openbare lancering; sitemap pas bij openbare lancering indienen.
- Cloudflare Account Analytics is bereikbaar voor Schaapsvis en toont verkeer. Requests/bots/resources zijn geen menselijke paginaweergaven.
- Cloudflare Web Analytics bestaat, maar staat op automatische injectie behalve EU-bezoekers. Dat verklaart waarom dit rapport de Nederlandse bezoekers niet meet. Deze instelling is ongewijzigd; de eigen toestemmingsmeting verzamelt dagtotalen op Cloudflare zonder extra beacon. Geen dubbele tracker geïnstalleerd.

## Validatie
- Ledenintegratie en lokale SMTP-test slagen; geen echte mail verstuurd.
- Regressies: totalen boven 2.000 rijen, datumgrenzen, nul-dagen, oude/nieuwe WhatsApp-labels, autorisatie, private routes en URL-sanitizing.
- TypeScript/Next-productiebuild, Cloudflare/Vite-build, gerichte ESLint en contentintegriteit slagen.
- Lokale browsercontrole met uitsluitend synthetische data: volle grafiek/ranglijsten, 403 verwijdert eerdere cijfers, lege/uitgeschakelde toestand en periodekeuze. Fixture alleen buiten Git in design-preview/analytics.
- Live gepubliceerd via PR #101, main `92f3b21`. GitHub Build257 en Member157 groen, Codex-review zonder bevindingen. Cloudflare site `474ad18c` en leden `316dc564` beide 100% Ready.
- Live Chrome: server meldt meting actief; na weigeren en homepagebezoek blijft het dashboard op 0. Na accepteren zijn homepage, Feestdagen en de klik homepage → Feestdagen geregistreerd. Het dashboard toont daarnaast één weergave van Visschalen uit een andere open context; deze is niet aan een persoon toegeschreven. Verversen van beheer verhoogt de tellers niet. Geen consolefouten.
- Screenshot buiten Git: `../design-preview/analytics/live-dashboard.png`. Browserviewport hersteld; lokale fixture/testserver gestopt. Er zijn geen berichten verstuurd.

Bronnen voor eventueel latere API-uitbreiding:
- https://developers.google.com/webmaster-tools/v1/prereqs
- https://developers.google.com/webmaster-tools/v1/how-tos/authorizing
- https://developers.cloudflare.com/web-analytics/faq/
