# Tweede verbeteringsronde — 2 november 2026

## Uitvoering

1. Assortimentfilters staan in de URL (`zoek`, `categorie`, `sortering`, `aantal`). Native `history.replaceState` houdt het bij één geschiedenisitem; Next/Vinext koppelt dit aan `useSearchParams`. Serverrendering toont direct de gedeelde filterweergave. Enkelvoud, meervoud en lege resultaten zijn vertaald.
2. Gewone producten hebben een beeldkolom en een informatiekolom. Op mobiel staat de titel voor de begrensde foto. De bestaande contacthelper levert de directe productaanvraag; voedingswaarden, allergenen en recepten blijven intact.
3. De header gebruikt onder 1440 CSS-pixels het compacte menu. De brede navigatie heeft geen tweede rij meer. Alle menuonderwerpen, talen en accountlinks blijven beschikbaar.
4. Zes homepageproducten staan op drie kolommen (twee mobiel). Sectieruimte is compacter; verhaal en citaat vormen een complete compositie zonder lege fotokolom. Een echte historische foto kan later via `beeld.ts` worden toegevoegd.
5. Drie schaalfamilies gebruiken ieder een native formaatselectie. De bestaande catalogus bepaalt naam, persoonsaantal, foto, prijs, detailroute en WhatsApp-bericht. De bestaande fotovergroter blijft werken. Het maatwerkrichtbedrag staat apart.
6. Locaties beginnen met de locatiekeuze; daarna adres, uren, route en toelichting. Route krijgt voorrang; productpromotie staat onderaan.
7. De beeldinventaris bevat productfoto's, recepten, VÅRLAKS, merkbeelden en redactionele beelden. Er zijn geen herkenbaar eigen gevel-, team-, kraam- of historische foto's aangetroffen. De SVG-scenes zijn illustraties en worden hiervoor niet gebruikt.
8. Lucas bevestigde maandag gesloten en dinsdag tot en met zaterdag open. `openingHours.ts` voedt de winkelstatus, locatie-uren, homepage-/locatieoverzicht, footer, wachtwoordscherm, bezoekmetadata en schema.org. De bestaande tijden blijven di–vr 09:00–18:00, za 09:00–17:00; er zijn geen feestdaguitzonderingen verzonnen.

## Functionele controles

- Chrome: zoek `kabeljauw` → product openen → browser terug: `kabeljauw`, `1 product` en juiste URL hersteld.
- Chrome: categorie Verse vis + Naam A–Z + Toon meer → product → terug: categorie, sortering en 25 beschikbare producten behouden (`aantal=32`); browser herstelt de positie bij het geopende product.
- Alle 12 keuzes in de browser doorlopen en vergeleken met `FEESTDAGEN_PRODUCTEN`: naam, foto, volledige prijs, bestaande detailroute en productgerichte WhatsApp-tekst komen overeen. Geen aanvragen verzonden.

| Soort | Personen | Volledige prijs |
|---|---|---|
| Klassiek | 2–3 / 3–5 / 5–8 / 8–10 | €59,50 / €73,50 / €98,50 / €115,50 |
| Luxe | 2–3 / 3–5 / 5–8 / 8–10 / 10–14 | €69,50 / €84,50 / €109,50 / €125,50 / €160,00 |
| Hapjes | 2–3 / 3–5 / 6–10 | €53,50 / €67,50 / €85,50 |

## Nog aan te leveren echte foto's

| Foto | Plaats | Gewenste uitsnede |
|---|---|---|
| Gevel Herenstraat 48 | Homepage en Locaties, `winkelGevel` | Liggend 3:2; gevelnaam en ingang volledig |
| Toonbank/team in winkel | Contact en verhaal, `achterDeToonbank` / `toonbank` | Liggend 3:2, persoon en toonbank zichtbaar; ook vierkant uitsnijdbaar |
| Woensdagkraam Botermarkt | Locaties, `marktWoensdag` | Liggend 3:2, kraam met herkenbare omgeving |
| Zaterdagkraam De Waag | Locaties, `marktZaterdag` | Liggend 3:2, kraam en Waag herkenbaar |
| Vrijdagkraam Hoogvliet | Locaties, `marktVoorschoten` | Liggend 3:2, kraam met herkenningspunt Hoogvliet |
| Echte historische foto | Homepage/familieverhaal, `historie1938` of passend jaartal | Liefst origineel/scanafbeelding, ruim kader; geen AI-reconstructie |

De ontbrekende foto's blokkeren deze ronde niet. Bij een later aangeleverde historische foto ook het juiste jaartal en onderschrift vastleggen.

## Beeldbewijs

Voor-/na-screenshots en de twaalf waargenomen formaatkeuzes staan lokaal in `../design-preview/round-two/`. Er zijn geen accountgegevens in de screenshots opgenomen.

- Header gecontroleerd op 390, circa 1024 (1023 gemeten), 1280, 1366, 1440 en 1920 CSS-pixels: geen horizontale overflow, hoofdheader steeds circa 76 px hoog. Duits op 1440 gecontroleerd.
- Desktop-uitklapmenu: Enter opent; Escape sluit en herstelt focus op de trigger, zichtbare focusrand aanwezig. Compact menu met Enter/Escape gecontroleerd.
- Gewone producten: Kibbeling, Kabeljauwfilet en Haring; Haring toont €2,50 per stuk. Productnaam in elke WhatsApp-link gecontroleerd.
- TypeScript, ESLint, inhoudscontrole, Next-productiebuild en Cloudflare/Vinext-build slagen.

Publicatie wordt hieronder toegevoegd na verificatie van de echte Cloudflare-uitrol.
