// Package the owner's original logo for browsers; never redraw or crop it.
import fs from 'node:fs/promises';
import sharp from 'sharp';

const source='public/images/brand/schaapsvis-logo-original.png';
const outputs=[
 [32,'public/schaapsvis-icon-32.png'],
 [192,'public/images/brand/schaapsvis-logo-192.png'],
 [180,'public/schaapsvis-apple-touch-icon.png'],
];
for(const [size,path] of outputs){
 await sharp(source).resize(size,size,{fit:'contain',background:'#ffffff'}).png().toFile(path);
}
const sizes=[32,48,64];
const images=await Promise.all(sizes.map(size=>sharp(source).resize(size,size,{fit:'contain',background:'#ffffff'}).png().toBuffer()));
const header=Buffer.alloc(6+16*images.length);
header.writeUInt16LE(1,2);header.writeUInt16LE(images.length,4);
let offset=header.length;
for(const [i,bytes] of images.entries()){
 const entry=6+i*16;
 header[entry]=sizes[i];header[entry+1]=sizes[i];
 header.writeUInt16LE(1,entry+4);header.writeUInt16LE(32,entry+6);
 header.writeUInt32LE(bytes.length,entry+8);header.writeUInt32LE(offset,entry+12);
 offset+=bytes.length;
}
await fs.writeFile('public/favicon.ico',Buffer.concat([header,...images]));
// Preserve the old URL for existing browser bookmarks, using the same artwork.
const png=await fs.readFile('public/images/brand/schaapsvis-logo-192.png');
await fs.writeFile('public/favicon.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><image width="192" height="192" href="data:image/png;base64,${png.toString('base64')}"/></svg>\n`);
console.log('Original logo packaged as 32/192px PNG, 180px Apple icon, ICO and legacy SVG.');
