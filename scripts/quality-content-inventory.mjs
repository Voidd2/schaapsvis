import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

// Run the real pure TypeScript modules without introducing a test dependency.
const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  if (file.endsWith(".json")) return JSON.parse(fs.readFileSync(file, "utf8"));
  const mod = { exports: {} };
  cache.set(file, mod);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const localRequire = spec => spec.startsWith(".")
    ? load(path.resolve(path.dirname(file), spec + (path.extname(spec) ? "" : ".ts")))
    : require(spec);
  new Function("require", "exports", "module", code)(localRequire, mod.exports, mod);
  return mod.exports;
}

const {recepten}=load('src/lib/recepten.ts');
const {blogPosts}=load('src/lib/blog.ts');
for(const word of ['haring','schol','wijting','makreel','tonijn','zalm','kabeljauw','garnalen']) console.log(word, recepten.filter(r=>[r.hoofdproduct,...r.geschiktVoor??[],r.slug].some(p=>p?.includes(word))).map(r=>r.slug));
console.log('BLOG',blogPosts.map(p=>p.slug));
