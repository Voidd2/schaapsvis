// Read-only regression check: catalogue and detail pages share their image source.
import fs from 'node:fs/promises';
import ts from 'typescript';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
async function sourceModule(path) {
  const text = await fs.readFile(path, 'utf8');
  const code = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('exports', 'require', code)(exports, require);
  return exports;
}
const { products } = await sourceModule('src/lib/assortiment-data.ts');
const { productPhoto } = await sourceModule('src/lib/product-beeld.ts');
const { BEELD } = await sourceModule('src/lib/beeld.ts');
const origin = process.argv[2];
const failures = [];
for (const p of products) if (!productPhoto(p)) failures.push({slug:p.slug,error:'Product photo is required'});
const assets = new Set([...products.map(p => productPhoto(p)?.src), ...Object.values(BEELD).map(p => p.bestand)].filter(Boolean));
for (const asset of assets) {
  try {
    await fs.access('public' + asset);
    if (origin) {
      const response = await fetch(origin + asset);
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`HTTP ${response.status}`);
      await response.arrayBuffer();
    }
  } catch (error) { failures.push({asset, error: String(error)}); }
}
const queue = origin ? products.flatMap(p => ['nl', 'en', 'de'].map(locale => ({p, locale}))) : [];
let checked = 0;
await Promise.all(Array.from({length: 6}, async () => {
  while (queue.length) {
    const {p, locale} = queue.shift();
    const photo = productPhoto(p);
    try {
      const response = await fetch(`${origin}/${locale}/assortiment/${p.slug}`);
      const html = await response.text();
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (photo && !html.includes(`src="${photo.src}"`) && !html.includes(encodeURIComponent(photo.src))) throw new Error('Detail image missing');
      if (html.includes('opacity:0.45')) throw new Error('Empty labelled photo placeholder');
      checked++;
    } catch (error) { failures.push({slug: p.slug, locale, error: String(error)}); }
  }
}));
console.log(JSON.stringify({products: products.length, productsWithPhotos: products.filter(p => productPhoto(p)).length, assets: assets.size, livePagesChecked: checked, failures}, null, 2));
if (failures.length) process.exitCode = 1;
