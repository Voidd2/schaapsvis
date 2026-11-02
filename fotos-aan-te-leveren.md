# Foto's aan te leveren — echte locaties en winkel

De product- en receptpagina's hebben al lokale afbeeldingen. De controle van 67 assortimentproducten vindt 67 unieke bestanden en unieke afbeeldingsbytes; alle productbeelden zijn minimaal 1200 pixels breed. De 37 receptbeelden en 18 blogkaartbeelden zijn eveneens uniek. Dit betekent niet dat alle foto's door Schaap's zelf zijn gemaakt: bron, licentie en voorbeeldstatus staan in `docs/afbeeldingsbronnen.md`.

Voor de locatiepagina en het verhaal van de winkel ontbreken nog herkenbare foto's van Schaap's zelf. Op `/bezoek-ons` staan daarom expliciete fotovakken met “Eigen foto volgt”; ze doen zich niet voor als foto's van onze winkel of kramen. De schaalfoto's zijn voorbeeldbeelden en kunnen afwijken van wat de klant ontvangt.

## Hoe aanleveren

- Liggend formaat, liefst minimaal **1200 × 800 px**, scherp en bij daglicht.
- Stuur het originele JPG- of PNG-bestand; we optimaliseren een lokale WebP-versie.
- Maak de foto bij voorkeur met een telefoon op ooghoogte of schuin van boven; vermijd harde flits en tegenlicht.
- Deel foto's via WhatsApp of e-mail en vermeld welke locatie of personen erop staan.
- Gebruik alleen foto's waarvoor Schaap's de rechten heeft of toestemming heeft gekregen. Online voorbeeldfoto's blijven lokaal gehost; we bewaren bron en licentie in `docs/afbeeldingsbronnen.md`.

## Prioriteiten

| # | Foto | Waarvoor | Wat moet herkenbaar zijn |
|---|---|---|---|
| 1 | Winkelgevel Herenstraat 48 | Homepage, Bezoek ons, delen van links | Schaap's naam/gevel en een stukje Herenstraat |
| 2 | Toonbank met verse vis | Homepage, winkelpagina's | De eigen toonbank en het assortiment op ijs |
| 3 | Team achter de toonbank | Ons verhaal, contact, blog | Echte medewerkers, tijdens het werk |
| 4 | Zaterdagkraam bij De Waag | Bezoek ons, marktdagblog | De eigen kraam en de Waag/Aalmarkt |
| 5 | Woensdagkraam in Leiden | Bezoek ons | De eigen kraam en herkenbare omgeving |
| 6 | Vrijdagkraam bij Hoogvliet in Voorschoten | Bezoek ons, viswinkel Voorschoten | De eigen kraam op de parkeerplaats |
| 7 | Eigen borrel-, familie- en feestschaal | Visschalen, blog | De schalen zoals Schaap's ze werkelijk samenstelt |
| 8 | Eigen VÅRLAKS-zalm in de winkel | Biologische vis, assortiment | De eigen levering of toonbank; huidige leverancierfoto's zijn al lokaal aanwezig |

Product-, recept- en blogafbeeldingen zijn al aanwezig; losse vervangingsfoto's daarvoor zijn alleen nodig als er een betere echte foto beschikbaar is. Geef bij een nieuwe foto het product of de pagina door, zodat die niet per ongeluk als een ander product wordt getoond.

## Waar foto's worden gekoppeld

Alle vaste fotoplekken staan in `src/lib/beeld.ts`. Zodra een winkel- of locatiebeeld is goedgekeurd en onder `public/images/` staat, krijgt het daar een eigen lokaal bestandspad en passende alt-tekst. De pagina gebruikt de foto dan automatisch; externe afbeeldingsservers worden niet rechtstreeks aangeroepen.

## Aansluiting na de derde verbeteringsronde (2 november 2026)

- `BEELD.winkelGevel`: zodra `bestand` een goedgekeurde eigen gevel bevat, vervangt die automatisch de zalmfoto bovenaan de homepage. Vul tegelijk `alt` en `bijschrift` passend bij de werkelijk aangeleverde foto in. Zonder gevel blijft de huidige zalm met het correcte gerechtbijschrift staan. Dezelfde gevelregistratie wordt gebruikt bij de locaties.
- `BEELD.historie1938`: uitsluitend een passende historische opname voor het familieblok op de homepage en de historische tijdlijn. Bevestig de datering en pas alt-tekst/vertalingen aan als het jaar anders is. Zonder beeld blijven verhaal, quote en verticale lijn volledig intact.
- `BEELD.historieNu`: aparte bestaande registratie voor een **actuele teamfoto**, aangesloten bij ‘Vandaag’ op Ons verhaal. Niet invullen bij historie1938. `achterDeToonbank` is de aparte persoonlijke contactfoto. Dit zijn geen automatische homepage-plaatsingen.
- `marktWoensdag`, `marktZaterdag`, `marktVoorschoten`: de eigen kramen met herkenbare omgeving; de locatiekaarten blijven zonder foto's gewoon bruikbaar.
- Een aangeleverde gevel/teamfoto wordt niet automatisch een social-shareafbeelding. Toonbank- en blogplaatsingen worden afzonderlijk op de bedoelde pagina gecontroleerd; de huidige homepage toont zes productfoto's, geen toonbankblok.
- Nog nodig: gevel, echte toonbank/contactpersoon, huidig team, drie kramen en historische opname. Lever originelen liefst minimaal 1200 × 800 px met ruimte voor uitsnede. Geen AI-beelden voor deze identiteit.
