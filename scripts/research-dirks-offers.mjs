// Read-only snapshot of publicly advertised competitor offers and prices.
import { readFile } from 'node:fs/promises';
const origin='https://www.dirksvishandel.nl';
const inventory=JSON.parse(await readFile(new URL('./dirks-photo-sources.json',import.meta.url),'utf8'));
const wanted=[...inventory.collections.barbecue,...inventory.collections.platters.filter(slug=>!slug.startsWith('vleesschotel-'))];
const products=[];
let pages=1;
for(let page=1;page<=pages;page++){
 const response=await fetch(`${origin}/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
 if(!response.ok)throw Error(`Store API ${response.status}`);
 pages=Number(response.headers.get('x-wp-totalpages'))||1;
 products.push(...await response.json());
}
const selected=wanted.map(slug=>{
 const p=products.find(item=>item.slug===slug);
 if(!p)return {slug,missing:true};
 return {slug,id:p.id,name:p.name,permalink:p.permalink,prices:p.prices,has_options:p.has_options,is_purchasable:p.is_purchasable,is_in_stock:p.is_in_stock,description:p.description,short_description:p.short_description};
});
console.log(JSON.stringify({observedAt:'2026-09-29',source:origin+'/wp-json/wc/store/v1/products',total:products.length,selected}));
