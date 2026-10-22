# Bedrijfsdoel en platformstrategie — Schaap’s Vishandel

Vastgelegd op 21 oktober 2026 op verzoek van de eigenaar. Dit document bewaart
de overkoepelende bedoeling achter de website-, hosting-, marketing- en
accountverzoeken.

## Einddoel

Maak van de website een sterke, complete en vertrouwde online basis voor
Schaap’s Vishandel. De site moet mensen helpen de winkel en marktkramen te
vinden, het assortiment en de kwaliteit begrijpen, recepten ontdekken en
contact opnemen of bestellen waar dat past.

Daarna moet de site helpen een eigen, met toestemming opgebouwde klantrelatie
te ontwikkelen:

1. Rond de site en het assortiment af: juiste productinformatie, passende en
   goede foto’s, bruikbare recepten, correcte talen, lokale vindbaarheid en
   een verzorgde mobiele ervaring.
2. Zet Meta/Facebook-advertenties in om relevante bezoekers naar de site te
   brengen.
3. Verzamel e-mailinschrijvingen met heldere toestemming en gebruik Klaviyo
   voor nieuws en aanbiedingen die speciaal voor Schaap’s-klanten zijn.
   Beloof geen vaste wekelijkse deals als die niet gegarandeerd zijn.
4. Bouw op langere termijn de e-maillijst en klantrelatie uit naar veilige
   klantaccounts, met functies zoals bezorgen, punten sparen en relevante
   klantvoordelen.
5. Maak de studentenregeling onderdeel van die veilige accountomgeving:
   betrouwbare aanmelding en verificatie, beperkte toegang tot bewijsstukken,
   bewaartermijnen en kortingsregels volgens de laatst door de eigenaar
   goedgekeurde voorwaarden.

## Platform- en domeinkeuze

- De eigenaar wil **Citywalk Stories en Schaap’s Vishandel gescheiden houden**
  in aparte Cloudflare-accounts.
- De registratie van `schaapsvishandel.nl` blijft bij **Knoth**. Het domein
  hoeft niet naar Cloudflare Registrar te verhuizen om Cloudflare DNS of
  Cloudflare Workers te gebruiken.
- De gewenste eindhosting voor de website is **Cloudflare Workers**, niet
  Vercel. Vercel is alleen tijdelijk bruikbaar zolang Cloudflare nog wordt
  voorbereid en getest.
- Cloudflare moet het domein als DNS-zone beheren; de nameservers die bij
  Knoth worden ingesteld moeten exact overeenkomen met de waarden die in het
  aparte **Schaapsvis**-account voor deze zone verschijnen.
- Bij DNS-migratie moeten website-, e-mail-, verificatie- en
  beveiligingsrecords worden geïnventariseerd en behouden. Een Cloudflare-scan
  is niet automatisch een volledige of gecontroleerde DNS-export.

