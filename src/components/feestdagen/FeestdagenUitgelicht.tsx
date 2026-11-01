"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { FeestProduct } from "@/lib/feestdagen";

type Props = {
  locale: string;
  label: string;
  title: string;
  hint: string;
  linkLabel: string;
  products: readonly FeestProduct[];
};

export function FeestdagenUitgelicht({ locale, label, title, hint, linkLabel, products }: Props) {
  const rail = useRef<HTMLUListElement>(null);
  const featured = products.slice(0, 7);

  function move(direction: -1 | 1) {
    const container = rail.current;
    if (!container) return;
    container.scrollBy({ left: direction * Math.max(280, container.clientWidth * 0.82), behavior: "smooth" });
  }

  const previous = locale === "de" ? "Vorherige Empfehlung" : locale === "en" ? "Previous highlight" : "Vorige uitgelichte keuze";
  const next = locale === "de" ? "Nächste Empfehlung" : locale === "en" ? "Next highlight" : "Volgende uitgelichte keuze";

  return (
    <section className="overflow-hidden border-b" style={{ background: "linear-gradient(115deg, #063f59 0%, #075b82 58%, #0d7da5 100%)", borderColor: "rgba(255,255,255,.18)" }} aria-labelledby="feest-uitgelicht">
      <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-4 py-7 md:py-10">
        <div className="mb-5 flex items-end justify-between gap-5 text-white">
          <div>
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[#ffd98b]">{label}</p>
            <h2 id="feest-uitgelicht" className="mt-1 text-[1.65rem] leading-tight md:text-[2.2rem]" style={{ color: "white" }}>{title}</h2>
            <p className="mt-1 text-xs text-white/70 md:hidden">{hint} →</p>
          </div>
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => move(-1)} aria-label={previous} className="grid h-11 w-11 place-items-center rounded-full border border-white/45 text-2xl text-white transition hover:bg-white hover:text-[#075b82]">←</button>
            <button type="button" onClick={() => move(1)} aria-label={next} className="grid h-11 w-11 place-items-center rounded-full border border-white/45 text-2xl text-white transition hover:bg-white hover:text-[#075b82]">→</button>
          </div>
        </div>

        <ul ref={rail} className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5" aria-label={title}>
          {featured.map(([productTitle, text, image, alt, href, price], index) => (
            <li key={productTitle} className="min-w-[84%] snap-start overflow-hidden rounded-xl bg-white shadow-lg sm:min-w-[47%] lg:min-w-[31.5%]">
              <Link href={`/${locale}${href}`} className="group grid h-full grid-rows-[auto_1fr] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#ffd98b]">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#eaf7fc]">
                  <Image src={image} alt={alt} fill sizes="(max-width: 640px) 84vw, (max-width: 1024px) 47vw, 32vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.035]" priority={index === 0} />
                  <span className="absolute left-3 top-3 rounded-full bg-[#b32632] px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white">{label}</span>
                </div>
                <div className="flex flex-col p-5">
                  <h3 className="text-[1.28rem] leading-tight" style={{ color: "var(--navy-dark)" }}>{productTitle}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: "var(--charcoal)" }}>{text}</p>
                  <p className="mt-4 text-sm font-bold" style={{ color: "#a61f2b" }}>{price}</p>
                  <span className="mt-3 text-sm font-semibold underline underline-offset-4" style={{ color: "var(--navy)" }}>{linkLabel} →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
