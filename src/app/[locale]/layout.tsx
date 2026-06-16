import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.schaapsvishandel.nl"),
  title: "Schaap's Vishandel Leiden — Viswinkel Herenstraat | Verse Vis & Kibbeling",
  description:
    "Schaap's Vishandel in Leiden. Verse kibbeling, haring, biologische Varlaks zalm en duurzame vis. Vier generaties op de Herenstraat 48. Ook op de Leidse markt en bij Hoogvliet Voorschoten.",
  openGraph: {
    siteName: "Schaap's Vis Leiden",
    type: "website",
    locale: "nl_NL",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Schaap's Vishandel Leiden — verse en biologische vis sinds 1938",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@schaapsvis",
    images: ["/images/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Ixvg5PEMPRLQQsLIhwaSxGUiVEjm7JRm0E0bMBXJQw8",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
