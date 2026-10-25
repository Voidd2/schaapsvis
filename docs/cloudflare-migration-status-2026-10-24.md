# Cloudflare-migratie — status gecontroleerd 26 oktober 2026

Deze notitie houdt de migratiestatus bij op basis van de geopende Cloudflare-dashboardpagina, de GitHub-PR en de informatie van de eigenaar. De eigenaar meldt dat de productiesite nog op Vercel draait.

## Wat nu is bevestigd

- De eigenaar meldt dat `schaapsvishandel.nl` nog via Vercel wordt gehost terwijl de Cloudflare-hosting wordt voorbereid. DNS-resolutie via Cloudflare alleen bewijst niet waar de sitecode draait.
- De Cloudflare API-integratie in deze sessie toont alleen `Admin@haascom.com's Account`; zij heeft geen toegang tot Schaapsvis. De R2-configuratie is daarom via de door de eigenaar aangewezen, ingelogde dashboardpagina van het account **Schaapsvis** gecontroleerd en gewijzigd.
- In account Schaapsvis zijn de R2-buckets `schaapsvis-student-proofs-preview` en `schaapsvis-student-proofs` aangemaakt. Beide zijn privé (public access uit), ingesteld op de EU-jurisdictie en leeg. De R2-pagina toonde na aanmaak $0 billable usage en 0 B opgeslagen.
- De eigenaar noemde €10 per maand als gewenste bovengrens. Cloudflare-budgetmeldingen zijn waarschuwingen en geen harde bestedingslimiet. R2 kan dus niet technisch tot €10 per maand worden begrensd; gebruik boven de gratis bundel kan kosten opleveren. De eigenaar heeft R2 en mogelijke gebruikskosten geaccepteerd. Bekijk [R2-prijzen](https://developers.cloudflare.com/r2/pricing/) en [budgetmeldingen](https://developers.cloudflare.com/changelog/post/2026-06-15-budget-alerts-default-on/).
- Workerconfiguratie in de sitebranch definieert een `STUDENT_PROOFS`-binding voor beide bucketnamen. Dat bewijst nog niet dat de binding in de Cloudflare Worker-runtime is gedeployed of getest.
- De sitecode en Worker-build staan op de open concept-PR [#23](https://github.com/Voidd2/schaapsvis/pull/23). De PR is niet samengevoegd; dit is geen bewijs van een productie-uitrol.
- GitHub rapporteert succesvolle Vercel-deploymentchecks voor branchcommit `c9bac10` voor projecten `schaapsvis` en `schaapsvis-9sai`. Dit zijn oudere branchchecks, geen bewijs van een huidige productie-deploy. [Project schaapsvis](https://vercel.com/voidd2s-projects/schaapsvis/CTW8LWPv25NL73EQnLSAEuuFUL5f) · [Project schaapsvis-9sai](https://vercel.com/voidd2s-projects/schaapsvis-9sai/DDRceh9M2obJ8WJR3Rd5Gn7mPwwU).
- De GitHub Actions-workflow bouwt de Cloudflare Worker, maar publiceert hem niet. Een Cloudflare branch-preview/runtime-deployment is niet bevestigd.
- De publieke root en Worker-preview zijn eerder gezien als afgeschermde “Binnenkort online”-pagina. Succesvolle wachtwoordontgrendeling op de huidige productiehost is niet bevestigd.
- Studenten- en ledenfunctionaliteit blijft uit (`MEMBERS_ENABLED=off`) totdat de juiste bindings, migraties, runtime-geheimen, e-mail en privacy-/goedkeuringsflow in de beoogde omgevingen zijn gecontroleerd.

## Nog nodig voor een aantoonbaar afgeronde migratie

1. Controleer in het Schaapsvis-account de DNS-records en de origin van apex én `www`; exporteer de zone als herstelpunt. Wijzig records pas wanneer de Cloudflare-hostingdeploy en rollback zijn gecontroleerd.
2. Voeg de aangemaakte R2-buckets als `STUDENT_PROOFS`-binding toe aan de bedoelde preview- en productie-Member Workers, en verifieer elke binding in Cloudflare. De configuratie staat in Git; de actieve runtimebindings zijn niet onafhankelijk geverifieerd.
3. Rond de Cloudflare website-hostingdeploy af vanuit de bedoelde productiebranch en controleer in het Schaapsvis-dashboard welke commit daadwerkelijk production serveert. Bewaar Vercel als rollback totdat end-to-end-tests slagen.
4. Configureer en verifieer sitegeheimen afzonderlijk in preview en productie. Eerder gedeelde waarden gelden niet meer als geheim; roteer ze voordat ze opnieuw worden gebruikt. Test toegang en ontgrendeling zonder geheimen in Git of logs te zetten.
5. Test vanaf een gewone browser: apex en `www`, HTTPS, canonieke redirects inclusief pad/query, pagina's, afbeeldingen, formulieren/API's, robots/sitemap en mobiele/desktopnavigatie.
6. Houd `MEMBERS_ENABLED=off` totdat opslag, D1-migraties, e-mail, privacykeuzes en previewflows in het juiste Cloudflare-account zijn getest. Zet studentkorting niet live zonder juiste goedkeurings- en e-mailconsentflow.
7. Houd R2-gebruik en facturering in de gaten: de genoemde €10 is geen harde Cloudflare-limiet.

Verwijder of deactiveer Vercel niet voordat alle controles zijn geslaagd en de eigenaar expliciet bevestigt dat Cloudflare-hosting productie overneemt.
