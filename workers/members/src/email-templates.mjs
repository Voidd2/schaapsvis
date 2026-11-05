// Presentation only: no delivery, tracking, account state or token generation.
const BRAND_ORIGIN = "https://schaapsvishandel.nl";
const LOGO_URL = `${BRAND_ORIGIN}/images/brand/schaapsvis-logo-192.png?v=2`;
const COPY = {
  nl: { account: "ACCOUNT", offers: "AANBIEDINGEN", heritage: "LEIDEN · SINDS 1938", code: "Uw verificatiecode", codeHint: "Deel deze code met niemand. De code verloopt automatisch.", fallback: "Werkt de knop niet? Open deze link:", help: "Een vraag? Antwoord gerust op deze e-mail.", website: "Naar onze website", footer: "Dit is een automatisch accountbericht van Schaap’s Vishandel." },
  en: { account: "ACCOUNT", offers: "OFFERS", heritage: "LEIDEN · SINCE 1938", code: "Your verification code", codeHint: "Do not share this code with anyone. It expires automatically.", fallback: "Button not working? Open this link:", help: "Have a question? Simply reply to this email.", website: "Visit our website", footer: "This is an automated account message from Schaap’s Vishandel." },
  de: { account: "KONTO", offers: "ANGEBOTE", heritage: "LEIDEN · SEIT 1938", code: "Ihr Bestätigungscode", codeHint: "Geben Sie diesen Code nicht weiter. Er läuft automatisch ab.", fallback: "Die Schaltfläche funktioniert nicht? Öffnen Sie diesen Link:", help: "Eine Frage? Antworten Sie einfach auf diese E-Mail.", website: "Zu unserer Website", footer: "Dies ist eine automatische Kontonachricht von Schaap’s Vishandel." },
};
const languageFor = (locale) => Object.hasOwn(COPY, locale) ? locale : "nl";
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const FOOTER_LINKS = {
  nl: { privacy: "Privacyverklaring", terms: "Voorwaarden studentenkorting", greeting: "Beste", generic: "Hallo," },
  en: { privacy: "Privacy policy", terms: "Student discount terms", greeting: "Hello", generic: "Hello," },
  de: { privacy: "Datenschutzerklärung", terms: "Bedingungen für den Studentenrabatt", greeting: "Guten Tag", generic: "Guten Tag," },
};

function greeting(locale, recipient) {
  const copy = FOOTER_LINKS[languageFor(locale)];
  const clean = (value) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 140) : "";
  const name = typeof recipient === "string" ? clean(recipient) : clean(recipient?.first_name) || clean(recipient?.full_name);
  return name ? `${copy.greeting} ${name},` : copy.generic;
}

// Keep text-only clients just as personal and usable as the HTML version.
export function accountEmailText(locale, body, recipient = "") {
  const language = languageFor(locale);
  const copy = FOOTER_LINKS[language];
  return `${greeting(language, recipient)}\n\n${body}\n\nSchaap’s Vishandel · Herenstraat 48 · 2313 AL Leiden\n${COPY[language].website}: ${BRAND_ORIGIN}/${language}\n${copy.privacy}: ${BRAND_ORIGIN}/${language}/privacyverklaring\n${copy.terms}: ${BRAND_ORIGIN}/${language}/studentenkorting#voorwaarden`;
}

