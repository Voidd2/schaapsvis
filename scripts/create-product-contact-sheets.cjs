// Build temporary visual QA sheets for the active catalogue photos.
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const sharp = require('sharp');
const ts = require('typescript');

function load(name) {
  const exports = {};
  const source = fs.readFileSync(`src/lib/${name}.ts`, 'utf8');
  const js = ts.transpileModule(source, {compilerOptions: {module: 1}}).outputText;
  new Function('exports', js)(exports);
  return exports;
}

const {products} = load('assortiment-data');
const {productPhoto} = load('product-beeld');
const columns = 4, tileWidth = 220, tileHeight = 190, perSheet = 24;
const outputDir = path.resolve(process.argv[2] || os.tmpdir());
fs.mkdirSync(outputDir, {recursive: true});

(async () => {
  for (let start = 0; start < products.length; start += perSheet) {
    const subset = products.slice(start, start + perSheet);
    const composites = [];
    for (let index = 0; index < subset.length; index++) {
      const product = subset[index];
      const photo = productPhoto(product);
      const left = (index % columns) * tileWidth;
      const top = Math.floor(index / columns) * tileHeight;
      composites.push({
        input: await sharp(`public${photo.src}`).resize(204, 136, {fit: 'contain', background: '#f1f7fa'}).png().toBuffer(),
        left: left + 8,
        top: top + 4,
      });
      const label = `<svg width="204" height="38"><rect width="100%" height="100%" fill="white"/><text x="5" y="24" font-size="12" font-family="Arial" fill="#06445d">${product.slug.replace(/[&<>]/g, '')}</text></svg>`;
      composites.push({input: Buffer.from(label), left: left + 8, top: top + 144});
    }
    const sheet = path.join(outputDir, `schaapsvis-contact-${Math.floor(start / perSheet) + 1}.jpg`);
    await sharp({
      create: {width: columns * tileWidth, height: Math.ceil(subset.length / columns) * tileHeight, channels: 3, background: '#e8f4f8'},
    }).composite(composites).jpeg({quality: 82}).toFile(sheet);
    console.log(sheet);
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
