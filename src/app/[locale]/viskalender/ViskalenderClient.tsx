"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { viskalenderData } from "@/lib/viskalender";
import type { MaandData } from "@/lib/viskalender";

// ── SVG wheel geometry ────────────────────────────────────────────────────────
const CX = 100, CY = 100, R_OUT = 80, R_IN = 22;
const toRad = (d: number) => (d * Math.PI) / 180;

function slicePath(i: number): string {
  const a0 = i * 30 - 90, a1 = a0 + 30;
  const ox1 = CX + R_OUT * Math.cos(toRad(a0)), oy1 = CY + R_OUT * Math.sin(toRad(a0));
  const ox2 = CX + R_OUT * Math.cos(toRad(a1)), oy2 = CY + R_OUT * Math.sin(toRad(a1));
  const ix1 = CX + R_IN * Math.cos(toRad(a0)),  iy1 = CY + R_IN * Math.sin(toRad(a0));
  const ix2 = CX + R_IN * Math.cos(toRad(a1)),  iy2 = CY + R_IN * Math.sin(toRad(a1));
  const f = (n: number) => n.toFixed(2);
  return `M ${f(ix1)},${f(iy1)} L ${f(ox1)},${f(oy1)} A ${R_OUT},${R_OUT} 0 0,1 ${f(ox2)},${f(oy2)} L ${f(ix2)},${f(iy2)} A ${R_IN},${R_IN} 0 0,0 ${f(ix1)},${f(iy1)} Z`;
}

function labelXY(i: number) {
  const mid = (i + 0.5) * 30 - 90;
  const r = (R_OUT + R_IN) / 2;
  return { x: (CX + r * Math.cos(toRad(mid))).toFixed(1), y: (CY + r * Math.sin(toRad(mid))).toFixed(1) };
}

const SLICES = Array.from({ length: 12 }, (_, i) => ({ path: slicePath(i), xy: labelXY(i) }));
const wheelRotation = (i: number) => -(i * 30 + 15);

// ── Seasonal section backgrounds ──────────────────────────────────────────────
const SEASON_BG: Record<string, string> = {
  Winter:  "rgba(20,25,79,0.55)",
  Lente:   "rgba(20,60,50,0.4)",
  Zomer:   "rgba(80,50,20,0.4)",
  Herfst:  "rgba(60,30,15,0.45)",
};

// ── Fish SVG silhouette ───────────────────────────────────────────────────────
function Fish({ color = "currentColor", size = 34 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.56)} viewBox="0 0 80 45" fill={color} aria-hidden="true" style={{ flexShrink: 0 }}>
      <ellipse cx="33" cy="22" rx="31" ry="18" />
      <polygon points="62,22 80,8 80,36" />
      <circle cx="11" cy="17" r="4" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}

// ── Keurmerk badge ────────────────────────────────────────────────────────────
const BADGE_BG: Record<string, string> = { MSC: "var(--seafoam)", ASC: "var(--lichtblauw)", BIO: "var(--seafoam)" };

function Badge({ type }: { type: string }) {
  return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 leading-none"
      style={{ backgroundColor: BADGE_BG[type] ?? "var(--gold)", color: "var(--navy-dark)" }}
    >
      {type}
    </span>
  );
}

