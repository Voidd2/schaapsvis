import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const mod={exports:{}};cache.set(file,mod);
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const local=spec=>spec==='next/server'?{NextResponse:{json:(body,init)=>Response.json(body,init)}}:spec.startsWith('@/')?load('src/'+spec.slice(2)+'.ts'):spec.startsWith('.')?load(path.resolve(path.dirname(file),spec+(path.extname(spec)?'':'.ts'))):require(spec);
 new Function('require','exports','module',code)(local,mod.exports,mod);return mod.exports;
}
// The real handler, isolated from transport; never sends a contact request.
const {POST}=load('src/app/api/bericht/route.ts');
const previousFetch=globalThis.fetch,previousWebhook=process.env.BESTELLING_WEBHOOK_URL;
const deliveries=[];process.env.BESTELLING_WEBHOOK_URL='https://mock.invalid';
globalThis.fetch=async(url,init)=>{assert.equal(url,'https://mock.invalid');deliveries.push(JSON.parse(init.body));return Response.json({ok:true});};
try{
 for(const body of [null,[],{}, {naam:'Test',bericht:'Vraag'},{naam:'Test',bericht:'Vraag',email:'geen-email'},{naam:'Test',bericht:'Vraag',telefoon:'x123'}]){
  const response=await POST({json:async()=>body});assert.equal(response.status,400);
 }
 assert.equal(deliveries.length,0);
 for(const contact of [{email:'test@example.invalid'},{telefoon:'+31 6 1234 5678'},{email:'test@example.invalid',telefoon:'071-1234567'}]){
  const response=await POST({json:async()=>({naam:'Test',bericht:'Test',...contact})});assert.equal(response.status,200);
 }
 assert.equal(deliveries.length,3);assert.equal(deliveries[1].telefoon,'+31 6 1234 5678');
}finally{globalThis.fetch=previousFetch;if(previousWebhook===undefined)delete process.env.BESTELLING_WEBHOOK_URL;else process.env.BESTELLING_WEBHOOK_URL=previousWebhook;}
const {products}=load('src/lib/assortiment-data.ts'),{recepten}=load('src/lib/recepten.ts'),{FEESTDAGEN_PRODUCTEN}=load('src/lib/feestdagen-producten.ts'),{blogPosts}=load('src/lib/blog.ts');
const dir='docs/seo';fs.mkdirSync(dir,{recursive:true});
const rows=recepten.map(r=>({slug:r.slug,title:r.title,product:r.hoofdproduct||null,otherProducts:r.geschiktVoor||[],photo:r.fotoUrl||null,portions:r.porties,time:r.tijd,ingredients:r.vanSchaap.length+r.vanSupermarkt.length,steps:r.bereidingswijze.length,modified:r.bijgewerkt||null}));
const {localizeProduct}=load('src/lib/product-localization.ts'),{localizeRecipe}=load('src/lib/recipe-localization.ts'),{localizeBlog}=load('src/lib/blog-localization.ts'),{productPhoto}=load('src/lib/product-beeld.ts'),{productAvailability}=load('src/lib/product-availability.ts');
// Execute the real localization layer: missing translations and mismatched
// paragraph/ingredient counts must fail, rather than merely counting UI keys.
for(const lang of ['nl','en','de']){
 for(const p of products){const v=localizeProduct(p,lang);assert.ok(v.naam&&v.desc&&v.ingredienten);assert.equal(v.bevat.length,p.bevat.length);assert.ok(productAvailability(v,lang).label);}
 for(const r of recepten){const v=localizeRecipe(r,lang);assert.equal(v.bereidingswijze.length,r.bereidingswijze.length);assert.equal(v.vanSchaap.length,r.vanSchaap.length);assert.equal(v.vanSupermarkt.length,r.vanSupermarkt.length);}
 for(const p of blogPosts){const v=localizeBlog(p,lang);assert.ok(v.title&&v.excerpt);assert.equal(v.secties.length,p.secties.length);v.secties.forEach((section,index)=>assert.equal(section.alineas.length,p.secties[index].alineas.length,`${p.slug}/${lang}: paragraph count`));}
}
const recipeSlugs=new Set(recepten.map(r=>r.slug));
for(const p of blogPosts)for(const slug of p.gerelateerdeRecepten||[])assert.ok(recipeSlugs.has(slug),`${p.slug}: unknown recipe ${slug}`);
const pendingCertificates=new Set(['gerookte-zalm-high-seas','gerookte-zalm-snippers','gerookte-zalmmoot']);
fs.writeFileSync(`${dir}/content-inventory.json`,JSON.stringify({
 recipes:rows,
 products:products.map(p=>({slug:p.slug,name:p.naam,category:p.categorie,intent:'product information, preparation and local enquiry',description:p.desc,availability:p.beschikbaar||'current',image:productPhoto(p)?.src||null,allergens:p.bevat,ingredientsPresent:Boolean(p.ingredienten),certificateLabel:p.badge||null,ownerCertificateNeeded:pendingCertificates.has(p.slug),locales:['nl','en','de'],recipes:rows.filter(r=>r.product===p.slug||r.otherProducts.includes(p.slug)).map(r=>r.slug)})),
 festive:FEESTDAGEN_PRODUCTEN.map(p=>({slug:p.slug,name:p.naam,priceCents:p.prijsCents,image:p.afbeelding,category:p.categorie,intent:'fixed product contents, total price and enquiry',description:p.intro,compositionItems:p.samenstelling.length,allergens:p.allergenen,format:p.formaat||null})),
 blogs:blogPosts.map(p=>({slug:p.slug,title:p.title,intent:p.excerpt,published:p.datum,modified:p.bijgewerkt||null,headings:p.secties.map(s=>s.kop).filter(Boolean),recipes:p.gerelateerdeRecepten||[],links:(p.gerelateerdeLinks||[]).map(l=>l.href),locales:['nl','en','de']}))
},null,2)+'\n');
fs.writeFileSync(`${dir}/recepten-matrix.md`,'# Receptenmatrix\n\nGegenereerd uit de bestaande inhoud; geen nieuwe recepten of foto’s verzonnen. Datum: 3 november 2026. Een ontbrekend gerechtbeeld sluit Google Recipe-rich-results uit; de tekstpagina blijft bruikbaar. Dit is een inhoudsinventaris, geen bewijs dat ieder gerecht culinair getest is.\n\n| Recept | Hoofdproduct | Tijd / porties | Gerechtbeeld | Actie |\n|---|---|---|---|---|\n'+rows.map(r=>`| ${r.title} (${r.slug}) | ${r.product||'Geen specifieke productkoppeling'} | ${r.time} / ${r.portions||'niet vermeld'} | ${r.photo||'Ontbreekt'} | ${r.photo?'Beeldmapping behouden; geen rauwe productfoto substitueren':'Eigen foto van bereid gerecht aanleveren'} |`).join('\n')+'\n\nGeen synoniemrecepten toegevoegd. Controleer bij uitbreiding eerst hoofdproduct én bereidingswijze in deze matrix. Product- en blogkoppelingen: [volledige inventaris](content-inventory.json).\n');
console.log(JSON.stringify({contactCases:9,realMessagesSent:0,products:products.length,recipes:rows.length,missingDishImages:rows.filter(r=>!r.photo).map(r=>r.slug),festive:FEESTDAGEN_PRODUCTEN.length,blogs:blogPosts.length}));
