# Derde verbeteringsronde — 2 november 2026

Branch: `codex/shop-round-three`. Uitgangspunt: `ae6d7aa` na de tweede live ontwerpronde.

## Uitgevoerde eisen

1. Homepage: alleen locaties en studenten zijn wit gemaakt. Visschalen/familie blijven lichtblauw, quote/lijn en volgorde blijven intact. Korte schaaltekst in NL/EN/DE; zes producten en 3/2 kolommen behouden.
2. Visschalen: kortere inleiding, drie gewone familieankers, bescheiden advieslink. Lokale bovenruimte 32/48 px. Dubbele introductie en ‘schaal of borrelbox’ verwijderd. Eerste foto staat direct onder familienaam.
3. Familiekaart: foto volledig zichtbaar in 4:3, bestaand eerlijk bijschrift, korte omschrijving, formaat met prijs, prominente prijs, primaire WhatsApp-knop en secundaire samenstellingslink. Specifieke `family`-presentatie in SelectieGalerij; barbecue/gourmet gebruikt deze niet.
4. `platter-families.ts` is de gedeelde mapping van de twaalf bestaande producten. URL-parameters `klassiek`, `luxe`, `hapjes` bevatten gevalideerde slugs. Native replaceState behoudt overige parameters en hash zonder extra geschiedenisstappen. Hydratatiebescherming behouden. Detail: teruglink naar juiste familie met keuzes, formaatwissel alleen binnen familie; bestaande Feestdagen-kruimel blijft.
5. Vaste prijs geldt voor hele formaat, circa €17,50 p.p. uitsluitend maatwerk. FAQ, onderblok, NL/EN/DE metadata en Service/FAQ-schema gebruiken dezelfde betekenis. Geen bedragen gewijzigd.
6. Gewone producten zonder vastgelegde prijs tonen ‘Prijs op aanvraag’. Bijschriften uit productPhoto worden weergegeven. Alle twaalf schaal-detailpagina’s tonen het inspiratiebijschrift.
7. Homepagehero gebruikt BEELD.winkelGevel zodra een echte foto is ingevuld; anders huidige zalmfotografie met passend bijschrift. Historisch beeld en actuele teamregistratie historieNu zijn gescheiden. Foto-instructies bijgewerkt; geen nieuwe identiteit verzonnen.
8. Openstatus gebruikt expliciet Europe/Amsterdam via Intl.DateTimeFormat met zomer-/wintertijd, centrale openingHours behouden.

## Gerichte controles

- `node scripts/check-shop-navigation.mjs`: twaalf varianten met canonical prijs/foto/naam, URL-roundtrips, andere familiekeuzes en trackingparameter, onbekende/cross-family slugs, directe detailteruglink en 65 tijdzone/boundary cases. Gevel/fallback-regressietest inbegrepen. Toegevoegd aan build-validation CI.
- Optionele browsercontrole: `node scripts/check-shop-navigation.mjs ../design-preview/round-three/variants-evidence.json` vergelijkt echte DOM-uitvoer voor alle twaalf opties met de canonieke productbron, inclusief foto, prijs, productlink en WhatsApp-inhoud.
- Chrome: klassiek 8–10 → detail → browser Terug behoudt 8–10. Herladen behoudt alle drie families. Detailwissel naar 3–5 blijft klassiek, zichtbare teruglink behoudt luxe/hapjes en landt bij klassiek. Query `utm_source=folder` en familieanker blijven na wijziging staan. Ongeldige slug valt terug op geldig familielid.
- Chrome: fotovergrootvenster met Enter geopend en Escape gesloten. Familieankers liggen na scroll onder vaste header (kop rond y150, headeronderkant rond y104).
- Chrome: kabeljauw zoeken → detail → terug bewaart zoekterm en ‘1 product’.
- Chrome: homepage, visschalen, schaal-detail en kibbeling bij echte CSS-breedtes 390,1440,360,1366: geen horizontale overflow. Kibbeling toont prijsfallback. EN/DE overzicht geen overflow.
- Voorbeeldmeting vóór wijziging op live 390×844, previewbalk zichtbaar: eerste schaalfoto y929. Lokaal na: y560 zonder previewbalk. Definitieve livemeting volgt bij publicatie.
- Barbecue/gourmet: 13 selectiekaarten, geen family-variant; oorspronkelijke presentatie behouden. Referentiescreenshot vóór/na opgeslagen.
- Geen aanvragen, bestellingen, registraties of e-mails verstuurd. Accounts, backend, Wallet en toegangsbeveiliging niet gewijzigd.

## Ontbrekende eigen foto's

Gevel Herenstraat, echte toonbank/contactpersoon, actuele teamfoto, woensdagkraam Botermarkt, zaterdagkraam De Waag, vrijdagkraam Hoogvliet en gedateerde historische opname. `fotos-aan-te-leveren.md` beschrijft exacte registraties/plaatsing. Ontbrekende foto's blokkeren deze ontwerpronde niet.

## Publicatie

Lokale Next-productiebuild, TypeScript, gerichte ESLint, inhoudscontrole en build-targetcontrole geslaagd. Ook de Cloudflare/Vinext-build slaagt. PR/publicatie volgen. Bewijsbestanden staan in `../design-preview/round-three/`.
