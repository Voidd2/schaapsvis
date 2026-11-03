# E-mailbezorging — audit en vervolgstappen

Bijgewerkt op 3 november 2026 aan de hand van DNS, echte Gmail-ontvangsten en de SMTP-broncode.

## Nieuwe bezorgcontrole — 3 november 2026, 21:38 UTC

De eigenaar gaf toestemming voor precies één nieuw testbericht. Dat is éénmaal verstuurd via Knoth (`khsm1.khsmserver1.nl:587`, geverifieerde STARTTLS) met de huidige `actionEmail`-template en `makeMessage`-MIME uit de projectbron. Geen echte accountaanmaak, code, campagne, tracking of wijziging aan productie-instellingen. SMTP accepteerde het om 21:38:42 UTC; Gmail ontving het om 21:38:44 UTC.

**Resultaat: Spam, niet Postvak IN.** Het originele Gmail-bericht toont SPF PASS voor 91.220.37.174, DKIM PASS met domein schaapsvishandel.nl en selector x, en DMARC PASS. Beide transportdelen gebruikten TLS 1.3. De huidige Auto-Submitted- en X-Auto-Response-Suppress-headers zijn aanwezig; HTML en platte tekst zijn correct ontvangen. Gmail meldt dat het bericht lijkt op eerder als spam geïdentificeerde berichten. Dit bewijst geen afzonderlijke oorzaak zoals IP-reputatie of inhoud: Gmail geeft die uitsplitsing hier niet.

Deze test gebruikt de bestaande mailserver vanaf de lokale machine; hij bewijst niet dat een volledige registratie vanuit de Cloudflare Worker nu is doorlopen. Betrouwbare inboxplaatsing is niet afgetekend. De ene toestemming is verbruikt; niet opnieuw verzenden zonder akkoord. Er zijn geen Gmail-filters aangemaakt of labels verplaatst om de uitkomst te veranderen.

Bewijs buiten Git: `../design-preview/student-admin/delivery-attempt.json`, `delivery-test.eml`, `mail-spam-proof.png` en `mail-auth-proof.png`. Geen volledige headers, privé-adressen of geheimen in Git.

De eigenaar wil voorlopig alleen intern onderzoek; Knoth is niet benaderd. Een eventueel later serveronderzoek blijft een concept. Een ander lokaal afzenderadres of strengere DMARC-policy is op basis van deze PASS-resultaten geen bewezen oplossing. Een volgende volledige registratie-/inboxtest vraagt nieuwe verzendtoestemming en moet de oorspronkelijke classificatie vastleggen voordat iemand het bericht als Geen spam markeert.

## Conclusie

### Afzenderherkenning na de nieuwe test

PR95: main a9f0143, Cloudflare leden8f697caa en sitea720cb6d beide Ready/100%; Build249/Member149 groen, Codex-review zonder bevindingen.

De SMTP-berichten krijgen twee vaste, correct UTF-8-gecodeerde zichtbare afzendernamen: `Schaap’s Vishandel – Accounts` voor transactionele berichten en `Schaap’s Vishandel – Aanbiedingen` voor campagnes met de bestaande afmeldheaders. Het mailboxadres, SMTP-envelope, authenticatie en Reply-gedrag blijven gelijk. De namen bevatten geen klantinvoer of onderwerptekst. Dit vult het herkenningspunt uit het uitvoerplan in; het is geen bewezen remedie tegen Spam. De nieuwe naam is uitsluitend lokaal getest, niet met een nieuwe echte verzending.

