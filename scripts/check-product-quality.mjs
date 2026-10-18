import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const sources = JSON.parse(await fs.readFile(new URL('product-image-sources.json', import.meta.url), 'utf8'));
function dimensions(buffer) {
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const type = buffer.toString('ascii', 12, 16);
    if (type === 'VP8X') return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)];
    if (type === 'VP8 ') return [buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff];
    if (type === 'VP8L') { const n = buffer.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >>> 14) & 0x3fff) + 1]; }
    throw new Error('Unsupported WebP header');
  }
  if (buffer.toString('ascii', 1, 4) === 'PNG') return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) throw new Error('Invalid JPEG marker');
      while (buffer[offset] === 0xff) offset++;
      const marker = buffer[offset++];
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      const segmentLength = buffer.readUInt16BE(offset);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return [buffer.readUInt16BE(offset + 5), buffer.readUInt16BE(offset + 3)];
      }
      offset += segmentLength;
    }
    throw new Error('JPEG has no supported frame header');
  }
  throw new Error('Unsupported image format');
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
 ['public/images/assortiment-internet/kippers-craster-commons.jpg',2272,1704],
 ['public/images/assortiment-internet/tilapiafilet-serving-commons.jpg',1280,848],
 ['public/images/varlaks/from-egg-to-plate-2.jpg.webp',600,600],
 ['public/images/varlaks/from-egg-to-plate-3.jpg.webp',600,600],
 ['public/images/varlaks/from-egg-to-plate-4.jpg.webp',600,600],
 ['public/images/producten-hd/sprot-garitzko.jpg',1280,960],
 ['public/images/editorial/gerookte-zalm-serveervoorbeeld.png',1536,1024],
 ['public/images/editorial/creuse-oesters-serveervoorbeeld.png',1536,1024],
 ['public/images/editorial/schar-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/surimisalade-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/bot-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/wijtingfilet-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/victoriabaars-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/gerookte-zalmmoot-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/gerookte-sprotfilet-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/gerookte-heilbot-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/gerookte-forel-heel-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/gerookte-forelfilet-serveervoorbeeld.webp',1448,1086],
 ['public/images/editorial/gebakken-mosselen-serveervoorbeeld.webp',1536,1024],
 ['public/images/editorial/gerookte-kipper-serveervoorbeeld.webp',1536,1024],
]){
  const [actualWidth,actualHeight]=dimensions(await fs.readFile(new URL(file,root)));
  assert.equal(actualWidth,width,file);assert.equal(actualHeight,height,file);
}
console.log('19 additional product and supplier photos validated (metadata inspection only).');
