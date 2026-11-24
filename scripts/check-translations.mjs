// Strict translation coverage and read-only rendered-content checks.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),ts=require('typescript'),cache=new Map();
function load(name){const file=path.resolve('src/lib',name+'.ts');if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;new Function('exports','require',source)(exports,n=>n.startsWith('./')?load(n.slice(2)):n.startsWith('@/lib/')?load(n.slice(6)):n.startsWith('../data/')?{default:require(path.resolve('src/lib',n))}:require(n));return exports;}
const locales=['nl','en','de'],errors=[],pages=[],redirects=[];
const products=load('assortiment-data'),recipes=load('recepten').recepten,blogs=load('blog').blogPosts;
const translatedProducts=load('product-localization'),translatedRecipes=load('recipe-localization'),translatedBlogs=load('blog-localization');
function check(ok,issue){if(!ok)errors.push(issue);}
for(const l of locales){
 for(const p of products.products)try{const t=translatedProducts.localizeProduct(p,l),stock=load('product-availability').productAvailability(p,l);check(t.bevat.length===p.bevat.length,`Allergens ${l}/${p.slug}`);for(const n of [products.getSeizoen(p.slug),products.getViswijzer(p.slug)])if(n)load('product-copy').productNote(n,l);const path = `/${l}/assortiment/${p.slug}`;
  const target = load('product-href').productHref(l, p.slug);
  if (target !== path) redirects.push({path, target, status:308});
  else pages.push({path, title:t.naam, texts:[t.desc,t.ingredienten,...t.bevat,stock.label,stock.note], schema:'WebPage'});}catch(e){errors.push(e.message);}
 for(const r of recipes)try{const t=translatedRecipes.localizeRecipe(r,l);check(!t.hoofdproduct||products.products.some(p=>p.slug===t.hoofdproduct),`Missing recipe product ${r.slug}`);pages.push({path:`/${l}/recepten/${r.slug}`,title:t.title,texts:[t.subtitle,t.verhaal,...t.vanSchaap,...t.vanSupermarkt,...t.bereidingswijze],schema:'Recipe'});}catch(e){errors.push(e.message);}
 for(const b of blogs)try{const t=translatedBlogs.localizeBlog(b,l);for(const slug of b.gerelateerdeRecepten??[])check(recipes.some(r=>r.slug===slug),`Missing blog recipe ${b.slug}: ${slug}`);pages.push({path:`/${l}/blog/${b.slug}`,title:t.title,texts:[t.excerpt,...t.secties.flatMap(s=>[s.kop,...s.alineas]),...(t.vragen??[]).flatMap(q=>[q.v,q.a])].filter(Boolean),schema:'Article'});}catch(e){errors.push(e.message);}
 const months=load('calendar-localization').localizedCalendar(l);check(months.length===12,`Calendar ${l}`);pages.push({path:`/${l}/viskalender`,texts:months.flatMap(m=>[m.naam,m.tekst,m.hoogtepunt,...m.vis.map(v=>v.naam)])});
 for (const kind of ['viswinkel-leiden', 'marktkraam-leiden', 'too-good-to-go']) {
  const c = load('local-pages-copy').localPageCopy(kind, l);
  const shopTexts = c.shop ? Object.values(c.shop) : [];
  pages.push({
   path: `/${l}/${kind}`, title: c.title,
   texts: [c.intro, c.heading, ...c.paragraphs, ...shopTexts, ...c.questions.flatMap(q => [q.v, q.a])],
  });
 }
 const discounts=load('discount-signup').discountSignupCopy(l);
 pages.push({path:`/${l}/aanbiedingen`,title:discounts.title,texts:[discounts.intro,discounts.email,discounts.consent,discounts.submit]});
 const voorschoten={
  nl:{title:'Visboer Voorschoten: elke vrijdag bij Hoogvliet',texts:['Goede vis, persoonlijk advies en duidelijke prijzen. Probeer onze viskraam op vrijdag: van verse zalm voor het avondeten tot krokante kibbeling en haring met uitjes.','De prijs hangt af van de vissoort en hoeveelheid. Vraag ons bij de kraam of vooraf via WhatsApp; we noemen de prijs voordat u beslist.']},
  en:{title:'Fishmonger in Voorschoten: every Friday at Hoogvliet',texts:['Good fish, personal advice and clear pricing. Visit our Friday fish stall: from fresh salmon for dinner to crispy kibbeling and herring with onions.','The price depends on the type and quantity of fish. Ask us at the stall or via WhatsApp in advance; we will tell you the price before you decide.']},
  de:{title:'Fischstand in Voorschoten: jeden Freitag bei Hoogvliet',texts:['Guter Fisch, persönliche Beratung und klare Preise. Besuchen Sie freitags unseren Fischstand: von frischem Lachs fürs Abendessen bis zu knusprigem Kibbeling und Matjes mit Zwiebeln.','Der Preis hängt von Fischart und Menge ab. Fragen Sie uns am Stand oder vorab per WhatsApp; wir nennen Ihnen den Preis, bevor Sie sich entscheiden.']},
 }[l];
 pages.push({path:`/${l}/viswinkel-voorschoten`,title:voorschoten.title,texts:voorschoten.texts});
}
// Every message key must exist in all languages; placeholders must match.
const messages=Object.fromEntries(locales.map(l=>[l,JSON.parse(fs.readFileSync(`src/messages/${l}.json`,'utf8'))]));
const platters=load('visschaal'),photos=load('product-beeld'),selection=load('dirks-selectie');
const catalog=load('seafood-catalog'),festive=load('feestdagen-producten'),pricing=load('gourmet-pricing');
check(selection.DIRKS_SELECTIE.length===30,'Incomplete platter/BBQ selection');
check(selection.DIRKS_VISSCHALEN.length===17,'Incomplete seafood platter selection');
check(selection.DIRKS_BARBECUE.length===13,'Incomplete BBQ/gourmet selection');
for(const item of selection.DIRKS_SELECTIE){
 check(fs.existsSync(`public${item.foto}`),`Missing local photo ${item.slug}`);
 const source=festive.feestdagenProduct(item.slug);
 const loose=pricing.LOOSE_GOURMET_FISH_INDEX[item.slug];
 const expected=source?.prijsCents ?? (loose!==undefined?pricing.GOURMET_RETAIL_CENTS_PER_100G[loose]:item.slug==='zalmspies'?400:Math.round(item.bronPrijs*90));
 check(Math.round(item.prijs*100)===expected,`Retail price ${item.slug}`);
 check(!item.slug.startsWith('vleesschotel-'),`Meat platter included ${item.slug}`);
}
for(const l of locales){
 for(const item of selection.DIRKS_SELECTIE)check(!!selection.selectieNaam(item.slug,l),`Missing selection title ${l}/${item.slug}`);
 const items=messages[l].visschaalItems;
 for(const item of platters.ONDERDELEN){
  for(const key of [item.id,item.toelichting&&`toelichting_${item.id}`,item.perStuk&&`eenheid_${item.perStuk}`,item.seizoen&&`seizoen_${item.seizoen}`].filter(Boolean))check(!!items[key],`Missing platter item ${l}/${key}`);
 }
 for(const group of platters.GROEP_VOLGORDE)for(const prefix of ['groep_','uitleg_'])check(!!items[prefix+group],`Missing platter group ${l}/${group}`);
 const copy=load('catalog-copy').catalogText(l);
 const texts=[copy.title,copy.platters,...catalog.MAIN_PLATTERS.map(slug=>catalog.catalogProduct(slug,l).naam)];
 const home = messages[l].home;
 const locations = load('local-pages-copy').localLocations(l);
 const homeTexts = [
  home.locatiesKop, home.winkelUren, home.winkelPagina, home.marktdagen,
  ...locations.map(p => p.adres),
  ...locations.filter(p => p.id !== 'winkel').map(p => p.dagen),
  ...load('openingHours').openingRows('winkel', l).flatMap(row => [row.label, row.time]),
  ...load('reviews').googleReviews.slice(0,3).map(r => load('reviews').localizeReview(r,l).text),
 ];
 pages.push({path:`/${l}`, texts:homeTexts});
 if (load('seasonal-availability').seasonalCatalogOpen) pages.push({path:`/${l}/visschalen`, texts});
 else redirects.push({path:`/${l}/visschalen`, target:`/${l}/assortiment`, status:307});
 for (const suffix of ['/assortiment','/bezoek-ons','/varlaks','/ons-verhaal','/contact','/recepten','/blog']) {
  pages.push({path:`/${l}${suffix}`, texts:[]});
 }
 for(const p of products.products){const t=translatedProducts.localizeProduct(p,l),photo=photos.productPhoto(t,l);if(photo)check(!!photo.alt,`Missing image description ${l}/${p.slug}`);}
}
for(const p of products.products){
 const alts=locales.map(l=>photos.productPhoto(translatedProducts.localizeProduct(p,l),l)?.alt?.trim()??"");
 if(alts.some(Boolean))for(let i=1;i<alts.length;i++)check(alts[i]!==alts[0],`Product image description not localized ${locales[0]}/${locales[i]}/${p.slug}`);
}
function flatten(value,prefix=''){return Object.fromEntries(Object.entries(value).flatMap(([k,v])=>typeof v==='object'&&v!==null?Object.entries(flatten(v,prefix+k+'.')):[[prefix+k,v]]));}
const flat=Object.fromEntries(locales.map(l=>[l,flatten(messages[l])]));
for(const key of Object.keys(flat.nl))for(const l of ['en','de']){check(key in flat[l],`Missing UI key ${l}/${key}`);const placeholders=s=>[...String(s).matchAll(/\{(\w+)[},]/g)].map(m=>m[1]).sort().join(',');check(placeholders(flat.nl[key])===placeholders(flat[l][key]),`UI placeholders ${l}/${key}`);}
let rendered=0;
const origin=process.argv[2];
function decode(s){return s.replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&apos;|&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();}
if(origin&&!errors.length){
 const queue=[...pages];
 const concurrency=/^http:\/\/(localhost|127\.0\.0\.1):/.test(origin)?1:5;
 await Promise.all(Array.from({length:concurrency},async()=>{
  while(queue.length){
   const p=queue.shift();
   try{
    const res=await fetch(origin+p.path),html=await res.text();
    const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]??'';
    const visible=decode(main.replace(/<script\b[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' '));
    check(res.status===200,p.path+' HTTP '+res.status);
    check(html.includes('rel="canonical" href="https://schaapsvishandel.nl'+p.path+'"'),p.path+' self-canonical');
    if(p.title)check(visible.includes(decode(p.title)),p.path+' title not rendered');
    for(const text of p.texts)check(visible.includes(decode(text)),p.path+' text not rendered: '+text.slice(0,75));
    const alternates=[...html.matchAll(/<link[^>]*rel="alternate"[^>]*>/g)].map(m=>m[0]);
    for(const l of locales){
     const expected='https://schaapsvishandel.nl/'+l+p.path.slice(3);
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
      check(schema.name === localized.title, p.path+' recipe name');
      if (raw.fotoUrl) check(schema.image?.includes('https://schaapsvishandel.nl'+raw.fotoUrl), p.path+' recipe photo');
      else check(!schema.image, p.path+' text-only recipe must not claim a dish photo');
      check(JSON.stringify(schema.recipeIngredient)===JSON.stringify([...localized.vanSchaap,...localized.vanSupermarkt]),p.path+' schema ingredients match visible recipe');
      check(JSON.stringify(schema.recipeInstructions.map(s=>s.text))===JSON.stringify(localized.bereidingswijze),p.path+' schema steps match visible recipe');
      check(!schema.aggregateRating,p.path+' no invented ratings');
     }
    }
    rendered++;
   }catch(e){errors.push(p.path+': '+e.message);}
  }
 }));
 for (const {path, target, status} of redirects) {
  const res = await fetch(origin+path, {redirect:'manual'});
  const location = res.headers.get('location');
  check(res.status === status && location && new URL(location, origin).href === new URL(target, origin).href, path+' redirect to '+target);
  await res.arrayBuffer();
 }
 const icon = await fetch(origin+'/favicon.ico');
 check(icon.ok && /^image\//.test(icon.headers.get('content-type') ?? ''), 'favicon.ico must be an image');
 await icon.arrayBuffer();
 const missing = await fetch(origin+'/unsupported-locale');
 check(missing.status === 404, 'Unknown page should return 404');
 await missing.text();
}
console.log(JSON.stringify({products:products.products.length,recipes:recipes.length,blogs:blogs.length,locales,dataPages:pages.length,rendered,recipesAwaitingPhotos:recipes.filter(r=>!r.fotoUrl).map(r=>r.slug),uiKeys:Object.keys(flat.nl).length,failures:errors.length,details:errors.slice(0,40)},null,2));
if(errors.length)process.exitCode=1;
