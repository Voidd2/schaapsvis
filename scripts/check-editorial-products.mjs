import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import ts from 'typescript';
function module(text) {
  const exports = {};
  new Function('exports', ts.transpileModule(text, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText)(exports);
  return exports;
}
const {products} = module(await fs.readFile('src/lib/assortiment-data.ts', 'utf8'));
const {productPhoto} = module(await fs.readFile('src/lib/product-beeld.ts', 'utf8'));
const newSlugs = ['krabsalade', 'noorse-garnalen', 'schol', 'zeebaars', 'zalmsalade', 'tonijnsalade', 'zeeuwse-mosselen'];
const paths = new Set();
for (const slug of newSlugs) {
  const photo = productPhoto(products.find(p => p.slug === slug));
  assert.ok(photo?.editorial, slug);
  assert.ok(!paths.has(photo.src), `${slug}: duplicated image`);
  paths.add(photo.src);
  const bytes = await fs.readFile('public' + photo.src);
  if (slug === 'schol') assert.equal(bytes.readUInt16BE(0), 0xffd8, 'Real unmodified JPEG photograph');
  else {
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  }
  assert.ok(bytes.length > 100_000, `${slug}: suspicious thumbnail`);
  assert.equal(photo.whole, ['schol', 'zeebaars'].includes(slug), `${slug}: crop policy`);
}
const schol = productPhoto(products.find(p => p.slug === 'schol'));
assert.equal(schol.src, '/images/producten-hd/schol-hans-hillewaert.jpg');
assert.equal(schol.credit.author, 'Hans Hillewaert');
const missing = products.filter(p => !productPhoto(p)).map(p => p.slug);
assert.equal(missing.length, 0, 'Every catalogue product must have a photograph');
console.log(JSON.stringify({newUniquePhotos: paths.size, productsWithPhotos: products.length - missing.length, missingPhotos: missing.length, missing}, null, 2));
const origin = process.argv[2];
if (origin) for (const locale of ['nl', 'en', 'de']) {
  const catalogue = await fetch(`${origin}/${locale}/assortiment`);
  assert.ok(catalogue.ok);
  const html = await catalogue.text();
  for (const slug of newSlugs) {
    const photo = productPhoto(products.find(p => p.slug === slug));
    assert.ok(html.includes(encodeURIComponent(photo.src)) || html.includes(photo.src), `${locale}/${slug}: catalogue photo`);
    const response = await fetch(`${origin}/${locale}/assortiment/${slug}`);
    assert.ok(response.ok);
    const detail = await response.text();
    assert.ok(detail.includes(`src="${photo.src}"`) || detail.includes(encodeURIComponent(photo.src)), `${locale}/${slug}: detail photo`);
    if (photo.credit) {
      assert.ok(html.includes(photo.credit.source), `${locale}/${slug}: catalogue attribution`);
      assert.ok(detail.includes(photo.credit.licenseUrl), `${locale}/${slug}: detail license`);
      assert.ok(!detail.includes('/images/editorial/schol-v2.webp'), 'Rejected synthetic plaice must not return');
      const bio = await (await fetch(`${origin}/${locale}/biologische-vis`)).text();
      assert.ok(bio.includes(photo.src) || bio.includes(encodeURIComponent(photo.src)), `${locale}: biological page photo`);
      assert.ok(bio.includes(photo.credit.source), `${locale}: biological page attribution`);
    }
  }
}
