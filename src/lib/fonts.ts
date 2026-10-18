import localFont from "next/font/local";

/**
 * De twee lettertypen van de site, op één plek.
 *
 * De subsetbestanden staan in src/fonts en worden vanaf ons eigen domein
 * geserveerd. Builds hoeven daardoor niet met Google Fonts te verbinden.
 *
 * **Bitter** voor de koppen: een schreefletter met blokvoetjes, zoals de letters
 * op een oud winkelbord, maar getekend voor een scherm. Hiervoor stond er Libre
 * Caslon — een boekletter uit de achttiende eeuw, mooi op papier maar op een
 * telefoon net te dun en te sierlijk voor een viswinkel.
 *
 * **Source Sans** voor lopende tekst, formulieren en prijzen.
 *
 * Ze staan hier en niet in de layout omdat het wachtwoordscherm (`/coming-soon`)
 * buiten de taal-layout valt en ze óók nodig heeft. Stond het daar niet, dan
 * viel dat scherm terug op de systeemletter — precies het eerste wat een
 * bezoeker van de site te zien krijgt.
 */
export const fontKop = localFont({
  src: [
    { path: "../fonts/bitter-latin.woff2", weight: "500 700", style: "normal" },
    { path: "../fonts/bitter-latin-italic.woff2", weight: "500 700", style: "italic" },
  ],
  variable: "--font-kop",
  display: "swap",
});

export const fontTekst = localFont({
  src: "../fonts/source-sans-3-latin.woff2",
  weight: "400 700",
  variable: "--font-source",
  display: "swap",
});

/** Op het element zetten dat de lettertypen moet doorgeven aan alles eronder. */
export const FONT_KLASSEN = `${fontKop.variable} ${fontTekst.variable}`;
