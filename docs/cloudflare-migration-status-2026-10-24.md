# Cloudflare-migratie — status gecontroleerd 25 oktober 2026

Deze notitie vervangt de eerdere statusclaims die niet meer stroken met de huidige project- en accountinformatie. De eigenaar meldt dat de website nog op Vercel draait en dat hosting/domein nog worden overgezet. Er zijn in deze controle geen DNS-, Vercel-, Cloudflare- of billing-instellingen gewijzigd.

## Wat nu is bevestigd

- De lokale DNS-resolver geeft voor zowel `schaapsvishandel.nl` als `www.schaapsvishandel.nl` Cloudflare-IP-adressen terug. Dit bewijst dat de hosts via Cloudflare proxy/DNS-resolutie lopen, maar niet welke origin de records gebruiken of waar de websitecode wordt gehost. De owner meldt dat hosting nog op Vercel staat.
- HTTPS-tests vanuit deze omgeving konden geen verbinding openen. Daarom zijn redirects, TLS, de live HTML en de huidige origin niet onafhankelijk bevestigd in deze controle.
- De Cloudflare API-verbinding is aangemeld als `admin@haascom.com`. `GET /accounts` toont alleen `Admin@haascom.com's Account`; een zonezoekopdracht voor `schaapsvishandel.nl` levert geen zone op. De aparte dashboardaccount `Schaapsvis`, Workers, secrets, DNS-originrecords en R2-billing kunnen via deze API-verbinding dus niet worden beheerd of geverifieerd.
- De sitecode en Worker-build zijn bijgewerkt op de open concept-PR [#23](https://github.com/Voidd2/schaapsvis/pull/23). De nieuwste branchbuild en Cloudflare-build slagen, maar de PR is niet samengevoegd; dit is geen bewijs van een productie-uitrol.
- GitHub rapporteert op branchcommit `c9bac10` succesvolle Vercel-deploymentchecks voor projecten `schaapsvis` en `schaapsvis-9sai`. De checklinks openen de deploymentdashboards, niet rechtstreeks de previewpagina; de gerenderde preview en wachtwoordtoegang zijn dus niet via deze status bevestigd. [Project schaapsvis](https://vercel.com/voidd2s-projects/schaapsvis/CTW8LWPv25NL73EQnLSAEuuFUL5f) · [Project schaapsvis-9sai](https://vercel.com/voidd2s-projects/schaapsvis-9sai/DDRceh9M2obJ8WJR3Rd5Gn7mPwwU).
- De GitHub Actions-workflow bouwt de Cloudflare Worker, maar publiceert hem niet. Een Cloudflare-branch-preview moet apart via Workers Builds/previewconfiguratie worden uitgerold; die runtime-deployment is niet bevestigd.
- De publieke root en Worker-preview zijn eerder in de browser gezien als afgeschermde “Binnenkort online”-pagina. Een geslaagde ontgrendeling op de huidige productiehost is niet bevestigd. Behandel de live site dus als niet geverifieerd; presenteer de volledige site of het wachtwoord niet als werkend.
- R2 is niet geactiveerd. De eigenaar heeft €10 per maand als maximum genoemd. Cloudflare's gebruiksbudgetmeldingen zijn alleen waarschuwingen, geen bestedingslimiet; ze kunnen bovendien vertraagd zijn. Daarom kan een harde limiet van €10 niet worden gegarandeerd en is er geen betaalde R2-activatie uitgevoerd. Zie [R2-prijzen](https://developers.cloudflare.com/r2/pricing/) en [budgetmeldingen](https://developers.cloudflare.com/changelog/post/2026-06-15-budget-alerts-default-on/).

## Nog nodig voor een aantoonbaar afgeronde migratie

1. Bevestig in het `Schaapsvis`-account de DNS-records en de origin van apex én `www`; exporteer eerst de zone als herstelpunt. De records mogen pas wijzigen nadat de Cloudflare-hostingbuild en rollback zijn gecontroleerd.
2. Rond de Cloudflare Workers-hostingdeploy af vanuit de bedoelde productiebranch en controleer in het Schaapsvis-dashboard dat de juiste commit als production is gepubliceerd. Bewaar Vercel als rollback totdat de Cloudflare-site end-to-end is getest.
3. Configureer en verifieer de sitegeheimen afzonderlijk in preview en productie. Omdat eerder gedeelde waarden niet als geheim mogen gelden, roteer ze voordat ze opnieuw worden gebruikt. Test wachtwoordontgrendeling op de Worker-URL en het eigen domein zonder geheimen in Git of logs te zetten.
4. Test vanaf een gewone browser: apex en `www`, HTTPS, canonieke redirect inclusief pad/query, pagina's, afbeeldingen, formulier/API's, robots/sitemap en mobiele/desktopnavigatie.
5. De leden-/studenten-Worker is een aparte dienst. Laat `MEMBERS_ENABLED=off` totdat database-/R2-bindings, migraties, mail, privacykeuzes en volledige previewtests in het juiste Cloudflare-account zijn geverifieerd. Maak de studentkorting niet live zonder de juiste goedkeurings- en e-mailconsentflow.
6. Activeer R2 alleen als extra gebruikskosten boven €10 per maand expliciet acceptabel worden óf Cloudflare een harde limiet kan garanderen. App-quota's begrenzen alleen de applicatie, niet de totale rekening van het Cloudflare-account.

Verwijder of deactiveer Vercel niet voordat alle controles zijn geslaagd en de eigenaar expliciet bevestigt dat de Cloudflare-hosting de productie overneemt.