De SMTP-test decodeert beide From-headers, controleert één afzender en het ongewijzigde envelope-adres. STARTTLS-, UTF-8-, afmeldheader- en volledige ledenintegratietests slagen. Google vraagt om consistente, duidelijke afzenderidentiteit en noemt gedeelde IP-reputatie als afzonderlijk bezorgingsrisico: [officiële verzendrichtlijnen, gecontroleerd 3 november](https://support.google.com/mail/answer/81126?hl=en).

### Gevonden fout in eigen headers

Na de opdracht om eerst eigen oorzaken te onderzoeken is de huidige MIME-uitvoer rechtstreeks gemeten. Het werkelijke Nederlandse verificatieonderwerp levert één encoded-word van92 tekens en een Subject-regel van101 tekens. RFC2047 begrenst dit tot respectievelijk75 en76. De herkenbare From-naam uit PR95 geeft een regel van93 tekens en moet eveneens worden gevouwen. Zie [RFC2047 §2](https://www.rfc-editor.org/rfc/rfc2047).

De encoder is gecorrigeerd: maximaal 39 UTF-8-bytes per woord, alleen splitsen tussen volledige Unicode-codepunten, continuation lines met CRLF+spatie. Ook lange ASCII-onderwerpen worden veilig gecodeerd en gevouwen. Het mailboxadres verhuist naar een continuation line zonder envelope- of authenticatiewijziging. De test decodeert elk woord met een strikte UTF-8-decoder en vergelijkt de volledige tekst, inclusief lange onderwerpen, NL/EN/DE, emoji/CJK en een poging tot headerinjectie.

PR96 is live als `2dd048b`: Build251 en Member151 geslaagd, Codex-review zonder bevindingen. Cloudflare leden `a8a2b2e9` en site `3b8085d3` beide Ready/100%; de leden-healthroute geeft HTTP200/status ok. Geen nieuwe echte mail verstuurd na deze wijzigingen.

Dit is een aangetoonde interoperabiliteitsfout in onze code. De laatste ontvangen test had een kort ASCII-onderwerp en nog geen displaynaam; deze fout bewijst dus niet de oorzaak van zijn Spam-classificatie. Geen nieuwe mail gestuurd. De eigenaar heeft het supportbericht geweigerd; het concept blijft uitsluitend lokaal buiten Git in `../design-preview/student-admin/knoth-mailonderzoek-concept.md`.

De Knoth-mailserver is correct gekoppeld en de drie belangrijkste controles
slagen bij Gmail:

- SPF: `pass` voor `schaapsv@schaapsvishandel.nl` en `91.220.37.174`;
- DKIM: `pass`, ondertekend met `d=schaapsvishandel.nl` en selector `x`;
- DMARC: `pass`, met uitlijning op `schaapsvishandel.nl`.

Een nieuw afzenderadres lost de eerdere spamplaatsing daarom niet vanzelf op.
De ontvangende server, het domein en de verzend-IP blijven dan hetzelfde.

## Waargenomen gedrag

De eerste reeks van 27 oktober bestond uit meerdere, vrijwel gelijktijdige en
zeer korte berichten (accountcode, schoolcode en toen nog een losse
e-maildealsbevestiging). Gmail plaatste die berichten in Spam. Een latere
wachtwoord-resetmail van dezelfde afzender en dezelfde server kwam wel in
Postvak IN. Beide berichten hadden SPF, DKIM en DMARC `pass`.

Dit ondersteunt de gekozen oplossing:

- registratie verstuurt alleen de twee noodzakelijke verificatieberichten;
- e-maildeals gebruiken single opt-in en veroorzaken geen extra bevestigingsmail;
- transactionele mails krijgen herkenbare Schaap's-opmaak en duidelijke inhoud;
- campagnes krijgen een zichtbare afmeldlink plus `List-Unsubscribe` en
  `List-Unsubscribe-Post: List-Unsubscribe=One-Click`.

## DNS- en serverstatus

- MX: `mail.schaapsvishandel.nl` (voorkeur 10);
- mailserver: `91.220.37.174`;
- SPF: `v=spf1 a mx ip4:91.220.37.174 ~all`;
- DKIM-selector: `x._domainkey.schaapsvishandel.nl`;
- DMARC: `v=DMARC1; p=none`;
- PTR: `91.220.37.174` verwijst naar `khsm1.khsmserver1.nl` en dat adres wijst
  weer terug naar dezelfde IP.

De PTR is dus forward-confirmed. De publieke servernaam is niet gelijk aan de
SMTP-clientnaam `mail.schaapsvishandel.nl`, maar Gmail accepteert en
authenticeert de huidige verzending. Er is nu geen reden om een riskante DNS-
of mailserverwijziging uit te voeren.

## Vervolg na voldoende echte verzending

1. Markeer alleen legitieme testmails als `Geen spam` en stuur niet meerdere
   tests kort achter elkaar.
2. Bewaak bounces, klachten en afmeldingen voordat campagnes groter worden.
3. Gebruik bij voldoende volume Google Postmaster Tools voor reputatie-inzicht.
4. Verhoog DMARC pas van `p=none` naar `quarantine` wanneer rapportages aantonen
   dat alle legitieme verzenders structureel SPF- of DKIM-uitlijning halen.
5. De herkenbare afzendernamen zijn inmiddels ingevoerd; controleer bij een
   volgende toegestane echte ontvangst de weergave. Een ander lokaal adres
   blijft vooral voor herkenning, niet als bewezen technische spamoplossing.
