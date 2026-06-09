import Link from "next/link";
import { notFound } from "next/navigation";
import { useLocale } from "next-intl";
import type { Metadata } from "next";
import { Clock, ChefHat, ShoppingBag, ShoppingCart, ArrowLeft } from "lucide-react";
import { PhotoPlaceholder } from "@/components/shared/PhotoPlaceholder";
import { recepten, TAG_ICON, type Recept } from "@/lib/recepten";

export async function generateStaticParams() {
  return recepten.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recept = recepten.find((r) => r.slug === slug);
  if (!recept) return {};

  return {
    title: `${recept.title} | Recepten Schaap's Vis Leiden`,
    description: `${recept.verhaal.slice(0, 155)}...`,
    keywords: recept.seoKeywords,
    openGraph: {
      title: `${recept.title} | Schaap's Vis Leiden`,
      description: recept.subtitle,
      type: "article",
      images: recept.fotoUrl ? [{ url: recept.fotoUrl }] : [],
    },
  };
}

function ReceptDetailContent({
  recept,
  locale,
}: {
  recept: Recept;
  locale: string;
}) {
  const moeilijkheidColor =
    recept.moeilijkheid === "Makkelijk"
      ? "var(--seafoam)"
      : recept.moeilijkheid === "Gemiddeld"
      ? "var(--gold)"
      : "var(--salmon)";

  return (
    <>
      {/* Back */}
      <div
        className="py-4 px-6"
        style={{ backgroundColor: "var(--cream)", borderBottom: "1px solid var(--sand)" }}
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/${locale}/recepten`}
            className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--navy)" }}
          >
            <ArrowLeft size={15} />
            Alle recepten
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {recept.highlight && (
            <span
              className="inline-block text-xs font-bold px-3 py-1 mb-5 text-white"
              style={{ backgroundColor: "var(--salmon)" }}
            >
              {recept.highlight}
            </span>
          )}
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
            style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
          >
            {recept.title}
          </h1>
          <p className="text-lg mb-6" style={{ color: "rgba(247,240,227,0.7)" }}>
            {recept.subtitle}
          </p>
          <div className="flex flex-wrap gap-3 mb-2">
            <span
              className="inline-flex items-center gap-2 text-sm px-4 py-2 text-white"
              style={{ backgroundColor: "rgba(247,240,227,0.1)" }}
            >
              <Clock size={15} /> {recept.tijd}
            </span>
            <span
              className="inline-flex items-center gap-2 text-sm px-4 py-2 text-white"
              style={{ backgroundColor: "rgba(247,240,227,0.1)" }}
            >
              <ChefHat size={15} /> {recept.moeilijkheid}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {recept.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1"
                style={{ backgroundColor: "rgba(247,240,227,0.12)", color: "var(--sand)" }}
              >
                {TAG_ICON[tag]} {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-14 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Left: photo + verhaal + stappen */}
          <div className="md:col-span-2 space-y-8">
            {recept.fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={recept.fotoUrl}
                alt={recept.title}
                className="w-full aspect-video object-cover"
              />
            ) : (
              <PhotoPlaceholder
                label={recept.fotoLabel}
                aspectRatio="aspect-video"
              />
            )}

            {/* Verhaal */}
            <div
              className="p-6"
              style={{
                backgroundColor: "var(--sand)",
                borderLeft: "4px solid var(--navy)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50"
                style={{ color: "var(--navy)" }}
              >
                Aldert vertelt
              </p>
              <p
                className="leading-relaxed italic"
                style={{ color: "var(--charcoal)", opacity: 0.85 }}
              >
                &ldquo;{recept.verhaal}&rdquo;
              </p>
            </div>

            {/* Bereidingswijze */}
            <div>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
              >
                Bereidingswijze
              </h2>
              <ol className="space-y-4">
                {recept.bereidingswijze.map((stap, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "var(--navy)" }}
                    >
                      {i + 1}
                    </span>
                    <p
                      className="leading-relaxed text-sm pt-0.5"
                      style={{ color: "var(--charcoal)", opacity: 0.85 }}
                    >
                      {stap}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: boodschappenlijst */}
          <div className="space-y-5">
            {/* Van Schaap's Vis */}
            <div
              className="p-5"
              style={{
                backgroundColor: "var(--navy)",
                borderTop: "3px solid var(--salmon)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={16} style={{ color: "var(--sand)" }} />
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--sand)" }}
                >
                  Van Schaap&apos;s Vis
                </h3>
              </div>
              <ul className="space-y-2">
                {recept.vanSchaap.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-snug"
                    style={{ color: "rgba(247,240,227,0.85)" }}
                  >
                    · {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/bestellen`}
                className="inline-block mt-5 text-xs font-semibold px-4 py-2 text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--salmon)" }}
              >
                Vooruit bestellen
              </Link>
            </div>

            {/* Van de supermarkt */}
            <div
              className="p-5"
              style={{
                backgroundColor: "var(--sand)",
                borderTop: "3px solid var(--charcoal)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart
                  size={16}
                  style={{ color: "var(--charcoal)", opacity: 0.6 }}
                />
                <h3
                  className="text-sm font-bold uppercase tracking-wide opacity-60"
                  style={{ color: "var(--charcoal)" }}
                >
                  Van de supermarkt
                </h3>
              </div>
              <ul className="space-y-2">
                {recept.vanSupermarkt.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-snug opacity-75"
                    style={{ color: "var(--charcoal)" }}
                  >
                    · {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Moeilijkheid */}
            <div className="p-4 bg-white">
              <div
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: moeilijkheidColor }}
              >
                {recept.moeilijkheid}
              </div>
              <p
                className="text-xs opacity-60"
                style={{ color: "var(--charcoal)" }}
              >
                {recept.moeilijkheid === "Makkelijk"
                  ? "Perfect voor doordeweeks — geen gedoe"
                  : recept.moeilijkheid === "Gemiddeld"
                  ? "Met aandacht en geduld prima te doen"
                  : "Voor de echte liefhebber — de moeite waard"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back */}
      <section
        style={{ backgroundColor: "var(--navy)" }}
        className="py-12 px-6 text-center"
      >
        <Link
          href={`/${locale}/recepten`}
          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: "var(--sand)" }}
        >
          <ArrowLeft size={15} />
          Meer recepten van Schaap&apos;s Vis
        </Link>
      </section>
    </>
  );
}

function ReceptDetailWrapper({ recept }: { recept: Recept }) {
  const locale = useLocale();
  return <ReceptDetailContent recept={recept} locale={locale} />;
}

export default async function ReceptDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const recept = recepten.find((r) => r.slug === slug);
  if (!recept) notFound();

  return <ReceptDetailWrapper recept={recept} />;
}
