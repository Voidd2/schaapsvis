import { readFile } from 'node:fs/promises';

const origin = 'https://schaapsvishandel.nl';
const { key } = JSON.parse(await readFile(new URL('./indexnow-key.json', import.meta.url), 'utf8'));
const urls = [...new Set(process.argv.slice(2).flatMap(value => value.split(/[\s,]+/)).filter(Boolean))];
if (!urls.length || urls.length > 10000) throw new Error('Supply 1–10000 published public URLs.');
for (const value of urls) {
  const url = new URL(value);
  if (url.origin !== origin || url.search || url.hash || !/^\/(nl|en|de)(\/|$)/.test(url.pathname)) {
    throw new Error(`Only canonical public language URLs are allowed: ${value}`);
  }
}
const keyLocation = `${origin}/${key}.txt`;
const proof = await fetch(keyLocation, { signal: AbortSignal.timeout(20000) });
if (!proof.ok || (await proof.text()).trim() !== key) throw new Error('The ownership file is not live yet.');
const sitemapResponse = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(20000) });
if (!sitemapResponse.ok) throw new Error('Cannot verify the live sitemap.');
const sitemap = await sitemapResponse.text();
for (const url of urls) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`URL is absent from the public sitemap: ${url}`);
  const page = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
  const html = await page.text();
  if (page.status !== 200 || /noindex/i.test(page.headers.get('x-robots-tag') || '') || /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) {
    throw new Error(`URL is unavailable or excluded from indexing: ${url}`);
  }
}
if (process.env.INDEXNOW_DRY_RUN === '1') {
  console.log(`Verified ${urls.length} live public URLs. Dry run, nothing submitted.`);
} else {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host: 'schaapsvishandel.nl', key, keyLocation, urlList: urls }),
    signal: AbortSignal.timeout(30000),
  });
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow rejected submission: HTTP ${response.status}`);
  console.log(JSON.stringify({ submittedAt: new Date().toISOString(), status: response.status, urls }, null, 2));
}
