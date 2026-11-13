import styles from "./certificates.module.css";

const supplierIndex = "https://norwegianseafood.com/certification/";
const ascDocuments = [
  {
    holder: "Norwegian Seafood AS",
    code: "ASC-C-04033",
    href: "https://norwegianseafood.com/wp-content/uploads/2026/10/ASC-Norwegian-Seafood-AS.pdf",
  },
  {
    holder: "Norwegian Seafood Europe B.V.",
    code: "ASC-C-00231",
    href: "https://norwegianseafood.com/wp-content/uploads/2026/06/ASC-2026-2029.pdf",
  },
];

const copy = {
  nl: {
    eyebrow: "Van kwekerij tot verwerking",
    title: "Wat betekenen de keurmerken?",
    intro: "Onze VÅRLAKS-zalm draagt het ASC-keurmerk. Dit vertellen de keurmerken en certificaten van onze leverancier Norwegian Seafood Group over de kweek, herkomst en verwerking.",
    ascTitle: "Verantwoorde viskweek",
    asc: "ASC stelt eisen aan de waterkwaliteit, de gezondheid van de zalm en de werkomstandigheden op de kwekerij. De ASC-ketencertificaten van onze leverancier borgen de traceerbaarheid van de gecertificeerde vis.",
    ascAlt: "Een VÅRLAKS-medewerker bij de zalmkwekerij op het water",
    register: "Controleer een certificaatnummer bij ASC",
    gapTitle: "Traceerbare herkomst",
    gap: "Onze leverancier is GLOBALG.A.P. Chain of Custody-gecertificeerd. De herkomst van gecertificeerde vis wordt vastgelegd. Bij opslag, verwerking en verpakking blijft deze vis herkenbaar en gescheiden van niet-gecertificeerde vis.",
    gapAlt: "Zalmfilets verpakt in een herkenbare VÅRLAKS-transportbak",
    gapLink: "GLOBALG.A.P. Chain of Custody (PDF)",
    ifsTitle: "Voedselveiligheid",
    ifs: "Onze leverancier heeft het IFS Food-certificaat voor de verwerking van zalm. Dit betekent controles op hygiëne, voedselveiligheid en kwaliteit bij het fileren, portioneren en verpakken.",
    ifsAlt: "Zalmfilets op de controleband in de verwerking, foto van VÅRLAKS",
    ifsLink: "IFS Food (PDF)",
    documents: "Bekijk de certificaten",
    credit: "Foto’s: VÅRLAKS",
    index: "Alle certificaten bij Norwegian Seafood Group",
  },
  en: {
    eyebrow: "From farming to processing",
    title: "What do the certifications mean?",
    intro: "Our VÅRLAKS salmon is ASC certified. Here is what the certifications held by our supplier Norwegian Seafood Group tell you about farming, origin and processing.",
    ascTitle: "Responsible fish farming",
    asc: "ASC sets requirements for water quality, salmon health and working conditions on the farm. Our supplier’s ASC Chain of Custody certificates safeguard the traceability of certified seafood.",
    ascAlt: "A VÅRLAKS employee at the salmon farm on the water",
    register: "Check a certificate number with ASC",
    gapTitle: "Traceable origin",
    gap: "Our supplier is GLOBALG.A.P. Chain of Custody certified. The origin of certified seafood is recorded. During storage, processing and packing, it remains identifiable and separate from non-certified seafood.",
    gapAlt: "Salmon fillets packed in a clearly marked VÅRLAKS transport box",
    gapLink: "GLOBALG.A.P. Chain of Custody (PDF)",
    ifsTitle: "Food safety",
    ifs: "Our supplier holds IFS Food certification for salmon processing. This covers checks on hygiene, food safety and quality during filleting, portioning and packing.",
    ifsAlt: "Salmon fillets on the inspection line during processing, photo by VÅRLAKS",
    ifsLink: "IFS Food (PDF)",
    documents: "View the certificates",
    credit: "Photos: VÅRLAKS",
    index: "All certificates at Norwegian Seafood Group",
  },
  de: {
    eyebrow: "Von der Zucht bis zur Verarbeitung",
    title: "Was bedeuten die Zertifizierungen?",
    intro: "Unser VÅRLAKS-Lachs trägt das ASC-Siegel. Das sagen die Zertifizierungen unseres Lieferanten Norwegian Seafood Group über Zucht, Herkunft und Verarbeitung aus.",
    ascTitle: "Verantwortungsvolle Fischzucht",
    asc: "ASC stellt Anforderungen an die Wasserqualität, die Gesundheit der Lachse und die Arbeitsbedingungen in der Zucht. Die ASC-Lieferkettenzertifikate unseres Lieferanten sichern die Rückverfolgbarkeit von zertifiziertem Fisch.",
    ascAlt: "Ein VÅRLAKS-Mitarbeiter an der Lachszucht auf dem Wasser",
    register: "Zertifikatsnummer bei ASC prüfen",
    gapTitle: "Rückverfolgbare Herkunft",
    gap: "Unser Lieferant ist GLOBALG.A.P. Chain of Custody-zertifiziert. Die Herkunft von zertifiziertem Fisch wird dokumentiert. Bei Lagerung, Verarbeitung und Verpackung bleibt er eindeutig erkennbar und von nicht zertifiziertem Fisch getrennt.",
    gapAlt: "Lachsfilets in einer deutlich gekennzeichneten VÅRLAKS-Transportbox",
    gapLink: "GLOBALG.A.P. Chain of Custody (PDF)",
    ifsTitle: "Lebensmittelsicherheit",
    ifs: "Unser Lieferant besitzt das IFS-Food-Zertifikat für die Lachsverarbeitung. Dazu gehören Kontrollen von Hygiene, Lebensmittelsicherheit und Qualität beim Filetieren, Portionieren und Verpacken.",
    ifsAlt: "Lachsfilets auf dem Kontrollband in der Verarbeitung, Foto von VÅRLAKS",
    ifsLink: "IFS Food (PDF)",
    documents: "Zertifikate ansehen",
    credit: "Fotos: VÅRLAKS",
    index: "Alle Zertifikate der Norwegian Seafood Group",
  },
};

