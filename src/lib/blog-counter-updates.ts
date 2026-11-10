import type { BlogPost } from "./blog";
type Revision={intro?:string[];heading?:string[];text?:string[];photo?:string[];links:string[][]};
const revisions:Record<string,Revision>={
  "kibbeling-vs-lekkerbek-het-verschil": {
    "intro": [
      "Kibbeling bestaat bij Schaap’s uit stukjes pollak in beslag. Een lekkerbek is één hele heekfilet in een krokant jasje.",
      "At Schaap’s, kibbeling is battered pollack in bite-sized pieces. A lekkerbek is one whole hake fillet in a crisp coating.",
      "Bei Schaap’s besteht Kibbeling aus kleinen Seelachsstücken im Backteig. Ein Lekkerbek ist ein ganzes Seehechtfilet in knuspriger Hülle."
    ],
    "links": [
      [
        "/assortiment/kibbeling",
        "Bekijk de kibbeling"
      ],
      [
        "/assortiment/lekkerbek",
        "Bekijk de lekkerbek"
      ],
      [
        "/viswinkel-leiden",
        "Route naar de Leidse winkel"
      ]
    ]
  },
  "de-echte-hollandse-garnaal": {
    "heading": [
      "Hollandse garnalen aan de toonbank",
      "Dutch brown shrimp at our counter",
      "Nordseegarnelen an unserer Theke"
    ],
    "text": [
      "Onze Hollandse garnalen komen van vijf vissers uit Zoutkamp. Hun verhaal verbindt Zoutkamp met de haven van Lauwersoog. Op de verpakking vindt u het MSC-keurmerk voor de wildvangst.",
      "Our Dutch brown shrimp come from five fishers in Zoutkamp. Their story links Zoutkamp with the port of Lauwersoog. The pack carries the MSC mark for wild-caught seafood.",
      "Unsere Nordseegarnelen stammen von fünf Fischern aus Zoutkamp. Ihre Geschichte verbindet Zoutkamp mit dem Hafen von Lauwersoog. Auf der Packung steht das MSC-Siegel für Wildfang."
    ],
    "links": [
      [
        "https://www.soltmen.com/ons-avontuur/",
        "Lees het verhaal van de vissers"
      ],
      [
        "/assortiment/hollandse-garnalen",
        "Bekijk onze Hollandse garnalen"
      ]
    ],
    "photo": [
      "Bakjes Hollandse garnalen",
      "Packs of Dutch brown shrimp",
      "Packungen mit Nordseegarnelen"
    ]
  },
  "hoeveel-vis-per-persoon": {
    "heading": [
      "Drie of vier personen aan het gourmetstel",
      "Three or four at a tabletop grill",
      "Tischgrill für drei oder vier Personen"
    ],
    "text": [
      "Onze vaste gourmetschaal voor 3–4 personen bevat 1.000 gram vis en garnalen. Met vier personen komt dat neer op 250 gram per persoon; voor drie is dezelfde schaal royaler. Dat is het gewicht van de inhoud, zonder de verpakking. Voor een borrel met brood en salades kiest u een ander formaat dan voor een volledige maaltijd.",
      "Our platter for three to four contains 1,000 g of fish and prawns. Shared by four, that is 250 g each; shared by three, the portions are larger. This is the weight of the contents without packaging. A few bites with bread and salads call for a different portion from a full meal.",
      "Unsere Platte für drei bis vier enthält 1.000 g Fisch und Garnelen. Zu viert sind das 250 g pro Person, zu dritt größere Portionen. Das ist das Gewicht ohne Verpackung. Für einen Imbiss mit Brot und Salat brauchen Sie eine andere Menge als für eine Hauptmahlzeit."
    ],
    "links": [
      [
        "/blog/welke-vis-voor-gourmet",
        "Welke vis past in een gourmetpannetje?"
      ]
    ]
  },
  "marktdag-in-leiden-achter-de-kraam": {
    "intro": [
      "Woensdag zoekt u onze viskraam op de Botermarkt bij Dille & Kamille. Zaterdag staat dezelfde visfamilie op de Aalmarkt bij De Waag. Zo ziet een marktochtend eruit.",
      "On Wednesdays, find our stall on Botermarkt by Dille & Kamille. On Saturdays, the family sets up on Aalmarkt by De Waag. Here is what a morning at the market looks like.",
      "Mittwochs finden Sie unseren Stand am Botermarkt bei Dille & Kamille. Samstags steht unsere Familie am Aalmarkt bei De Waag. So beginnt ein Marktmorgen."
    ],
    "links": [
      [
        "/marktkraam-leiden",
        "Bekijk de routes naar onze marktkraam"
      ]
    ]
  }
};
export function reviseCounterPost(post:BlogPost, index:number):BlogPost {
 const u=revisions[post.slug]; if(!u)return post;
 const links=[...(post.gerelateerdeLinks??[])];
 if(index===0)for(const [href,label] of u.links)if(!links.some(l=>l.href===href))links.push({href,label});
 return {...post,bijgewerkt:"2026-11-09",datumLabel:["Bijgewerkt 9 november 2026","Updated 9 November 2026","Aktualisiert am 9. November 2026"][index],gerelateerdeLinks:links,fotoAlt:u.photo?.[index]??post.fotoAlt,excerpt:u.intro?.[index]??post.excerpt,secties:u.heading&&u.text?[...post.secties,{kop:u.heading[index],alineas:[u.text[index]]}]:post.secties};
}
