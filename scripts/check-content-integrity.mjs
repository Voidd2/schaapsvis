import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const flatten = (value, prefix = "") => Object.fromEntries(
  Object.entries(value).flatMap(([key, child]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child)
      ? Object.entries(flatten(child, fullKey))
      : [[fullKey, child]];
  }),
);

const localeFiles = ["nl", "en", "de"].map((locale) => ({
  locale,
  values: flatten(JSON.parse(read(`src/messages/${locale}.json`))),
}));
const reference = localeFiles[0];
for (const { locale, values } of localeFiles.slice(1)) {
  const missing = Object.keys(reference.values).filter((key) => !(key in values));
  const extra = Object.keys(values).filter((key) => !(key in reference.values));
  if (missing.length || extra.length) {
    failures.push(`${locale} message keys differ from nl (missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"})`);
  }
}

const productSource = read("src/lib/assortiment-data.ts");
const productsBlock = productSource.match(/export const products: Product\[\] = \[([\s\S]*?)\n\];/)?.[1];
if (!productsBlock) throw new Error("Could not locate the product data array.");
const productSlugs = new Set([...productsBlock.matchAll(/"slug":\s*"([^"]+)"/g)].map((match) => match[1]));

const recipeSource = [read("src/lib/recepten.ts"), read("src/lib/recepten-praktisch.ts")].join("\n");
const recipeSlugs = new Set([...recipeSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]));
const recipeProductRefs = new Set([
  ...[...recipeSource.matchAll(/hoofdproduct:\s*"([^"]+)"/g)].map((match) => match[1]),
  ...[...recipeSource.matchAll(/geschiktVoor:\s*\[([^\]]*)\]/g)].flatMap((match) =>
    [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]),
  ),
]);
const unknownProducts = [...recipeProductRefs].filter((slug) => !productSlugs.has(slug));
if (unknownProducts.length) failures.push(`Recipes reference unknown products: ${unknownProducts.join(", ")}`);

const recipePhotoSource = read("src/lib/recept-fotos.ts");
const recipePhotos = new Map([...recipePhotoSource.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((match) => [match[1], match[2]]));
const missingRecipePhotos = [...recipeSlugs].filter((slug) => !recipePhotos.has(slug));
if (missingRecipePhotos.length) failures.push(`Recipes without a mapped photo: ${missingRecipePhotos.join(", ")}`);
for (const [slug, image] of recipePhotos) {
  if (!recipeSlugs.has(slug)) failures.push(`Recipe photo mapping has no recipe: ${slug}`);
  if (!fs.existsSync(path.join(root, "public", image.replace(/^\//, "")))) failures.push(`Missing recipe image file: ${image}`);
}

if (failures.length) {
  console.error("Content integrity check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Content integrity passed: ${productSlugs.size} products, ${recipeSlugs.size} recipes with existing photos, ${reference.values && Object.keys(reference.values).length} Dutch UI strings with matching EN/DE keys.`);
  console.log("Note: matching translation keys do not replace editorial review of translation quality.");
}
