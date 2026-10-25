# Schaap's account- en studenten-API

Deze Worker is de serverkant voor algemene accounts, e-mailbevestiging, wachtwoordherstel, studentenaanvragen, beoordeling, de kortingspas en dubbele opt-in voor e-mailaanbiedingen. De site blijft eigenaar van de pagina's; de Worker verwerkt de gevoelige gegevens.

## Huidige status

- Dit is de afzonderlijke account-/studenten-Worker, niet de website-Worker. De website-Worker `schaapsvis` is inmiddels op de apex `https://schaapsvishandel.nl` aan Cloudflare gekoppeld. De account-Worker zelf is nog niet gedeployed; D1-migraties, R2-buckets, mailverzending en beheerderstoegang moeten nog per omgeving worden geverifieerd. De historische voorbereiding staat hieronder; actuele domein- en accounttoegangspunten staan in [`../../docs/cloudflare-migration-status-2026-10-24.md`](../../docs/cloudflare-migration-status-2026-10-24.md). De twee R2-bindings vereisen `jurisdiction: "eu"`; maak de buckets met die jurisdiction aan en controleer de onveranderlijke instelling.
- `wrangler.jsonc` bevat de D1-ID's. Email Sending werkt pas nadat Cloudflare DNS actief is en `schaapsvishandel.nl` in Email Service is ge-onboard; het afzenderadres moet op dat domein vallen. Na onboarding en met Workers Paid kan de binding willekeurige ontvangers mailen; voordien alleen geverifieerde bestemmingsadressen. Controleer de DNS-records in het dashboard en behoud de bestaande mailconfiguratie. Wijzig zowel `MAIL_FROM` als `allowed_sender_addresses` als een ander afzenderadres wordt gekozen. Beheer vereist zowel een bevestigd account op `ADMIN_EMAILS` als een overeenkomend Cloudflare `CF-Connecting-IP` in `ADMIN_IPS`; stel beide uitsluitend als Worker-secrets in.
- `MEMBERS_ENABLED` staat in preview en productie standaard op `off`. Cloudflare-routes kunnen de Next.js-passcode omzeilen; zet deze schakel pas op `on` nadat de site openbaar mag zijn en alle diensten zijn geverifieerd.
- De nieuwsbrief-cron controleert dezelfde schakel en blijft volledig inactief zolang `MEMBERS_ENABLED` niet `on` is; ook een eventueel achtergebleven campagne wordt dan niet verwerkt.
- De bewijsbucket moet privé blijven. Koppel geen publieke custom domain aan `STUDENT_PROOFS`.
- De bewijsbucket hoort vanwege studentgegevens in de EU-jurisdictie. De binding vraagt daarom expliciet `jurisdiction: "eu"`; controleer deze onveranderlijke bucketinstelling bij het aanmaken. Een EU-locatiehint is niet gelijk aan de EU-jurisdictiegarantie ([Cloudflare R2 data location](https://developers.cloudflare.com/r2/reference/data-location/)).
- Login-, wachtwoordreset-, bevestigingsmail- en nieuwsbriefverzoeken hebben afzonderlijke limieten per IP-adres en per e-mailadres. Accountgerichte tellers zijn HMAC-gehasht met `AUTH_PEPPER`, zodat e-mailadressen niet als rate-limit-sleutel in D1 worden opgeslagen.
- Er is geen R2 lifecycle-/retentieregel ingesteld. Na een beoordeling probeert de Worker het bewijs direct te verwijderen; bij een fout probeert de cron dit opnieuw (maximaal 20 beoordeelde bewijzen per run) en kan een beheerder ook handmatig opnieuw proberen. Voor uploads wordt eerst een D1-opruimrij aangemaakt. Als de aanvraagtransactie én directe R2-verwijdering falen, probeert de cron het na een uur opnieuw (maximaal 20 weesbestanden per run); gekoppelde bewijzen worden nooit door deze weesopruiming verwijderd. Kies geen automatische bewaartermijn voor beoordeelde documenten zonder privacybesluit.
- Plan Workers Paid vóór activering: e-mail aan willekeurige ontvangers vereist dit volgens Cloudflare. Free Workers hebben 10 ms CPU per invocation; Paid heeft standaard 30 seconden (maximaal 5 minuten configureerbaar). De Worker stelt expliciet 30 seconden in en gebruikt PBKDF2 met 210.000 iteraties voor wachtwoorden. Bevestig registratie en login op een echte preview en controleer de gerapporteerde CPU-tijd voordat de service wordt aangezet.
- Sessiecookies zijn host-only; preview en productie delen geen login-cookie.
- De account-Worker is pas bereikbaar zodra de exacte `api/members/*`-route op de Cloudflare-zone naar deze Worker is gepubliceerd. De actuele route moet overeenkomen met `workers/members/wrangler.jsonc`; de `www`-host heeft op dit moment geen DNS-record. De site-hosting is al Cloudflare, maar deze aparte account-Worker is nog niet live.

## Nog uit te voeren Cloudflare-stappen

1. DNS-migratie van de website is inmiddels actief: de autoritatieve nameservers zijn Cloudflare en de apex Worker werkt. Zie de actuele statusnotitie voor de live DNS-snapshot. Vóór verdere DNS-wijzigingen: exporteer de zone, controleer mail (MX/SPF/DKIM/DMARC) en voeg alleen de ontbrekende `www`-route toe. Importeer nooit gescande `localhost`-records. De Cloudflare API-koppeling kan momenteel alleen het andere account zien, dus voer geen wijzigingen uit via die koppeling totdat account Schaapsvis zichtbaar is.
2. Schakel R2 in via het Cloudflare-dashboard. Maak daarna de twee bewijsbuckets met EU-jurisdictie aan en controleer beide instellingen vóór gebruik:

   ```sh
   npx --yes wrangler@4.151.1 r2 bucket create schaapsvis-student-proofs-preview --jurisdiction eu
   npx --yes wrangler@4.151.1 r2 bucket create schaapsvis-student-proofs --jurisdiction eu
   npx --yes wrangler@4.151.1 r2 bucket info schaapsvis-student-proofs-preview --jurisdiction eu --json
   npx --yes wrangler@4.151.1 r2 bucket info schaapsvis-student-proofs --jurisdiction eu --json
   ```

   Maak beide buckets privé: geen `r2.dev`-publieke URL en geen custom domain. De jurisdictie is na aanmaak niet wijzigbaar; controleer dus expliciet dat de API `eu` teruggeeft. Zie [Cloudflare R2-jurisdicties](https://developers.cloudflare.com/r2/reference/data-location/#jurisdictional-restrictions) en [Wrangler R2-commando's](https://developers.cloudflare.com/workers/wrangler/commands/r2/).
3. De preview- en productie-D1-ID's staan in `wrangler.jsonc`; beide zijn EU-databases. De laatst gecontroleerde remote databases bevatten `0001` t/m `0004`; lokale migraties `0005` t/m `0009` zijn nog niet remote toegepast. Controleer vóór een Worker-uitrol alle remote migratiestatussen en pas alleen na een expliciete preview-/productieplanning de benodigde migrations toe met `npx wrangler d1 migrations apply schaapsvis-members-preview --config workers/members/wrangler.jsonc --env preview --remote` (en later de afzonderlijke productieopdracht). De nieuwe statistiektabel uit 0009 is nodig voor het dashboard.
4. Zodra Cloudflare DNS voor het domein actief is, onboard je `schaapsvishandel.nl` in **Email Service → Email Sending**. Controleer de gegenereerde SPF-, DKIM-, DMARC- en bounce-records en behoud alle bestaande mailrecords. De `EMAIL`-binding staat al in Wrangler; na onboarding mag `noreply@schaapsvishandel.nl` naar willekeurige ontvangers sturen met Workers Paid. Daarvóór kan Email Service alleen naar geverifieerde bestemmingsadressen sturen. De huidige API-verbinding kan Email Sending-status niet lezen (2036 Unauthorized), dus verifieer dit in het dashboard. Stel daarna `AUTH_PEPPER` en `PASS_SIGNING_KEY` in met Wrangler en gebruik per omgeving verschillende willekeurige secrets.
5. Stel `ADMIN_EMAILS` en `ADMIN_IPS` als secrets in per omgeving. `ADMIN_EMAILS` bevat alleen bevestigde beheeraccounts; `ADMIN_IPS` bevat de toegestane IPv4/IPv6-adressen, komma-gescheiden. De Worker controleert beide bij ieder adminverzoek met het door Cloudflare gezette `CF-Connecting-IP`; een zelf ingestelde browserheader telt niet. Een dynamisch IP-adres moet worden bijgewerkt wanneer het verandert. Geen beheerder wordt aangemaakt op basis van een formulier.
6. De opt-in statistieken staan standaard uit (`ANALYTICS_ENABLED` ontbreekt of is niet `on`). Voer migratie 0009 eerst uit op preview en productie. De site slaat na toestemming alleen geaggregeerde dagtotalen per openbare pagina en klikdoel op; queryparameters en afgeschermde routes worden geweerd. De cron verwijdert dagtotalen ouder dan 395 dagen en rate-limit-hashes na 30 dagen. De statistieken geven geen individuele bezoekerfunnels of exacte uitvalmomenten.
7. Houd `MEMBERS_ENABLED=off` totdat de site bewust publiek mag zijn. Zet de schakel alleen lokaal of op een geïsoleerde preview tijdelijk op `on` om registratie, bevestiging, login/logout, reset, upload en verwijdering van bewijs, goed-/afkeuren, pascontrole, nieuwsbriefbevestiging en afmelding te testen. `ANALYTICS_ENABLED` is een afzonderlijke keuze en blijft uit totdat de privacytekst en toestemming zijn goedgekeurd.
8. Voer pas na de volledige preview- en privacycontrole een productie-uitrol uit; activeer `MEMBERS_ENABLED` niet zolang de site achter het wachtwoordslot hoort te blijven.

## Lokale checks

```powershell
npm run check:members
npx wrangler d1 migrations apply schaapsvis-members-preview --config workers/members/wrangler.jsonc --env preview --local --persist-to workers/members/.wrangler-preview
npx wrangler dev --config workers/members/wrangler.jsonc --env preview --local --persist-to workers/members/.wrangler-preview
```

De `--local`-vlag is essentieel: de previewconfiguratie bevat een remote Email Service-binding. Met `--local` blijven D1 en R2 lokaal en wordt e-mail alleen gesimuleerd; zonder die vlag kan e-mail echt worden verstuurd. De twee commando's gebruiken dezelfde lokale opslagmap, los van de Cloudflare-databases.

Maak voor handmatige lokale tests een niet-gecommitte `workers/members/.dev.vars.preview` met `MEMBERS_ENABLED="on"`, `SITE_ORIGIN="http://localhost:8787"`, `MAIL_FROM`, `ADMIN_EMAILS`, `AUTH_PEPPER` en `PASS_SIGNING_KEY`. Gebruik alleen aparte testwaarden, nooit productiegeheimen. Laat `MEMBERS_ENABLED` in preview en productie uit totdat de site bewust publiek mag zijn. Gebruik geen echte studentbewijzen of persoonsgegevens in fixtures.

De integratietest met `npm run check:members` gebruikt eigen tijdelijke database- en e-mailmocks; daarvoor zijn geen Cloudflare-account, remote bindings of `.dev.vars` nodig.

## Open bedrijfs- en privacykeuzes

- De 10% geldt uitsluitend op gebakken kibbeling, haring, broodjes haring en drinken. Andere gebakken vis, visschalen en alle overige producten zijn uitgesloten. Stapeling met andere acties is nog niet afgesproken.
- De formele bewaartermijn voor aanvraagmetadata en procedure voor inzage/verwijdering.
- De uiteindelijke privacyverklaring, verantwoordelijke beoordelaars en geverifieerde afzender.

De pas geeft 10% korting uitsluitend op kibbeling, haring, broodjes haring en drinken. Andere gebakken vis, visschalen en overige artikelen zijn uitgesloten. Een goedgekeurde pas is één studiejaar geldig; daarna kan de student met nieuw bewijs opnieuw aanvragen.

## Lokale voortgang 21 oktober 2026

De accountregistratie vraagt persoonlijk e-mailadres + schoolmail + wachtwoord.
Twee afzonderlijke 6-cijferige codes moeten binnen 10 minuten worden ingevoerd;
codes worden HMAC-gehasht, zijn eenmalig en rate limits begrenzen raden. De
studentenaanvraag endpoint eist server-side dat beide adressen bevestigd zijn.
Migraties 0006-0008 horen bij deze lokale wijzigingen en staan nog niet op
remote D1.

De klanteninschrijving bewaart eerst tijdelijk een e-maildraft, daarna kiest
de klant regio en geeft apart expliciet toestemming. Alleen dubbelbevestigde
subscriptions worden verzonden. Drafts verlopen na 30 minuten en worden door
scheduled cleanup verwijderd. Regio-tags: Leiden, Voorschoten, Wassenaar,
Leidschendam, elders in regio 071 en elders. Leeftijd/geboortedatum wordt niet
verzameld.

Klaviyo is nog niet gekoppeld. Bij een latere koppeling blijven bevestigde
toestemming en afmelding in deze Worker leidend. Er is niets gedeployed; de
accountswitch blijft uit.
