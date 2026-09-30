import type { Schaal, Regel } from "./visschaal";
import { siteLanguage } from "./language";
import { DIRKS_VISSCHALEN, selectieNaam } from "./dirks-selectie";
const COPY:Record<string,readonly [{naam:string;omschrijving:string;bevat:string[]},{naam:string;omschrijving:string;bevat:string[]}]>={
borrelschaal:[
{naam:"Sharing platter",omschrijving:"A seafood platter for a get-together. Tell us what you like and we will discuss a suitable selection.",bevat:[]},
{naam:"Snackplatte",omschrijving:"Eine Fischplatte für geselliges Beisammensein. Teilen Sie uns Ihre Wünsche mit; wir beraten Sie zur Auswahl.",bevat:[]}],
familieschaal:[
{naam:"Family platter",omschrijving:"A larger seafood platter for family and friends. Tell us which fish you like and we will discuss the selection.",bevat:[]},
{naam:"Familienplatte",omschrijving:"Eine größere Fischplatte für Familie und Freunde. Teilen Sie uns Ihre Wünsche mit; wir stimmen die Auswahl mit Ihnen ab.",bevat:[]}],
feestschaal:[
{naam:"Celebration platter",omschrijving:"A festive seafood platter for a special occasion. Tell us about your guests and we will help plan the selection.",bevat:[]},
{naam:"Festplatte",omschrijving:"Eine festliche Fischplatte für einen besonderen Anlass. Erzählen Sie uns von Ihren Gästen; wir planen gern die Auswahl mit Ihnen.",bevat:[]}]
};
export function localizePlatter(s:Schaal,locale:string):Schaal{
  const l=siteLanguage(locale);
  if(l==="nl")return s;
  const c=COPY[s.id]?.[l==="en"?0:1];
  if(c)return {...s,...c};
  const item=DIRKS_VISSCHALEN.find(x=>x.slug===s.id);
  if(!item)throw new Error("Missing platter "+s.id);
  const omschrijving=l==="en"
    ? item.groep==="borrelbox"?"A seafood box for sharing. We agree the exact selection and presentation with you.":item.groep==="hapjes"?"Small seafood bites to share. Ask us about today's selection.":item.groep==="luxe"?"A more generous seafood selection for a special occasion. Contents depend on your wishes and fresh supply.":"A platter of fish and seafood. Tell us what you would like on it."
    : item.groep==="borrelbox"?"Eine Fischbox zum Teilen. Inhalt und Präsentation stimmen wir mit Ihnen ab.":item.groep==="hapjes"?"Kleine Fischhäppchen zum Teilen. Fragen Sie nach der aktuellen Auswahl.":item.groep==="luxe"?"Eine großzügigere Fischauswahl für besondere Anlässe. Der Inhalt richtet sich nach Ihren Wünschen und der frischen Lieferung.":"Eine Platte mit Fisch und Meeresfrüchten. Sagen Sie uns, was Sie gern darauf hätten.";
  return {...s,naam:selectieNaam(s.id,locale),omschrijving};
}
export function platterName(id:string,locale:string):string|undefined{const l=siteLanguage(locale);if(l==="nl")return undefined;return COPY[id]?.[l==="en"?0:1].naam ?? (DIRKS_VISSCHALEN.some(x=>x.slug===id)?selectieNaam(id,locale):undefined);}
const UNITS:Record<string,readonly[string,string]>={"dozijn":["dozen","Dutzend"],"stuk":["piece","Stück"],"set van 3":["set of 3","3er-Set"]};
export function platterQuantity(r:Regel,locale:string):string{const l=siteLanguage(locale);if(r.isSchaal)return `${r.personen ?? r.hoeveelheid} ${l==="en"?"people":l==="de"?"Personen":"personen"}`;if(r.perStuk){const unit=l==="nl"?r.perStuk:UNITS[r.perStuk]?.[l==="en"?0:1];if(!unit)throw new Error("Missing platter unit "+r.perStuk);return r.hoeveelheid+"× "+unit;}return r.hoeveelheid>=1000?new Intl.NumberFormat(l,{minimumFractionDigits:1,maximumFractionDigits:1}).format(r.hoeveelheid/1000)+" kg":r.hoeveelheid+" g";}
