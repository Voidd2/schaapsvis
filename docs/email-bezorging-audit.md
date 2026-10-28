# E-mailbezorging — audit en vervolgstappen

Gecontroleerd op 28 oktober 2026 aan de hand van DNS en echte Gmail-ontvangsten.

## Conclusie

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
5. Overweeg later herkenbare afzendernamen (bijvoorbeeld `Schaap's account` en
   `Schaap's aanbiedingen`); een ander lokaal adres is vooral voor herkenning,
   niet als technische spamoplossing.
