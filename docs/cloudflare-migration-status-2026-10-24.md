# Cloudflare-migratie — status 24 oktober 2026

Deze notitie is de actuele controle na de eerdere, gedateerde migratielogboeken. Er zijn geen DNS-records of productievariabelen gewijzigd tijdens deze controle.

## Wat is bevestigd

- De autoritatieve nameservers voor `schaapsvishandel.nl` zijn `joel.ns.cloudflare.com` en `serena.ns.cloudflare.com`. De Cloudflare-zone meldt DNS Setup: Full.
- De apex `schaapsvishandel.nl` heeft in Cloudflare een Worker-record naar productie-Worker `schaapsvis`. Het Cloudflare-dashboard toont een Ready-productieversie op `main` (commit `ed2d9ce`) en het hoofddomein als Custom Domain.
- Een actuele HTTP-request naar de apex gaf status 200 met `server: cloudflare` en `x-opennext`. De response bevatte ook `x-robots-tag: noindex, nofollow`: de website is dus nog niet openbaar voor bezoekers/zoekmachines. De poging om HTTPS via deze Windows-shell te testen liep vast op de lokale Schannel-clientinstelling; daaruit volgt geen conclusie over de TLS-certificaatstatus.
- `www.schaapsvishandel.nl` heeft momenteel geen A-, AAAA- of CNAME-record; Cloudflare waarschuwt dat bezoekers de host niet kunnen bereiken en publieke DNS-resolutie gaf geen record. De applicatiecode is op GitHub bijgewerkt om www-verzoeken met HTTP 301 naar de apex om te leiden, inclusief pad en queryparameters. De redirect kan pas worden getest nadat www weer naar de Worker wordt geleid.
- De zakelijke mailrecords staan nog in de zone: `mail`, `smtp`, `pop` en `ftp` wijzen naar `91.220.37.174` en zijn DNS-only; MX verwijst naar `mail.schaapsvishandel.nl` met prioriteit 10; het SPF-record bevat `v=spf1 a mx ip4:91.220.37.174 ~all`. Er staan in de huidige zone geen DKIM- of DMARC-records; Cloudflare toont hiervoor een DMARC-aanbeveling. Die records zijn niet aangepast.
- In de Worker-preview zijn `SITE_PASSWORD` en `SITE_ACCESS_TOKEN` als versleutelde secrets opgeslagen. Na uitloggen is het previewwachtwoord opnieuw getest en gaf de preview toegang. De waarden staan niet in GitHub.
- Pull request #18 staat open; de meest recente update bevat de apex-canonicalisatie, sitemapupdate, www-301-code en bijgewerkte tests. De nieuwe GitHub- en Vercel-checks waren bij het schrijven nog bezig.

## Nog nodig vóór de migratie echt af is

1. Exporteer de Cloudflare-DNS-zone als back-up vóór de eerstvolgende DNS-wijziging. Deze export is nog niet gelukt; er is nog niets gewijzigd.
2. Maak `www` bereikbaar via een proxied CNAME naar de apex of voeg een passende Worker-custom-domain/route toe, en configureer HTTPS. Test daarna de 301 op minstens een URL met pad én querystring.
3. Zet op de productie-Worker `SITE_PUBLIC=launch-approved` als runtime-variabele en controleer dat de gewone site publiek wordt. Laat privé-API's, studenten-/klantbeheer en andere accountdata server-side beschermd; de preview blijft een aparte afgeschermde omgeving.
4. Test daarna HTTPS op beide hosts, de redirects, robots/sitemap en toegangsweigering van beheer-API's vanaf een niet-toegestaan account/IP.
5. Verifieer dat GitHub `main` de juiste Cloudflare-productie-Worker automatisch uitrolt en dat de oude Vercel-projecten/-domeinkoppelingen niet meer voor live verkeer nodig zijn. Verwijder het Vercel-project niet zonder afzonderlijke toestemming.