Cloudflare ondersteunt het toevoegen van een domein als DNS-zone los van de
domeinregistratie. De site is al als `.nl`-zone aan Cloudflare toegevoegd; de
pending-status betekent dat de delegatie naar de toegewezen nameservers nog
niet is afgerond. Zie [Cloudflare: een domein onboarden](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/) en
[nameservers bijwerken](https://developers.cloudflare.com/dns/nameservers/update-nameservers/).

## Privacy en vertrouwen

- Nieuwsbriefinschrijving en marketingtoestemming moeten expliciet en
  aantoonbaar zijn; een account aanmaken is niet vanzelf toestemming voor
  marketing.
- Elke campagne moet afmelden mogelijk maken en de geldende kortingsregels
  respecteren; studentenvoordeel stapelt niet met andere aanbiedingen volgens
  de vastgelegde voorwaarden.
- Verzamel alleen gegevens die nodig zijn voor de gekozen functie. Behandel
  studentbewijs als gevoelig: veilige opslag, beperkte beheerderstoegang en
  verwijderen zodra beoordeling dit toelaat.
- Een toekomstige bezorg- en spaarpuntenfunctie moet rekening houden met
  klantaccountbeveiliging, privacy, toestemming en operationele haalbaarheid.

## Beheer, inzicht en klantaccounts

- De lokale basis voor website-inzicht telt na toestemming alleen openbare
  paginaweergaven en klikdoelen op dag-niveau op. Geen ruwe IP's,
  account-/checkoutbezoek, formulierinhoud of unieke bezoekers-ID's. Zo kan de
  eigenaar zien welke pagina's en links worden gebruikt zonder te doen alsof
  we exacte individuele uitstaproutes kennen.
- Het beheer-overzicht is geen volwaardig klantensysteem. Studentenaanvragen
  en e-mailcampagnes hebben al eigen beheerflows; algemeen klantbeheer,
  bezorging en punten zijn toekomstig werk.
- Voor klantbeheer vóór livegang: rolgebaseerde rechten, sterke login en
  tweestapsverificatie; IP-toegang is alleen een extra slot. Leg gevoelige
  inzage en wijzigingen vast in een auditlog, bied beperkte zoek-/export- en
  verwijderfuncties, toon of bewaar nooit leesbare wachtwoorden en scheid
  studentbewijs van gewone klantgegevens.
- Schakel accountfuncties pas aan nadat privacytekst, bewaartermijnen,
  dataverwerkers, back-up/herstel, incidentprocedure en minimale
  beheerdersrechten zijn gecontroleerd. Een verborgen URL of IP-filter alleen
  is geen accountbeveiliging.

## Keuze voor klantsegmentatie

Vraag bij de eerste inschrijving niet naar leeftijd of geboortedatum. Voor
relevante aanbiedingen is een zelfgekozen woon-/winkelregio (Leiden,
Voorschoten, Wassenaar, Leidschendam, elders in regio 071 of elders) directer
bruikbaar en minder indringend. Begin ook niet met aannames zoals “ouderen
willen schol, jongeren kibbeling”: laat klanten desgewenst later vrijwillig
interesse in producten of recepten kiezen, en leer welke aanbiedingen echt
relevant zijn via geaggregeerde campagneprestaties. Vraag alleen een leeftijd
of leeftijdscategorie als een concrete, vooraf geteste functie dat nodig maakt
en de privacytekst dit duidelijk verantwoordt.

De e-mailinschrijving is ontworpen als twee stappen: eerst slaat de server het
ingevoerde adres tijdelijk op met een willekeurige vervolgcode; daarna kiest
de bezoeker de regio en geeft expliciet toestemming. Zonder toestemming en
bevestiging komt het adres niet op de verzendlijst. Een onafgemaakte stap
verloopt na 30 minuten. Deze korte conceptopslag, de uiteindelijke
bewaartermijn en de juridische grondslag moeten in de definitieve
privacyverklaring worden nagekeken vóór live activering.

Klaviyo is de beoogde campagnetool, niet de bron die toestemming bepaalt. Het
leden-/inschrijfsysteem blijft de bron van waarheid voor status,
toestemmingsmoment, regio, bevestiging en afmelding; pas bevestigde
inschrijvingen worden later naar Klaviyo gesynchroniseerd. Een koppeling,
vendor-/verwerkerscontrole en actuele Klaviyo-configuratie zijn nog niet
uitgevoerd.

## Uitvoeringsvolgorde

Eerst de site en productinformatie afronden; vervolgens Cloudflare-hosting,
DNS en accountbeveiliging betrouwbaar inrichten; daarna advertenties en
toestemmingsgebaseerde e-mailcampagnes opschalen; pas daarna de bredere
klantaccounts, bezorging en loyaliteit uitbouwen. Geen platform- of
marketingstap mag de afgesproken winkelinformatie, privacy of beschikbaarheid
van de bestaande site stilzwijgend ondermijnen.
