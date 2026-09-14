import { Bitter, Source_Sans_3 } from "next/font/google";

/**
 * De twee lettertypen van de site, op één plek.
 *
 * Ze worden meegebouwd en vanaf ons eigen domein geserveerd: dat scheelt een
 * verbinding met Google én voorkomt dat de tekst pas verschijnt als het
 * lettertype binnen is — allebei goed voor de laadscores waar Google op let.
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
export const fontKop = Bitter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-kop",
  display: "swap",
});

export const fontTekst = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
  display: "swap",
});

/** Op het element zetten dat de lettertypen moet doorgeven aan alles eronder. */
export const FONT_KLASSEN = `${fontKop.variable} ${fontTekst.variable}`;
