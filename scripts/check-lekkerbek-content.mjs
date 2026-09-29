// Owner-confirmed product fact: our lekkerbek is fried hake, not whiting.
// Optional origin checks are read-only; no orders or messages are submitted.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url), ts=require('typescript'), cache=new Map();
function load(name) {
  const file=path.resolve('src/lib',name+'.ts');
  if(cache.has(file))return cache.get(file);
  const exports={};cache.set(file,exports);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  new Function('exports','require',code)(exports,n=>n.startsWith('./')?load(n.slice(2)):n.startsWith('@/lib/')?load(n.slice(6)):require(n));
  return exports;
}
const {products}=load('assortiment-data'),{localizeProduct}=load('product-localization');
const {blogPosts}=load('blog'),{localizeBlog}=load('blog-localization');
const {recepten}=load('recepten'),{localizeRecipe}=load('recipe-localization');
const {productPhoto}=load('product-beeld');
const origin=process.argv[2];let pagesChecked=0;
for(const [locale,fish] of [['nl','heek'],['en','hake'],['de','Seehecht']]) {
  const hasFish=value=>value.toLowerCase().includes(fish.toLowerCase());
  const product=localizeProduct(products.find(p=>p.slug==='lekkerbek'),locale);
  for(const value of [product.desc,product.ingredienten,productPhoto(product,locale).alt]) {
    assert.ok(hasFish(value),locale+' correct fish');
    assert.ok(!/wijting|whiting|wittling|Merlangius/i.test(value),locale+' no whiting claim');
  }
  for(const slug of ['wijting','wijtingfilet'])assert.ok(!/lekkerbek|backfisch/i.test(localizeProduct(products.find(p=>p.slug===slug),locale).desc),locale+' no incorrect whiting association');
  const recipe=localizeRecipe(recepten.find(r=>r.slug==='lekkerbek-koolsalade'),locale);
  assert.ok(hasFish(recipe.verhaal)&&recipe.vanSchaap.some(hasFish),locale+' recipe hake');
  const post=localizeBlog(blogPosts.find(b=>b.slug==='kibbeling-vs-lekkerbek-het-verschil'),locale);
  assert.ok(hasFish(post.secties[2].alineas.join(' ')),locale+' blog hake');
  const routes=[`/${locale}/assortiment/lekkerbek`,`/${locale}/blog/${post.slug}`,`/${locale}/recepten/${recipe.slug}`];
  if(origin)for(const route of routes) {
    const response=await fetch(origin+route),html=await response.text();
    assert.equal(response.status,200,route+' HTTP');
    const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]??'';
    const visible=main.replace(/<script\b[\s\S]*?<\/script>/g,'').replace(/<[^>]*>/g,' ');
    assert.ok(hasFish(visible),route+' rendered hake');
    assert.ok(!/wijting|whiting|wittling|Merlangius/i.test(visible),route+' no stale whiting copy');
    pagesChecked++;
  }
}
console.log(JSON.stringify({locales:3,product:'fried hake',productIngredientsAndAlt:true,whitingAssociationsRemoved:true,blogAndRecipe:true,pagesChecked,failures:0}));
