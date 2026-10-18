// Read-only regression check: catalogue and detail pages share their image source.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
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
const internetSources = JSON.parse(await fs.readFile('scripts/internet-product-sources.json', 'utf8'));
const origin = process.argv[2];
const failures = [];
const selectedImageSources = new Map();
const selectedImageHashes = new Map();
const varlaksImages = [
  '/images/varlaks/from-egg-to-plate-2.jpg.webp',
  '/images/varlaks/from-egg-to-plate-3.jpg.webp',
  '/images/varlaks/from-egg-to-plate-4.jpg.webp',
];
for (const p of products) {
  const photo = productPhoto(p);
  if (!photo) { failures.push({slug:p.slug,error:'Product photo is required'}); continue; }
  selectedImageSources.set(photo.src, [...(selectedImageSources.get(photo.src) || []), p.slug]);
  try {
    const bytes = await fs.readFile('public' + photo.src);
    const hash = crypto.createHash('sha256').update(bytes).digest('hex');
    selectedImageHashes.set(hash, [...(selectedImageHashes.get(hash) || []), p.slug]);
  } catch { /* The local-file check below reports the missing asset with its product source. */ }
}
for (const [source, slugs] of selectedImageSources) if (slugs.length > 1) failures.push({source,slugs,error:'Product image source is reused'});
for (const [hash, slugs] of selectedImageHashes) if (slugs.length > 1) failures.push({hash,slugs,error:'Identical product image bytes are reused'});
for (const source of internetSources) {
  const product = products.find(p => p.slug === source.slug);
  if (!product) failures.push({slug:source.slug,error:'Image provenance references an unknown product'});
  if (!source.src?.startsWith('/') || source.src.startsWith('//')) failures.push({slug:source.slug,error:'Runtime image must use a local site path'});
  if (!source.author || !source.source || !source.license) failures.push({slug:source.slug,error:'Image provenance is incomplete'});
  if (source.src?.startsWith('/') && !source.src.startsWith('//')) {
    try { await fs.access('public' + source.src); }
    catch (error) { failures.push({slug:source.slug,asset:source.src,error:String(error)}); }
  }
}
const assets = new Set([...products.map(p => productPhoto(p)?.src), ...Object.values(BEELD).map(p => p.bestand), ...varlaksImages].filter(Boolean));
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
if (origin) for (const locale of ['nl', 'en', 'de']) {
  try {
    const response = await fetch(`${origin}/${locale}/biologische-vis`);
    const html = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    for (const image of varlaksImages) if (!html.includes(image)) throw new Error(`Supplier image not rendered: ${image}`);
    if (html.includes('varlaks.no/wp-content/uploads')) throw new Error('Supplier image is hotlinked instead of hosted locally');
  } catch (error) { failures.push({locale, page:'biologische-vis', error:String(error)}); }
}
const queue = origin ? products.flatMap(p => ['nl', 'en', 'de'].map(locale => ({p, locale}))) : [];
const recipePaths = new Set();
let checked = 0;
const concurrency = /^http:\/\/(localhost|127\.0\.0\.1):/.test(origin ?? '') ? 1 : 6;
await Promise.all(Array.from({length: concurrency}, async () => {
  while (queue.length) {
    const {p, locale} = queue.shift();
    const photo = productPhoto(p);
    try {
      const response = await fetch(`${origin}/${locale}/assortiment/${p.slug}`);
      const html = await response.text();
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (photo && !html.includes(`src="${photo.src}"`) && !html.includes(encodeURIComponent(photo.src))) throw new Error('Detail image missing');
      if (html.includes('opacity:0.45')) throw new Error('Empty labelled photo placeholder');
      for (const match of html.matchAll(new RegExp(`href="/${locale}/recepten/([^"?#]+)`, 'g'))) {
        recipePaths.add(`/${locale}/recepten/${match[1]}`);
      }
      checked++;
    } catch (error) { failures.push({slug: p.slug, locale, error: String(error)}); }
  }
}));
let recipePagesChecked = 0;
if (origin) {
  for (const locale of ['nl', 'en', 'de']) recipePaths.add(`/${locale}/recepten`);
  await Promise.all(Array.from({length: concurrency}, async () => {
    while (recipePaths.size) {
      const route = recipePaths.values().next().value;
      recipePaths.delete(route);
      try {
        const response = await fetch(`${origin}${route}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        if (html.includes('De site is nog niet open.')) throw new Error('Received access gate instead of recipe content');
        recipePagesChecked++;
      } catch (error) { failures.push({route, error: String(error)}); }
    }
  }));
}
console.log(JSON.stringify({products: products.length, productsWithPhotos: products.filter(p => productPhoto(p)).length, uniqueProductImageSources: selectedImageSources.size, uniqueProductImageBytes: selectedImageHashes.size, locallyHostedSourcedPhotos: internetSources.length, assets: assets.size, livePagesChecked: checked, linkedRecipePagesChecked: recipePagesChecked, failures}, null, 2));
if (failures.length) process.exitCode = 1;