export function SupplierCertificates({ locale }: { locale: keyof typeof copy }) {
  const t = copy[locale];
  const cards = [
    { key: "asc", label: "ASC", title: t.ascTitle, text: t.asc, image: "from-egg-to-plate-2.jpg.webp", alt: t.ascAlt, width: 600, height: 600 },
    { key: "gap", label: "GLOBALG.A.P. Chain of Custody", title: t.gapTitle, text: t.gap, image: "from-egg-to-plate-3.jpg.webp", alt: t.gapAlt, width: 600, height: 600 },
    { key: "ifs", label: "IFS Food", title: t.ifsTitle, text: t.ifs, image: "kwaliteitscontrole.webp", alt: t.ifsAlt, width: 1920, height: 1310 },
  ];
  return <section className={styles.certificates} id="certificaten" aria-labelledby="varlaks-certificates-heading">
    <header className={styles.intro}>
      <p className={styles.eyebrow}>{t.eyebrow}</p>
      <h2 id="varlaks-certificates-heading">{t.title}</h2>
      <p>{t.intro}</p>
    </header>
    <div className={styles.grid}>
      {cards.map(card => <article className={styles.card} key={card.key} aria-labelledby={`certificate-${card.key}`}>
        {/* Local supplier photos; no runtime image service needed on Cloudflare. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/varlaks/${card.image}`} alt={card.alt} width={card.width} height={card.height} loading="lazy" decoding="async" />
        <div className={styles.body}>
          <p className={styles.label}>{card.label}</p>
          <h3 id={`certificate-${card.key}`}>{card.title}</h3>
          <p>{card.text}</p>
          <details>
            <summary>{t.documents}</summary>
            {card.key === "asc" ? <>
              {ascDocuments.map(doc => <a key={doc.code} href={doc.href}>{doc.holder} · {doc.code} (PDF)</a>)}
              <a href="https://asc-aqua.org/find-a-supplier/">{t.register}</a>
            </> : card.key === "gap" ?
              <a href="https://norwegianseafood.com/wp-content/uploads/2026/08/Norwegian-Seafood-Europe-B.V.-GLOBALG.A.P.-26-27-2.pdf">{t.gapLink}</a> :
              <a href="https://norwegianseafood.com/wp-content/uploads/2025/12/SGS_IFS-Food-V8_NL17819942732_EN.pdf">{t.ifsLink}</a>}
          </details>
        </div>
      </article>)}
    </div>
    <footer className={styles.footer}><span>{t.credit}</span><a href={supplierIndex}>{t.index} ↗</a></footer>
  </section>;
}
