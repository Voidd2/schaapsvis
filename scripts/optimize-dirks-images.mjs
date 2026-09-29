// Mechanical lossless-dimension / lossy-codec conversion for deployable local assets.
// Original downloads remain ignored in public/images/dirks for the owner to replace.
import { createRequire } from 'node:module';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url);
const sharp=require('sharp');
const folder=path.resolve('public/images/dirks');
const originals=(await readdir(folder)).filter(name=>name.endsWith('.jpg'));
let bytes=0;
for(const name of originals){
 const input=path.join(folder,name),output=input.slice(0,-4)+'.webp';
 try {if((await stat(output)).mtimeMs<(await stat(input)).mtimeMs)throw Error('outdated');}
 catch {await sharp(input).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:84,effort:5}).toFile(output);}
 bytes+=(await stat(output)).size;
}
console.log(JSON.stringify({files:originals.length,optimizedBytes:bytes}));
