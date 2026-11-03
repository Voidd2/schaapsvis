# Visuele eindcontrole — masteraudit

Datum: 3 november 2026. Beperkte afwerking van de bestaande vormgeving, geen herontwerp.

## Veranderingen

- Bitter-koppen, Source Sans-tekst, 1536px-canvas en bestaande productfoto’s behouden. De in de opdracht genoemde hoofdheadingselectoren waren op main al gecorrigeerd.
- Witte knoptekst: achtergrond van #0b93ca naar bestaande #0875a3; contrast **3,48 → 5,14:1**. Hover #075b82: **7,43:1**.
- Ondersteunende producttekst #496875 heeft circa **5,97:1** tegen wit. Categorieën/bijschriften 0,8rem; beschrijvingen1rem; aantallen/acties0,95rem. Geen gelijke grootte voor alle hiërarchieniveaus.
- Informatiebalk en mobiele menugroepnamen leesbaarder. Informatiebalk kan bij vergroten afbreken.
- Footer gebruikt kolommen gebaseerd op beschikbare tekstruimte; de gevonden overlap bij grotere tekst is verholpen.
- Feestdagen: vijf compacte vertaalde sectielinks, voldoende raakvlak en scroll-margin. Geen extra decoratieve banners.
- Contact vraagt e-mail of telefoon; foutmelding bij onbruikbare contactgegevens; naam/bericht blijven verplicht.
- Homepagefavorieten gebruiken responsive beeldvarianten van dezelfde originele bestanden.

## Browserbewijs

Acht templates: homepage, assortiment, visschalen, feestdagen, bezoek-ons, vast schaalproduct, zalmrecept en contact. Afmetingen:360×800,390×844,430×932,768×1024,820×1180,1180×820,1366×768,1440×900,1920×1080.

72 combinaties plus één vergrote-tekst/reflowtest. Geen horizontale overflow, kapotte geladen beelden of JavaScript-pageerrors in de laatste matrix. Aanvullend: contactvalidatie in NL/EN/DE; alle vijf ankers; bestaande mand-/focus-/Escape-/taal-/opslagtests. Er is niets verzonden.

**Echte zoom aanvullend uitgevoerd:** `check-browser-zoom.mjs` gebruikt een nieuw geïsoleerd Chrome-profiel met echte pagezoom200% (DPR2, venster1366px, CSS-viewport675px, rootfont ongewijzigd17px). Acht templates slagen zonder overflow/pageerrors; fysieke-viewportbeelden via CDP staan in `zoom/`. De oude CSS-tekstvergroting is slechts een extra reflowtest. Geen volledige WCAG-certificering geclaimd.

Lighthouse13.6.0 op de gebouwde Cloudflare-runtime: home, assortiment, visschalen en contact op mobiel/desktop na correcties allemaal accessibility100. Gevonden en verholpen: lichte kapitaallabels/kruimels/sociallinks, 18px-brede menu-uitklappers (nu28px), afwijkende toegankelijke namen van Bellen/fotolabels. Voor schermlezers blijven de zichtbare fotolabels behouden. Meetbeperkingen en prestaties staan in de technische audit.

## Screenshots

Bekijk `../design-preview/master-audit/overzicht.html` naast de repository. Voor/na: home390/1440, assortiment390/1440, visschalen, feestdagen, locaties, productdetail en contact. Na: iPadportret820 en landschap1180 plus recept.

De eerste recept-vooropname gebruikte een bestaande redirect naar de receptenindex. Daarom wordt die niet gepresenteerd als vergelijkbare vooropname van het zalmrecept. Sommige eerste volledige vooropnames hebben nog lazy-imageplaatsaanduidingen buiten het zichtbare scherm; dat zijn geen verwijderde productfoto’s. Nieuwe naopnames scrollen eerst door de pagina zodat die beelden kunnen laden.

## Resterende visuele controle

Na PR-review en merge: echte Cloudflare-output naast de screenshots controleren. Onderhoud de lange catalogus met bestaande content; geen nieuwe kaartfoto’s, porties of vrijere ingrediëntenclaims toevoegen. Eigen bedrijfsfoto’s en ontbrekende gerechtbeelden blijven eigenaarsinput.

## Live na PR #81

Siteversie b3f74852 (main b13dfee) Ready/100%. Twintig live controles op390/1440px: geen overflow of pageerrors. Live screenshots en Lighthouse-mobielrapport staan naast de repo in design-preview/master-audit; het overzicht linkt ze. Geen formulieren verzonden. Live mobiele Lighthouse: performance81, accessibility100, best-practices100; LCP4,83s blijft een aandachtspunt, geen veld-CWV-certificering.
