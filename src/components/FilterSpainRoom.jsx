import { useEffect, useMemo, useRef, useState } from "react";
import "./filterSpainRoom.css";

const STORAGE_KEY = "sr_filters_v1";

export default function FilterSpainRoom({ items = [], onChange }) {
  const didHydrate = useRef(false);

  const cities = useMemo(() => {
    const set = new Set();
    items.forEach((it) => {
      const city = (it.location || "").split("—")[0].trim();
      if (city) set.add(city);
    });
    return ["Todas"].concat([...set].sort());
  }, [items]);

  const [city, setCity] = useState("Todas");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [promos, setPromos] = useState(false);

  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.city) setCity(saved.city);
        if (saved.min !== undefined && saved.min !== null) setMin(String(saved.min));
        if (saved.max !== undefined && saved.max !== null) setMax(String(saved.max));
        if (typeof saved.promos === "boolean") setPromos(saved.promos);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    const payload = {
      city: city === "Todas" ? "" : city,
      min: min === "" ? null : Number(min),
      max: max === "" ? null : Number(max),
      promos,
    };
    onChange?.(payload);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ city, min: payload.min, max: payload.max, promos })
      );
    } catch (_) {}
  }, [city, min, max, promos, onChange]);

  const reset = () => {
    setCity("Todas");
    setMin("");
    setMax("");
    setPromos(false);
  };

  return (
    <div className="sr-filter sr-section">
      <div className="sr-heading">
        <span className="sr-heading__dot" />
        <h3 className="sr-heading__title">Filtra tu búsqueda</h3>
      </div>

      <div className="sr-filter__row sr-grid-12">
        <div className="sr-field" style={{ gridColumn: "span 4" }}>
          <label className="sr-label">Ciudad</label>
          <select
            className="sr-input sr-input-brand"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sr-field" style={{ gridColumn: "span 3" }}>
          <label className="sr-label">Precio mín. (€)</label>
          <input
            type="number"
            inputMode="numeric"
            className="sr-input sr-input-brand"
            placeholder="0"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            min={0}
          />
        </div>

        <div className="sr-field" style={{ gridColumn: "span 3" }}>
          <label className="sr-label">Precio máx. (€)</label>
          <input
            type="number"
            inputMode="numeric"
            className="sr-input sr-input-brand"
            placeholder="600"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            min={0}
          />
        </div>

        <div className="sr-field sr-field--checkbox" style={{ gridColumn: "span 2" }}>
          <label className="sr-checkbox">
            <input
              type="checkbox"
              checked={promos}
              onChange={(e) => setPromos(e.target.checked)}
            />
            <span>Solo promociones</span>
          </label>
        </div>

        <div className="sr-actions" style={{ gridColumn: "span 12", display: "flex", gap: 8 }}>
          <button type="button" className="sr-btn-ghost" onClick={reset}>
            Limpiar
          </button>
          <button
            type="button"
            className="sr-btn-brand"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          >
            Ver resultados
          </button>
        </div>
      </div>
    </div>
  );
}
