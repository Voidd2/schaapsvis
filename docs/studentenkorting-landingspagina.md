# Studentenkorting — landingspagina voor advertenties

Uitvoering: 4 november 2026.

## Aanpak

De oude pagina had een algemene kop, een vage accountknop en verspreide voorwaarden met herhaalde ontwikkelinformatie. De nieuwe pagina sluit aan op een advertentie voor 10% studentenkorting in Leiden: voordeel en beperking direct zichtbaar, vervolgens de aanvraagstappen, doelgroep, voorbeeldpas, lokale bezoekinformatie en antwoorden op bezwaren. Dit volgt het principe van overeenkomst tussen advertentie, aanbod en vervolgstap en eenvoudige mobiele navigatie. Bron: [Google Ads, advertenties en landingspagina's optimaliseren](https://support.google.com/google-ads/answer/6238826?hl=nl), geraadpleegd 4 november 2026. Geen conversiestijging gegarandeerd en geen campagne gestart.

## Uitgevoerd

- 10% op het hele assortiment, na goedkeuring en niet stapelbaar, bovenaan. Leiden sinds 1938 en concrete voorbeelden kibbeling/zalm.
- Eén primaire actie, herhaald na uitleg en onderaan: studentenkorting aanvragen. Deze opent `/account?mode=register` direct op Account maken. Gewone `/account` blijft op Inloggen. De query kiest alleen een presentatietab, geeft geen toegang en slaat geen persoonsgegevens op. Een bestaande sessie blijft de bestaande accountweergave gebruiken.
- Drie aanmeldstappen; privé- én schoolmail vooraf duidelijk. Privémail voor latere login, schoolmail als bewijs, geen bewijsupload en handmatige beoordeling behouden.
- Mbo/hbo/wo, Nederlandse en internationale studenten; studeren buiten Leiden toegestaan, middelbare scholieren uitgesloten.
- Voorbeeldpas met echt logo, duidelijk ongeldig als kortingsbewijs. Geen werkende voorbeeld-QR, geen Wallet- of spaarpuntenbelofte.
- Herenstraat met centrale openingstijden en routeknop; alle winkel/marktlocaties via bestaande locatiepagina. FAQ over bewijs, goedkeuring, vrijwillige mailaanbiedingen en login.
- NL/EN/DE. Knoppen minimaal 52px; één kolom op mobiel. Besloten-previewmelding zichtbaar zolang de bestaande site-publicatievlag dicht staat. Toegangsregels en account-API ongewijzigd.

## Validatie

- Contentintegriteit, gerichte ESLint, Next-build (572 pagina's), Cloudflare/Vite-build en diff-check geslaagd. Na de laatste tekstcorrectie ook GitHub Build263 geslaagd; Codex-review op definitieve PR-head `56ba34e` afgerond zonder bevindingen.
- Chrome: CTA → geselecteerd Account maken; terugschakelen naar Inloggen; gewone account-URL → geselecteerd Inloggen. Getest met lokale read-only fixture die alleen anoniem `{user:null}` teruggeeft; iedere niet-GET geweigerd. Niets aangemaakt, verzonden of aan productie gekoppeld.
- NL/EN/DE-inhoud bekeken; NL en DE op 390px zonder horizontale overflow, CTA's minimaal 52px. Vrijwillige nieuwsbrief-FAQ opent met juiste uitleg. Desktopopmaak visueel bekeken in Chrome; bewijs buiten Git: `../design-preview/student-landing/live-page.png`.

## Vóór echte advertenties

Gebruik `https://schaapsvishandel.nl/nl/studentenkorting`, niet de Workers-preview. De site is nog besloten; publieke lancering en de al vastgelegde mail/privacy-acceptatie staan los van deze vormgevingsronde. Bestaande geaggregeerde statistieken na toestemming meten paginaweergaven/linkklikken, geen betrouwbare individuele registratieconversies of ROAS. Geen nieuwe trackers toegevoegd.

Mogelijke advertentietekst: “Student in Leiden? Ontdek 10% korting op het hele assortiment bij Schaap’s. Voor mbo-, hbo- en wo-studenten, na goedkeuring. Niet te combineren met andere acties.” Laat de advertentie niet beloven dat registratie direct een geldige pas oplevert.

## Publicatie

- PR #104 samengevoegd als `b76a036`; Cloudflare-versie `6c192cfa` Ready met 100% verkeer.
- Nieuwe kop en drie aanvraaglinks op Workers én hoofddomein bevestigd. Op het hoofddomein ook definitieve stap-3-tekst, previewmelding, geladen afbeeldingen en canonical naar `.nl` gecontroleerd.
- Live CTA opent `/nl/account?mode=register`. De reeds ingelogde beheerder blijft terecht zijn account zien; niet uitgelogd of aangepast. De anonieme registratietab is hierboven afzonderlijk lokaal gecontroleerd. Geen echte aanvraag of mail verstuurd.
