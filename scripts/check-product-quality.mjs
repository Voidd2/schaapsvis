import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const sharp=createRequire(import.meta.url)('sharp');
const root = new URL('../', import.meta.url);
const sources = JSON.parse(await fs.readFile(new URL('product-image-sources.json', import.meta.url), 'utf8'));
function dimensions(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF');
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP');
  const type = buffer.toString('ascii', 12, 16);
  if (type === 'VP8X') return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)];
  if (type === 'VP8 ') return [buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff];
  if (type === 'VP8L') { const n = buffer.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >>> 14) & 0x3fff) + 1]; }
  throw new Error('Unsupported WebP header');
}
assert.equal(sources.length, 37);
assert.equal(new Set(sources.map(s => s.file)).size, 37);
for (const source of sources) {
  const image = await fs.readFile(new URL(`public/images/producten-hd/${source.file}`, root));
  const [width, height] = dimensions(image);
  assert.equal(width, source.width, source.file);
  assert.equal(height, source.height, source.file);
  assert.ok(width >= 400 && Math.max(width, height) >= 570, `${source.file}: source resolution too low`);
}
for (const file of ['src/lib/assortiment-data.ts', 'src/lib/beeld.ts', 'src/lib/blog.ts', 'src/app/[locale]/page.tsx']) {
  const source = await fs.readFile(new URL(file, root), 'utf8');
  assert.ok(!source.includes('/images/producten/'), `${file} still uses low-resolution thumbnails`);
}
console.log('37 higher-resolution product images validated; no old thumbnail references in catalogue, homepage or blog.');
for(const [file,width,height] of [
 ['public/images/producten-hd/sprot-garitzko.jpg',1280,960],
 ['public/images/editorial/gerookte-zalm-serveervoorbeeld.png',1536,1024],
 ['public/images/editorial/creuse-oesters-serveervoorbeeld.png',1536,1024],
]){
 const metadata=await sharp(await fs.readFile(new URL(file,root))).metadata();
 assert.equal(metadata.width,width,file);assert.equal(metadata.height,height,file);
}
console.log('3 additional high-resolution product photos validated (metadata inspection only).');
