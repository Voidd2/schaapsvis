<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Schaapsvis: houd context klein

Begin bij `README.md` en lees daarna alleen de bron die bij de wijziging hoort. `docs/project-map.md` bevat de huidige architectuur, bewezen status en open werkzaamheden; controleer veranderlijke live-status opnieuw in Cloudflare. Voor account- of studentenwerk is `workers/members/README.md` de gedetailleerde bron. Voor de bedrijfsrichting is `docs/bedrijfsdoel-en-platformstrategie.md` de bron.

De live site draait op Cloudflare Worker `schaapsvis`; `/api/members/*` gaat naar Worker `schaapsvis-members` met D1 en private R2. Een groene Vercel-build bewijst geen productie-uitrol. Test de aangeraakte laag, controleer daarna de bijbehorende Cloudflare-deploy en de echte route. Bewaar geen wachtwoorden, tokens, mailcodes of persoonsgegevens in Git of documentatie.
