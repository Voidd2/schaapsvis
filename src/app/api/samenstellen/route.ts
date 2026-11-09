import { whatsappLink } from "@/lib/bedrijf";
import { gourmetFish, gourmetRequestLink, type Portions } from "@/lib/gourmet-request";
import { inquiryText, platterInquiryMessage, type PlatterInquiry } from "@/lib/platter-inquiry";
import { catalogProduct } from "@/lib/seafood-catalog";
import { deliDraft, isDeliTrio } from "@/lib/deli-trio";
import { giftRequestLink } from "@/lib/gift-request";
import { giftCopy } from "@/lib/gift-copy";
import { validPickupDate } from "@/lib/pickup-date";
import { readBoundedBody } from "@/lib/read-bounded-body";

// Build a preview only. Do not log, persist, or redirect submitted form data.
function draft(data: URLSearchParams, locale: string) {
  const field = (name: string) => (data.get(name) ?? "").trim();
  const kind = field("kind");
  const people = field("people"), date = field("date"), wishes = field("wishes");
  if (!validPickupDate(date)) return null;
  if (kind === "gourmet") {
    const packaging = field("packaging");
    if (packaging !== "standard" && packaging !== "premium") return null;
    const portions: Portions = {};
    const selected = data.getAll("fish");
    for (const fish of gourmetFish) if (selected.includes(fish.id)) portions[fish.id] = field(fish.id);
    return gourmetRequestLink(locale, { people, date, wishes, packaging, portions });
  }
  if (kind === "platter") {
    const t = inquiryText(locale);
    const selection = field("selection") as PlatterInquiry["kind"];
    const presentation = field("presentation") as PlatterInquiry["presentation"];
    if (!Object.hasOwn(t.kinds, selection) || !Object.hasOwn(t.presentations, presentation)) return null;
    if (selection === "salads" ? !field("amount") : !/^[1-9]\d*$/.test(people)) return null;
    const budget = field("budget");
    if (budget && !/^\d+(?:[.,]\d{1,2})?$/.test(budget)) return null;
    const fish = data.getAll("fish").filter((id): id is PlatterInquiry["fish"][number] => Object.hasOwn(t.fishes,id));
    return whatsappLink(platterInquiryMessage(locale, {kind:selection, fish, excluded:field("excluded"), presentation,
      people, amount:field("amount"), date, dateUnknown:!date, budget, remarks:wishes, allergies:field("allergies")}));
  }
  if (kind === "deli") {
    const slug = field("slug");
    if (!isDeliTrio(slug)) return null;
    const slots = [0,1,2].map(i => ({choice:field(`choice${i}`),grams:field(`grams${i}`)}));
    return deliDraft(locale,catalogProduct(slug,locale).naam,slots,wishes);
  }
  if (kind !== "package" && kind !== "trio" && kind !== "custom") return null;
  const size = field("size");
  if (kind !== "custom" && !/^[012]$/.test(size)) return null;
  const product = giftCopy(locale).items[{package:0,trio:2,custom:3}[kind]][0];
  const indexes = (name: string) => data.getAll(name).map(value => /^\d$/.test(value) ? Number(value) : -1);
  return giftRequestLink(locale,{kind,product,size:Number(size),fish:indexes("fish"),extras:indexes("extra"),
    wishes,voucher:!!field("voucher"),voucherAmount:field("voucher")});
}

const copy = {
  nl: ["Uw samenstelling", "Open WhatsApp", "Controleer de keuzes in het vorige tabblad en probeer het opnieuw.", "U kunt het bericht in WhatsApp aanpassen en zelf versturen."],
  en: ["Your selection", "Open WhatsApp", "Check the selection in the previous tab and try again.", "You can edit and send the message in WhatsApp."],
  de: ["Ihre Zusammenstellung", "WhatsApp öffnen", "Prüfen Sie Ihre Auswahl im vorherigen Tab und versuchen Sie es erneut.", "Sie können die Nachricht in WhatsApp bearbeiten und selbst senden."],
};
const escape = (s: string) => s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
export async function POST(request: Request) {
  const headers = {"Cache-Control":"private, no-store", "Referrer-Policy":"no-referrer", "X-Robots-Tag":"noindex, nofollow"};
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) return new Response(null,{status:415,headers});
  if (Number(request.headers.get("content-length")) > 32768) return new Response(null,{status:413,headers});
  const body = await readBoundedBody(request,32768);
  if (!body) return new Response(null,{status:413,headers});
  const data = new URLSearchParams(new TextDecoder().decode(body));
  const lang = data.get("locale");
  const locale = lang === "en" || lang === "de" ? lang : "nl";
  const [title,button,invalid,note] = copy[locale];
  const href = draft(data,locale);
  const content = href ? `<p>${note}</p><pre>${escape(new URL(href).searchParams.get("text") ?? "")}</pre><a href="${escape(href)}">${button} →</a>` : `<p>${invalid}</p>`;
  return new Response(`<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | Schaap’s Vishandel</title><style>*{box-sizing:border-box}body{margin:0;background:#f6fafb;color:#073c55;font:1.06rem/1.6 system-ui,sans-serif}main{max-width:42rem;margin:3vh auto;padding:clamp(1rem,5vw,2.5rem)}header{display:flex;align-items:center;gap:.7rem;font:bold 1.3rem Georgia,serif}header img{width:48px;height:48px}h1{font: bold 2rem Georgia,serif;margin-top:2rem}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;background:white;border:1px solid #bed5df;border-radius:.65rem;padding:1rem}a{display:inline-block;background:#075b82;color:white;font-weight:700;padding:.75rem 1.25rem;border-radius:.4rem}</style><main><header><img alt="" src="/images/brand/schaapsvis-logo-192.png"> Schaap’s Vishandel</header><h1>${title}</h1>${content}</main></html>`,{status:href?200:422,headers:{...headers,"Content-Type":"text/html; charset=utf-8","Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'"}});
}
