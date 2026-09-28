import Link from "next/link";
import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { blogPostsGesorteerd } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { eenTaalMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";

export async function generateMetadata(): Promise<Metadata> {
  return eenTaalMetadata({
    taal: "nl",
    pad: "/blog",
    title: "Blog | Schaap's Vis Leiden — verhalen van achter de toonbank",
    description:
      "Welke vis wanneer het lekkerst is, hoe de winkel sinds 1938 loopt en wat we onderweg tegenkomen. Verhalen van achter de toonbank op de Herenstraat in Leiden.",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd />

      <PaginaKop
        kruimels={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: "Blog" }]}
        label="Vers van achter de toonbank"
        titel="Verhalen uit de winkel"
        intro="Welke vis is wanneer het lekkerst? Hoe werd een viswinkeltje uit 1938 een Leids begrip? En wat is nou eigenlijk het verschil tussen kibbeling en lekkerbek? Hier staat wat we achter de toonbank elke dag vertellen."
        knoppen={[
          { label: "De viskalender", href: `/${locale}/viskalender` },
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true, soort: "lijn" },
        ]}
        feiten={[
          { label: "Artikelen", waarde: `${blogPostsGesorteerd.length}` },
          { label: "Onderwerpen", waarde: "Seizoen · winkel · duurzaamheid" },
          { label: "Taal", waarde: "Nederlands" },
        ]}
      />

      {/* ── Alle stukken ─────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <Kop
          label="Alles op een rij"
          titel="Wat we schreven"
          intro="Van de eerste haring van het jaar tot de vraag waarom garnalen pellen zo veel werk is."
        />
        <ul style={{ borderTop: "1px solid var(--linen)" }}>
          {blogPostsGesorteerd.map((post) => (
            <li key={post.slug} style={{ borderBottom: "1px solid var(--linen)" }}>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group grid md:grid-cols-[12rem_1fr] gap-x-10 gap-y-2 py-7"
              >
                <div>
                  <p className="kapitaal mb-1">{post.categorie}</p>
                  <p className="text-sm" style={{ color: "var(--grijs)" }}>
                    {post.datumLabel} · {post.leestijd}
                  </p>
                </div>
                <div>
                  <h2
                    className="text-[1.35rem] leading-snug mb-2 group-hover:underline underline-offset-4"
                    style={{ color: "var(--ink)" }}
                  >
                    {post.title}
                  </h2>
                  <p className="lees" style={{ color: "var(--charcoal)" }}>
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Sectie>

      {/* ── De viskalender ───────────────────────────────────────────────── */}
      <Sectie grond="zand" smal>
        <Kop
          label="Interactief"
          titel="Het Visjaar — de viskalender"
          intro="Maand voor maand: welke vis is nú op zijn best? De kalender springt naar de huidige maand en laat zien wat het hele jaar te bieden heeft."
        />
        <Link href={`/${locale}/viskalender`} className="knop knop-navy">
          Bekijk de viskalender
        </Link>
      </Sectie>

      <PaginaSlot
        titel="Liever proeven dan lezen?"
        tekst="Alles waar we hier over schrijven ligt gewoon in de vitrine. Herenstraat 48 in Leiden, dinsdag tot en met zaterdag — of bestel vooruit."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
          { label: "Het assortiment", href: `/${locale}/assortiment`, soort: "lijn" },
        ]}
      />
    </>
  );
}
