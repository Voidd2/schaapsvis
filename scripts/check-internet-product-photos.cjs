// Inspect original bytes, resolution, uniqueness and all language descriptions.
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),path=require('path'),sharp=require('sharp'),ts=require('typescript');
function load(name){const exports={};new Function('exports',ts.transpileModule(fs.readFileSync(`src/lib/${name}.ts`,'utf8'),{compilerOptions:{module:1}}).outputText)(exports);return exports;}
(async()=>{
 const records=JSON.parse(fs.readFileSync('scripts/internet-product-sources.json','utf8'));
 const {products}=load('assortiment-data'),{productPhoto}=load('product-beeld');
 assert.equal(records.length,75);assert.equal(new Set(records.map(p=>p.slug)).size,75);
 const hashes=new Set();let credits=0;
 for(const p of records){
  const product=products.find(x=>x.slug===p.slug);assert.ok(product,p.slug);
  const photo=productPhoto(product);assert.equal(photo.src,p.src,p.slug);
  const bytes=fs.readFileSync('public'+p.src),meta=await sharp(bytes).metadata();
  assert.ok(Math.min(meta.width,meta.height)>=350&&Math.max(meta.width,meta.height)>=600,`${p.slug}: resolution ${meta.width}x${meta.height}`);
  assert.ok(['jpeg','png','webp'].includes(meta.format),p.slug+' format');
  const hash=crypto.createHash('sha256').update(bytes).digest('hex');assert.ok(!hashes.has(hash),p.slug+' duplicate');hashes.add(hash);
  if(p.provider==='commons'){assert.ok(photo.credit?.author&&photo.credit.source&&photo.credit.licenseUrl,p.slug+' attribution');assert.ok(/^(CC BY(-SA)? [\d.]+|CC0|Public domain)$/.test(p.license));credits++;}
  for(const l of ['nl','en','de']){const localized=productPhoto(product,l);assert.ok(localized.alt&&localized.caption,l+'/'+p.slug+' description');}
 }
 assert.equal(products.filter(p=>productPhoto(p)).length,128);
 console.log(JSON.stringify({catalogue:128,photos:128,newInternetPhotos:records.length,uniqueOriginals:hashes.size,licensedPhotos:credits,ownerApprovedHarteveltSources:records.length-credits,localeDescriptions:225,failures:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
