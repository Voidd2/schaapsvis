"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PRODUCTEN, type Product } from "@/lib/products";

// !! Stel in als environment variable in Vercel:
// Settings → Environment Variables → NEXT_PUBLIC_ADMIN_WACHTWOORD
const ADMIN_WACHTWOORD = process.env.NEXT_PUBLIC_ADMIN_WACHTWOORD ?? "schaap1938";

export default function AdminPage() {
  const [ingelogd, setIngelogd] = useState(false);
  const [wachtwoord, setWachtwoord] = useState("");
  const [producten, setProducten] = useState<Product[]>([]);
  const [opgeslagen, setOpgeslagen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("schaapsvis_producten");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducten(stored ? JSON.parse(stored) : PRODUCTEN);
  }, []);

  const toggleBeschikbaar = (id: string) => {
    setProducten((prev) =>
      prev.map((p) => p.id === id ? { ...p, beschikbaar: !p.beschikbaar } : p)
    );
    setOpgeslagen(false);
  };

  const slaOp = () => {
    localStorage.setItem("schaapsvis_producten", JSON.stringify(producten));
    setOpgeslagen(true);
    setTimeout(() => setOpgeslagen(false), 3000);
  };

  const reset = () => {
    localStorage.removeItem("schaapsvis_producten");
    setProducten(PRODUCTEN);
    setOpgeslagen(false);
  };

  const login = () => {
    if (wachtwoord === ADMIN_WACHTWOORD) {
      setIngelogd(true);
    } else {
      alert("Verkeerd wachtwoord");
    }
  };

  if (!ingelogd) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white border p-10 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin</h1>
          <p className="text-sm text-gray-400 mb-6">Schaap&apos;s Vis — producten beheren</p>
          <input
            type="password"
            placeholder="Wachtwoord"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="w-full border px-4 py-3 text-lg mb-4 focus:outline-none focus:border-gray-800"
          />
          <button
            onClick={login}
            className="w-full bg-gray-800 text-white py-3 font-medium hover:bg-gray-700 transition-colors"
          >
            Inloggen
          </button>
        </div>
      </main>
    );
  }

  const categorieen = [...new Set(PRODUCTEN.map((p) => p.categorie))];
  const aantalBeschikbaar = producten.filter((p) => p.beschikbaar).length;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Producten beheren</h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={reset}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
              Herstel standaard
            </button>
            <button
              onClick={slaOp}
              className={`px-6 py-2 font-medium transition-colors text-white ${
                opgeslagen ? "bg-green-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {opgeslagen ? "Opgeslagen" : "Opslaan"}
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {aantalBeschikbaar} van {producten.length} producten beschikbaar
        </p>

        <div className="bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800 mb-6">
          Schakel producten uit die tijdelijk niet beschikbaar zijn. Klanten zien ze dan niet meer op de bestelpagina. Klik daarna op &ldquo;Opslaan&rdquo;.
        </div>

        {categorieen.map((cat) => (
          <div key={cat} className="bg-white border mb-4">
            <div className="px-6 py-3 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                {cat}
              </h2>
            </div>
            {producten.filter((p) => p.categorie === cat).map((product) => (
              <div key={product.id} className="flex items-center justify-between px-6 py-4 border-b last:border-b-0">
                <div>
                  <p
                    className={`font-medium ${
                      product.beschikbaar ? "text-gray-800" : "text-gray-400 line-through"
                    }`}
                  >
                    {product.naam}
                  </p>
                  <p className="text-sm text-gray-400">{product.eenheid}</p>
                </div>
                <button
                  onClick={() => toggleBeschikbaar(product.id)}
                  className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                    product.beschikbaar ? "bg-green-500" : "bg-gray-300"
                  }`}
                  aria-label={`${product.naam} ${product.beschikbaar ? "uitzetten" : "aanzetten"}`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      product.beschikbaar ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        ))}

        <div className="mt-8 text-center">
          <Link href="/nl" className="text-sm text-gray-400 underline hover:text-gray-600">
            Terug naar de website
          </Link>
        </div>
      </div>
    </main>
  );
}
