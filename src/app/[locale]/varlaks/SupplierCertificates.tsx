import styles from "./campaign.module.css";

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
    title: "Certificaten van de leverancier",
    intro: "VÅRLAKS is een zalmmerk van Norwegian Seafood Group. De groep publiceert de volgende documenten over de herkomst en verwerking van vis.",
    asc: "Met deze ketencertificaten tonen de leveranciers aan hoe zij ASC-gecertificeerde vis gescheiden houden en de herkomst kunnen terugvolgen.",
    register: "Controleer een certificaatnummer bij ASC",
    gap: "Het ketencertificaat van Norwegian Seafood Europe B.V. in Urk omvat onder meer de opslag, verwerking en verpakking van Atlantische zalm.",
    gapLink: "Bekijk de GLOBALG.A.P.-certificaten",
    ifs: "Het IFS Food-certificaat voor de locatie in Urk gaat over voedselveiligheid bij onder meer het fileren, portioneren en verpakken van zalm.",
    ifsLink: "Bekijk het IFS Food-certificaat",
    index: "Alle certificaten bij Norwegian Seafood Group",
  },
  en: {
    title: "Supplier certificates",
    intro: "VÅRLAKS is a salmon brand of Norwegian Seafood Group. The group publishes the following documents on seafood sourcing and processing.",
    asc: "These chain of custody certificates cover how the suppliers keep ASC-certified seafood separate and trace it back to its source.",
    register: "Check a certificate number with ASC",
    gap: "The chain of custody certificate for Norwegian Seafood Europe B.V. in Urk covers the storage, processing and packing of Atlantic salmon.",
    gapLink: "View the GLOBALG.A.P. certificates",
    ifs: "The IFS Food certificate for the Urk site covers food safety in activities including filleting, portioning and packing salmon.",
    ifsLink: "View the IFS Food certificate",
    index: "All certificates at Norwegian Seafood Group",
  },
  de: {
    title: "Zertifikate des Lieferanten",
    intro: "VÅRLAKS ist eine Lachsmarke der Norwegian Seafood Group. Die Gruppe veröffentlicht die folgenden Dokumente zur Herkunft und Verarbeitung von Fisch.",
    asc: "Diese Lieferkettenzertifikate belegen, wie die Lieferanten ASC-zertifizierten Fisch getrennt halten und bis zu seiner Herkunft zurückverfolgen können.",
    register: "Zertifikatsnummer bei ASC prüfen",
    gap: "Das Lieferkettenzertifikat für Norwegian Seafood Europe B.V. in Urk umfasst unter anderem die Lagerung, Verarbeitung und Verpackung von Atlantischem Lachs.",
    gapLink: "GLOBALG.A.P.-Zertifikate ansehen",
    ifs: "Das IFS-Food-Zertifikat für den Standort Urk betrifft die Lebensmittelsicherheit unter anderem beim Filetieren, Portionieren und Verpacken von Lachs.",
    ifsLink: "IFS-Food-Zertifikat ansehen",
    index: "Alle Zertifikate der Norwegian Seafood Group",
  },
};

export function SupplierCertificates({ locale }: { locale: keyof typeof copy }) {
  const t = copy[locale];
  return <details className={styles.certificates} id="certificaten">
    <summary>{t.title}</summary>
    <p>{t.intro}</p>
    <dl>
      <dt>ASC Chain of Custody</dt>
      <dd>
        <p>{t.asc}</p>
        {ascDocuments.map(doc => <a key={doc.code} href={doc.href}>
          {doc.holder} · {doc.code} (PDF)
        </a>)}
        <a href="https://asc-aqua.org/find-a-supplier/">{t.register}</a>
      </dd>
      <dt>GLOBALG.A.P. Chain of Custody</dt>
      <dd><p>{t.gap}</p><a href={supplierIndex + "#global-g-a-p"}>{t.gapLink}</a></dd>
      <dt>IFS Food</dt>
      <dd><p>{t.ifs}</p><a href={supplierIndex + "#ifs-food"}>{t.ifsLink}</a></dd>
    </dl>
    <a href={supplierIndex}>{t.index}</a>
  </details>;
}
