import Link from "next/link";
import type { Metadata } from "next";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { VarlaksFilm } from "@/components/shared/VarlaksFilm";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { BEELD } from "@/lib/beeld";
import { DiscountOfferPopup } from "@/components/shared/DiscountOfferPopup";
import { VarlaksLocations } from "@/components/shared/VarlaksLocations";
import { BedieningSlot } from "@/components/catalog/BedieningSlot";
import { Schema } from "@/components/Schema";
import { campaign } from "./campaign";
import { SupplierCertificates } from "./SupplierCertificates";
import { questionsCopy, sources } from "./questions";
import styles from "./campaign.module.css";

type Props = { params: Promise<{ locale: string }> };
const language = (locale: string) => locale === "en" || locale === "de" ? locale : "nl";
const base = "/images/varlaks/";

function Photo({ name, alt, hero = false }: { name: "zalmfilet" | "noord-noorwegen" | "zalm-aan-tafel"; alt: string; hero?: boolean }) {
  const widths = hero ? [640, 1200, 1760] : [640, 1280];
  const wide = name === "zalm-aan-tafel";
  // Serve the supplied print photos in screen-sized WebP variants directly from the Worker.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={base + name + "-640.webp"} alt={alt} width={640} height={hero ? 446 : 428}
    srcSet={widths.map(w => base + name + "-" + w + ".webp " + w + "w").join(", ")}
    sizes={wide ? "(max-width: 740px) 100vw, 60vw" : "(max-width: 740px) 100vw, 52vw"}
    fetchPriority={hero ? "high" : "auto"} loading={hero ? "eager" : "lazy"} decoding="async" />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = language((await params).locale);
  const c = campaign[lang];
  return paginaMetadata({ locale: lang, pad: "/varlaks", title: c.title + " | Schaap’s Vishandel", description: c.intro, image: base + "zalmfilet-1200.webp" });
}

export default async function VarlaksPage({ params }: Props) {
  const lang = language((await params).locale);
  const c = campaign[lang], q = questionsCopy[lang];
  const storefront = BEELD.winkelGevel;
  const shopCopy = lang === "nl" ? storefront : storefront.vertalingen[lang];
  const locationPhotoSizes = "(max-width: 740px) 90vw, min(45vw, 800px)";
  return <div className={styles.page}>
    <Schema data={kruimelSchema(lang, [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: "VÅRLAKS", pad: "/varlaks" }])} />
    <Schema data={{ "@context":"https://schema.org", "@type":"WebPage", name:c.title,
      inLanguage:lang, description:c.intro,
      image:BEDRIJF.domein + base + "zalmfilet-1200.webp", url:`${BEDRIJF.domein}/${lang}/varlaks` }} />
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{c.since}</p>
        <h1>{c.heading} <em>{c.place}</em></h1>
        <p className={styles.lead}>{c.intro}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#locaties">{c.locations}</a>
          <a className={styles.videoAction} href="#film"><span aria-hidden="true">▶</span>{c.video}</a>
        </div>
      </div>
      <div className={styles.heroPhoto}>
        <Photo name="zalmfilet" alt={c.fileAlt} hero />
        <a className={styles.filmLink} href="#film"><span aria-hidden="true">▷</span>{c.film}</a>
      </div>
    </header>

    <section className={styles.origin} aria-labelledby="varlaks-origin">
      <div className={styles.landscape}><Photo name="noord-noorwegen" alt={c.fjordAlt}/></div>
      <div className={styles.originCopy}>
        <p className={styles.eyebrow}>{c.why}</p><h2 id="varlaks-origin">{c.originTitle}</h2>
        <p>{c.story}</p>
        <ul>{c.proof.map(reason => <li key={reason}>{reason}</li>)}</ul>
        <p>{c.originClosing}</p>
        <a className={styles.inlineLink} href="https://varlaks.no/#why-choose-varlaks" target="_blank" rel="noopener noreferrer">{c.source} ↗</a>
      </div>
    </section>

    <SupplierCertificates locale={lang}/>

    <section id="film" className={styles.filmSection} aria-labelledby="varlaks-film-heading">
      <div className={styles.filmIntro}><p className={styles.eyebrow}>VÅRLAKS · Film</p><h2 id="varlaks-film-heading">{c.filmTitle}</h2><p>{c.filmText}</p></div>
      <div className={styles.player}><BedieningSlot fallback={<a className={styles.primary} href="https://vimeo.com/932791452">{c.vimeo} ↗</a>}>
        <VarlaksFilm locale={lang} poster={base + "kweker-met-zalm.webp"}>
          <DiscountOfferPopup locale={lang} experiment="varlaks" />
        </VarlaksFilm>
      </BedieningSlot></div>
    </section>

    <div className={styles.locationPhotos}>
        <figure>
          <StaticResponsiveImage src={storefront.bestand} alt={shopCopy.alt} className={styles.storefront}
            width={1320} height={984} sizes={locationPhotoSizes} />
          <figcaption>{shopCopy.bijschrift}</figcaption>
        </figure>
        <figure>
          <StaticResponsiveImage src={BEELD.historieNu.bestand} alt={c.stallAlt}
            width={1600} height={900} sizes={locationPhotoSizes} />
          <figcaption>{c.stallCaption}</figcaption>
        </figure>
    </div>

    <VarlaksLocations locale={lang}/>
    <section className={styles.serving} aria-labelledby="varlaks-cooking">
      <Photo name="zalm-aan-tafel" alt={c.dishAlt}/>
      <div><p className={styles.eyebrow}>{c.serving}</p><h2 id="varlaks-cooking">{c.dish}</h2><p>{c.cooking}</p>
        <Link className={styles.inlineLink} href={"/" + lang + "/recepten/zalm-citroen-dille"}>{c.recipe} →</Link></div>
    </section>
    <section className={styles.faq} aria-labelledby="varlaks-questions">
      <h2 id="varlaks-questions">{q.questions}</h2>
      <div>
        <details><summary>{q.certification.q}</summary><p>{q.certification.a}</p></details>
        <Link className={styles.recipeShortcut} href={`/${lang}/recepten?vis=zalm#lijst`}>
          <span>{q.preparationQuestion}</span>
          <span>{q.salmonRecipes} <span aria-hidden="true">→</span></span>
        </Link>
        <details><summary>{q.sources}</summary><ul>{sources.map(([url,key]) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{q[key]} ↗</a></li>)}</ul></details>
      </div>
    </section>
  </div>;
}
