// Convert reviewed selections into an auditable source manifest (stdout only).
import fs from 'node:fs/promises';
const selections=JSON.parse(await fs.readFile('scripts/product-photo-selections.json','utf8'));
const research=JSON.parse(await fs.readFile('../../outputs/fish-photo-research.json','utf8'));
const hartevelt=JSON.parse(await fs.readFile('../../outputs/hartevelt-media.json','utf8'));
const records=selections.map(([slug,provider,key,index,kind])=>{
 let p;
 if(provider==='commons')p=research.find(r=>r.term===key)?.photos[index];
 else {const m=hartevelt.find(m=>m.url.endsWith('/'+key));if(m)p={url:m.url,source:m.url,width:m.w,height:m.h,author:'Vishandel Hartevelt',license:'Owner-approved source; independent reuse permission not verified'};}
 if(!p)throw new Error('Missing reviewed source: '+slug);
 if(!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(p.url))throw new Error('Not a photo: '+slug);
 const ext=provider==='commons'?(/\.png(?:\?|$)/i.test(p.url)?'png':'jpg'):key.split('.').pop();
 return {slug,src:`/images/assortiment-internet/${slug}.${ext}`,kind,provider,...p};
});
// Preserve later individually reviewed additions, including supplier photos.
const existing=JSON.parse(await fs.readFile('scripts/internet-product-sources.json','utf8'));
const decisions=JSON.parse(await fs.readFile('src/lib/assortiment-besluiten.json','utf8'));
const selected=new Set(records.map(p=>p.slug));
const preserved=existing.filter(p=>!selected.has(p.slug)&&!decisions.removed.includes(p.slug));
console.log(JSON.stringify([...records,...preserved],null,2));
