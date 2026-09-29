import Image from "next/image";
import { bestelContact } from "@/lib/bestel-contact";
import { calendarCopy, localizedCalendar } from "@/lib/calendar-localization";

/**
 * Wat er déze maand ligt, bovenaan de kalender.
 *
 * Wie de viskalender opent wil één ding weten: is het nu het seizoen van wat ik
 * zoek? Die vraag beantwoorden we hier, vóór de twaalf maanden eronder. De maand
 * wordt op de server in de tijdzone Europe/Amsterdam bepaald, zodat bezoekers
 * en zoekmachines meteen dezelfde actuele maand te zien krijgen.
 *
 * En er staat eerlijk bij dat aanvoer nooit helemaal voorspelbaar is. Een
 * kalender die doet alsof de zee zich aan een schema houdt, klopt niet.
 */

export function DezeMaand({ locale, maandIndex }: { locale: string; maandIndex: number }) {
  // Server-rendered in Europe/Amsterdam: visible to crawlers without JavaScript.
  const nu = maandIndex;

  const c = calendarCopy(locale);
  const maand = localizedCalendar(locale)[nu];
  if (!maand) return null;

  return (
    <section style={{ backgroundColor: "var(--lichtblauw)" }} className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-14">
        <div>
          <p className="kapitaal mb-2" style={{ color: "var(--navy)" }}>
            {c.thisMonth}
          </p>
          <h2 className="text-[2rem] md:text-[2.6rem] leading-none mb-3">
            {`${maand.naam} ${c.at}`}
          </h2>
          <p
            className="text-[1.15rem] mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
          >
            {maand.hoogtepunt}
          </p>
          <p className="lees" style={{ color: "var(--charcoal)" }}>
            {maand.tekst}
          </p>
          <p className="lees mt-4 text-[0.95rem]" style={{ color: "var(--charcoal)" }}>
            {c.availability}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={bestelContact(locale).href} className="knop knop-rood">{bestelContact(locale).label}</a>
            <a href={`#maand-${nu}`} className="knop knop-lijn">
              {c.allAbout} {maand.naam}
            </a>
          </div>
        </div>

        <div>
          <Image src={maand.foto.src} alt={maand.foto.alt} width={1200} height={800} sizes="(max-width: 768px) 100vw, 50vw" className="w-full aspect-[16/9] object-cover rounded-2xl mb-6" />
          <p className="kapitaal mb-3" style={{ color: "var(--navy)" }}>
            {c.now}
          </p>
          <ul style={{ borderTop: "1px solid var(--navy)" }}>
            {maand.vis.map((vis) => (
              <li
                key={vis.naam}
                className="flex items-baseline justify-between gap-4 py-3"
                style={{ borderBottom: "1px solid rgba(47,62,143,0.25)" }}
              >
                <span style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {vis.naam}
                </span>
                {vis.keurmerk && (
                  <span className="kapitaal shrink-0" style={{ color: "var(--seafoam)" }}>
                    {vis.keurmerk}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
