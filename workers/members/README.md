# Schaap's account- en studenten-API

Deze Worker is de serverkant voor algemene accounts, e-mailbevestiging, wachtwoordherstel, studentenaanvragen, beoordeling, de kortingspas en dubbele opt-in voor e-mailaanbiedingen. De site blijft eigenaar van de pagina's; de Worker verwerkt de gevoelige gegevens.

## Huidige status

- Gecontroleerd op 26 oktober 2026 in account **Schaapsvis**: `schaapsvis-members` is gedeployed op de productieroute `schaapsvishandel.nl/api/members/*`. De website zelf blijft een besloten preview; bezoekers zonder geldige toegang zien de binnenkort-pagina.
- Productie `MEMBERS_ENABLED=on` is bedoeld voor deze afgeschermde preview. De Worker eist daarnaast de site-unlock-cookie of het door Cloudflare vastgestelde IP op de allowlist; bezoekers kunnen niet alleen door de API-URL te kennen registreren. Zet de toegangspoort niet open als onderdeel van deze preview.
- De productie-Worker heeft D1 `schaapsvis-members` en de private EU-R2-bucket `schaapsvis-student-proofs`; alle 11 migraties zijn toegepast. De database bevatte bij de laatste controle geen accounts of studentaanvragen. De R2-bucket blijft privé.
- Cloudflare bevat de mailhost `mail.schaapsvishandel.nl`, poort 587, gebruikersnaam en versleuteld `SMTP_PASSWORD`; ook auth-, ondertekenings- en site-access-secrets zijn ingesteld. De configuratie is aanwezig, maar een echte Knoth-mailbezorging is nog niet end-to-end geverifieerd. De lokale STARTTLS/PLAIN-protocoltest is geslaagd; dit bewijst geen aflevering door Knoth.
- Beheerdermail en IP-allowlist zijn ingesteld voor `schaapsv@schaapsvishandel.nl` en de door de eigenaar opgegeven IP-adressen. De beheer-API blijft bovendien achter de site-access-gate.
- De aparte Worker `schaapsvis-members-preview` met eigen D1/R2 bestaat nog, maar `preview.schaapsvishandel.nl` heeft geen DNS-record en die Worker staat uit. De actieve besloten preview gebruikt daarom de hoofdsitehost, zoals de eigenaar heeft toegestaan.
- De Worker begrenst bewijsopslag per omgeving tot 4 GB, 400.000 uploads en 4 miljoen bewijslezingen per maand (plus daglimieten van 10.000 uploads en 50.000 lezingen). Dit zijn applicatielimieten, geen harde accountbrede factuurstop. Cloudflare biedt hier geen harde limiet van €10 per maand. De Worker Paid-upgrade is niet geactiveerd.
- Studentbewijs wordt na beoordeling verwijderd; bij een fout probeert de cron dit opnieuw. Er is geen automatische bewaartermijn voor aanvraagmetadata vastgesteld. Laat echte openbare registratie daarom dicht totdat de privacyinformatie, bewaartermijnen en daadwerkelijke e-mailaflevering zijn bevestigd.
- Login-, wachtwoordreset-, bevestigingsmail- en nieuwsbriefverzoeken hebben afzonderlijke limieten per IP-adres en per e-mailadres. Accountgerichte tellers zijn HMAC-gehasht met `AUTH_PEPPER`.
- De nieuwsbrief-cron blijft alleen actief zolang `MEMBERS_ENABLED=on`; alleen dubbelbevestigde aanmeldingen mogen campagnes ontvangen. De toestemming voor marketing blijft vrijwillig en los van studentenkorting.
- Sessiecookies zijn host-only; productie en de losse preview-Worker delen geen accountsessie.

## Resterende controles vóór publieke registratie

1. Houd de website en account-API achter de bestaande site-access-gate. De leden-API staat aan voor de besloten preview; bezoekers zonder site-unlock-cookie of het vertrouwde eigenaar-IP worden door de Worker geweigerd.
2. Verifieer echte Knoth-mailaflevering met een door de eigenaar opgegeven testontvanger. De lokale SMTP-protocoltest is geen bewijs van aflevering. Deel of log geen mailboxwachtwoord, verificatiecode of echte gebruikersgegevens.
3. Controleer privacyverklaring, verwerkingsverantwoordelijke, grondslagen, verwerkers, bewaartermijnen en verwijderprocedure vóór publieke registratie. Gebruik tijdens preview geen echt inschrijvingsbewijs.
4. Houd `ANALYTICS_ENABLED` uit totdat privacytekst en toestemming definitief zijn goedgekeurd. Statistieken zijn geaggregeerd en bevatten geen individuele funnels of exacte uitvalmomenten.
5. Houd bewijsbuckets privé; activeer geen `r2.dev`-URL of custom domain. R2-limieten in de Worker zijn geen harde accountbrede maandelijkse factuurstop. Zie [Cloudflare R2-jurisdicties](https://developers.cloudflare.com/r2/reference/data-location/#jurisdictional-restrictions) en [Wrangler R2-commando's](https://developers.cloudflare.com/r2/reference/data-location/).

## Lokale checks

```powershell
npm run check:members
npx wrangler d1 migrations apply schaapsvis-members-preview --config workers/members/wrangler.jsonc --env preview --local --persist-to workers/members/.wrangler-preview
npx wrangler dev --config workers/members/wrangler.jsonc --env preview --local --persist-to workers/members/.wrangler-preview
```

De `--local`-vlag is essentieel: de previewconfiguratie bevat een remote Email Service-binding. Met `--local` blijven D1 en R2 lokaal en wordt e-mail alleen gesimuleerd; zonder die vlag kan e-mail echt worden verstuurd. De twee commando's gebruiken dezelfde lokale opslagmap, los van de Cloudflare-databases.

Maak voor handmatige lokale tests een niet-gecommitte `workers/members/.dev.vars.preview` met `MEMBERS_ENABLED="on"`, `SITE_ORIGIN="http://localhost:8787"`, `MAIL_FROM`, `ADMIN_EMAILS`, `AUTH_PEPPER` en `PASS_SIGNING_KEY`. Gebruik alleen aparte testwaarden, nooit productiegeheimen. De productiewaarde `MEMBERS_ENABLED="on"` hoort bij de password-gated preview; open de websitepoort niet zonder expliciete go-live-beslissing. Gebruik geen echte studentbewijzen of persoonsgegevens in fixtures.

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
toestemming en afmelding in deze Worker leidend. De site-, account- en
studenten-Workers zijn gedeployed; klantaccounts voor bezorging en spaarpunten
blijven toekomstige ontwikkeling.

