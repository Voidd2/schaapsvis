import { redirect } from "next/navigation";

/**
 * The former client-side product editor only changed localStorage and had a
 * password embedded in the browser bundle. Route owners to the real,
 * server-authorized review portal instead.
 */
export default function AdminPage() {
  redirect("/nl/beheer/studenten");
}
