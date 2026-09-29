// Downloads only owner-relevant originals to our own public directory; no hotlinks.
// Third-party reuse rights are not verified. See dirks-photo-sources.json.
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
const source=JSON.parse(await readFile(new URL('./dirks-photo-sources.json',import.meta.url),'utf8'));
const mapping=JSON.parse(await readFile(new URL('../src/lib/dirks-photo-map.json',import.meta.url),'utf8'));
const bySlug=new Map(source.images.map(image=>[image.slug,image]));
const extras=[...source.collections.barbecue,...source.collections.platters.filter(slug=>!slug.startsWith('vleesschotel-'))];
const slugs=[...new Set([...Object.values(mapping),...extras])];
const target=path.resolve('public/images/dirks');
await mkdir(target,{recursive:true});
let cursor=0,errors=[];
async function worker(){
 while(cursor<slugs.length){
  const slug=slugs[cursor++],record=bySlug.get(slug);
  if(!record){errors.push(`${slug}: absent in source inventory`);continue;}
  const extension=new URL(record.source).pathname.toLowerCase().match(/\.(jpe?g|png|webp)$/)?.[0]??'.jpg';
  const file=path.join(target,slug+extension);
  try {if((await stat(file)).size>1000)continue;} catch{}
  let ok=false;
  for(let attempt=0;attempt<3&&!ok;attempt++){
   try{
    const response=await fetch(record.source,{headers:{'user-agent':'Mozilla/5.0'}});
    if(!response.ok)throw Error(`HTTP ${response.status}`);
    const mime=response.headers.get('content-type')??'';
    if(!/^image\//.test(mime))throw Error(`not image: ${mime}`);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length<1000)throw Error('image too small');
    await writeFile(file,bytes);ok=true;
   }catch(error){if(attempt===2)errors.push(`${slug}: ${error}`);else await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));}
  }
 }
}
await Promise.all(Array.from({length:5},worker));
console.log(JSON.stringify({selected:slugs.length,errors}));
if(errors.length)process.exitCode=1;
