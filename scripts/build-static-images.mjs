// Reproducible, offline resizing of existing photos. No runtime image service.
// Originals remain untouched; commit generated files with the manifest.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const sources = [...new Set([
 '/images/schaaps/winkel-herenstraat.webp',
 '/images/schaaps/aldert-overname.webp',
 '/images/schaaps/schaaps-viskraam.webp',
 '/images/schaaps/haringkraam-aan-het-water.webp',
 '/images/schaaps/toonbank-marktkraam.webp',
 '/images/editorial/varlaks-zalm-rauw-ai.webp',
 '/images/editorial/kibbeling-schaapstray.png',
 '/images/editorial/feestschaal-voorbeeld.webp',
 '/images/editorial/schaaps-vispakket-v3.webp',
 '/images/assortiment-internet/hollandse-garnalen-solt.jpeg',
 '/images/dirks/scholfilet.webp',
 '/images/dirks/coquilles-vlees.webp',
 '/images/dirks/haring.webp',
 '/images/recepten/zalm-citroen-dille.webp',
 ...JSON.parse(await fs.readFile('src/lib/catalog-image-sources.json','utf8')),
])];
const manifestPath='src/lib/static-image-variants.json';
const check=process.argv.includes('--check');
const existing=check?JSON.parse(await fs.readFile(manifestPath,'utf8')):null;
const manifest={};
for(const src of sources){
 const original=await fs.readFile('public'+src);
 const hash=crypto.createHash('sha256').update(original).digest('hex');
 const metadata=await sharp(original).metadata();
 const widths=[320,640,960,1280].filter(w=>w<=metadata.width);
 if(!widths.length) widths.push(metadata.width);
 const variants=[];
 for(const width of widths){
  const url=`/images/responsive/${path.parse(src).name}-${hash.slice(0,12)}-${width}.webp`;
  const output='public'+url;
  if(!check){
   await fs.mkdir(path.dirname(output),{recursive:true});
   await sharp(original).rotate().resize({width,withoutEnlargement:true}).webp({quality:82,effort:6}).toFile(output);
  }
  const bytes=await fs.readFile(output),image=await sharp(bytes).metadata();
  assert.equal(image.width,width,output);
  assert.equal(image.format,'webp',output);
  variants.push({src:url,width,bytes:bytes.length});
 }
 manifest[src]={sha256:hash,originalBytes:original.length,variants};
}
if(check) assert.deepEqual(manifest,existing,'Regenerate variants after changing source photos');
else await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({sources:sources.length,variants:Object.values(manifest).reduce((n,x)=>n+x.variants.length,0),check}));
