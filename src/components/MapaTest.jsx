import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// ✅ Import robusto: genera una URL absoluta del geojson según este archivo
const PROVINCES_URL = new URL("../assets/maps/spain-provinces.geojson", import.meta.url).href;

export default function MapaTest() {
  const [info, setInfo] = useState({ ok: null, err: "", features: 0 });

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(PROVINCES_URL, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        const count = Array.isArray(j.features) ? j.features.length : 0;
        setInfo({ ok: true, err: "", features: count });
      } catch (e) {
        setInfo({ ok: false, err: String(e), features: 0 });
      }
    })();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:12, background:"#fff", marginBottom:12}}>
        <b>Debug GeoJSON</b><br/>
        Ruta importada: <code>{PROVINCES_URL}</code><br/>
        Estado:{" "}
        {info.ok === null ? "cargando…" :
         info.ok ? `✅ features: ${info.features}` :
         `❌ error: ${info.err}`}
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
        <h3 style={{ marginTop: 0 }}>Mapa de prueba (solo GeoJSON)</h3>
        <ComposableMap projection="geoMercator" width={800} height={900}>
          <Geographies geography={PROVINCES_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e5e7eb"
                  stroke="#ffffff"
                  strokeWidth={0.35}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", filter: "brightness(0.95)" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}
