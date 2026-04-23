"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    // segments[0] = '', segments[1] = locale, segments[2+] = page
    segments[1] = newLocale;
    const newPath = segments.join("/");

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      {(["nl", "en", "de"] as const).map((locale, i) => (
        <span key={locale} className="flex items-center gap-2">
          {i > 0 && <span className="opacity-30">·</span>}
          <button
            onClick={() => switchLocale(locale)}
            className={`uppercase tracking-wider transition-opacity ${
              currentLocale === locale
                ? "opacity-100 underline underline-offset-2"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            {locale}
          </button>
        </span>
      ))}
    </div>
  );
}
