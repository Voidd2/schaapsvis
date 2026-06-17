"use client";

import { useState } from "react";

type Lang = "nl" | "en" | "de";

const COPY: Record<
  Lang,
  {
    eyebrow: string;
    title: string;
    body: string;
    features: string[];
    openLine: string;
    contactLabel: string;
    hoursLine: string;
    whatsapp: string;
    loginLabel: string;
    placeholder: string;
    button: string;
    error: string;
  }
> = {
  nl: {
    eyebrow: "Schaap's Vishandel · Leiden · sinds 1938",
    title: "We werken aan onze nieuwe website",
    body: "Binnenkort kunt u hier terecht voor:",
    features: [
      "Visrecepten",
      "Online bestellingen",
      "Informatie over waar onze vis vandaan komt",
    ],
    openLine: "Tot die tijd zijn we gewoon open in de winkel.",
    contactLabel: "Herenstraat 48, Leiden · 071 514 9802",
    hoursLine:
      "Ma t/m za in de winkel · wo + za op de markt in Leiden · vr bij Hoogvliet Voorschoten",
    whatsapp: "Bestel via WhatsApp",
    loginLabel: "Beheer — voer het wachtwoord in",
    placeholder: "Wachtwoord",
    button: "Inloggen",
    error: "Onjuist wachtwoord. Probeer het opnieuw.",
  },
  en: {
    eyebrow: "Schaap's Vishandel · Leiden · since 1938",
    title: "We're working on our new website",
    body: "Soon you'll be able to use this site for:",
    features: [
      "Fish recipes",
      "Online orders",
      "Information about where our fish comes from",
    ],
    openLine: "Until then, you're welcome to visit us in the shop.",
    contactLabel: "Herenstraat 48, Leiden · +31 71 514 9802",
    hoursLine:
      "Mon–Sat in the shop · Wed + Sat at the Leiden market · Fri at Hoogvliet Voorschoten",
    whatsapp: "Order via WhatsApp",
    loginLabel: "Admin — enter the password",
    placeholder: "Password",
    button: "Log in",
    error: "Incorrect password. Please try again.",
  },
  de: {
    eyebrow: "Schaap's Vishandel · Leiden · seit 1938",
    title: "Wir arbeiten an unserer neuen Website",
    body: "Bald können Sie hier:",
    features: [
      "Fischrezepte finden",
      "Online bestellen",
      "Erfahren, woher unser Fisch kommt",
    ],
    openLine: "Bis dahin besuchen Sie uns gerne im Laden.",
    contactLabel: "Herenstraat 48, Leiden · +31 71 514 9802",
    hoursLine:
      "Mo–Sa im Laden · Mi + Sa auf dem Markt in Leiden · Fr bei Hoogvliet Voorschoten",
    whatsapp: "Per WhatsApp bestellen",
    loginLabel: "Verwaltung — Passwort eingeben",
    placeholder: "Passwort",
    button: "Anmelden",
    error: "Falsches Passwort. Bitte versuchen Sie es erneut.",
  },
};

const LANGS: { code: Lang; label: string }[] = [
  { code: "nl", label: "NL" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
];

export function ComingSoon({ error = false }: { error?: boolean }) {
  const [lang, setLang] = useState<Lang>("nl");
  const t = COPY[lang];

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}
    >
      <div className="w-full max-w-xl">
        {/* Taalmenu */}
        <div className="flex justify-center gap-2 mb-10">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className="px-3 py-1.5 text-xs font-bold tracking-widest transition-colors"
              style={{
                backgroundColor: lang === code ? "var(--gold)" : "rgba(246,250,253,0.08)",
                color: lang === code ? "var(--navy-dark)" : "rgba(246,250,253,0.7)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="text-center">
          {/* Logo / merk */}
          <img
            src="/images/scene-winkel.svg"
            alt="Schaap's Vishandel, Herenstraat 48 Leiden"
            className="w-40 h-40 object-cover mx-auto mb-8 rounded-full"
            style={{ border: "3px solid var(--gold)" }}
          />

          <p
            className="text-xs tracking-[0.25em] uppercase mb-5"
            style={{ color: "var(--sand)", opacity: 0.8 }}
          >
            {t.eyebrow}
          </p>

          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-6"
            style={{ color: "var(--cream)", fontFamily: "Playfair Display, Georgia, serif" }}
          >
            {t.title}
          </h1>

          <p className="text-base mb-4" style={{ color: "rgba(246,250,253,0.8)" }}>
            {t.body}
          </p>

          <ul className="inline-flex flex-col gap-2 mb-8 text-left">
            {t.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "rgba(246,250,253,0.92)" }}>
                <span
                  className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5"
                  style={{ backgroundColor: "var(--seafoam)", borderRadius: "9999px" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>

          <p className="text-sm mb-8" style={{ color: "rgba(246,250,253,0.6)" }}>
            {t.openLine}
          </p>

          {/* Contact */}
          <div
            className="px-6 py-5 mb-10"
            style={{ backgroundColor: "rgba(246,250,253,0.06)" }}
          >
            <p className="font-semibold text-sm mb-2" style={{ color: "var(--cream)" }}>
              {t.contactLabel}
            </p>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(246,250,253,0.6)" }}>
              {t.hoursLine}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/31715149802"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.132.558 4.13 1.532 5.864L.057 23.885l6.186-1.443A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.955 0-3.78-.554-5.33-1.511l-.383-.226-3.676.858.87-3.582-.249-.396A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                {t.whatsapp}
              </a>
              <a
                href="tel:+31715149802"
                className="inline-block px-4 py-2 text-sm font-medium border transition-opacity hover:opacity-80"
                style={{ borderColor: "rgba(246,250,253,0.35)", color: "var(--cream)" }}
              >
                071 514 9802
              </a>
            </div>
          </div>
        </div>

        {/* Beheer-login */}
        <form
          method="POST"
          action="/api/unlock"
          className="max-w-sm mx-auto"
        >
          <label
            htmlFor="password"
            className="block text-xs tracking-widest uppercase mb-2 text-center"
            style={{ color: "rgba(246,250,253,0.45)" }}
          >
            {t.loginLabel}
          </label>
          {error && (
            <p
              className="text-sm text-center mb-3 px-3 py-2"
              style={{ backgroundColor: "rgba(192,57,43,0.2)", color: "#ffb4a8" }}
            >
              {t.error}
            </p>
          )}
          <div className="flex gap-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder={t.placeholder}
              className="flex-1 px-4 py-2.5 text-sm outline-none"
              style={{ backgroundColor: "var(--cream)", color: "var(--charcoal)" }}
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--salmon)" }}
            >
              {t.button}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
