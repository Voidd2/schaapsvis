# Uitvoerplan — studentenaccount, e-mail en digitale pas

Vastgelegd op 27 oktober 2026 na een volledige test van de huidige registratie,
studentenaanvraag, kortingspas en wachtwoordreset. Dit document is de leidende
scope voor de komende releases. Voer de fasen op volgorde uit en maak per fase
een aparte pull request, migratie en live controle.

## Besluiten van de eigenaar

- Een account gebruikt een **privé-e-mailadres** voor inloggen en een apart
  **schooladres** uitsluitend om de studentenstatus te bevestigen.
- De registratie vraagt **voornaam en achternaam** afzonderlijk.
- Een student hoeft niet in Leiden te studeren. De aanvraag vraagt de
  onderwijsinstelling, het niveau en de **stad van de opleiding**.
- Een bevestigd schooladres is voldoende studentenbewijs. Nieuwe aanvragen
  vragen geen inschrijfbewijs, upload of toestemming voor bewijsverwerking.
- Na bevestiging van beide e-mailcodes wordt de gebruiker meteen ingelogd en
  verschijnt direct de aanvraag voor studentenkorting.
- De studentenkorting is 10% op het hele assortiment en is niet te combineren
  met andere acties.
- De accountpagina belooft geen bezorging of spaarpunten. Die functies vallen
  buiten de huidige scope.
- E-mailaanbiedingen gebruiken **single opt-in**: na een duidelijke,
  afzonderlijke toestemming bij het formulier wordt de inschrijving direct
  actief. Er volgt geen extra bevestigingsmail en geen losse mail met alleen
  een afmeldlink. Iedere echte campagne bevat wel een werkende afmeldlink.
- De digitale pas toont de volledige naam, het Schaap's-beeldmerk, geldigheid,
  een korte controlecode en een QR-code. De lange ondertekende code wordt niet
  meer leesbaar op de pas getoond.

## Randvoorwaarden voor toestemming en e-mail

Single opt-in betekent niet dat ieder willekeurig ingevuld e-mailadres zonder
context reclame mag ontvangen. Het formulier moet bij de verzendknop duidelijk
zeggen dat het adres voor aanbiedingen wordt ingeschreven. Bij accountregistratie
blijft marketing een afzonderlijke keuze; het aanmaken van een account is niet
automatisch marketingtoestemming. De server bewaart minimaal:

- genormaliseerd e-mailadres;
- datum en tijd in UTC;
- versie van de getoonde toestemmingstekst;
- bron van de inschrijving, bijvoorbeeld `account-registration` of
  `newsletter-form`;
- gekozen regio en, waar van toepassing, het gekoppelde account;
- actuele status en datum van afmelding.

