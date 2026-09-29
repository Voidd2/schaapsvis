import { siteLanguage } from "./language";
const TEXT:Record<string,readonly[string,string]> = {
"Bon laden…":["Loading voucher…","Gutschein wird geladen…"],
"Ongeldige bon":["Invalid voucher","Ungültiger Gutschein"],
"Deze kortingslink is niet (meer) geldig. Volg onze nieuwsbrief voor nieuwe acties.":["This voucher link is no longer valid. Follow our Facebook page for new offers.","Dieser Gutscheinlink ist nicht mehr gültig. Folgen Sie unserer Facebook-Seite für neue Angebote."],
"Bon verlopen":["Voucher expired","Gutschein abgelaufen"],
"Deze kortingsbon is gebruikt of de 10 minuten zijn voorbij. Elke bon is eenmalig geldig.":["This voucher has been used or its ten minutes have elapsed. Each voucher is valid once.","Dieser Gutschein wurde verwendet oder die zehn Minuten sind abgelaufen. Jeder Gutschein gilt einmal."],
"Kortingsbon":["Discount voucher","Rabattgutschein"],
"Gebruiken →":["Use voucher →","Gutschein verwenden →"],
"Nu geldig":["Valid now","Jetzt gültig"],
"Toon dit scherm aan de medewerker":["Show this screen to a member of staff","Zeigen Sie dieses Bildschirmfenster einem Mitarbeiter"],
"Nog geldig":["Time remaining","Noch gültig"],
"Deze bon verloopt automatisch en kan daarna niet opnieuw gebruikt worden. Een screenshot is niet geldig — de klok moet live lopen.":["This voucher expires automatically and cannot be used again afterwards. Screenshots are not valid: the timer must be running live.","Dieser Gutschein läuft automatisch ab und kann anschließend nicht erneut verwendet werden. Screenshots sind ungültig: Der Timer muss live laufen."],
"10% korting op verse vis":["10% off fresh fish","10 % Rabatt auf frischen Fisch"],
"Bedankt dat u onze nieuwsbrief volgt! Laat deze bon zien aan de kassa en ontvang 10% korting op uw verse vis.":["Thank you for following our newsletter! Show this voucher at the till for 10% off your fresh fish.","Danke, dass Sie unseren Newsletter lesen! Zeigen Sie diesen Gutschein an der Kasse und erhalten Sie 10 % Rabatt auf Ihren frischen Fisch."],
"Eén keer geldig per klant, alleen in de winkel of op de markt. Niet geldig in combinatie met andere aanbiedingen. Toon dit scherm live aan de medewerker.":["Valid once per customer, only in the shop or at the market. Cannot be combined with other offers. Show the live screen to a member of staff.","Einmal pro Kunde gültig, nur im Geschäft oder am Marktstand. Nicht mit anderen Angeboten kombinierbar. Zeigen Sie den Live-Bildschirm einem Mitarbeiter."]
};
export function couponText(text:string,locale:string){const l=siteLanguage(locale);if(l==="nl")return text;const t=TEXT[text];if(!t)throw new Error("Missing coupon translation: "+text);return t[l==="en"?0:1];}
export function couponNotice(minutes:number,locale:string){const l=siteLanguage(locale);return l==="en"?`Please note: once you choose Use voucher, it is valid for ${minutes} minutes and then expires. Only activate it when you are at the till.`:l==="de"?`Bitte beachten: Nach dem Klick auf Gutschein verwenden gilt der Gutschein ${minutes} Minuten und läuft danach ab. Aktivieren Sie ihn erst an der Kasse.`:`Let op: zodra u op Gebruiken klikt, is de bon nog ${minutes} minuten geldig en daarna verlopen. Klik dus pas als u aan de kassa staat.`;}
