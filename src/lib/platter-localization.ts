import type { Schaal, Regel } from "./visschaal";
import { siteLanguage } from "./language";
const COPY:Record<string,readonly [{naam:string;omschrijving:string;bevat:string[]},{naam:string;omschrijving:string;bevat:string[]}]>={
borrelschaal:[
{naam:"Sharing platter",omschrijving:"Our most requested platter. Enough to share between four to six people alongside other food.",bevat:["Freshly sliced smoked salmon","Dutch shrimp","Herring bites with onion","Smoked mackerel fillet","Salmon and crab salads","Ravigote and cocktail sauces"]},
{naam:"Snackplatte",omschrijving:"Unsere meistgefragte Platte. Für vier bis sechs Personen zum Teilen, zusätzlich zu weiteren Speisen.",bevat:["Frisch aufgeschnittener Räucherlachs","Holländische Garnelen","Matjeshäppchen mit Zwiebeln","Geräuchertes Makrelenfilet","Lachs- und Krabbensalat","Ravigote- und Cocktailsauce"]}],
familieschaal:[
{naam:"Family platter",omschrijving:"The same selection, more generously filled, with smoked eel. For a birthday or a Sunday with the family.",bevat:["Everything from the sharing platter, more generously portioned","Smoked eel","Gravlax","Northern shrimp","Pickled herring and rollmops","Ravigote and cocktail sauces"]},
{naam:"Familienplatte",omschrijving:"Die gleiche Zusammenstellung, großzügiger gefüllt, mit Räucheraal. Für einen Geburtstag oder einen Sonntag mit der Familie.",bevat:["Alles von der Snackplatte, großzügiger portioniert","Räucheraal","Graved Lachs","Nordische Garnelen","Sauer eingelegter Hering und Rollmops","Ravigote- und Cocktailsauce"]}],
feestschaal:[
{naam:"Celebration platter",omschrijving:"The large platter with oysters and prawns. For Christmas, a reception or a larger gathering.",bevat:["Everything from the family platter","Cupped oysters, unopened, with an oyster knife","Prawns","Surimi crab","Smoked herring","Ravigote and cocktail sauces"]},
{naam:"Festplatte",omschrijving:"Die große Platte mit Austern und Garnelen. Für Weihnachten, einen Empfang oder eine größere Gesellschaft.",bevat:["Alles von der Familienplatte","Felsenaustern, ungeöffnet, mit Austernmesser","Garnelen","Surimi","Geräucherter Bückling","Ravigote- und Cocktailsauce"]}]
};
export function localizePlatter(s:Schaal,locale:string):Schaal{const l=siteLanguage(locale);if(l==="nl")return s;const c=COPY[s.id]?.[l==="en"?0:1];if(!c)throw new Error("Missing platter "+s.id);return {...s,...c};}
export function platterName(id:string,locale:string):string|undefined{const l=siteLanguage(locale);return l==="nl"?undefined:COPY[id]?.[l==="en"?0:1].naam;}
const UNITS:Record<string,readonly[string,string]>={"dozijn":["dozen","Dutzend"],"stuk":["piece","Stück"],"set van 3":["set of 3","3er-Set"]};
export function platterQuantity(r:Regel,locale:string):string{const l=siteLanguage(locale);if(r.isSchaal)return "1×";if(r.perStuk){const unit=l==="nl"?r.perStuk:UNITS[r.perStuk]?.[l==="en"?0:1];if(!unit)throw new Error("Missing platter unit "+r.perStuk);return r.hoeveelheid+"× "+unit;}return r.hoeveelheid>=1000?new Intl.NumberFormat(l,{minimumFractionDigits:1,maximumFractionDigits:1}).format(r.hoeveelheid/1000)+" kg":r.hoeveelheid+" g";}