function brandedEmail({ locale = "nl", title, intro, contentHtml = "", buttonUrl = "", buttonLabel = "", footer = "", category = "account", recipient = "" }) {
  const language = languageFor(locale);
  const copy = COPY[language];
  const url = escapeHtml(buttonUrl);
  const action = buttonUrl && buttonLabel ? `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0 22px"><tr><td bgcolor="#075c7c" style="background:#075c7c;border-radius:8px;text-align:center;mso-padding-alt:16px 24px">
    <a href="${url}" style="display:inline-block;border:16px solid #075c7c;border-left-width:24px;border-right-width:24px;border-radius:8px;font:700 16px/24px Arial,sans-serif;color:#ffffff;text-decoration:none;text-align:center;mso-padding-alt:0">${escapeHtml(buttonLabel)}</a>
    </td></tr></table>
    <p style="margin:0 0 8px;color:#496273;font-size:13px;line-height:21px">${copy.fallback}</p>
    <p style="margin:0;font-size:13px;line-height:21px;word-break:break-all;overflow-wrap:anywhere"><a href="${url}" style="color:#075c7c;text-decoration:underline;word-break:break-all">${url}</a></p>` : "";
  return `<!doctype html>
<html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="format-detection" content="telephone=no,date=no,address=no,email=no"><title>${escapeHtml(title)}</title>
<style>@media only screen and (max-width:480px){.email-outer{padding:16px 8px!important}.email-pad{padding-left:24px!important;padding-right:24px!important}.email-name{font-size:22px!important}.email-logo{width:64px!important;height:64px!important}.email-title{font-size:28px!important}.email-code{font-size:30px!important;letter-spacing:4px!important}}</style></head>
<body style="margin:0;padding:0;background:#eef5f8;color:#173b4c;font:16px/1.65 Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#eef5f8" style="background:#eef5f8"><tr><td class="email-outer" align="center" style="padding:32px 16px">
<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #d4e4eb;border-radius:16px;border-spacing:0;table-layout:fixed">
<tr><td bgcolor="#075c7c" style="height:6px;font-size:1px;line-height:6px;background:#075c7c;border-radius:16px 16px 0 0">&nbsp;</td></tr>
<tr><td class="email-pad" style="padding:28px 36px 26px;border-bottom:1px solid #e2ebef">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="96" style="width:96px;vertical-align:middle"><img class="email-logo" src="${LOGO_URL}" width="80" height="80" alt="Schaap’s Vis — Leiden" style="display:block;width:80px;height:80px;border:0;background:#ffffff;color:#075c7c;font:12px Arial,sans-serif"></td><td style="vertical-align:middle"><div class="email-name" style="font:700 26px/1.2 Georgia,'Times New Roman',serif;color:#08445b">Schaap’s Vishandel</div><div style="margin-top:9px;font:700 10px/1.6 Arial,sans-serif;letter-spacing:2px;color:#496273">${copy.heritage}</div></td></tr></table>
</td></tr>
<tr><td class="email-pad" style="padding:32px 36px 36px">
<div style="font:700 11px/18px Arial,sans-serif;letter-spacing:2px;color:#075c7c">${category === "offers" ? copy.offers : copy.account}</div>
<h1 class="email-title" style="margin:12px 0 20px;font:700 32px/1.2 Georgia,'Times New Roman',serif;color:#08445b">${escapeHtml(title)}</h1>
<p style="margin:0 0 14px;font-size:16px;line-height:27px;color:#355566;overflow-wrap:anywhere">${escapeHtml(greeting(language, recipient))}</p>
<p style="margin:0 0 22px;font-size:16px;line-height:27px;color:#355566">${escapeHtml(intro)}</p>
${contentHtml}${action}
</td></tr>
<tr><td class="email-pad" bgcolor="#f3f8fa" style="padding:22px 36px;background:#f3f8fa;border-top:3px solid #bdab88;border-radius:0 0 16px 16px">
<p style="margin:0 0 12px;font-size:14px;line-height:23px;color:#355566">${copy.help}</p>
<p style="margin:0;font-size:13px;line-height:22px;color:#496273"><strong style="color:#08445b">Schaap’s Vishandel</strong><br>Herenstraat 48 · 2313 AL Leiden<br><a href="${BRAND_ORIGIN}/${language}" style="color:#075c7c;text-decoration:underline">${copy.website}</a></p>
<p style="margin:8px 0 0;font-size:13px;line-height:24px"><a href="${BRAND_ORIGIN}/${language}/privacyverklaring" style="color:#075c7c;text-decoration:underline">${FOOTER_LINKS[language].privacy}</a><br><a href="${BRAND_ORIGIN}/${language}/studentenkorting#voorwaarden" style="color:#075c7c;text-decoration:underline">${FOOTER_LINKS[language].terms}</a></p>
<p style="margin:16px 0 0;font-size:12px;line-height:20px;color:#496273">${escapeHtml(footer || copy.footer)}</p>
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
}

export function verificationCodeEmail(locale, subject, intro, code, validity, recipient = "") {
  const language = languageFor(locale);
  const copy = COPY[language];
  return brandedEmail({ locale: language, title: subject, intro, recipient,
    contentHtml: `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:26px 0 22px;table-layout:fixed"><tr><td align="center" bgcolor="#edf6fa" style="padding:22px 12px;background:#edf6fa;border:1px solid #c9e2ed;border-radius:10px"><div style="font-size:13px;font-weight:700;color:#355566">${copy.code}</div><div class="email-code" style="margin-top:8px;font:700 36px/1.4 'Courier New',monospace;letter-spacing:6px;color:#08445b">${escapeHtml(code)}</div></td></tr></table><p style="margin:0;color:#355566;font-size:15px;line-height:25px">${escapeHtml(validity)}</p><p style="margin:10px 0 0;color:#496273;font-size:13px;line-height:22px">${copy.codeHint}</p>`,
  });
}

export function actionEmail(locale, subject, intro, buttonLabel, buttonUrl, note = "", recipient = "") {
  return brandedEmail({ locale, title: subject, intro, buttonUrl, buttonLabel, recipient,
    contentHtml: note ? `<p style="margin:0;color:#496273;font-size:14px;line-height:23px">${escapeHtml(note)}</p>` : "",
  });
}

export function campaignEmail(subject, bodyText, unsubscribeUrl) {
  const paragraphs = escapeHtml(bodyText).split(/\n{2,}/).map((paragraph) => `<p style="margin:0 0 16px">${paragraph.replace(/\n/g, "<br>")}</p>`).join("");
  return brandedEmail({ locale: "nl", title: subject, category: "offers", intro: "Speciaal voor klanten van Schaap’s Vishandel.",
    contentHtml: `<div style="color:#173b4c">${paragraphs}</div><p style="margin:26px 0 0;color:#496273;font-size:13px">U ontvangt dit bericht omdat u zich heeft aangemeld voor e-maildeals. <a href="${escapeHtml(unsubscribeUrl)}" style="color:#075c7c">Afmelden</a>.</p>`,
    footer: "Schaap’s Vishandel · Herenstraat 48, Leiden",
  });
}
