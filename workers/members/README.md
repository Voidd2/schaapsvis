# Schaap's account- en studenten-API

Deze Worker is de serverkant voor algemene accounts, e-mailbevestiging, wachtwoordherstel, studentenaanvragen, beoordeling, de kortingspas en dubbele opt-in voor e-mailaanbiedingen. De site blijft eigenaar van de pagina's; de Worker verwerkt de gevoelige gegevens.

## Huidige status

- Dit is de afzonderlijke account-/studenten-Worker, niet de website-Worker. De apex en `www` wijzen publiek naar Cloudflare; op 25 oktober 2026 antwoordde de apex met Cloudflare-headers en de afgesproken toegangscode opende de volledige site. Zonder sessie blijft alleen de afgeschermde `Binnenkort online`-pagina zichtbaar. De aparte account-Worker is nog niet als actieve account-API bevestigd, dus registratie en studentaanvragen mogen niet als live worden beschouwd.
- Preview en productie zijn in `wrangler.jsonc` gekoppeld aan de D1-databases `schaapsvis-members-preview` en `schaapsvis-members`. De huidige Cloudflare API-verbinding ziet uitsluitend `Admin@haascom.com’s Account`, niet het dashboardaccount `Schaapsvis`; daardoor zijn de actuele database-ID's, tabellen en migratiestatus niet opnieuw onafhankelijk bevestigd. Controleer de bindings en pas migraties `0001` t/m `0011` pas toe nadat de doelaccount en remote status in het Schaapsvis-account zijn geverifieerd.
- `MEMBERS_ENABLED` staat in preview en productie standaard op `off`. Cloudflare-routes kunnen de Next.js-passcode omzeilen; zet deze schakel pas op `on` nadat de site openbaar mag zijn en alle diensten zijn geverifieerd.
- De nieuwsbrief-cron controleert dezelfde schakel en blijft volledig inactief zolang `MEMBERS_ENABLED` niet `on` is; ook een eventueel achtergebleven campagne wordt dan niet verwerkt.
- De bewijsbucket moet privé blijven. Koppel geen publieke custom domain aan `STUDENT_PROOFS`.
- De Worker begrenst bewijsopslag per omgeving tot 4 GB, 400.000 uploads en 4 miljoen bewijslezingen per maand (plus daglimieten van 10.000 uploads en 50.000 lezingen). Preview en productie blijven samen onder het standaardvrije R2-volume zolang dit de enige R2-verbruiker op het account is. Dit is geen accountbrede factuurstop: ander R2-gebruik kan alsnog kosten veroorzaken; Cloudflare biedt hier geen harde limiet van €10 per maand.
- De bewijsbucket hoort vanwege studentgegevens in de EU-jurisdictie. De binding vraagt daarom expliciet `jurisdiction: "eu"`; controleer deze onveranderlijke bucketinstelling bij het aanmaken. Een EU-locatiehint is niet gelijk aan de EU-jurisdictiegarantie ([Cloudflare R2 data location](https://developers.cloudflare.com/r2/reference/data-location/)).
- Login-, wachtwoordreset-, bevestigingsmail- en nieuwsbriefverzoeken hebben afzonderlijke limieten per IP-adres en per e-mailadres. Accountgerichte tellers zijn HMAC-gehasht met `AUTH_PEPPER`, zodat e-mailadressen niet als rate-limit-sleutel in D1 worden opgeslagen.
- Er is geen R2 lifecycle-/retentieregel ingesteld. Na een beoordeling probeert de Worker het bewijs direct te verwijderen; bij een fout probeert de cron dit opnieuw (maximaal 20 beoordeelde bewijzen per run) en kan een beheerder ook handmatig opnieuw proberen. Voor uploads wordt eerst een D1-opruimrij aangemaakt. Als de aanvraagtransactie én directe R2-verwijdering falen, probeert de cron het na een uur opnieuw (maximaal 20 weesbestanden per run); gekoppelde bewijzen worden nooit door deze weesopruiming verwijderd. Kies geen automatische bewaartermijn voor beoordeelde documenten zonder privacybesluit.
- R2-buckets en Email Sending zijn nog niet ingericht of via de huidige API-koppeling te bevestigen. R2-aanmaak kan gebruiksafhankelijke kosten activeren; Cloudflare heeft geen harde accountbrede uitgavenstop op €10 per maand. Workers-limieten en budgetalerts zijn geen garantie tegen accountbrede meerkosten. Email Sending aan willekeurige ontvangers vereist Workers Paid. Productie `MEMBERS_ENABLED` blijft uit en er worden geen echte studentbewijzen of klantmails verwerkt.
- Sessiecookies zijn host-only; preview en productie delen geen login-cookie.
- De leden-API-route hoort op `schaapsvishandel.nl/api/members/*` en de preview-route op `preview.schaapsvishandel.nl/api/members/*`; publiceer de route samen met de aparte account-Worker nadat bindings, secrets en preview zijn gecontroleerd.

## Nog uit te voeren Cloudflare-stappen

1. Behoud de afgeronde nameservermigratie en wijzig geen nameservers. Publieke DNS-resolutie toont `joel.ns.cloudflare.com` en `serena.ns.cloudflare.com`. Voor eventuele Email Sending-onboarding: controleer de door Cloudflare opgegeven SPF-, DKIM-, DMARC- en bounce-records tegen de bestaande zone en behoud de huidige MX-, SPF- en mailrecords. De Cloudflare API-koppeling is niet verbonden met account Schaapsvis; accountbrede wijzigingen kunnen via die koppeling dus niet worden uitgevoerd.
2. R2 is nog niet geactiveerd voor deze account. De Worker-limieten beschermen alleen het gebruik van de twee bewijsbuckets en garanderen geen accountbrede grens van €10 per maand. Maak de buckets pas aan als de rekeninghouder dit risico accepteert en het accountgebruik verder bewaakt:
   ```sh
   npx --yes wrangler@4.151.1 r2 bucket create schaapsvis-student-proofs-preview --jurisdiction eu
   npx --yes wrangler@4.151.1 r2 bucket create schaapsvis-student-proofs --jurisdiction eu
   npx --yes wrangler@4.151.1 r2 bucket info schaapsvis-student-proofs-preview --jurisdiction eu --json
   npx --yes wrangler@4.151.1 r2 bucket info schaapsvis-student-proofs --jurisdiction eu --json
   ```
   Zet geen `r2.dev`-publieke URL of custom domain aan. De jurisdictie is na aanmaak niet wijzigbaar; controleer dus dat Cloudflare expliciet `eu` toont. Zie [Cloudflare R2-jurisdicties](https://developers.cloudflare.com/r2/reference/data-location/#jurisdictional-restrictions) en [Wrangler R2-commando's](https://developers.cloudflare.com/workers/wrangler/commands/r2/).
3. Controleer de remote migratiestatus van beide nieuwe D1-databases en pas migraties `0001` t/m `0011` eerst op preview toe. Voer echte previewtests uit vóór dezelfde migraties op de lege productie-D1. De nieuwe statistiektabel uit 0009, beheer-/klantaccounttabellen uit 0010 en R2-gebruikslimieten uit 0011 horen bij de huidige lokale code.
4. De zone en apex-Worker zijn al actief. Onboard `schaapsvishandel.nl` in **Email Service → Email Sending** alleen nadat afzenderrecords en bestaande e-mailbezorging zijn gecontroleerd. De `EMAIL`-binding staat in Wrangler; willekeurige ontvangers vereisen Workers Paid. Stel daarna per omgeving verschillende, willekeurige `AUTH_PEPPER`- en `PASS_SIGNING_KEY`-secrets in.
5. Stel `ADMIN_EMAILS` en `ADMIN_IPS` per omgeving als secrets in. `ADMIN_EMAILS` bevat alleen bevestigde beheeraccounts; `ADMIN_IPS` bevat de toegestane IPv4-/IPv6-adressen, komma-gescheiden. De Worker vergelijkt dit met Cloudflare's `CF-Connecting-IP`; een door de browser aangeleverde header telt niet. Een dynamisch IP-adres moet worden bijgewerkt wanneer het verandert.
6. Opt-in statistieken staan standaard uit (`ANALYTICS_ENABLED` ontbreekt of is niet `on`). Voer migratie 0009 uit vóór activering. Na toestemming bewaart de site alleen geaggregeerde dagtotalen per openbare pagina en klikdoel; queryparameters en afgeschermde routes worden geweerd. De cron verwijdert dagtotalen ouder dan 395 dagen en rate-limit-hashes na 30 dagen. Dit geeft geen individuele bezoekerfunnels of exacte uitvalmomenten.
7. Houd `MEMBERS_ENABLED=off` totdat de site bewust publiek mag zijn. Zet de schakel alleen lokaal of op een geïsoleerde preview tijdelijk op `on` om registratie, bevestiging, login/logout, reset, bewijsupload/-verwijdering, goed-/afkeuren, pascontrole, nieuwsbriefbevestiging en afmelding te testen. `ANALYTICS_ENABLED` is een aparte keuze en blijft uit totdat privacytekst en toestemming zijn goedgekeurd.
8. Voer pas na volledige preview- en privacycontrole een productie-uitrol uit. Activeer `MEMBERS_ENABLED` niet zolang de site achter het wachtwoordslot hoort te blijven.

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
