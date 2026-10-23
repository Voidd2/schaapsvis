// Create temporary visual QA sheets for the current recipe photos.
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const sharp = require('sharp');
const ts = require('typescript');

function load(name) {
  const file = path.resolve('src/lib', name + '.ts');
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('exports', 'require', source)(exports, (specifier) => {
    if (specifier.startsWith('./')) return load(specifier.slice(2));
    if (specifier.startsWith('../data/')) {
      return { default: require(path.resolve('src/lib', specifier)) };
    }
    return require(specifier);
  });
  return exports;
}

const { recepten } = load('recepten');
const columns = 4;
const tileWidth = 260;
const tileHeight = 236;
const imageWidth = 244;
const imageHeight = 183;
const perSheet = 20;
const outputDir = path.resolve(process.argv[2] || os.tmpdir());
fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  for (let start = 0; start < recepten.length; start += perSheet) {
    const subset = recepten.slice(start, start + perSheet);
    const composites = [];
    for (let index = 0; index < subset.length; index++) {
      const recipe = subset[index];
      if (!recipe.fotoUrl) throw new Error(`Recipe image missing: ${recipe.slug}`);
      const imagePath = path.resolve('public', recipe.fotoUrl.replace(/^\//, ''));
      if (!fs.existsSync(imagePath)) throw new Error(`Local image missing: ${recipe.slug} (${recipe.fotoUrl})`);
      const left = (index % columns) * tileWidth;
      const top = Math.floor(index / columns) * tileHeight;
      composites.push({
        // Match ReceptFoto's 4:3 card viewport and object-cover crop.
        input: await sharp(imagePath).resize(imageWidth, imageHeight, { fit: 'cover', position: 'attention' }).png().toBuffer(),
        left: left + 8,
        top: top + 4,
      });
      const label = `<svg width="${imageWidth}" height="38"><rect width="100%" height="100%" fill="white"/><text x="5" y="16" font-size="11" font-family="Arial" fill="#06445d">${recipe.slug.replace(/[&<>]/g, '')}</text><text x="5" y="31" font-size="10" font-family="Arial" fill="#547080">${recipe.title.replace(/[&<>]/g, '')}</text></svg>`;
      composites.push({ input: Buffer.from(label), left: left + 8, top: top + imageHeight + 6 });
    }
    const sheet = path.join(outputDir, `schaapsvis-recepten-${Math.floor(start / perSheet) + 1}.jpg`);
    await sharp({
      create: { width: columns * tileWidth, height: Math.ceil(subset.length / columns) * tileHeight, channels: 3, background: '#e8f4f8' },
    }).composite(composites).jpeg({ quality: 85 }).toFile(sheet);
    console.log(sheet);
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
