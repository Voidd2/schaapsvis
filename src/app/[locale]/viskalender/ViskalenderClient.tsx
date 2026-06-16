"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { viskalenderData } from "@/lib/viskalender";

// ── Season visual themes ───────────────────────────────────────────────────────
const SEASON: Record<
  string,
  { bg: string; accent: string; strip: string; eyebrow: string }
> = {
  Winter: {
    bg:      "linear-gradient(150deg, #060820 0%, #0f1340 50%, #1d2472 100%)",
    accent:  "#a8d8f0",
    strip:   "rgba(6,8,32,0.94)",
    eyebrow: "rgba(168,216,240,0.4)",
  },
  Lente: {
    bg:      "linear-gradient(150deg, #04100c 0%, #0a2a20 50%, #1a5c42 100%)",
    accent:  "#7ad4a8",
    strip:   "rgba(4,16,12,0.94)",
    eyebrow: "rgba(122,212,168,0.35)",
  },
  Zomer: {
    bg:      "linear-gradient(150deg, #140c00 0%, #2a1e00 50%, #7a4e10 100%)",
    accent:  "#e8c46a",
    strip:   "rgba(20,12,0,0.94)",
    eyebrow: "rgba(232,196,106,0.35)",
  },
  Herfst: {
    bg:      "linear-gradient(150deg, #120500 0%, #2a0e04 50%, #7a2810 100%)",
    accent:  "#e88c6a",
    strip:   "rgba(18,5,0,0.94)",
    eyebrow: "rgba(232,140,106,0.35)",
  },
};

// ── Fish SVG silhouette ────────────────────────────────────────────────────────
function Fish({ color = "white", size = 26 }: { color?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.56)}
      viewBox="0 0 80 45"
      fill={color}
      aria-hidden
    >
      <ellipse cx="33" cy="22" rx="31" ry="18" />
      <polygon points="62,22 80,8 80,36" />
      <circle cx="11" cy="17" r="4" fill="rgba(0,0,0,0.28)" />
    </svg>
  );
}

const FISH_COLORS = [
  "rgba(168,216,240,0.9)",
  "rgba(246,250,253,0.75)",
  "rgba(212,232,245,0.85)",
  "rgba(184,131,46,0.9)",
];

// ── Badge ──────────────────────────────────────────────────────────────────────
function Badge({ type }: { type: string }) {
  const bg =
    type === "MSC" ? "#2e8b6e" : type === "ASC" ? "#1d75b8" : "#2e8b6e";
  return (
    <span
      className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 leading-none"
      style={{ backgroundColor: bg, color: "white" }}
    >
      {type}
    </span>
  );
}

