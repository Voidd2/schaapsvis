import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ViskalenderClient } from "./ViskalenderClient";
import { eenTaalMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return eenTaalMetadata({
    taal: "nl",
    pad: "/viskalender",
    title: "Viswijzer — welke vis is nu het lekkerst? | Schaap's Vis Leiden",
    description:
      "Maand voor maand welke vis in het seizoen is. Van Hollandse Nieuwe in juni tot Zeeuwse mosselen in september. De viswijzer van Schaap's Vishandel in Leiden.",
  });
}

export default async function ViswijzerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <>
      <JsonLd />

      {/* Hero — dark, blends into the first month section */}
      <section
        className="py-16 px-6 text-center"
        style={{
          background: "linear-gradient(180deg, #060820 0%, #060820 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          className="text-[10px] tracking-[0.35em] uppercase mb-4"
          style={{ color: "rgba(168,216,240,0.45)" }}
        >
          Seizoensvis · Schaap&apos;s Vishandel Leiden
        </p>
        <h1
          className="font-bold mb-4 leading-tight"
          style={{
            color:       "rgba(250,246,239,0.95)",
            fontFamily:  "var(--font-display)",
            fontSize:    "clamp(2.4rem, 7vw, 4rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Viswijzer
        </h1>
        <p
          className="text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          style={{ color: "rgba(250,246,239,0.5)" }}
        >
          Welke vis is nú op zijn best? De pagina springt automatisch naar de huidige maand.
          Scroll om het hele jaar te ontdekken.
        </p>
      </section>

      {/* Interactive viswijzer */}
      <ViskalenderClient />
    </>
  );
}
