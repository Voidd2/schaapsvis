import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Schaaps Vis Leiden — Vers vis, Leiden",
  description:
    "Schaaps Vis in Leiden verkoopt verse vis, kibbeling, haring en biologische Vårlaks zalm. Al 86 jaar op de Herenstraat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
