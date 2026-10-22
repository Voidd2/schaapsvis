"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

const TALEN = [
  { code: "nl", label: "NL", naam: "Nederlands" },
  { code: "en", label: "EN", naam: "English" },
  { code: "de", label: "DE", naam: "Deutsch" },
] as const;

/**
 * Taalkeuze als echte links.
 *
 * Dit stond eerst met knoppen en `router.push()`. Dat werkt voor een bezoeker,
 * maar een zoekmachine volgt geen knop: die ziet de Engelse en Duitse versie
 * dan simpelweg niet vanaf de Nederlandse pagina. Met gewone <a>-links wordt
 * elke taalversie wél gevonden en gekoppeld — samen met de hreflang-gegevens
 * per pagina is dat de basis om in alle drie de talen te ranken.
 */
export function LanguageSwitcher({ licht = false }: { licht?: boolean }) {
  const pathname = usePathname();
  const huidige = useLocale();

  const paden = pathname.split("/");

  return (
    <nav aria-label={huidige === "de" ? "Sprache wählen" : huidige === "en" ? "Choose language" : "Kies een taal"} className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em]">
      {TALEN.map(({ code, label, naam }, i) => {
        const segmenten = [...paden];
        segmenten[1] = code;
        const href = segmenten.join("/") || `/${code}`;
        const actief = huidige === code;

        return (
          <span key={code} className="flex items-center gap-1.5">
            {i > 0 && <span style={{ opacity: 0.3 }}>·</span>}
            {actief ? (
              <span aria-current="page" className="inline-flex min-h-11 min-w-11 items-center justify-center" style={{ opacity: 1 }}>
                {label}
              </span>
            ) : (
              <Link
                href={href}
                hrefLang={code}
                lang={code}
                title={naam}
                style={{ opacity: licht ? 0.9 : 0.82 }}
                className="inline-flex min-h-11 min-w-11 items-center justify-center underline-offset-4 hover:underline hover:opacity-100 transition-opacity"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
