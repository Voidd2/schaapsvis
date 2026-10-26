# Schaap's account- en studenten-API

Deze Worker is de serverkant voor algemene accounts, e-mailbevestiging, wachtwoordherstel, studentenaanvragen, beoordeling, de kortingspas en dubbele opt-in voor e-mailaanbiedingen. De site blijft eigenaar van de pagina's; de Worker verwerkt de gevoelige gegevens.

## Huidige status

- Gecontroleerd op 26 oktober 2026 in het account **Schaapsvis**: de hoofdsite-worker `schaapsvis` is actief; de aparte account-/studenten-preview-worker `schaapsvis-members-preview` bestaat en is gedeployed. De productie-accountworker `schaapsvis-members` is nog niet gedeployed. Registratie en studentaanvragen zijn dus niet live.
- De preview-worker gebruikt D1 `schaapsvis-members-preview` en de privé-EU-R2-bucket `schaapsvis-student-proofs-preview`. De elf lokale migraties zijn eerder op deze previewdatabase toegepast; productie-D1 is ongemoeid gelaten. De previewbucket is leeg en niet publiek. Controleer vóór productie de productiemigraties apart.
- De preview-worker heeft `MEMBERS_ENABLED=off`; `/api/members/health` antwoordt daarom `disabled`. Dit is bewust fail-closed. De members-API is niet gekoppeld aan de hoofdsite en moet pas na een werkende previewmail- en browserflow worden geactiveerd.
- In Cloudflare staan voor de preview-worker `SITE_ORIGIN=https://preview.schaapsvishandel.nl`, `MAIL_FROM=schaapsv@schaapsvishandel.nl`, `SMTP_HOST=mail.schaapsvishandel.nl`, poort `587` en `SMTP_USERNAME=schaapsv@schaapsvishandel.nl`. `SMTP_PASSWORD` ontbreekt nog; de invoer staat als geheim klaargezet in het Schaapsvis-dashboard. De STARTTLS/PLAIN-protocolintegratietest en leden-worker-tests slagen lokaal, maar er is nog geen echte Knoth-mail verzonden.
- De previewroute is geconfigureerd voor `preview.schaapsvishandel.nl/api/members/*`, maar de hostname heeft geen werkende DNS-resolutie; de `workers.dev`-healthroute is wel bereikbaar. De previewwebsite en de members-API zijn daardoor nog niet end-to-end in één browserflow getest.
- De leden-worker bevat nog geen vastgestelde `ADMIN_EMAILS`/`ADMIN_IPS`-instellingen. Beheerdertoegang tot aanvragen/bewijzen is dus niet operationeel. Stel uitsluitend geverifieerde beheerders en het gewenste IP in nadat preview-login en mail zijn getest.
- De Cloudflare API-koppeling in deze sessie ziet alleen `Admin@haascom.com’s Account`; wijzig accountresources niet via die API-koppeling. Gebruik het geopende dashboard met account **Schaapsvis**.
- De privé-R2-buckets `schaapsvis-student-proofs` en `schaapsvis-student-proofs-preview` zijn aangemaakt in EU-jurisdictie. Cloudflare Email Sending aan willekeurige ontvangers vereist Workers Paid; dit abonnement is niet geactiveerd omdat Cloudflare geen harde kostenstop biedt. Er is gekozen voor Knoth SMTP; er is geen nieuwe betaalde dienst geactiveerd.
- De website staat achter het toegangsslot totdat publicatie bewust wordt goedgekeurd. Verander `MEMBERS_ENABLED` of het site-slot niet op productie als onderdeel van previewtests.
- De nieuwsbrief-cron controleert dezelfde schakel en blijft volledig inactief zolang `MEMBERS_ENABLED` niet `on` is; ook een eventueel achtergebleven campagne wordt dan niet verwerkt.
- De bewijsbucket moet privé blijven. Koppel geen publieke custom domain aan `STUDENT_PROOFS`.
- De Worker begrenst bewijsopslag per omgeving tot 4 GB, 400.000 uploads en 4 miljoen bewijslezingen per maand (plus daglimieten van 10.000 uploads en 50.000 lezingen). Preview en productie blijven samen onder het standaardvrije R2-volume zolang dit de enige R2-verbruiker op het account is. Dit is geen accountbrede factuurstop: ander R2-gebruik kan alsnog kosten veroorzaken; Cloudflare biedt hier geen harde limiet van €10 per maand.
- De bewijsbucket hoort vanwege studentgegevens in de EU-jurisdictie. De binding vraagt daarom expliciet `jurisdiction: "eu"`; controleer deze onveranderlijke bucketinstelling bij het aanmaken. Een EU-locatiehint is niet gelijk aan de EU-jurisdictiegarantie ([Cloudflare R2 data location](https://developers.cloudflare.com/r2/reference/data-location/)).
- Login-, wachtwoordreset-, bevestigingsmail- en nieuwsbriefverzoeken hebben afzonderlijke limieten per IP-adres en per e-mailadres. Accountgerichte tellers zijn HMAC-gehasht met `AUTH_PEPPER`, zodat e-mailadressen niet als rate-limit-sleutel in D1 worden opgeslagen.
- Er is geen R2 lifecycle-/retentieregel ingesteld. Na een beoordeling probeert de Worker het bewijs direct te verwijderen; bij een fout probeert de cron dit opnieuw (maximaal 20 beoordeelde bewijzen per run) en kan een beheerder ook handmatig opnieuw proberen. Voor uploads wordt eerst een D1-opruimrij aangemaakt. Als de aanvraagtransactie én directe R2-verwijdering falen, probeert de cron het na een uur opnieuw (maximaal 20 weesbestanden per run); gekoppelde bewijzen worden nooit door deze weesopruiming verwijderd. Kies geen automatische bewaartermijn voor beoordeelde documenten zonder privacybesluit.
- De privé-R2-buckets `schaapsvis-student-proofs` en `schaapsvis-student-proofs-preview` zijn aangemaakt in EU-jurisdictie. Cloudflare Email Sending aan willekeurige ontvangers vereist Workers Paid; dit abonnement is niet geactiveerd omdat de rekeninghouder een maximum van €5 per maand heeft gesteld en Cloudflare geen harde kostenstop biedt. De leden-Worker gebruikt daarom Knoth SMTP zodra de geverifieerde serverinstellingen en mailboxsecrets zijn ingesteld. Productie `MEMBERS_ENABLED` blijft uit; er worden geen echte studentbewijzen of klantmails verwerkt.
- Sessiecookies zijn host-only; preview en productie delen geen login-cookie.
- De leden-API-route hoort op `schaapsvishandel.nl/api/members/*` en de preview-route op `preview.schaapsvishandel.nl/api/members/*`; publiceer de route samen met de aparte account-Worker nadat bindings, secrets en preview zijn gecontroleerd.

## Nog uit te voeren Cloudflare-stappen

1. Laat Lucas het bestaande mailboxwachtwoord als Cloudflare-secret `SMTP_PASSWORD` invoeren voor uitsluitend de Worker `schaapsvis-members-preview` (Production-environment van die previewservice). Deel dit wachtwoord niet in chat. Controleer daarna de secret-aanwezigheid zonder de waarde te tonen.
2. Herstel een werkende previewhost vóór de end-to-endtest: controleer DNS/proxy en de previewsite-serving-worker voor `preview.schaapsvishandel.nl`. Behoud de afgeronde nameservermigratie; wijzig geen nameservers.
3. Test na de DNS- en secretstap een bericht naar een eigen mailbox en daarna registratie, persoonlijke- en schoolmailverificatie, login/logout, reset en nieuwsbrief-double-opt-in. Houd `MEMBERS_ENABLED=off` tot deze previewtests succesvol zijn; zet het daarna alleen tijdelijk aan op de geïsoleerde preview, voer de tests uit en zet het weer uit.
4. Stel `ADMIN_EMAILS` en `ADMIN_IPS` op de previewworker in zodra de beheerderse-mail is bevestigd. De Worker gebruikt Cloudflare's `CF-Connecting-IP`; door browsers aangeleverde IP-headers worden niet vertrouwd. Een dynamisch IP moet worden bijgewerkt wanneer het verandert.
5. Controleer daarna de productieworkerconfiguratie, leg verschillende productie-authsecrets vast, pas de elf migraties gecontroleerd toe op de productiedatabase en koppel pas dan de productieroute. Houd productie `MEMBERS_ENABLED=off` totdat openbare lancering expliciet is goedgekeurd.
6. `ANALYTICS_ENABLED` blijft uit totdat de privacytekst en toestemming definitief zijn goedgekeurd. De statistieken zijn geaggregeerd en bevatten geen individuele funnels of exacte uitvalmomenten.
7. Houd de bewijsbuckets privé; activeer geen `r2.dev`-URL of custom domain. De R2-limieten in de Worker zijn geen harde accountbrede maandelijkse factuurstop. Zie [Cloudflare R2-jurisdicties](https://developers.cloudflare.com/r2/reference/data-location/#jurisdictional-restrictions) en [Wrangler R2-commando's](https://developers.cloudflare.com/r2/reference/data-location/).

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

- De 10% geldt uitsluitend op gebakken kibbeling, haring, broodjes haring en drinken. Andere gebakken vis, visschalen en alle overige producten zijn uitgesloten. De studentenkortingspagina vermeldt dat studentenkorting niet te combineren is met nieuwsbriefkortingen of andere acties.
- De eigenaar heeft aangegeven reclame via het persoonlijke e-mailadres verplicht te willen stellen voor studentenkorting. De huidige pagina beschrijft nieuwsbriefdeelname juist als vrijwillig en apart. Maak marketingtoestemming niet verplicht voordat dit juridisch is getoetst: AVG artikel 7(4) vraagt extra aandacht wanneer een dienst afhankelijk wordt gemaakt van toestemming voor verwerking die niet nodig is voor die dienst. De Autoriteit Persoonsgegevens zegt dat toestemming niet vrijelijk is gegeven als iemand wordt benadeeld bij weigering. Bronnen: [AVG artikel 7](https://eur-lex.europa.eu/eli/reg/2016/679/oj#d1e2024-1-1) en [Autoriteit Persoonsgegevens: grondslag toestemming](https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/grondslag-toestemming). Houd aanmelding daarom optioneel totdat een privacyjurist/controller dit heeft beoordeeld.
- De formele bewaartermijn voor aanvraagmetadata en procedure voor inzage/verwijdering.
- De uiteindelijke privacyverklaring, verantwoordelijke beoordelaars en geverifieerde afzender.

De pas geeft 10% korting uitsluitend op kibbeling, haring, broodjes haring en drinken. Andere gebakken vis, visschalen en overige artikelen zijn uitgesloten. Een goedgekeurde pas is één studiejaar geldig; daarna kan de student met nieuw bewijs opnieuw aanvragen.

## Lokale voortgang 21 oktober 2026

De accountregistratie vraagt persoonlijk e-mailadres + schoolmail + wachtwoord.
Twee afzonderlijke 6-cijferige codes moeten binnen 10 minuten worden ingevoerd;
codes worden HMAC-gehasht, zijn eenmalig en rate limits begrenzen raden. De
studentenaanvraag endpoint eist server-side dat beide adressen bevestigd zijn.
Migraties 0006-0008 horen bij deze lokale wijzigingen. De volledige lokale
migratiereeks loopt inmiddels door t/m 0011; de actuele remote D1-status moet
in account Schaapsvis opnieuw worden gecontroleerd voordat er iets wordt toegepast.

De klanteninschrijving bewaart eerst tijdelijk een e-maildraft, daarna kiest
de klant regio en geeft apart expliciet toestemming. Alleen dubbelbevestigde
subscriptions worden verzonden. Drafts verlopen na 30 minuten en worden door
scheduled cleanup verwijderd. Regio-tags: Leiden, Voorschoten, Wassenaar,
Leidschendam, elders in regio 071 en elders. Leeftijd/geboortedatum wordt niet
verzameld.

Klaviyo is nog niet gekoppeld. Bij een latere koppeling blijven bevestigde
toestemming en afmelding in deze Worker leidend. Er is nog niets gedeployed; de
accountswitch blijft uit.

