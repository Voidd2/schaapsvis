# Inventaris en uitgangspunten — 15 september 2026

## Toegang
- Repository volledig gekloond op `claude/schaapsvis-website-remake-yfhbfu`.
- Startcommit: `675bfc4b4995822234e447eb39385bdc19f55e61`.
- 162 gevolgde bestanden; `git fsck --full` zonder fouten; geen submodules.
- Alle bestanden staan in `bestandsinventaris.txt`.
- Next.js 16.2.4, next-intl 4, React 19, NL/EN/DE.
- De browser toont een oudere besloten preview dan de huidige branch; live observaties en broncode zijn daarom apart beoordeeld.

## Paginafamilies in de startbranch
Homepage; assortiment + productdetails (129); bestellen + bedankt; bezoek ons; bezorgen + vijf gemeenten; biologische vis; Varlaks; ons verhaal; contact; visschalen; blog + artikelen; recepten + recepten; viskalender; viswinkel Leiden; Duitse Leiden-landingspagina; marktkraam Leiden; Voorschoten; Too Good To Go; kortingsbon; admin; coming soon. Daarnaast vier API-routes, sitemap en robots.

## Leidende keuzes uit de opdracht
Leiden en sinds 1938 centraal. Bezorgen uitsluitend iedere donderdag: verse vis, salades en visschalen. Geen levering van gebakken vis of bereide maaltijden. SumUp als centrale bestelomgeving. Aanraders met eerlijke fotoplaatsen. Geen onbevestigde leveranciers-, gezondheids-, historische of prijsclaims. Alle primaire klantpagina’s en productinformatie in Nederlands, Engels en Duits; redactionele inhoud alleen aanbieden onder werkelijk geschreven taalversies.

## Geconstateerde problemen
- Vier bezorgdagen en salades uitgesloten in centrale configuratie.
- Nederlandse product- en locatiegegevens op Engelse en Duitse pagina’s.
- Maatwerkbestelformulier en lokale mand naast toekomstige SumUp-winkel.
- Voorlopige schalenprijzen, samenstellingen en aantallen personen als koopaanbod.
- Inkoopbedrijfsnamen en locaties, absolute keurmerk-/gezondheidsclaims.
- Afwijkende historische generatietelling en onbevestigde citaten/tijdlijn.
- Niet-aangesloten nieuwsbrief; contactstatus niet overal vertaald.
- Structured data bevat niet-bestaand FishStore-type en onjuist logo; meertalige alternates voor onvertaalde pagina’s.
- Rootmetadata noemt 86 jaar; verschilt van sinds 1938.

Concurrentieonderzoek staat in `concurrentie-audit-2026-09-15.md`; uitgevoerde wijzigingen en resterende content worden vastgelegd in `site-audit-2026-09-15.md` en `OVERDRACHT.md`.