Zo blijft toestemming aantoonbaar en kan een gebruiker zich bij iedere campagne
met één handeling afmelden. Laat de definitieve publieke teksten vóór het openen
van de site nog juridisch beoordelen. Relevante basisinformatie:
[Autoriteit Persoonsgegevens — direct marketing](https://autoriteitpersoonsgegevens.nl/themas/internet-telefoon-tv-en-post/direct-marketing).

## Fase 1 — registratie en aanvraag vereenvoudigen

Doel: een nieuwe student voltooit registratie en aanvraag zonder onnodige mail,
herlogin of bewijsupload.

### Database

Nieuwe migratie, zonder bestaande data te verwijderen:

- voeg `first_name` en `last_name` toe aan `users`;
- vul bestaande records veilig terug vanuit `full_name` en behoud `full_name`
  tijdelijk voor compatibiliteit;
- voeg `study_city` toe aan `student_applications`;
- maak de oude bewijsvelden nullable waar dat nog niet zo is;
- bewaar bestaande R2-bewijzen volgens de huidige verwijderprocedure, maar maak
  geen nieuwe bewijsobjecten meer.

### Worker

- valideer voor- en achternaam afzonderlijk en stel `full_name` server-side
  samen;
- laat `verify-codes` na succesvolle bevestiging direct een beveiligde
  sessiecookie aanmaken;
- zet een gekozen marketinginschrijving pas op `subscribed` nadat het persoonlijke
  adres is bevestigd, zonder `newsletter_confirm`-token of extra mail;
- laat de openbare e-mailinschrijving na de expliciete toestemmingsstap direct
  `subscribed` worden en stuur geen bevestigingsmail;
- accepteer bij een studentenaanvraag alleen instelling, opleidingsniveau en
  studiestad; vereis server-side nog steeds een bevestigd schooladres;
- verwijder R2 uit de nieuwe aanvraagroute, maar behoud beheer/cleanup voor
  historische uploads zolang die bestaan.

### Website

- labels: `Voornaam`, `Achternaam`, `Privé-e-mailadres (hiermee logt u in)` en
  `E-mailadres van uw onderwijsinstelling`;
- na beide codes: succesmelding, automatische login en direct de aanvraag tonen;
- vervang de Leiden-checkbox door een verplicht tekstveld `Stad van uw opleiding`;
- verwijder uploadveld en bewijs-toestemming;
- verwijder het blok over bezorging en spaarpunten op `/account`;
- pas NL, EN en DE en de privacy-/studentenpagina's tegelijk aan.

### Acceptatie

1. Een nieuwe registratie verstuurt precies twee noodzakelijke berichten: één
   code naar privé en één code naar school.
2. Marketingtoestemming veroorzaakt geen derde of vierde registratiemail.
3. Na twee geldige codes geeft de response een host-only sessiecookie en toont
   dezelfde pagina meteen de aanvraag.
4. Een aanvraag uit elke stad kan worden opgeslagen zonder bestand of R2-write.
5. Inloggen met het schooladres faalt; inloggen met het privéadres werkt.
6. Oude aanvragen en bestaande passen blijven leesbaar.

## Fase 2 — studentenpas en winkelcontrole

Doel: een nette pas voor de student en een snelle, veilige controle voor een
medewerker.

### Pasmodel

- maak bij goedkeuring naast de UUID een willekeurige, unieke korte code van
  bijvoorbeeld acht tekens zonder verwarrende tekens (`0/O`, `1/I`);
- bewaar alleen een hash als de code uitsluitend als geheim bewijs dient, of
  versleutel/beperk toegang als zoeken op de exacte code nodig is;
- de QR-code bevat een HTTPS-verificatielink met een onvoorspelbaar, ondertekend
  token; geen naam, e-mail of andere persoonsgegevens in de QR-inhoud;
- de pas toont naam, 10%, uitgiftedatum, vervaldatum, korte code en logo;
- toon de bestaande lange HMAC-code niet in beeld of in een printbare kaart.

### Medewerkerscontrole

- voeg een beheerpagina toe voor QR-scan en zoeken op exacte korte code;
- zoeken op naam mag alleen voor ingelogde beheerders, met limiet en auditlog;
- het resultaat toont uitsluitend geldig/ongeldig, naam, vervaldatum en 10%;
- intrekken, schorsen en verlopen werken direct door in QR en Wallet;
- rate-limit zowel zoeken als verificatie en log succesvolle en mislukte
  beheeracties zonder de volledige QR-token te bewaren.

### Acceptatie

1. De kaart toont het aangeleverde Schaap's-beeldmerk scherp en zonder vervorming.
2. Een QR-scan op de beheerpagina vindt een actieve pas; een ingetrokken of
   verlopen pas geeft nooit korting.
3. De naam op de pas komt uit voornaam + achternaam van het account.
4. De gebruiker ziet nergens de lange interne token.

## Fase 3 — Apple Wallet en Google Wallet

Wallet is haalbaar, maar niet alleen een vormgevingswijziging. Beide platformen
vereisen een uitgeversconfiguratie en ondertekende passen.

### Apple Wallet

- vereist een Apple Developer-account, Pass Type ID en pass-certificaat;
- genereer een ondertekend `.pkpass`-bestand met logo, naam, korting, vervaldatum
  en QR/barcode;
- voor intrekken en vernieuwen is een Wallet web service met serienummer,
  authenticatietoken en optioneel push-updates nodig;
- distributie kan vanaf de accountpagina en via e-mail, zonder eigen iOS-app.

Bronnen: [Apple Wallet — Get Started](https://developer.apple.com/wallet/get-started/)
en [pass-updates](https://developer.apple.com/documentation/WalletPasses/adding-a-web-service-to-update-passes).

### Google Wallet

- vereist een Google Wallet issuer-account, Google Cloud-project en serviceaccount;
- maak een Generic Pass class en per student een Generic Pass object;
- de knop `Toevoegen aan Google Wallet` gebruikt een server-side ondertekende
  JWT; private sleutels komen uitsluitend in Worker-secrets;
- vóór productie is publishing access van Google nodig; testpassen tonen anders
  `TEST ONLY`.

Bronnen: [Google Generic Pass](https://developers.google.com/wallet/generic)
en [webuitgifte](https://developers.google.com/wallet/generic/web).

### Gezamenlijk ontwerp

Gebruik in beide Wallets hetzelfde interne `student_passes.id` als stabiele
koppeling, maar exposeer nooit dat ID zonder ondertekening. Bewaar platform-ID's
en status in aparte tabellen, zodat een pas kan worden vernieuwd of ingetrokken
zonder het account opnieuw aan te maken. NFC is voor deze korting niet nodig;
QR/barcode is goedkoper en eenvoudiger te controleren.

## Fase 4 — wachtwoordreset en e-mailbezorging

### Resetpagina

- gebruik dezelfde kleuren, typografie, breedte en knoppen als de accountpagina;
- voeg logo, duidelijke uitleg, nieuw wachtwoord + bevestiging, toon/verberg en
  een sterkte-/lengtehint toe;
- valideer beide wachtwoorden ook server-side en toon een nette verlopen-linkpagina;
- behoud eenmalige tokens, één uur geldigheid en het intrekken van bestaande
  sessies na een reset.

### Spamdiagnose

Een nieuw afzenderadres zoals `verificatie@schaapsvishandel.nl` kan de herkenning
verbeteren, maar lost Spam niet zelfstandig op: hetzelfde domein, dezelfde SMTP-
server en dezelfde verzend-IP blijven de reputatie bepalen. Controleer in een
echte Gmail-ontvangst via `Origineel weergeven`:

- SPF: `PASS` en passend bij de envelope sender;
- DKIM: `PASS` met een `d=schaapsvishandel.nl`-handtekening;
- DMARC: `PASS` en uitlijning met het zichtbare From-domein;
- PTR/rDNS en SMTP/EHLO van de gedeelde Knoth-server;
- geen dubbele of vrijwel lege berichten en een consistente afzendernaam;
- campagneberichten bevatten `List-Unsubscribe` en one-click afmelden;
- transactionele verificatie/reset en commerciële campagnes gebruiken
  herkenbare, gescheiden afzendernamen en inhoud.

Verwijder testberichten niet alleen als spam, maar markeer gecontroleerde echte
berichten als `Geen spam`. Bij voldoende volume kan Google Postmaster Tools
reputatie-inzicht geven. Bron:
[Gmail sender guidelines](https://support.google.com/mail/answer/81126?hl=en).

## Release- en testvolgorde

Per fase:

1. één nieuwe branch en één logisch afgebakende migratie;
2. alleen de direct geraakte code en documenten openen;
3. `npm run check:members` en de relevante component-/contentcheck uitvoeren;
4. migratie eerst lokaal en daarna op de juiste D1-omgeving toepassen;
5. GitHub `main` controleren, daarna beide Cloudflare Workers en pas dan de
   echte domeinroute;
6. één gecontroleerde handmatige test met testaccounts, geen echte bewijsstukken;
7. pas daarna de volgende fase starten.

## Model- en tokenkeuze

- Gebruik **Sol High** voor fase 1 en 2, database-migraties, sessies, QR-signing,
  Wallet-signing en beveiligingsreviews.
- Gebruik **Luna Medium** voor vertalingen, microcopy, statische pagina-opmaak en
  visuele verfijning nadat de API-contracten vaststaan.
- Ga voor fase 3 tijdelijk terug naar **Sol High** vanwege certificaten,
  secrets, ondertekening en intrekkingslogica.
- Lees bij vervolgwerk eerst `docs/project-map.md`, daarna dit document en alleen
  het bestand van de actieve fase. Herhaal geen brede repository- of
  concurrentiescan zonder nieuwe aanleiding.

