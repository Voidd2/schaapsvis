# Studenten-eindcontrole — 3 november 2026

PR90 herstelt een gereproduceerde crash: de QR-encoder accepteerde17 bytes, de huidige API levert een veel langer ondertekend SVQ1-token. De browser tekent nu de volledige code lokaal met automatische capaciteit en foutcorrectie M. Een onafhankelijke jsQR-decoder leest de volledige waarde exact terug. Geen externe QR-dienst, nieuwe kosten, verkorte beveiligingstoken of leden-Workerwijziging.

## Resultaten en bewijsgrenzen

| Eis | Aangetoond |
| --- | --- |
| Voornaam/achternaam, privé- en schooladres | Zes browserflows NL/EN/DE ×390/1440px controleren afzonderlijke velden en registerpayload. |
| Twee codes, daarna meteen aanvraag | Zelfde pagina na verify-codes, directe ingelogde aanvraag. Backendintegratie controleert echte sessiecookie; UI gebruikt gesimuleerde API. |
| Geen Leiden-eis of bewijsupload | Utrecht/MBO ingediend in mock; geen file-, Leiden- of proof-consentvelden. MBO/HBO/WO beschikbaar. |
| Marketing afzonderlijk | Optioneel en standaard uit bij registratie; nieuwsbrief vereist eigen toestemming. Backendtests controleren mailaantallen en campagnes. |
| Pas met naam, logo,10%, korte code en QR | Alle zes gevallen: geladen oorspronkelijke logoafbeelding, volledige naam, korte code; lang token niet leesbaar als tekst. Werkelijke SVG onafhankelijk gedecodeerd op192px. |
| QR-capaciteit | CI decodeert korte code, productiegetrouw ondertekend formaat en500-byte-payload. Oude encoder faalt aantoonbaar op de normale API-waarde. |
| Beveiliging/intrekken | Bestaande backendintegratietests voor herroepbare sessies, verlopen/hergebruikte QR, beheer/netwerk en fraudesignalen slagen. Dit vervangt geen fysieke kassascan. |
| Uitloggen en Wallet | Uitloggen toont login; ongeconfigureerde Walletknoppen blijven verborgen. Wallet-activering is uitgesteld door eigenaar. |
| E-mail | SMTP-simulatie STARTTLS/PLAIN/UTF-8 slaagt. Bestaande echte Gmail-authenticatiebewijzen staan in email-bezorging-audit.md. Geen nieuwe echte testmail verzonden. |

Gerichte ESLint, TypeScript, inhoudscontrole en backend/SMTP-tests slagen. GitHub Build245/run41717594451 en Member147/run41717594315 zijn groen, inclusief Next- en Cloudflare-build, QR-decodering en externe slotcontrole. De eerste CI-poging wees een ontbrekende optionele SWC-peer in de npm12-lockfile aan; opnieuw vastgelegd met npm10, daarna npm-ci-dry-run en CI groen.

## Publicatie

- Maincommit8407edc9cff7dc275c6daa34971221e88e6f06fe, PR https://github.com/Voidd2/schaapsvis/pull/90.
- Cloudflare-siteversie df337971, Ready/100%; build9575e9c6-52e2-444b-b04e-f14510ec31a0.
- De zes browserflows zijn herhaald met werkelijk gepubliceerde HTML/JS/beelden van schaapsvishandel.nl; iedere API-call onderschept en iedere andere mutatie geblokkeerd. Nul echte accounts, aanvragen of berichten. Geen pageerrors/overflow. Geen claim dat dit een echte productie-accountregistratie was.
- Echte leden-health GET:200 en status ok. Geen ledenbron, secrets, migraties of serverbeveiliging gewijzigd.
- Artefacten naast Git: `../design-preview/student-final/student-portal-acceptance.json` (lokaal), `../design-preview/student-final/live-assets/student-portal-acceptance.json` en zes screenshots per ronde.
- Herhaalbare scripts: `scripts/check-pass-qr.mjs` en `scripts/check-student-portal-flows.cjs`. Browsercontrole vereist een apart beschikbare Playwright-installatie; NODE_PATH kan die aanwijzen. Live-assetcontrole vereist expliciet STUDENT_TEST_LIVE_READONLY=1 en accepteert uitsluitend de vaste productiehost. API wordt ook dan volledig gesimuleerd.

## Nog niet afgetekend

### Aanvullende beheercontrole en passtatus

Het bestaande eigenaaraccount bereikt het echte beveiligingsoverzicht vanaf het toegestane netwerk. De bekende teststudent staat actief, zonder actieve sessies of open waarschuwingen. De Chrome-extensie liep vast bij de native bevestigingsdialoog voor tijdelijk blokkeren; daarom is intrekken/herstellen niet afgetekend. Een nieuwe tab heeft daarna opnieuw de actieve status bevestigd. Er is geen nieuwe registratie, verificatieverzoek of e-mail verstuurd. Geen persoonsgegevens of toegangscodes opgenomen in dit verslag.

De codecontrole vond daarnaast een verkeerde studentenmelding: een geschorste pas toonde de tekst voor een verlopen pas en een nieuwe aanvraag die de server weigert. De UI onderscheidt deze situaties nu in NL/EN/DE: blokkade geeft uitleg over de eventuele controle en contact met de winkel, zonder heraanvraag of QR; een verlopen pas houdt de verlengingsmogelijkheid. De kaartkop kan op mobiel afbreken. Het bestaande geïsoleerde browserscript controleert beide statussen op 390 en 1440px. Serverbeleid en database blijven gelijk.

1. Fysiek iOS-toestel: Safari, beginscherminstallatie, opnieuw openen, uitloggen/intrekken en opnieuw aanmelden. Een desktopemulatie is geen bewijs hiervan.
2. Echte eigenaar/beheeracceptatie met een gecontroleerde teststudent: intrekken/herstellen en kassascan. Niet uitvoeren op willekeurige klantaccounts.
3. Nieuwe werkelijke registratie-mailontvangst na de laatste mailwijziging. Eerdere SPF/DKIM/DMARC PASS en inboxontvangst zijn geen garantie voor toekomstige inboxplaatsing.
4. Publieke lancering blijft afzonderlijk besluit; site blijft gesloten. Eigenaarinput voor echte foto's, actuele productetiketten, overige GBP-gegevens en Search Console-toegang blijft staan in de SEO-audit. Geen betaalde Walletactivering nodig voor de huidige scope.
