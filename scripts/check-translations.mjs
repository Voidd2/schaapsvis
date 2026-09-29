// Strict translation coverage and read-only rendered-content checks.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),ts=require('typescript'),cache=new Map();
function load(name){const file=path.resolve('src/lib',name+'.ts');if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;new Function('exports','require',source)(exports,n=>n.startsWith('./')?load(n.slice(2)):n.startsWith('@/lib/')?load(n.slice(6)):require(n));return exports;}
const locales=['nl','en','de'],errors=[],pages=[];
const products=load('assortiment-data'),recipes=load('recepten').recepten,blogs=load('blog').blogPosts;
const translatedProducts=load('product-localization'),translatedRecipes=load('recipe-localization'),translatedBlogs=load('blog-localization');
function check(ok,issue){if(!ok)errors.push(issue);}
for(const l of locales){
 for(const p of products.products)try{const t=translatedProducts.localizeProduct(p,l);check(t.bevat.length===p.bevat.length,`Allergens ${l}/${p.slug}`);for(const n of [products.getSeizoen(p.slug),products.getViswijzer(p.slug)])if(n)load('product-copy').productNote(n,l);pages.push({path:`/${l}/assortiment/${p.slug}`,title:t.naam,texts:[t.desc,t.ingredienten,...t.bevat],schema:'Product'});}catch(e){errors.push(e.message);}
 for(const r of recipes)try{const t=translatedRecipes.localizeRecipe(r,l);check(!t.hoofdproduct||products.products.some(p=>p.slug===t.hoofdproduct),`Missing recipe product ${r.slug}`);pages.push({path:`/${l}/recepten/${r.slug}`,title:t.title,texts:[t.subtitle,t.verhaal,...t.vanSchaap,...t.vanSupermarkt,...t.bereidingswijze],schema:'Recipe'});}catch(e){errors.push(e.message);}
 for(const b of blogs)try{const t=translatedBlogs.localizeBlog(b,l);for(const slug of b.gerelateerdeRecepten??[])check(recipes.some(r=>r.slug===slug),`Missing blog recipe ${b.slug}: ${slug}`);pages.push({path:`/${l}/blog/${b.slug}`,title:t.title,texts:[t.excerpt,...t.secties.flatMap(s=>[s.kop,...s.alineas]),...(t.vragen??[]).flatMap(q=>[q.v,q.a])].filter(Boolean),schema:'Article'});}catch(e){errors.push(e.message);}
 const months=load('calendar-localization').localizedCalendar(l);check(months.length===12,`Calendar ${l}`);pages.push({path:`/${l}/viskalender`,texts:months.flatMap(m=>[m.naam,m.tekst,m.hoogtepunt,...m.vis.map(v=>v.naam)])});
 for(const kind of ['viswinkel-leiden','marktkraam-leiden','too-good-to-go']){const c=load('local-pages-copy').localPageCopy(kind,l);pages.push({path:`/${l}/${kind}`,title:c.title,texts:[c.intro,c.heading,...c.paragraphs,...c.questions.flatMap(q=>[q.v,q.a])]});}
}
// Every message key must exist in all languages; placeholders must match.
const messages=Object.fromEntries(locales.map(l=>[l,JSON.parse(fs.readFileSync(`src/messages/${l}.json`,'utf8'))]));
const platters=load('visschaal'),platterCopy=load('platter-localization'),photos=load('product-beeld');
for(const l of locales){
 const items=messages[l].visschaalItems;
 for(const item of platters.ONDERDELEN){
  for(const key of [item.id,item.toelichting&&`toelichting_${item.id}`,item.perStuk&&`eenheid_${item.perStuk}`,item.seizoen&&`seizoen_${item.seizoen}`].filter(Boolean))check(!!items[key],`Missing platter item ${l}/${key}`);
 }
 for(const group of platters.GROEP_VOLGORDE)for(const prefix of ['groep_','uitleg_'])check(!!items[prefix+group],`Missing platter group ${l}/${group}`);
 const texts=platters.SCHALEN.flatMap(s=>{const t=platterCopy.localizePlatter(s,l);check(t.bevat.length===s.bevat.length,`Platter ingredients ${l}/${s.id}`);return [t.naam,t.omschrijving,...t.bevat];});
 for(const suffix of ['','/visschalen','/assortiment','/bezoek-ons','/biologische-vis','/varlaks','/ons-verhaal','/contact','/recepten','/blog','/viswinkel-voorschoten'])pages.push({path:`/${l}${suffix}`,texts:suffix==='/visschalen'?texts:[]});
 for(const p of products.products){const t=translatedProducts.localizeProduct(p,l),photo=photos.productPhoto(t,l);if(photo)check(!!photo.alt,`Missing image description ${l}/${p.slug}`);}
}
function flatten(value,prefix=''){return Object.fromEntries(Object.entries(value).flatMap(([k,v])=>typeof v==='object'&&v!==null?Object.entries(flatten(v,prefix+k+'.')):[[prefix+k,v]]));}
const flat=Object.fromEntries(locales.map(l=>[l,flatten(messages[l])]));
for(const key of Object.keys(flat.nl))for(const l of ['en','de']){check(key in flat[l],`Missing UI key ${l}/${key}`);const placeholders=s=>[...String(s).matchAll(/\{(\w+)[},]/g)].map(m=>m[1]).sort().join(',');check(placeholders(flat.nl[key])===placeholders(flat[l][key]),`UI placeholders ${l}/${key}`);}
let rendered=0;
const origin=process.argv[2];
function decode(s){return s.replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&apos;|&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();}
if(origin&&!errors.length){
 const queue=[...pages];
 await Promise.all(Array.from({length:5},async()=>{
  while(queue.length){
   const p=queue.shift();
   try{
    const res=await fetch(origin+p.path),html=await res.text();
    const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]??'';
    const visible=decode(main.replace(/<script\b[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' '));
    check(res.status===200,p.path+' HTTP '+res.status);
    check(html.includes('rel="canonical" href="https://www.schaapsvishandel.nl'+p.path+'"'),p.path+' self-canonical');
    if(p.title)check(visible.includes(decode(p.title)),p.path+' title not rendered');
    for(const text of p.texts)check(visible.includes(decode(text)),p.path+' text not rendered: '+text.slice(0,75));
    const alternates=[...html.matchAll(/<link[^>]*rel="alternate"[^>]*>/g)].map(m=>m[0]);
    for(const l of locales){
     const expected='https://www.schaapsvishandel.nl/'+l+p.path.slice(3);
     check(alternates.some(tag=>(tag.includes('hrefLang="'+l+'"')||tag.includes('hreflang="'+l+'"'))&&tag.includes('href="'+expected+'"')),p.path+' hreflang target '+l);
    }
    if(p.schema){
     const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
     const schema=schemas.find(s=>s['@type']===p.schema);
     check(!!schema,p.path+' schema '+p.schema);
     if(schema?.inLanguage)check(schema.inLanguage.startsWith(p.path.split('/')[1]),p.path+' schema language');
     if(schema&&p.schema==='Recipe'){
      const raw=recipes.find(r=>r.slug===p.path.split('/').pop());
      const localized=translatedRecipes.localizeRecipe(raw,p.path.split('/')[1]);
      check(!!schema.name&&schema.image?.length>0,p.path+' required recipe properties');
      check(JSON.stringify(schema.recipeIngredient)===JSON.stringify([...localized.vanSchaap,...localized.vanSupermarkt]),p.path+' schema ingredients match visible recipe');
      check(JSON.stringify(schema.recipeInstructions.map(s=>s.text))===JSON.stringify(localized.bereidingswijze),p.path+' schema steps match visible recipe');
      check(!schema.aggregateRating,p.path+' no invented ratings');
     }
    }
    rendered++;
   }catch(e){errors.push(p.path+': '+e.message);}
  }
 }));
}
console.log(JSON.stringify({products:products.products.length,recipes:recipes.length,blogs:blogs.length,locales,dataPages:pages.length,rendered,uiKeys:Object.keys(flat.nl).length,failures:errors.length,details:errors.slice(0,40)},null,2));
if(errors.length)process.exitCode=1;
