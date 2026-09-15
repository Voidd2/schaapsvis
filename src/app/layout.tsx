import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Schaap’s Vishandel Leiden — sinds 1938",
  description:
    "Schaap’s Vishandel, Herenstraat 48 in Leiden. Sinds 1938. Verse vis, salades en visschalen bezorgen we iedere donderdag.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