// ── Framer Motion variants ────────────────────────────────────────────────────
const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const fishContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
};
const fishItem: Variants = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ── Main component ────────────────────────────────────────────────────────────
export function ViskalenderClient() {
  const prefersReducedMotion = useReducedMotion();
  const noMotion = prefersReducedMotion ?? false;

  const [activeMaand, setActiveMaand]   = useState(0);
  const [currentDay, setCurrentDay]     = useState("");
  const [activeSeason, setActiveSeason] = useState("Winter");

  const sectionRefs     = useRef<(HTMLElement | null)[]>(Array(12).fill(null));
  const monthBtnRefs    = useRef<(HTMLButtonElement | null)[]>(Array(12).fill(null));
  const stripRef        = useRef<HTMLDivElement>(null);
  const isScrollingRef  = useRef(true);

  const setRef = useCallback((el: HTMLElement | null, i: number) => {
    sectionRefs.current[i] = el;
  }, []);

  // Scroll the month strip so active month is visible
  const snapStrip = useCallback((i: number) => {
    const btn   = monthBtnRefs.current[i];
    const strip = stripRef.current;
    if (!btn || !strip) return;
    strip.scrollTo({
      left: btn.offsetLeft - strip.offsetWidth / 2 + btn.offsetWidth / 2,
      behavior: "smooth",
    });
  }, []);

  // Public: jump to a month by clicking the strip
  const jumpToMonth = useCallback(
    (i: number) => {
      isScrollingRef.current = true;
      const el = sectionRefs.current[i];
      if (el) el.scrollIntoView({ behavior: noMotion ? "auto" : "smooth", block: "start" });
      setTimeout(() => { isScrollingRef.current = false; }, noMotion ? 50 : 900);
    },
    [noMotion]
  );

  useEffect(() => {
    const now   = new Date();
    const month = now.getMonth();
    const days  = ["zo", "ma", "di", "wo", "do", "vr", "za"];

    setActiveMaand(month);
    setActiveSeason(viskalenderData[month].seizoen);
    setCurrentDay(`${days[now.getDay()]} ${now.getDate()}/${now.getMonth() + 1}`);

    // Jump to current month
    const el = sectionRefs.current[month];
    if (el) el.scrollIntoView({ behavior: noMotion ? "auto" : "smooth", block: "start" });
    snapStrip(month);

    // Unlock observer after scroll
    const unlock = setTimeout(() => {
      isScrollingRef.current = false;
    }, noMotion ? 50 : 900);

    // IntersectionObserver to track active month while scrolling
    const obs = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const idx = sectionRefs.current.findIndex((s) => s === e.target);
          if (idx === -1) return;
          setActiveMaand(idx);
          setActiveSeason(viskalenderData[idx].seizoen);
          snapStrip(idx);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => { if (el) obs.observe(el); });

    return () => {
      obs.disconnect();
      clearTimeout(unlock);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const theme     = SEASON[activeSeason] ?? SEASON.Winter;
  const realMonth = currentDay ? new Date().getMonth() : -1;

  return (
    <div style={{ backgroundColor: "#060820" }}>
      {/* ── Sticky month navigation strip ────────────────────────────────── */}
      <div
        ref={stripRef}
        className="sticky top-0 z-30 overflow-x-auto scrollbar-hide border-b"
        style={{
          backgroundColor: theme.strip,
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.07)",
          transition: "background-color 0.6s ease",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex min-w-max px-2 py-2">
          {viskalenderData.map((maand, i) => {
            const active   = i === activeMaand;
            const isToday  = i === realMonth;
            return (
              <button
                key={i}
                ref={(el) => { monthBtnRefs.current[i] = el; }}
                onClick={() => jumpToMonth(i)}
                className="relative px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 whitespace-nowrap"
                style={{
                  color:           active ? "var(--navy-dark)" : "rgba(246,250,253,0.38)",
                  backgroundColor: active ? "var(--gold)"      : "transparent",
                  minWidth:        42,
                }}
                aria-current={active ? "true" : undefined}
              >
                {maand.afkorting}
                {isToday && (
                  <span
                    className="absolute top-1.5 right-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isToday && active ? "var(--navy-dark)" : "#ff6b6b" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Month sections ──────────────────────────────────────────────────── */}
      {viskalenderData.map((maand, i) => {
        const th       = SEASON[maand.seizoen] ?? SEASON.Winter;
        const isActive = i === activeMaand;
        const isNow    = i === realMonth;

        return (
          <section
            key={i}
            id={`maand-${i}`}
            ref={(el) => setRef(el, i)}
            className="relative flex flex-col justify-center overflow-hidden"
            style={{
              minHeight: "100svh",
              background: th.bg,
            }}
          >
            {/* Ghost month name in background */}
            <span
              aria-hidden
              className="absolute inset-0 flex items-end pb-8 pl-4 md:pl-12 select-none pointer-events-none overflow-hidden"
              style={{
                fontSize:    "clamp(6rem, 28vw, 22rem)",
                fontFamily:  "Playfair Display, serif",
                fontWeight:  700,
                color:       "white",
                opacity:     0.045,
                lineHeight:  1,
                letterSpacing: "-0.04em",
              }}
            >
              {maand.naam}
            </span>

            {/* Main content grid */}
            <motion.div
              className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-14 py-16 md:py-24"
              variants={noMotion ? undefined : sectionReveal}
              initial={noMotion ? false : "hidden"}
              whileInView={noMotion ? undefined : "show"}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            >
              <div className="md:grid md:grid-cols-5 md:gap-16 md:items-start">

                {/* ── Left: meta + heading + description ─────────────────── */}
                <div className="md:col-span-3">
                  {/* Badges row */}
                  <div className="flex items-center flex-wrap gap-2 mb-5">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1"
                      style={{
                        backgroundColor: th.eyebrow,
                        color: "rgba(246,250,253,0.75)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {maand.seizoen}
                    </span>
                    {isNow && currentDay && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1.5"
                        style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full bg-current"
                          style={{ animation: "pulse 2s infinite" }}
                        />
                        Nu · {currentDay}
                      </span>
                    )}
                  </div>

                  {/* Month heading */}
                  <h2
                    className="font-bold leading-none mb-5"
                    style={{
                      fontFamily:    "Playfair Display, serif",
                      color:         "rgba(246,250,253,0.95)",
                      fontSize:      "clamp(2.8rem, 9vw, 5.5rem)",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {maand.naam}
                  </h2>

                  {/* Hoogtepunt */}
                  <p
                    className="text-base md:text-lg font-semibold mb-5 leading-snug"
                    style={{ color: th.accent }}
                  >
                    {maand.hoogtepunt}
                  </p>

                  {/* Divider */}
                  <div
                    className="w-12 h-px mb-6"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  />

                  {/* Description */}
                  <p
                    className="text-sm md:text-base leading-relaxed mb-8"
                    style={{ color: "rgba(246,250,253,0.6)", maxWidth: "52ch" }}
                  >
                    {maand.tekst}
                  </p>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3">
                    {maand.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-opacity hover:opacity-75"
                        style={{
                          border:          "1px solid rgba(255,255,255,0.2)",
                          color:           "rgba(246,250,253,0.8)",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          backdropFilter:  "blur(4px)",
                        }}
                      >
                        {link.label} →
                      </Link>
                    ))}
                  </div>
                </div>

                {/* ── Right: fish list ───────────────────────────────────── */}
                <div className="md:col-span-2 mt-12 md:mt-0 md:pt-2">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.22em] mb-5"
                    style={{ color: "rgba(246,250,253,0.3)" }}
                  >
                    Seizoensvis
                  </p>

                  <motion.ul
                    className="space-y-0"
                    variants={noMotion ? undefined : fishContainer}
                    initial={noMotion ? false : "hidden"}
                    whileInView={noMotion ? undefined : "show"}
                    viewport={{ once: true }}
                  >
                    {maand.vis.map((vis, fi) => (
                      <motion.li
                        key={vis.naam}
                        variants={noMotion ? undefined : fishItem}
                        className="flex items-center gap-3 py-3.5"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {/* Fish icon box */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center"
                          style={{
                            width:           38,
                            height:          38,
                            backgroundColor: "rgba(255,255,255,0.06)",
                          }}
                        >
                          <Fish color={FISH_COLORS[fi % FISH_COLORS.length]} size={24} />
                        </div>

                        {/* Name */}
                        <span
                          className="flex-1 text-sm md:text-base font-medium"
                          style={{ color: "rgba(246,250,253,0.82)" }}
                        >
                          {vis.naam}
                        </span>

                        {vis.keurmerk && <Badge type={vis.keurmerk} />}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            </motion.div>

            {/* Scroll hint — first month only */}
            {i === 0 && (
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                style={{ animation: "bounce 2s infinite" }}
                aria-hidden
              >
                <span
                  className="text-[9px] uppercase tracking-[0.3em]"
                  style={{ color: "rgba(246,250,253,0.2)" }}
                >
                  scroll
                </span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="rgba(246,250,253,0.2)" strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
