// Public, read-only product-photo inventory. No cart, prices or personal data.
// Prints JSON for review; never changes site content or assumes photo rights.
const origin='https://www.dirksvishandel.nl';
const decode=s=>s.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;|&#039;/g,"'").replace(/<[^>]*>/g,'').trim();
const media=[];
let pages=1;
for(let page=1;page<=pages;page++){
 const r=await fetch(origin+'/wp-json/wp/v2/media?per_page=100&page='+page);
 if(!r.ok)throw new Error('Media HTTP '+r.status);
 pages=+r.headers.get('x-wp-totalpages')||1;
 for(const m of await r.json())media.push({id:m.id,url:m.source_url,width:m.media_details?.width,height:m.media_details?.height,sizes:Object.values(m.media_details?.sizes??{}).map(x=>x.source_url)});
}
const records=new Map(),listings=[];
const listingUrls=[origin+'/webshop/',...Array.from({length:6},(_,i)=>origin+'/webshop/page/'+(i+2)+'/'),origin+'/webshop/barbecue-gourmet/',origin+'/webshop/visschotels-boxen/'];
for(const url of listingUrls){
 const r=await fetch(url);if(!r.ok)throw new Error('Listing HTTP '+r.status+' '+url);
 const html=await r.text();let count=0;
 for(const match of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*class="woocommerce-LoopProduct-link[^"]*"[^>]*>([\s\S]*?)<\/a>/g)){
  const image=match[2].match(/<img\b[^>]*src="([^"]+)"[^>]*>/)?.[1];
  const title=match[2].match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1];
  if(!image||!title)continue;
  const productUrl=new URL(decode(match[1]),origin);productUrl.search='';
  const slug=productUrl.pathname.split('/').filter(Boolean).pop();
  let p=records.get(slug);
  if(!p){
   const thumbnail=decode(image),m=media.find(m=>m.url===thumbnail||m.sizes.includes(thumbnail));
   p={slug,title:decode(title),productUrl:productUrl.href,thumbnail,url:m?.url??thumbnail,width:m?.width??600,height:m?.height??450,mediaId:m?.id,listings:[],license:'Reuse permission not verified; requested by site owner'};
   records.set(slug,p);
  }
  p.listings.push(url);count++;
 }
 listings.push({url,products:count});
}
let storePages=1;
for(let page=1;page<=storePages;page++){
 const r=await fetch(origin+'/wp-json/wc/store/v1/products?per_page=100&page='+page);
 if(!r.ok)throw new Error('Public product images HTTP '+r.status);
 storePages=+r.headers.get('x-wp-totalpages')||1;
 for(const product of await r.json()){
  const p=records.get(product.slug);if(!p)continue;
  p.gallery=(product.images??[]).map(i=>i.src).filter(src=>src!==p.url);
 }
}
const collections={barbecue:[...records.values()].filter(p=>p.listings.some(url=>url.includes('/barbecue-gourmet/'))).map(p=>p.slug),platters:[...records.values()].filter(p=>p.listings.some(url=>url.includes('/visschotels-boxen/'))).map(p=>p.slug)};
console.log(JSON.stringify({source:origin,researchedAt:'2026-09-29',listings,collections,products:[...records.values()].map(({slug,title,url,width,height,gallery})=>({slug,title,url,width,height,...(gallery?.length?{gallery}:{})}))}));
