import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://schaapsvis.nl"),
  title: {
    template: "%s | Schaaps Vis Leiden",
    default: "Schaaps Vis Leiden — Viswinkel Herenstraat | Verse Vis & Kibbeling",
  },
  description:
    "Schaap's Vishandel in Leiden. Verse kibbeling, haring, biologische Varlaks zalm en duurzame vis. Al 86 jaar op de Herenstraat 48. Ook op de Leidse markt en bij Hoogvliet Voorschoten.",
  keywords: [
    "viswinkel Leiden",
    "verse vis Leiden",
    "kibbeling Leiden",
    "haring Leiden",
    "biologische zalm Leiden",
    "Varlaks zalm",
    "duurzame vis Leiden",
    "visboer Leiden",
    "vishandel Leiden",
    "Herenstraat Leiden",
    "schaapsvis",
    "Schaap Leiden",
  ],
  openGraph: {
    siteName: "Schaap's Vis Leiden",
    type: "website",
    locale: "nl_NL",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Schaap's Vishandel Leiden — Herenstraat 48",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@schaapsvis",
    images: ["/og-image.jpg"],
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
    google: "",
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
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
