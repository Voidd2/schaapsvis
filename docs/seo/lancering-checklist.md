# Lanceringchecklist

De site blijft besloten. Deze lijst is geen toestemming om `SITE_PUBLIC` of secrets te wijzigen.

## Vóór merge

- Controleer werkbranch tegen recente main; geen audit/gebruiksgemak-oudere-klanten-20261103 overnemen.
- Inhoudscontrole, winkel-/aanvraagtests, contactvalidatie met mocktransport, TypeScript, ESLint, Next en Cloudflare-build.
- Crawl lokale publieke simulatie én besloten profiel. Verifieer alle canonieke routes en taalparen, echte 404’s, oude redirects en noindex voor account/beheer.
- Test mobiel/tablet/desktop, toetsenbord, vergroten, fotovergroting, mandje en lokale conceptberichten. Geen echte aanvraag versturen.
- Controleer dat prijzen, afbeeldingen, ingrediënten, porties en toegangssecrets niet veranderd zijn.

## Na goedgekeurde merge

- Cloudflare-account Schaapsvis: site-Worker `schaapsvis`, daadwerkelijke gedeployde main-SHA, Ready en verkeerspercentage vastleggen. GitHub of Vercel alleen is onvoldoende.
- Controleer homepage, contact, feestdagen, één Product en Recipe live; canonical/hreflang/HTML-taal en noindex bij besloten toegang.
- Test zonder cookie én buiten de IP-allowlist. Robots blokkeert alles, sitemap leeg. Test van hetzelfde vertrouwde netwerk bewijst de anonieme blokkade niet.
- `Check private site hosts` controleert hoofddomein, workers.dev en beide bekende Vercel-hosts vanaf GitHub. Het verouderde 9sai-project houdt ook crawler-endpoints achter een noindex-wachtwoordscherm; documenteer dit afzonderlijk, noem dat geen geldig robotsbestand. Voeg nieuwe bekende previewhosts expliciet toe aan de controle. Geen willekeurige oude deployment-URL's als bewezen beschermd presenteren.
- Controleer www/http/apex/trailing slash zonder DNS of beveiliging onnodig te wijzigen.
- Controleer leden-health alleen lezen; geen leden-Worker of databasewijzigingen nodig voor deze ronde.

## Openbaar maken: afzonderlijk eigenaarsbesluit

- De GitHub-job `locked-site` controleert de besloten live site zonder cookies vanaf een extern runnernetwerk. Zet uitsluitend bij de goedgekeurde openbare lancering ook de repositoryvariabele `SITE_PUBLIC=launch-approved` om deze besloten-verwachting uit te schakelen. Deze CI-variabele opent de website niet; runtime-publicatie blijft een afzonderlijke handeling.

- Bevestig NAP, echte beelden, productwaarheid, contactafhandeling en juridische teksten.
- Pas dan de bestaande publicatieprocedure gebruiken. Controleer robots/sitemap opnieuw op runtime, geen aanname vanuit de build.
- GSC domeinproperty bevestigen; publieke sitemap indienen; representatieve product-, locatie-, recept- en artikelpagina’s inspecteren.
- Bewaar bewijs van indexeerbaarheid en bereikbaarheid van afbeelding-URL’s; controleer dat account-/beheer-/API- en previewroutes niet indexeerbaar worden.
- Start [90-dagenmeting](monitoring-90-dagen.md). Rankings of rich results zijn geen acceptatiegarantie.
