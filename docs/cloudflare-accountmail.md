# Cloudflare-accountmail — 5 november 2026

## Keuze en scope

De eigenaar kiest Cloudflare Email Sending voor verificatie, wachtwoordherstel,
inloglinks en beveiligingsmeldingen. Reclame volgt vermoedelijk over drie maanden
via een afzonderlijke marketingdienst. De bestaande expliciete inschrijvingen,
toestemmingsregistratie, segmenten en afmeldingen blijven behouden. Geen campagnes
versturen en geen accounts of mailboxen migreren/verwijderen.

Workers Paid is na expliciet akkoord op de checkout geactiveerd: $5 USD per maand
plus meerverbruik, zonder harde kostenstop. Het dashboard bevestigde Purchase
complete. Email Sending omvat 3.000 berichten per maand; daarna $0,35 per 1.000.
Een andere verzender garandeert geen Gmail-inboxplaatsing.

## Implementatie

- Productie gebruikt expliciet `MAIL_TRANSPORT=cloudflare` en binding `EMAIL`,
  beperkt tot afzender `account@berichten.schaapsvishandel.nl`. Antwoorden gaan naar de
  bestaande zakelijke mailbox. De herkenbare afzendernaam en beide berichtdelen
  blijven behouden; Cloudflare genereert MIME, DKIM en transportheaders.
- Bestaande SMTP-secrets kunnen de selectie niet overschrijven. Bij ontbrekende
  binding of een verzendfout volgt geen automatische SMTP-fallback.
- `NEWSLETTER_DELIVERY_ENABLED=off` pauzeert zowel nieuwe verzendopdrachten als
  de wachtrij. Cloudflare-transport weigert campagnes bovendien afzonderlijk.
  Concepten, abonnementen en afmeldingen blijven bruikbaar; beheer toont de pauze
  in NL/EN/DE. Er is geen timer die campagnes na drie maanden vanzelf activeert.
- Losse preview blijft uitgeschakeld en gebruikt de bestaande SMTP-configuratie.
- Geen databasewijziging nodig. Sitepoort, accountrollen en IP-controle blijven.

## Controles en uitrol

- Ledenintegratietests en SMTP-protocoltest geslaagd, uitsluitend lokale mocks.
  Nieuwe controles: foutieve provider, ontbrekende binding, behouden SMTP-secret,
  herkenbare afzender, campagneweigering, onveranderde inschrijvingen en een
  gepauzeerde wachtrij zonder verbruikte pogingen.
- TypeScript, gerichte ESLint en Next-productiebuild (572 pagina's) geslaagd.
  De eerste losse TypeScript-run had verouderde `.next`-routetypen; de build
  genereerde deze opnieuw, waarna de losse controle ook slaagde.
- Wrangler 4.151.1 production dry-run geslaagd; EMAIL-binding en afzenderbeperking
  worden herkend. Dit is nog geen bewijs van echte aflevering.
- Het nieuwe verzenddomein toont Sending status Enabled en DNS Configured.
- Cloudflare/Vinext-build en inhoudscontrole zijn eveneens geslaagd.
- PR #105 / merge `8aa4b91`: GitHub Build265 en Member159 geslaagd, Codex-review zonder bevindingen. Cloudflare site `adca3ad8` 100% Ready en ledenbuild `c781e815` Ready. Na de tijdelijke diagnostische instellingen is ledenversie `fe1ac418` 100% Ready met diagnostiek weer uit.
- De ene expliciet toegestane test vanuit de echte productie-leden-Worker gaf HTTP202 op 5 november 2026 om 00:18 CET. Gmail plaatste deze in **Inbox**, bezorgd na 5 seconden. SPF PASS (104.30.16.173), DKIM PASS voor berichten.schaapsvishandel.nl en DMARC PASS. Cloudflare toont 1/200 dagquotum en 100% aflevering. De daglimiet is de actuele onboardinglimiet; dit is geen maandelijkse kostenstop.
- Geen account/inschrijving aangemaakt en geen Gmail-labels gewijzigd. De diagnostische mail gebruikt een eenvoudige testinhoud met historische tekst “SMTP-bezorgtest”, maar de ontvangen headers bewijzen Cloudflare-transport. Dit is geen volledige registratiestroomtest en geen garantie voor alle toekomstige berichten.
- Live instellingen gecontroleerd: Cloudflare-provider, EMAIL-binding, campagnes uit en `SMTP_DIAGNOSTICS=off`. Het tijdelijke testadres is bij uitgeschakelde diagnostiek inert; een volgende configdeploy verwijdert die niet in Git opgenomen variabele. Geen extra mail versturen zonder nieuw akkoord.
- Bewijs buiten Git: `../design-preview/cloudflare-email/gmail-inbox.png`, `gmail-authentication.png`, `sending-live.png`; lokale sendguard voorkomt onbedoelde herhaling van deze test.

## DNS en terugval

Gebruik Email Sending op `berichten.schaapsvishandel.nl`, niet Email Routing.
Het root-voorstel met DMARC p=reject is door automatische goedkeuringscontrole
geblokkeerd wegens de bestaande p=none-policy. De veiligere inrichting gebruikt
een nieuw verzendsubdomein en wijzigt deze bestaande root-policy niet. Behoud de root-MX naar Knoth, het
bestaande SPF-record en de Knoth-DKIM-selector. Voeg alleen de door Cloudflare
opgegeven verzendrecords toe en controleer op een bestaand DMARC-record voordat
de onboarding iets aanmaakt. Knoth blijft de host voor inkomende mail.

Bij een noodzakelijke expliciete rollback: zet productie `MAIL_TRANSPORT=smtp`
en `MAIL_FROM=schaapsv@schaapsvishandel.nl`, behoud `NEWSLETTER_DELIVERY_ENABLED=off`
en de bestaande versleutelde SMTP-secret. Publiceer daarna opnieuw; geen verborgen
fallback na een mogelijk al geaccepteerd bericht.

## Bronnen

- https://developers.cloudflare.com/email-service/get-started/send-emails/
- https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
- https://developers.cloudflare.com/email-service/configuration/send-bindings/
- https://developers.cloudflare.com/email-service/configuration/domains/
- https://developers.cloudflare.com/email-service/reference/headers/
- https://developers.cloudflare.com/email-service/platform/pricing/

## Postmaster

Google Postmaster bevestigde `schaapsvishandel.nl` als geverifieerd. Het bestaande
Google TXT-record was al correct; geen tweede verificatierecord toegevoegd.
Het rapport heeft nog onvoldoende volume voor reputatiegegevens. Dit is geen
inboxgarantie of supportticket bij Gmail.
