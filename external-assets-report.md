# Externe afbeeldingen — inventarisatie & vervanging

Status: **opgelost.** Alle externe afbeeldings- en videohotlinks zijn uit de
codebase verwijderd en vervangen door eigen, lokaal gehoste assets in
`/public/images/`. Controle: `grep -rn "unsplash|hartevelt|wp-content|mooijer|
zalmvanurk|visdenhaag|oysterencyclopedia|varlaks.no|.mp4" src/` is schoon
(alleen nog een tekst-attributie "varlaks.no" en een Vimeo-embed blijven, zie onder).

## Waarom dit moest
- **Juridisch risico:** een groot deel van de productfoto's werd gehotlinkt van
  de concurrent **Vishandel Klaas Hartevelt** (`vishandelklaashartevelt.nl/wp-content/...`)
  en van andere visbedrijven (mooijer.nl, zalmvanurk.nl, visdenhaag.nl,
  oysterencyclopedia.com). Plus Unsplash-stockfoto's.
- **Stabiliteit:** hotlinks breken zodra die servers wijzigen of hotlink-protection aanzetten.
- **Image-SEO:** externe hotlinks leveren geen eigen, indexeerbare afbeeldingen op.

## Gevonden externe assets (vóór) → vervanging (na)

| Bestand | Blok / product | Externe bron (vóór) | Vervangen door |
|---|---|---|---|
| `src/lib/photos.ts` | volledige set (18) | `images.unsplash.com` | **Bestand verwijderd** (was dode code, nergens geïmporteerd) |
| `src/lib/assortiment-data.ts` | 14 productfoto's | `vishandelklaashartevelt.nl/wp-content/...` (concurrent!) + 1 Unsplash | `photo`-velden verwijderd → eigen merkillustratie per categorie |
| `src/lib/blog.ts` | 8 × `fotoUrl` | Unsplash + mooijer.nl | `/images/scene-*.svg` (thematisch per artikel) |
| `src/lib/recepten.ts` | 16 × `fotoUrl` | Unsplash | `fotoUrl` verwijderd → bestaande `PhotoPlaceholder` fallback |
| `src/app/[locale]/page.tsx` | hero-bg + 3 `<img>` + 6 grid-foto's | Unsplash | `/images/scene-*.svg` + lokale hero-bg |
| `src/app/[locale]/ons-verhaal/page.tsx` | 5 tijdlijn-foto's | Hartevelt CDN | `/images/scene-*.svg` |
| `src/app/[locale]/bezoek-ons/page.tsx` | 4 locatie-foto's | Hartevelt CDN | `/images/scene-*.svg` |
| `src/app/[locale]/biologische-vis/page.tsx` (was eerlijke-vis) | 5 viskaarten + 2 `<img>` | mooijer/oyster/Unsplash/zalmvanurk/visdenhaag | `/images/scene-*.svg` |
| `src/app/[locale]/viswinkel-leiden/page.tsx` | hero-achtergrond | Hartevelt CDN | `/images/scene-vis.svg` |
| `src/app/[locale]/varlaks/page.tsx` | hero-achtergrondvideo | `varlaks.no/...mp4` | `/images/scene-noorwegen.svg` |
| `next.config.ts` | `images.remotePatterns` | `images.unsplash.com` | verwijderd |

## Eigen assets toegevoegd in `/public/images/`
Lichte, schaalbare SVG-merkillustraties in de huisstijlkleuren (geen nepfoto's,
wel eigen en juridisch veilig):

- `scene-vis.svg` — verse vis op ijs (verse-vis, generiek)
- `scene-zalm.svg` — zalmfilet (Varlaks / zalm)
- `scene-noorwegen.svg` — Skjerstadfjorden (Varlaks-herkomst)
- `scene-markt.svg` — marktkraam Leiden
- `scene-gerookt.svg` — gerookte vis
- `scene-haring.svg` — Hollandse Nieuwe
- `scene-schaaldier.svg` — schaal- & schelpdieren
- `scene-winkel.svg` — winkelpui Herenstraat 48
- `og-image.svg` — Open Graph / social card (1200×630)

Elke `<img>` heeft een beschrijvende, lokaal-gerichte `alt`-tekst
(bv. *"Verse biologische Varlaks zalmfilet bij Schaap's Vishandel Leiden"*).

## Bewust behouden (geen hotlink-probleem)
- **Vimeo-embed** op de Varlaks-pagina (`player.vimeo.com/video/...`) — dit is een
  reguliere video-embed (iframe), geen gehotlinkt asset. De tekst-attributie
  "Film door VARLAKS · varlaks.no" is bronvermelding, geen hotlink.

## Aanbeveling
De SVG's zijn nette, eigen tussenoplossing. Vervang ze door **echte foto's** zodra
Lucas die aanlevert — zie `fotos-aan-te-leveren.md`. Lever dan ook een echte
raster **`og-image.png` (1200×630)** aan; sommige sociale platforms tonen geen SVG
als deelafbeelding.
