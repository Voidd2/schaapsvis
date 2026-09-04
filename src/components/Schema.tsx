/**
 * Zet gestructureerde gegevens (JSON-LD) in de pagina.
 *
 * Eén component in plaats van overal een los <script>-blok, zodat er nooit een
 * pagina overblijft met halve of dubbele gegevens.
 */
export function Schema({ data }: { data: object | object[] }) {
  const blokken = Array.isArray(data) ? data : [data];
  return (
    <>
      {blokken.map((blok, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify levert geen uitvoerbare code op; de </script>-reeks
          // wordt hieronder onschadelijk gemaakt zodat het blok niet vroegtijdig
          // kan worden afgesloten.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blok).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
