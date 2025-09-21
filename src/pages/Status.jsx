import { useEffect, useState } from "react";

export default function Status() {
  const [result, setResult] = useState({ ok: null, detail: "Comprobando…" });

  useEffect(() => {
    (async () => {
      const candidates = ["/api/health", "/api/api/health"];
      for (const url of candidates) {
        try {
          const res = await fetch(url, { headers: { Accept: "application/json" } });
          const text = await res.text();
          if (!res.ok) throw new Error(`HTTP ${res.status} — ${text?.slice(0, 120) || ""}`);
          let data = {};
          try { data = JSON.parse(text); } catch {}
          setResult({ ok: true, detail: `OK vía ${url} ${data?.ok ? "✓" : ""}` });
          return;
        } catch (e) {
          setResult({ ok: false, detail: `Fallo en ${url}: ${e.message}` });
        }
      }
    })();
  }, []);

  const color = result.ok === null ? "border-gray-200 bg-white"
    : result.ok ? "border-green-300 bg-green-50"
    : "border-red-300 bg-red-50";

  return (
    <div className="pt-20 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Estado del sistema</h1>
      <div className={`mt-4 p-4 rounded-xl border ${color}`}>
        <p className="text-lg whitespace-pre-wrap break-words">{result.detail}</p>
        <p className="text-sm text-gray-600 mt-2">Endpoint probado: /api/health → /api/api/health</p>
      </div>
    </div>
  );
}
