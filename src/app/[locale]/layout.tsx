import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Libre_Caslon_Text, Source_Sans_3 } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, ACCESS_TOKEN } from "@/lib/siteAccess";
import { BEDRIJF } from "@/lib/bedrijf";

/* Lettertypen worden meegebouwd en vanaf ons eigen domein geserveerd. Dat
   scheelt een verbinding met Google én voorkomt dat de tekst pas verschijnt als
   het lettertype binnen is — allebei goed voor de laadscores waar Google op
   let. Caslon voor de koppen (een letter uit dezelfde eeuw als het vak),
   Source Sans voor lopende tekst, formulieren en prijzen. */
const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-caslon",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
  display: "swap",
});

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
  const isPreview =
    process.env.MAINTENANCE_MODE === "on" &&
    cookieStore.get(ACCESS_COOKIE)?.value === ACCESS_TOKEN;

  return (
    <html lang={locale} className={`${caslon.variable} ${sourceSans.variable}`}>
      <head>
        <meta property="og:locale" content={OG_LOCALE[locale] ?? "nl_NL"} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {isPreview && (
            <div
              className="w-full text-center px-4 py-2 text-xs font-semibold"
              style={{ backgroundColor: "var(--gold)", color: "#fff" }}
            >
              Besloten preview — je bent ingelogd. Bezoekers zien de
              &ldquo;binnenkort online&rdquo;-pagina.{" "}
              {/* Route handler, geen pagina — moet een echte navigatie zijn zodat
                  de server de cookie kan wissen. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/api/logout" className="underline font-bold">
                Uitloggen en het slot testen
              </a>
            </div>
          )}
          <a href="#inhoud" className="sv-skip">
            Naar de inhoud
          </a>
          <Header />
          <main id="inhoud">{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
