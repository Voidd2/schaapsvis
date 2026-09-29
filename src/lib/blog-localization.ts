import type { BlogPost } from "./blog";
import { BLOG_TRANSLATIONS } from "./blog-translations";
import { siteLanguage } from "./language";
import { blogCopy } from "./blog-copy";
import { bestelContact } from "./bestel-contact";
import { localizedProduct } from "./product-localization";
const LINKS:Record<string,readonly[string,string]>={"/viswinkel-voorschoten":["Our Voorschoten fish stall: hours and directions","Unser Fischstand in Voorschoten: Zeiten und Anfahrt"],"/viskalender":["Fish calendar","Fischkalender"],"/visschalen":["Build a seafood platter","Fischplatte zusammenstellen"],"/assortiment":["Browse our range","Unser Sortiment ansehen"],"/bezoek-ons":["Locations, hours and directions","Standorte, Zeiten und Anfahrt"],"/ons-verhaal":["Our story","Unsere Geschichte"],"/biologische-vis":["Organic fish and certifications","Bio-Fisch und Siegel"],"/varlaks":["Our VÅRLAKS salmon","Unser VÅRLAKS-Lachs"],"https://varlaks.no/":["VÅRLAKS — supplier information","VÅRLAKS — Informationen des Lieferanten"],"https://www.goodfish.nl/nl/makreel-overbevist-en-vanaf-vandaag-in-het-rood-op-de-viswijzer/":["Good Fish: background to mackerel advice (Dutch)","Good Fish: Hintergrund zum Makrelenrat (Niederländisch)"],"https://www.voedingscentrum.nl/nl/thema/5xveilig/vis.aspx":["Dutch Nutrition Centre: safe handling of fish (Dutch)","Niederländisches Ernährungszentrum: sicherer Umgang mit Fisch"],"https://www.voedingscentrum.nl/encyclopedie/vis.aspx":["Dutch Nutrition Centre: storage, preparation and nutrition (Dutch)","Niederländisches Ernährungszentrum: Lagerung, Zubereitung und Ernährung"]};
export function localizeBlog(post:BlogPost,locale:string):BlogPost {
 const lang=siteLanguage(locale);if(lang==="nl")return post;
 const t=BLOG_TRANSLATIONS[post.slug]?.[lang];if(!t)throw new Error(`Missing ${lang} blog ${post.slug}`);
 if(t.sections.length!==post.secties.length||t.sections.some((s,i)=>s.alineas.length!==post.secties[i].alineas.length))throw new Error(`Blog paragraph mismatch ${lang}/${post.slug}`);
 if((t.questions?.length??0)!==(post.vragen?.length??0))throw new Error(`Blog FAQ mismatch ${lang}/${post.slug}`);
 const date=new Intl.DateTimeFormat(lang==="en"?"en-GB":"de-DE",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(post.bijgewerkt??post.datum));
 const links=post.gerelateerdeLinks?.map(link=>{
 if(link.href.startsWith("https://wa.me/"))return bestelContact(lang);
 let label:string|undefined=LINKS[link.href]?.[lang==="en"?0:1];
 if(link.href.startsWith("/blog/"))label=BLOG_TRANSLATIONS[link.href.slice(6)]?.[lang]?.title;
 if(link.href.startsWith("/assortiment/"))label=localizedProduct(link.href.slice("/assortiment/".length),lang)?.naam;
 if(!label)throw new Error(`Missing ${lang} blog link ${link.href}`);
 return {...link,label};
 });
 return {...post,title:t.title,excerpt:t.excerpt,fotoAlt:t.photo,secties:t.sections,vragen:t.questions,datumLabel:post.bijgewerkt?`${blogCopy(lang).updated} ${date}`:date,leestijd:lang==="de"?post.leestijd.replace("min","Min."):post.leestijd,gerelateerdeLinks:links,seoKeywords:`${t.title}, ${t.excerpt}`};
}
