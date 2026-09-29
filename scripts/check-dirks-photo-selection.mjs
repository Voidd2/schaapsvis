import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const map=JSON.parse(await fs.readFile('src/lib/dirks-photo-map.json','utf8'));
const inventory=JSON.parse(await fs.readFile('scripts/dirks-photo-sources.json','utf8'));
const source=new Map(inventory.images.map(image=>[image.slug,image]));
const productFile=await fs.readFile('src/lib/assortiment-data.ts','utf8');
const slugs=new Set([...productFile.matchAll(/"slug": "([^"]+)"/g)].map(match=>match[1]));
const moduleFile=await fs.readFile('src/lib/product-beeld.ts','utf8');
const active=JSON.parse(moduleFile.match(/const dirksPhotoMap: Record<string,string> = (\{[\s\S]*?\});/)?.[1]??'{}');
assert.deepEqual(active,map,'Download and website mappings must match');
for(const [siteSlug,photoSlug] of Object.entries(map)){
 assert.ok(slugs.has(siteSlug),`Retired product mapped: ${siteSlug}`);
 assert.ok(source.has(photoSlug),`Missing source: ${photoSlug}`);
 const bytes=await fs.readFile(`public/images/dirks/${photoSlug}.webp`);
 assert.equal(bytes.toString('ascii',0,4),'RIFF',photoSlug);
 assert.equal(bytes.toString('ascii',8,12),'WEBP',photoSlug);
 assert.ok(bytes.length>40_000,`${photoSlug}: too small`);
}
for(const photoSlug of ['visschotel-hapjes-3-5-pers','visschotel-middel-5-8-pers','visschotel-luxe-10-14-pers','barbecuepakket','barbecuepakket-xxl']){
 await fs.access(`public/images/dirks/${photoSlug}.webp`);
}
assert.equal(inventory.collections.barbecue.length,13,'Complete barbecue/gourmet category');
for(const slug of inventory.collections.barbecue)await fs.access(`public/images/dirks/${slug}.webp`);
const fishPlatters=inventory.collections.platters.filter(slug=>!slug.startsWith('vleesschotel-'));
assert.equal(fishPlatters.length,17,'Complete fish platter category without meat products');
for(const slug of fishPlatters)await fs.access(`public/images/dirks/${slug}.webp`);
for(const file of ['src/lib/product-beeld.ts','src/lib/beeld.ts','src/app/[locale]/assortiment/page.tsx']){
 const code=await fs.readFile(file,'utf8');
 assert.ok(!code.includes('https://www.dirksvishandel.nl/'),`${file}: remote hotlink`);
}
console.log(JSON.stringify({researched:inventory.images.length,mappedProducts:Object.keys(map).length,localExamplePhotos:(await fs.readdir('public/images/dirks')).filter(name=>name.endsWith('.webp')).length,remoteHotlinks:0}));
