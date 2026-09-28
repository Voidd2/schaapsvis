// Recipe image coverage and read-only live verification. No forms or orders.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const origin = process.argv[2];
const sources = await Promise.all(['src/lib/recepten.ts', 'src/lib/recepten-praktisch.ts'].map(p => fs.readFile(p, 'utf8')));
const slugs = sources.flatMap(s => [...s.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]));
const mapSource = await fs.readFile('src/lib/recept-fotos.ts', 'utf8');
const images = Object.fromEntries([...mapSource.matchAll(/"([^"]+)":\s*"(\/images\/recepten\/[^"\n]+)"/g)].map(m => [m[1], m[2]]));
const failures = [];
const hashes = new Map();
const details = Object.fromEntries(sources.flatMap(source => [...source.matchAll(/  \{\r?\n    slug: "([^"]+)"([\s\S]*?)\r?\n  \},/g)].map(m => [m[1], {porties: Number(m[2].match(/porties: (\d+)/)?.[1]), tijd: m[2].match(/tijd: "([^"]+)"/)?.[1]}])));
let bytes = 0;
const queue = [...slugs];
await Promise.all(Array.from({length: 4}, async () => {
  while (queue.length) {
    const slug = queue.shift();
    const image = images[slug];
    if (!image) { failures.push({slug, problem: 'Missing dish image'}); continue; }
    try {
      const buffer = await fs.readFile('public' + image);
      bytes += buffer.length;
      const hash = createHash('sha256').update(buffer).digest('hex');
      if (hashes.has(hash)) failures.push({slug, problem: 'Duplicate dish photo', other: hashes.get(hash)});
      hashes.set(hash, slug);
      if (!details[slug]?.porties || !details[slug]?.tijd) failures.push({slug, problem: 'Missing portions or total time'});
      if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP' || buffer.length > 500_000) failures.push({slug, problem: 'Invalid or unoptimized WebP image'});
      if (origin) {
        const response = await fetch(origin + '/nl/recepten/' + slug);
        const html = await response.text();
        if (response.status !== 200 || !html.includes(`src="${image}"`)) failures.push({slug, problem: 'Recipe does not render dish image', status: response.status});
        if (html.includes('Wat u hiervoor bij ons haalt:')) failures.push({slug, problem: 'Product photo fallback still visible'});
        const schemaBodies = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
        if (!schemaBodies.some(s => s['@type'] === 'Recipe' && s.image?.some(url => url.endsWith(image)))) failures.push({slug, problem: 'Recipe image missing from schema'});
        if (!schemaBodies.some(s => s['@type'] === 'Recipe' && s.recipeYield === `${details[slug]?.porties} personen` && s.totalTime)) failures.push({slug, problem: 'Recipe portions or total time missing from schema'});
        const asset = await fetch(origin + image);
        if (asset.status !== 200 || !(asset.headers.get('content-type') || '').includes('image/webp')) failures.push({slug, problem: 'Image URL unavailable', status: asset.status});
        await asset.arrayBuffer();
      }
    } catch (error) { failures.push({slug, problem: String(error)}); }
  }
}));
console.log(JSON.stringify({recipes: slugs.length, dishImages: Object.keys(images).length, uniqueDishImages: hashes.size, totalWebpBytes: bytes, liveChecked: Boolean(origin), failures}, null, 2));
if (failures.length) process.exitCode = 1;