// ── Calendar wheel ────────────────────────────────────────────────────────────
function CalendarWheel({
  activeMaand,
  currentDay,
  noMotion,
}: {
  activeMaand: number;
  currentDay: string;
  noMotion: boolean;
}) {
  const rotation = wheelRotation(activeMaand);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 200 200"
        width={260}
        height={260}
        role="img"
        aria-label={`Viskalender — ${viskalenderData[activeMaand].naam} actief`}
      >
        <polygon points="93,3 107,3 100,16" fill="var(--gold)" />
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
            transition: noMotion ? "none" : "transform 0.55s cubic-bezier(0.25,0.1,0.25,1)",
          }}
        >
          {SLICES.map(({ path, xy }, i) => {
            const active = i === activeMaand;
            return (
              <g key={i}>
                <path
                  d={path}
                  fill={active ? "var(--gold)" : "var(--navy)"}
                  stroke="var(--navy-dark)"
                  strokeWidth="1.5"
                />
                <text
                  x={xy.x}
                  y={xy.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={active ? "8.5" : "6.5"}
                  fontWeight={active ? "700" : "400"}
                  fill={active ? "var(--navy-dark)" : "rgba(246,250,253,0.55)"}
                  style={{ fontFamily: "sans-serif", pointerEvents: "none" }}
                >
                  {viskalenderData[i].afkorting}
                </text>
              </g>
            );
          })}
        </g>
        <circle cx={CX} cy={CY} r={R_IN - 1} fill="var(--navy-dark)" />
        {currentDay ? (
          <>
            <text x={CX} y={CY - 7} textAnchor="middle" fontSize="5" fontWeight="700" letterSpacing="1" fill="var(--gold)" style={{ fontFamily: "sans-serif" }}>
              VANDAAG
            </text>
            <text x={CX} y={CY + 4} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="var(--cream)" style={{ fontFamily: "sans-serif" }}>
              {viskalenderData[activeMaand].afkorting}
            </text>
            <text x={CX} y={CY + 13} textAnchor="middle" fontSize="4.5" fill="rgba(246,250,253,0.45)" style={{ fontFamily: "sans-serif" }}>
              {currentDay}
            </text>
          </>
        ) : (
          <text x={CX} y={CY + 4} textAnchor="middle" fontSize="7" fill="var(--cream)" style={{ fontFamily: "sans-serif" }}>
            {viskalenderData[activeMaand].afkorting}
          </text>
        )}
      </svg>
      <div className="text-center">
        <p className="text-xs" style={{ color: "rgba(246,250,253,0.5)" }}>
          Seizoen:{" "}
          <strong style={{ color: "var(--gold)" }}>{viskalenderData[activeMaand].seizoen}</strong>
        </p>
      </div>
    </div>
  );
}

