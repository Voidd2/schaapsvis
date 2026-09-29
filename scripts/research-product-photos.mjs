// Read public, licensed image metadata. This never changes website content.
import fs from 'node:fs/promises';
const destination = process.argv[2];
const terms = process.argv.slice(3);
const results = await fs.readFile(destination,'utf8').then(JSON.parse).catch(()=>[]);
for (const term of terms) {
  if (results.some(r=>r.term===term)) continue;
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({action:'query',format:'json',generator:'search',gsrsearch:term,gsrnamespace:'6',gsrlimit:'8',prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:'1280'}).forEach(([k,v])=>url.searchParams.set(k,v));
  let response;
  for (let attempt=0;attempt<4;attempt++) {
    response = await fetch(url, {headers:{'User-Agent':'SchaapsvisPhotoResearch/1.0 (website image attribution)'}});
    if (response.status!==429) break;
    await new Promise(resolve=>setTimeout(resolve,12000));
  }
  if (!response.ok) throw new Error(`${term}: HTTP ${response.status}`);
  const json = await response.json();
  const photos = Object.values(json.query?.pages || {}).sort((a,b)=>a.index-b.index).map(p=>{
    const i=p.imageinfo?.[0]; const m=i?.extmetadata || {};
    const plain = s => (s || '').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&');
    return {title:p.title,source:i?.descriptionurl,url:i?.thumburl || i?.url,width:i?.thumbwidth || i?.width,height:i?.thumbheight || i?.height,author:plain(m.Artist?.value),license:plain(m.LicenseShortName?.value),licenseUrl:m.LicenseUrl?.value,description:plain(m.ImageDescription?.value)};
  }).filter(p=>p.url && /\.(jpg|jpeg|png|webp)$/i.test(p.title) && p.width>=600 && p.height>=350 && /^(CC BY(-SA)? [\d.]+|CC0|Public domain)$/i.test(p.license));
  results.push({term,photos});
  await fs.writeFile(destination,JSON.stringify(results,null,2));
  console.log(term+': '+photos.map((p,i)=>`${i} ${p.title}`).join(' | '));
  await new Promise(resolve=>setTimeout(resolve,2200));
}
await fs.writeFile(destination,JSON.stringify(results,null,2));
