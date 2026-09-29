import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { FONT_KLASSEN } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chrome } from "@/components/layout/Chrome";
import { WinkelwagenProvider } from "@/components/winkel/Winkelwagen";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, ACCESS_TOKEN, siteOpSlot } from "@/lib/siteAccess";
import { BEDRIJF } from "@/lib/bedrijf";

export const metadata: Metadata = {
  metadataBase: new URL(BEDRIJF.domein),
  openGraph: {
    siteName: BEDRIJF.naam,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schaap's Vishandel, Herenstraat 48 Leiden — verse vis sinds 1938",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "Ixvg5PEMPRLQQsLIhwaSxGUiVEjm7JRm0E0bMBXJQw8",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const OG_LOCALE: Record<string, string> = {
  nl: "nl_NL",
  en: "en_GB",
  de: "de_DE",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "nl" | "en" | "de")) {
    notFound();
  }

  const messages = await getMessages();

  // Besloten preview: alleen zichtbaar voor wie is ingelogd terwijl de
  // onderhoudsmodus (wachtwoordslot) nog aanstaat. Zo verwar je je eigen
  // weergave nooit met wat het publiek ziet (die krijgt de "binnenkort"-pagina).
  const cookieStore = await cookies();
  const isPreview = siteOpSlot() && cookieStore.get(ACCESS_COOKIE)?.value === ACCESS_TOKEN;

  return (
    <html lang={locale} className={FONT_KLASSEN}>
      <head>
        <meta property="og:locale" content={OG_LOCALE[locale] ?? "nl_NL"} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {isPreview && (
            <div
              className="w-full text-center px-4 py-2 text-xs font-semibold"
              style={{ backgroundColor: "var(--gold)", color: "#fff" }}
            >
              {locale === "en" ? "Private preview — you are logged in. Visitors see the coming-soon page." : locale === "de" ? "Private Vorschau — Sie sind angemeldet. Besucher sehen die Demnächst-Seite." : "Besloten preview — u bent ingelogd. Bezoekers zien de binnenkort-pagina."}{" "}
              {/* Route handler, geen pagina — moet een echte navigatie zijn zodat
                  de server de cookie kan wissen. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/api/logout" className="underline font-bold">
                {locale === "en" ? "Log out and test access" : locale === "de" ? "Abmelden und Zugang testen" : "Uitloggen en het slot testen"}
              </a>
            </div>
          )}
          <a href="#inhoud" className="sv-skip">
            {locale === "en" ? "Skip to content" : locale === "de" ? "Zum Inhalt springen" : "Naar de inhoud"}
          </a>
          {/* De winkelwagen leeft boven de kop en de voet: hij moet dezelfde
              inhoud kennen op de winkelsite én in de webshop. */}
          <WinkelwagenProvider>
            <Chrome
              header={<Header />}
              footer={<Footer />}
              extras={<WhatsAppButton />}
            >
              {children}
            </Chrome>
          </WinkelwagenProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