// ── Framer Motion variants ────────────────────────────────────────────────────
const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};
const fishContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const fishItem: Variants = {
  hidden: { opacity: 0, x: -36 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ── Month section ─────────────────────────────────────────────────────────────
const FISH_COLORS = ["var(--sand)", "var(--lichtblauw)", "var(--gold)", "var(--cream)"];

function MaandSection({
  maand,
  index,
  activeMaand,
  noMotion,
  setRef,
}: {
  maand: MaandData;
  index: number;
  activeMaand: number;
  noMotion: boolean;
  setRef: (el: HTMLElement | null) => void;
}) {
  const isActive = index === activeMaand;
  const bg = isActive ? (SEASON_BG[maand.seizoen] ?? "rgba(29,36,114,0.4)") : "var(--charcoal)";

  return (
    <motion.section
      id={`maand-${index}`}
      ref={setRef}
      variants={noMotion ? undefined : sectionReveal}
      initial={noMotion ? false : "hidden"}
      whileInView={noMotion ? undefined : "show"}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      className="py-12 px-6 md:px-10 border-b"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
        backgroundColor: bg,
        transition: noMotion ? "none" : "background-color 0.45s ease",
      }}
    >
      {/* Season / current labels */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1"
          style={{ backgroundColor: "var(--navy)", color: "var(--sand)" }}
        >
          {maand.seizoen}
        </span>
        {isActive && (
          <span
            className="text-xs uppercase tracking-widest font-bold px-2.5 py-1"
            style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}
          >
            Nu
          </span>
        )}
      </div>

      {/* Month heading */}
      <h2
        className="text-4xl font-bold mb-2 leading-tight"
        style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
      >
        {maand.naam}
      </h2>

      {/* Highlight */}
      <p className="text-base font-semibold mb-5" style={{ color: "var(--gold)" }}>
        {maand.hoogtepunt}
      </p>

      {/* Body text */}
      <p
        className="text-sm leading-relaxed mb-8"
        style={{ color: "rgba(246,250,253,0.72)", maxWidth: "54ch" }}
      >
        {maand.tekst}
      </p>

      {/* Fish list — stagger animation */}
      <motion.ul
        className="space-y-2.5 mb-8"
        variants={noMotion ? undefined : fishContainer}
        initial={noMotion ? false : "hidden"}
        whileInView={noMotion ? undefined : "show"}
        viewport={{ once: true }}
      >
        {maand.vis.map((vis, fi) => (
          <motion.li
            key={vis.naam}
            className="flex items-center gap-3"
            variants={noMotion ? undefined : fishItem}
          >
            <Fish color={FISH_COLORS[fi % FISH_COLORS.length]} size={30} />
            <span className="text-sm font-medium" style={{ color: "var(--cream)" }}>
              {vis.naam}
            </span>
            {vis.keurmerk && <Badge type={vis.keurmerk} />}
          </motion.li>
        ))}
      </motion.ul>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        {maand.links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm font-semibold px-4 py-2 transition-opacity hover:opacity-75"
            style={{
              backgroundColor: "var(--navy)",
              color: "var(--sand)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ViskalenderClient() {
  const prefersReducedMotion = useReducedMotion();
  const noMotion = prefersReducedMotion ?? false;

  const [activeMaand, setActiveMaand] = useState(0);
  const [currentDay, setCurrentDay]   = useState("");

  const sectionRefs        = useRef<(HTMLElement | null)[]>(Array(12).fill(null));
  const isInitialScrollRef = useRef(true); // gates observer during initial auto-scroll

  const setRef = useCallback((el: HTMLElement | null, i: number) => {
    sectionRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const now   = new Date();
    const month = now.getMonth();
    const days  = ["zo", "ma", "di", "wo", "do", "vr", "za"];

    setActiveMaand(month);
    setCurrentDay(`${days[now.getDay()]} ${now.getDate()}/${now.getMonth() + 1}`);

    // Scroll to current month immediately — observer is still gated
    const scrollEl = sectionRefs.current[month];
    if (scrollEl) {
      scrollEl.scrollIntoView({ behavior: noMotion ? "auto" : "smooth", block: "start" });
    }

    // Enable observer only after the scroll animation has finished
    const enableTimer = setTimeout(() => {
      isInitialScrollRef.current = false;
    }, noMotion ? 50 : 900);

    // Active-month observer: tight viewport band
    const activeObs = new IntersectionObserver(
      (entries) => {
        if (isInitialScrollRef.current) return;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const idx = sectionRefs.current.findIndex((el) => el === e.target);
          if (idx !== -1) setActiveMaand(idx);
        });
      },
      { rootMargin: "-28% 0px -62% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) activeObs.observe(el);
    });

    return () => {
      activeObs.disconnect();
      clearTimeout(enableTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ backgroundColor: "var(--charcoal)" }}>
      <div className="max-w-6xl mx-auto md:flex">
        {/* Sticky wheel — desktop only */}
        <aside
          className="hidden md:flex flex-col items-center border-r w-80 flex-shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="sticky top-8 py-12">
            <CalendarWheel activeMaand={activeMaand} currentDay={currentDay} noMotion={noMotion} />
          </div>
        </aside>

        {/* Month sections */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Mobile: compact indicator */}
          <div
            className="md:hidden flex items-center gap-2 px-6 py-3 border-b"
            style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "var(--navy-dark)" }}
          >
            <span className="text-xs" style={{ color: "rgba(246,250,253,0.5)" }}>Nu:</span>
            <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>
              {viskalenderData[activeMaand].naam}
            </span>
            <span className="text-xs" style={{ color: "rgba(246,250,253,0.4)" }}>
              · {viskalenderData[activeMaand].seizoen}
            </span>
          </div>

          {viskalenderData.map((maand, i) => (
            <MaandSection
              key={i}
              maand={maand}
              index={i}
              activeMaand={activeMaand}
              noMotion={noMotion}
              setRef={(el) => setRef(el, i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
