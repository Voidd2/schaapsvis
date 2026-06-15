import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ViskalenderClient } from "./ViskalenderClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Viskalender — welke vis is wanneer het lekkerst? | Schaap's Vis Leiden",
    description:
      "Ontdek maand voor maand welke vis nu in het seizoen is. Van Hollandse Nieuwe in juni tot Zeeuwse mosselen in september — de interactieve viskalender van Schaap's Vis Leiden, sinds 1938.",
    alternates: {
      canonical: `/${locale}/viskalender`,
      languages: { nl: "/nl/viskalender" },
    },
  };
}

export default async function ViskalenderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <>
      <JsonLd />

      {/* Hero */}
      <section style={{ backgroundColor: "var(--navy-dark)" }} className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-4 opacity-60"
            style={{ color: "var(--sand)" }}
          >
            Seizoensvis
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
            style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
          >
            Het Visjaar
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: "rgba(246,250,253,0.75)" }}
          >
            Welke vis is nú op zijn best? De kalender springt automatisch naar de huidige maand. Scroll
            verder om te zien wat de komende maanden te bieden hebben.
          </p>
        </div>
      </section>

      {/* Interactive calendar */}
      <ViskalenderClient />
    </>
  );
}
