// Recipe image coverage and read-only live verification. No forms or orders.
import fs from 'node:fs/promises';
const origin = process.argv[2];
const sources = await Promise.all(['src/lib/recepten.ts', 'src/lib/recepten-praktisch.ts'].map(p => fs.readFile(p, 'utf8')));
const slugs = sources.flatMap(s => [...s.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]));
const mapSource = await fs.readFile('src/lib/recept-fotos.ts', 'utf8');
const images = Object.fromEntries([...mapSource.matchAll(/"([^"]+)":\s*"(\/images\/recepten\/[^"\n]+)"/g)].map(m => [m[1], m[2]]));
const failures = [];
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
      if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP' || buffer.length > 500_000) failures.push({slug, problem: 'Invalid or unoptimized WebP image'});
      if (origin) {
        const response = await fetch(origin + '/nl/recepten/' + slug);
        const html = await response.text();
        if (response.status !== 200 || !html.includes(image)) failures.push({slug, problem: 'Recipe does not render dish image', status: response.status});
        const schemaBodies = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
        if (!schemaBodies.some(s => s['@type'] === 'Recipe' && s.image?.some(url => url.endsWith(image)))) failures.push({slug, problem: 'Recipe image missing from schema'});
        const asset = await fetch(origin + image);
        if (asset.status !== 200 || !(asset.headers.get('content-type') || '').includes('image/webp')) failures.push({slug, problem: 'Image URL unavailable', status: asset.status});
        await asset.arrayBuffer();
      }
    } catch (error) { failures.push({slug, problem: String(error)}); }
  }
}));
console.log(JSON.stringify({recipes: slugs.length, dishImages: Object.keys(images).length, totalWebpBytes: bytes, liveChecked: Boolean(origin), failures}, null, 2));
if (failures.length) process.exitCode = 1;
