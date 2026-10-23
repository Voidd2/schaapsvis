"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Customer = {
  id: string;
  full_name: string;
  email: string;
  email_verified: number | boolean;
  account_status: "active" | "locked";
  created_at: string;
  newsletter_status: string;
  student_pass_status: string | null;
};

type CustomerPage = { customers: Customer[]; hasMore: boolean; nextCursor: string | null };

export function CustomerAccountsPortal({ locale }: { locale: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const copy = locale === "en"
    ? {
        title: "Customer accounts", intro: "View customer account status and marketing consent. Passwords, school email addresses and student proof are not shown here.",
        name: "Name", email: "Email", verified: "Email verified", notVerified: "Not verified", created: "Account created",
        account: "Account", active: "Active", locked: "Locked", newsletter: "Email offers", pass: "Student discount",
        subscribed: "Subscribed", pending: "Confirmation pending", unsubscribed: "Unsubscribed", noSubscription: "Not subscribed",
        approved: "Approved", rejected: "Rejected", noPass: "No active pass", lock: "Lock account", restore: "Restore account",
        search: "Filter loaded accounts", more: "Load more", loading: "Loading accounts…", empty: "No customer accounts found.",
        denied: "Could not load accounts. Sign in as an approved administrator from an allowed IP address.",
        failed: "The change could not be saved. Reload the page and try again.", lockedNotice: "Account locked; active sessions have been revoked.",
        restoredNotice: "Account restored. The customer must sign in again.", confirmLock: "Lock this customer account? Their active sessions will be revoked.",
        confirmRestore: "Restore this customer account? The customer will need to sign in again.", yes: "Yes", no: "No",
      }
    : locale === "de"
      ? {
          title: "Kundenkonten", intro: "Kontostatus und Einwilligung für E-Mail-Angebote ansehen. Passwörter, Schul-E-Mail-Adressen und Studentennachweise werden hier nicht angezeigt.",
          name: "Name", email: "E-Mail", verified: "E-Mail bestätigt", notVerified: "Nicht bestätigt", created: "Konto erstellt",
          account: "Konto", active: "Aktiv", locked: "Gesperrt", newsletter: "E-Mail-Angebote", pass: "Studentenrabatt",
          subscribed: "Abonniert", pending: "Bestätigung ausstehend", unsubscribed: "Abgemeldet", noSubscription: "Nicht angemeldet",
          approved: "Genehmigt", rejected: "Abgelehnt", noPass: "Kein aktiver Pass", lock: "Konto sperren", restore: "Konto entsperren",
          search: "Geladene Konten filtern", more: "Weitere laden", loading: "Konten werden geladen…", empty: "Keine Kundenkonten gefunden.",
          denied: "Konten konnten nicht geladen werden. Melden Sie sich als freigegebener Administrator von einer erlaubten IP-Adresse an.",
          failed: "Die Änderung konnte nicht gespeichert werden. Laden Sie die Seite neu und versuchen Sie es erneut.", lockedNotice: "Konto gesperrt; aktive Sitzungen wurden beendet.",
          restoredNotice: "Konto wiederhergestellt. Der Kunde muss sich erneut anmelden.", confirmLock: "Dieses Kundenkonto sperren? Aktive Sitzungen werden beendet.",
          confirmRestore: "Dieses Kundenkonto wiederherstellen? Der Kunde muss sich erneut anmelden.", yes: "Ja", no: "Nein",
        }
      : {
          title: "Klantaccounts", intro: "Bekijk accountstatus en toestemming voor e-maildeals. Wachtwoorden, schoolmailadressen en studentbewijs zijn hier niet zichtbaar.",
          name: "Naam", email: "E-mail", verified: "E-mail bevestigd", notVerified: "Niet bevestigd", created: "Account aangemaakt",
          account: "Account", active: "Actief", locked: "Geblokkeerd", newsletter: "E-maildeals", pass: "Studentenkorting",
          subscribed: "Aangemeld", pending: "Bevestiging open", unsubscribed: "Afgemeld", noSubscription: "Niet aangemeld",
          approved: "Goedgekeurd", rejected: "Afgewezen", noPass: "Geen geldige pas", lock: "Account blokkeren", restore: "Account herstellen",
          search: "Door geladen accounts zoeken", more: "Meer laden", loading: "Accounts laden…", empty: "Geen klantaccounts gevonden.",
          denied: "Accounts konden niet worden geladen. Log in als goedgekeurde beheerder vanaf een toegestaan IP-adres.",
          failed: "De wijziging kon niet worden opgeslagen. Herlaad de pagina en probeer het opnieuw.", lockedNotice: "Account geblokkeerd; actieve sessies zijn ingetrokken.",
          restoredNotice: "Account hersteld. De klant moet opnieuw inloggen.", confirmLock: "Dit klantaccount blokkeren? Actieve sessies worden ingetrokken.",
          confirmRestore: "Dit klantaccount herstellen? De klant moet opnieuw inloggen.", yes: "Ja", no: "Nee",
        };

  const loadPage = useCallback(async (next: string | null, append: boolean) => {
    setError("");
    try {
      const query = next ? `?cursor=${encodeURIComponent(next)}` : "";
      const response = await fetch(`/api/members/admin/customers${query}`, { credentials: "same-origin", cache: "no-store" });
      if (!response.ok) throw new Error("forbidden");
      const page = await response.json() as CustomerPage;
      setCustomers((current) => append ? [...current, ...page.customers] : page.customers);
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch {
      setError(copy.denied);
    } finally {
      setLoading(false);
    }
  }, [copy.denied]);

  useEffect(() => {
    let active = true;
    const loadInitialPage = async () => {
      try {
        const response = await fetch("/api/members/admin/customers", { credentials: "same-origin", cache: "no-store" });
        if (!response.ok) throw new Error("forbidden");
        const page = await response.json() as CustomerPage;
        if (!active) return;
        setCustomers(page.customers);
        setCursor(page.nextCursor);
        setHasMore(page.hasMore);
      } catch {
        if (active) setError(copy.denied);
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadInitialPage();
    return () => { active = false; };
  }, [copy.denied]);

  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return customers;
    return customers.filter((customer) => `${customer.full_name} ${customer.email}`.toLocaleLowerCase().includes(query));
  }, [customers, search]);

  const updateStatus = async (customer: Customer) => {
    const nextStatus = customer.account_status === "active" ? "locked" : "active";
    const prompt = nextStatus === "locked" ? copy.confirmLock : copy.confirmRestore;
    if (!window.confirm(prompt)) return;
    setBusyId(customer.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/members/admin/customers/${customer.id}/status`, {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error("save-failed");
      setCustomers((current) => current.map((item) => item.id === customer.id ? { ...item, account_status: nextStatus } : item));
      setNotice(nextStatus === "locked" ? copy.lockedNotice : copy.restoredNotice);
    } catch {
      setError(copy.failed);
    } finally {
      setBusyId("");
    }
  };

  const newsletterLabel = (status: string) => status === "subscribed" ? copy.subscribed
    : status === "pending" ? copy.pending : status === "unsubscribed" ? copy.unsubscribed : copy.noSubscription;
  const passLabel = (status: string | null) => status === "approved" ? copy.approved
    : status === "rejected" ? copy.rejected : copy.noPass;

  return <main className="section-wrap max-w-6xl py-12 md:py-16">
    <p className="kapitaal">Schaap’s Vishandel · intern</p>
    <h1 className="text-4xl">{copy.title}</h1>
    <p className="mt-3 max-w-3xl">{copy.intro}</p>
    <label className="my-6 block max-w-lg text-sm font-semibold">
      {copy.search}
      <input className="mt-2 w-full rounded-lg border border-sky-200 bg-white p-3 font-normal" value={search} onChange={(event) => setSearch(event.target.value)} type="search" autoComplete="off" />
    </label>
    {error && <p role="alert" className="mb-5 rounded-xl bg-amber-50 p-4">{error}</p>}
    {notice && <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-4">{notice}</p>}
    {loading && customers.length === 0 ? <p role="status">{copy.loading}</p> : visible.length === 0 ? <p className="rounded-xl bg-sky-50 p-5">{copy.empty}</p> : <div className="overflow-x-auto rounded-2xl border border-sky-100 bg-white">
      <table className="w-full min-w-[940px] text-left text-sm">
        <thead className="bg-sky-50"><tr>
          {[copy.name, copy.email, copy.verified, copy.created, copy.account, copy.newsletter, copy.pass, ""].map((heading, index) => <th className="px-4 py-3 font-semibold" key={heading || index}>{heading}</th>)}
        </tr></thead>
        <tbody>{visible.map((customer) => <tr className="border-t border-sky-100 align-top" key={customer.id}>
          <th className="px-4 py-4 font-semibold">{customer.full_name}</th>
          <td className="px-4 py-4">{customer.email}</td>
          <td className="px-4 py-4">{customer.email_verified ? copy.verified : copy.notVerified}</td>
          <td className="px-4 py-4">{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(customer.created_at))}</td>
          <td className="px-4 py-4">{customer.account_status === "active" ? copy.active : copy.locked}</td>
          <td className="px-4 py-4">{newsletterLabel(customer.newsletter_status)}</td>
          <td className="px-4 py-4">{passLabel(customer.student_pass_status)}</td>
          <td className="px-4 py-4"><button className="text-left font-semibold text-sky-800 underline disabled:opacity-50" type="button" disabled={busyId === customer.id} onClick={() => void updateStatus(customer)}>{busyId === customer.id ? "…" : customer.account_status === "active" ? copy.lock : copy.restore}</button></td>
        </tr>)}</tbody>
      </table>
    </div>}
    {hasMore && <button className="mt-5 rounded-lg bg-sky-700 px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={loading || !cursor} onClick={() => { setLoading(true); void loadPage(cursor, true); }} type="button">{loading ? copy.loading : copy.more}</button>}
  </main>;
}
