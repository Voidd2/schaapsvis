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

**Zoombeperking:** de geautomatiseerde test vergroot tekst tot200% bij683px reflow; dat is niet identiek aan echte Chrome-browserzoom200%. Die afzonderlijke handmatige controle blijft open. Ook is dit geen volledige WCAG-certificering of contrastcontrole van iedere mogelijke toestand.

## Screenshots

Bekijk `../design-preview/master-audit/overzicht.html` naast de repository. Voor/na: home390/1440, assortiment390/1440, visschalen, feestdagen, locaties, productdetail en contact. Na: iPadportret820 en landschap1180 plus recept.

De eerste recept-vooropname gebruikte een bestaande redirect naar de receptenindex. Daarom wordt die niet gepresenteerd als vergelijkbare vooropname van het zalmrecept. Sommige eerste volledige vooropnames hebben nog lazy-imageplaatsaanduidingen buiten het zichtbare scherm; dat zijn geen verwijderde productfoto’s. Nieuwe naopnames scrollen eerst door de pagina zodat die beelden kunnen laden.

## Resterende visuele controle

Na PR-review en merge: echte Cloudflare-output naast de screenshots controleren. Onderhoud de lange catalogus met bestaande content; geen nieuwe kaartfoto’s, porties of vrijere ingrediëntenclaims toevoegen. Eigen bedrijfsfoto’s en ontbrekende gerechtbeelden blijven eigenaarsinput.
