# Studentenpas-fraudebeveiliging

## Uitgangspunten

- Bouw voort op de bestaande accounts, sessies, studentaanvragen, passen en beheerrollen.
- Een signaal is nooit zelfstandig bewijs van fraude. Alleen een beheerder kan een pas blokkeren of een verificatieonderzoek openen.
- Apparaatherkenning gebruikt een willekeurig, servergegenereerd installatiekenmerk. Er wordt geen browserfingerprint gemaakt.
- IP-adressen worden niet als apparaatidentiteit opgeslagen. VPN, cookieverwijdering, browserupdates en een nieuwe telefoon zijn hooguit verklaarbare signalen.
- QR-inhoud bevat geen naam, e-mailadres of permanent toegangstoken en wordt telkens kort geldig ondertekend.
- Gezichts-/pasfotoverificatie wordt niet gebouwd of geactiveerd voordat grondslag, doelbinding, bewaartermijn, toegang en een gelijkwaardig alternatief afzonderlijk zijn goedgekeurd.

## Gefaseerde oplevering

### Fase 1 — betrouwbaar fundament

- Sessies: maximaal 365 dagen, herroepbaar, met voortschrijdende activiteit en een absolute einddatum.
- Apparaten: versleuteld-onbruikbaar installatiekenmerk (HMAC), globaal type, OS, browser, browser/PWA-context, eerste en laatste gebruik.
- Gebeurtenissen: gegroepeerde, uitlegbare events met risicopunten en concrete oorzaak.
- Beheerlog: elke ingrijpende beheeractie is herleidbaar tot beheerder, doel en tijdstip.

### Fase 2 — pas en beheer

- Dynamische QR van maximaal twee minuten; servercontrole tegen actuele account-, aanvraag- en passtatus.
- Bestaande korte code blijft als handmatige terugval beschikbaar.
- Dashboard `Studentenpas Beveiliging` met filters, apparaten, sessies, gebeurtenissen en verificatieverzoeken.
- Acties: veilig markeren, sessie/apparaat intrekken, alles uitloggen, pas blokkeren/herstellen, extra verificatie vragen en detectieregels vrijstellen.

### Fase 3 — extra verificatie en meldingen

- Eenmalige e-mailcode, hernieuwde schoolmail/studentstatus en controle aan de kraam.
- In-accountmelding met neutrale uitleg; beheerder kiest of de pas actief blijft of tijdelijk wordt geschorst.
- Gegroepeerde dashboardmeldingen; alleen nieuwe gebeurtenissen met hoge ernst sturen direct een e-mail.
- Drempels worden server-side configureerbaar met veilige standaardwaarden.

## Standaard risicoregels

| Gebeurtenis | Standaard | Automatische blokkade |
| --- | ---: | --- |
| Eerste apparaat | 0 punten, registreren | Nee |
| Derde nieuw apparaat in 7 dagen | 25 punten, waarschuwing | Nee |
| Twee apparaten kort na elkaar actief | 20 punten, waarschuwing | Nee |
| Herhaald nieuwe apparaten toevoegen | 35 punten, handmatige controle | Nee |
| Gebruik ingetrokken sessie | 50 punten, hoog signaal | Nee |
| QR-/inloglimiet overschreden | 30 punten, rate limit | Nee |

De totaalscore is een hulpmiddel: het dashboard toont altijd de onderliggende gebeurtenissen en nooit alleen een label.

## Bewaar- en toegangskeuzes

- Installatiekenmerken worden alleen gehasht opgeslagen.
- Vrije apparaatnamen zijn optioneel en maximaal 80 tekens.
- Gebeurtenissen bevatten alleen een beperkte JSON-context zonder persoonsgegevens of ruwe IP-adressen.
- Alleen de bestaande beheerallowlist én IP-allowlist krijgt toegang tot beveiligingsbeheer.
- Afgehandelde beveiligingsgebeurtenissen en verlopen verificatieverzoeken krijgen een aparte retentie-opruiming.

## Externe of juridische afhankelijkheden

- Apple/Google Wallet blijven afhankelijk van de eerder beschreven issuer- en certificaatconfiguratie.
- Een echte iOS Safari/PWA-installatietest vereist een fysiek Apple-apparaat.
- Fotoverificatie blijft uit tot een afzonderlijke privacy- en rechtmatigheidsbeoordeling is afgerond.
