import { chromium } from "playwright";

// Tijdelijk hulpje voor visuele controle. Eén verse browser per pagina, want de
// gedeelde sessie loopt in deze omgeving vast op de langere pagina's.
const map = "/tmp/claude-0/-home-user-schaapsvis/24a413fd-66c9-5077-9080-331d4be3e7aa/scratchpad";

for (const spec of process.argv.slice(2)) {
  const [naam, pad, breedte] = spec.split("|");
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium",
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });
  const page = await browser.newPage({
    viewport: { width: Number(breedte) || 1280, height: 1400 },
  });
  const res = await page.goto("http://localhost:3111" + pad, {
    waitUntil: "load",
    timeout: 40000,
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${map}/${naam}.png` });
  console.log(naam, res.status());
  await browser.close();
}
