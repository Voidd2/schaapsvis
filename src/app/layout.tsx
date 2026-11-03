import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Schaap’s Vishandel | Viswinkel in Leiden sinds 1938",
  description:
    "Schaap’s Vishandel is een viswinkel in Leiden sinds 1938. Bekijk ons assortiment, recepten, openingstijden en de locaties van onze winkel en marktkramen.",
  icons: {
    icon: [
      { url: "/schaapsvis-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/brand/schaapsvis-logo-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/schaapsvis-apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

