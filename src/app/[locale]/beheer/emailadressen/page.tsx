import { notFound } from "next/navigation";
import { EmailDirectory } from "@/components/account/EmailDirectory";
export const metadata = {title:"E-mailadressen | Schaap’s Vishandel",robots:{index:false,follow:false}};
export default async function EmailAddresses({params}:{params:Promise<{locale:string}>}) {
  const {locale} = await params;
  if (!["nl","en","de"].includes(locale)) notFound();
  return <EmailDirectory locale={locale}/>;
}
