# Afronding schaalselectie en vertalingen — 2 november 2026

## Wijzigingen

1. Gerelateerde schaalkaarten gebruiken platterDetailHref met de door de server gelezen searchParams. De bestaande familiemapping valideert alle keuzes; overige producten behouden hun normale route. Ook de fallback van de bovenste teruglink krijgt de parameters mee.
2. Eén tekstlaag `src/lib/platter-product-text.ts` vertaalt alle twaalf producten. Canonieke slugs, prijzen, foto’s, hoeveelheden en allergenensets blijven behouden. Detail, gerelateerde kaarten, alt-teksten, titel/metabeschrijving, Product-schema en WhatsApp gebruiken dezelfde tekst. Overzichtnamen gebruiken deze laag eveneens; overzicht/FAQ en barbecue-indeling blijven behouden.
3. De bestaande taalafhankelijke prijsformatter is gedeeld als `feestdagenBedrag`, zodat grote prijs en formaatopties dezelfde schrijfwijze hebben. Eenheid each/pro Stück op vertaalde details.
4. Toekomstige winkelgevel heeft EN/DE alt-tekst en bijschrift in de beeldregistratie. Zolang bestand ontbreekt blijft de bestaande gelokaliseerde zalmweergave behouden.

## Gecontroleerd

- Volledige reproductie in Chrome: vóór klassiek 8–10, luxe 10–14, hapjes 6–10; klassieke detail → gerelateerde klassieke 3–5 → Alle visschalen: na klassiek 3–5, luxe 10–14, hapjes 6–10. Reload behoudt dit.
- Browser Terug vanuit gerelateerd product herstelt klassieke 8–10; daarna overzicht herstelt de oorspronkelijke drie keuzes. Detailformaatwissel naar 5–8 behoudt luxe/hapjes. Bovenste teruglink landt op #schalen-klassiek.
- Alle 36 details (12 × NL/EN/DE) in Chrome op 1440 CSS-pixels. Echte DOM-uitvoer automatisch vergeleken met de productbron: naam, intro, samenstelling, allergenen, aantallen/afmetingen, prijs, eenheid, opties, alt, metadata, Product-schema, gerelateerde links en WhatsApp.
- Klassiek 8–10, luxe 10–14 en hapjes 6–10 in drie talen op 390 CSS-pixels. Eén te lang Duits samengesteld woord vervangen door ‘Platte mit Fischhäppchen’; hercontrole zonder horizontale overflow. Geen CSS of lay-outwijzigingen nodig.
- Regressietests: overige queryparameters, onbekende/cross-family slugs, niet-schaalroute, oorspronkelijke Nederlandse gegevens, onveranderde bedragen/aantallen, volledige allergenensets, gevel/mock + zalmfallback en bestaande 65 tijdzonegevallen.
- Next-productiebuild, TypeScript, gerichte ESLint, inhoudscontrole, build-targetcontrole en Cloudflare/Vinext-build geslaagd.
- Bewijs: `../design-preview/platter-finish/details-evidence.json` en `mobile-evidence.json`. Reproduceer gegevenscontrole met `PLATTER_DETAIL_EVIDENCE=../design-preview/platter-finish/details-evidence.json node scripts/check-shop-navigation.mjs` (zet de variabele in de gebruikte shell).
- Geen aanvragen, bestellingen, registraties of e-mails verstuurd. Geen nieuwe diensten of kosten.

## Publicatie

PR en productiecontrole volgen. Backend/accounts/toegangsbeveiliging en Wallet zijn ongemoeid.
