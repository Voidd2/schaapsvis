import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Schaap’s Vishandel | Viswinkel in Leiden sinds 1938",
  description:
    "Schaap’s Vishandel is een viswinkel in Leiden sinds 1938. Bekijk ons assortiment, recepten, openingstijden en de locaties van onze winkel en marktkramen.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

