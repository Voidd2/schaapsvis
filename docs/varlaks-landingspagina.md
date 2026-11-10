# VÅRLAKS als zelfstandige landingspagina

## Uitvoering — 4 november 2026

- Bestaande route `/nl/varlaks` behouden, met EN/DE-varianten, canonical, hreflang en deelmetadata. Geschikt als vaste bestemming voor toekomstige advertenties en QR-codes; geen campagne gestart en geen publieke toegang gewijzigd.
- VÅRLAKS-zalm staat rechtstreeks in het hoofdmenu op desktop en mobiel. Verwijderd uit het submenu Assortiment. Ons Verhaal blijft het bedrijfsverhaal. Desktop heeft twee rustige navigatieregels zodat de extra bestemming de overige knoppen niet verdringt.
- Eigen introductie met bestaande kleuren/typografie, herkomstverhaal, leveranciersfilm en echte leveranciersfoto's, bereidingsidee, FAQ en duidelijke acties voor winkelbezoek, productinformatie en persoonlijk advies. Bestaande AI-sfeerbeelden herkenbaar als illustratie aangeduid.
- Bestaande WhatsApp-helper en toestemmingsgebonden analytics gebruikt. Geen extra tracker, aanvraagformulier, prijsoverride, nieuwe betaalde dienst of gewijzigde accountfunctie.

## Claimcontrole

https://varlaks.no/retail/ gecontroleerd op 4 november 2026: noemt Noord-Noorwegen, kwekersfamilies, traceerbaarheid en ASC-certificering. Geen bevestiging gevonden van biologische certificering voor de door Schaap verkochte zalm. Daarom **VÅRLAKS-zalm**, zonder biologische verkoopclaim. Eén FAQ legt het onderscheid uit; het bestaande keurmerkenoverzicht blijft beschikbaar. Een productspecifiek biologisch etiket/certificaat van de leverancier blijft nodig voordat deze verkoopclaim kan worden toegevoegd.

Toestemming voor leveranciersbeelden is al vastgelegd in `docs/afbeeldingsbronnen.md`. Producten, voorraadregels, foto's en externe bronlinks behouden.

## Controle

- Inhoudscontrole, catalogus-/navigatiechecks, gerichte ESLint, Next-build (572 pagina's), Cloudflare/Vite-build en `git diff --check`: geslaagd.
- Chrome lokaal: NL desktop, EN/DE mobiel, eigen menu-item, FAQ, canonical en linkbestemmingen gecontroleerd. Vier bestaande beelden laden; Vimeo laadt niet voor een afspeelklik. Knoppen minimaal 52px; mobiele inhoud 388px breed zonder horizontale overflow.
- WhatsApp uitsluitend als link/concept gecontroleerd; geen bericht of aanvraag verstuurd.
- PR #102 samengevoegd als `a5a1b43`; GitHub Build259 geslaagd, Codex-review zonder bevindingen. Cloudflare siteversie `396d1958` Ready en 100% verkeer.
- Live Chrome op `https://schaapsvishandel.nl/nl/varlaks`: zelfstandig hoofdmenu-item, nieuwe introductie, vier geladen beelden, juiste canonical en besloten-previewmelding bevestigd. Bewijs buiten Git: `../design-preview/varlaks/live-landing.png`.
- Mobiele DOM-/maatcontrole geslaagd op 388px en 468px inhoudsbreedte; mobiele screenshots liepen tegen een Chrome-capturetimeout aan. Desktopopmaak is wel visueel gecontroleerd en vastgelegd. Geen claim van een geslaagde mobiele screenshotcontrole.


## Hercontrole keurmerken — 10 november 2026

- [VÅRLAKS voor retailers](https://varlaks.no/retail/) bevestigt ASC voor het merk. De [certificatenpagina](https://norwegianseafood.com/certification/) noemt daarnaast EU BIO op leveranciersniveau.
- [Skal, Nederlandse vestiging](https://norwegianseafood.com/wp-content/uploads/2025/09/NL-BIO-01.528-0006405.2025.002.pdf): op blad 2 staat biologische zalm, maar geen VÅRLAKS-artikel of partij. [Debio, Noorse vestiging](https://norwegianseafood.com/wp-content/uploads/2026/10/Bio-Norwegian-Seafood-AS.pdf): distributie/export van zowel biologische als niet-biologische aquacultuurproducten. Geen van beide documenten legt de koppeling met een levering aan de winkel.
- Publiceer geen biologische claim voor deze filet zonder bewijs voor het geleverde artikel/de partij (bijvoorbeeld een bijbehorende leverbon met bio-aanduiding en controlecode); zie de [RVO-uitleg voor biologische productreclame](https://www.rvo.nl/onderwerpen/biologisch-ondernemen/communiceren/regels). De zeven merkposters en de NL-flyer vermelden ASC. Op de eigen winkelfoto met de oesters staat wél een groene poster met ‘biologisch gekweekt’; de uitsnede op de locatiepagina toont alleen de medewerker en de toonbank.
