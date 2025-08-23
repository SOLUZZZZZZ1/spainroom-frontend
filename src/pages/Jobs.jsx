import { useMemo, useState } from "react";
import { JOBS, JOB_ZONES } from "../data/jobs.js";
import MapPlaceholder from "../components/MapPlaceholder.jsx";
import JobCard from "../components/JobCard.jsx";

function distanceKm(a, b) {
  // Haversine
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

export default function Jobs() {
  // Estado buscador general (2 km)
  const [zoneGeneral, setZoneGeneral] = useState(JOB_ZONES[0].key);

  // Estado buscador específico (10 km)
  const [zoneSpecific, setZoneSpecific] = useState(JOB_ZONES[0].key);
  const [query, setQuery] = useState("");

  const zoneGeneralObj = useMemo(
    () => JOB_ZONES.find((z) => z.key === zoneGeneral),
    [zoneGeneral]
  );
  const zoneSpecificObj = useMemo(
    () => JOB_ZONES.find((z) => z.key === zoneSpecific),
    [zoneSpecific]
  );

  // Resultados
  const resultsGeneral = useMemo(() => {
    if (!zoneGeneralObj) return [];
    return JOBS.filter((j) => {
      const d = distanceKm(zoneGeneralObj.coords, j.coords);
      return d <= 2; // radio 2 km
    }).sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));
  }, [zoneGeneralObj]);

  const resultsSpecific = useMemo(() => {
    if (!zoneSpecificObj) return [];
    const q = query.trim().toLowerCase();
    return JOBS.filter((j) => {
      const d = distanceKm(zoneSpecificObj.coords, j.coords);
      if (d > 10) return false; // radio 10 km
      if (!q) return true;
      const hay =
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags?.some((t) => t.toLowerCase().includes(q));
      return hay;
    }).sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));
  }, [zoneSpecificObj, query]);

  return (
    <main style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <h2 style={{ marginTop: 0 }}>SpainRoom Jobs</h2>

      {/* Buscador general (2 km) */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 12,
          boxShadow: "0 8px 24px rgba(10,23,45,.06)",
          marginBottom: 16,
        }}
      >
        <h3 style={{ marginTop: 6, marginBottom: 10 }}>Ofertas cerca (radio 2 km)</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 12,
            alignItems: "end",
          }}
        >
          <label style={{ gridColumn: "span 6", display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>
              Zona de referencia
            </span>
            <select
              value={zoneGeneral}
              onChange={(e) => setZoneGeneral(e.target.value)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 14,
              }}
            >
              {JOB_ZONES.map((z) => (
                <option key={z.key} value={z.key}>
                  {z.label}
                </option>
              ))}
            </select>
          </label>

          <div style={{ gridColumn: "span 6" }}>
            {zoneGeneralObj ? (
              <MapPlaceholder
                lat={zoneGeneralObj.coords.lat}
                lng={zoneGeneralObj.coords.lng}
                label="Radio 2 km"
              />
            ) : null}
          </div>
        </div>

        <div
          className="sr-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            marginTop: 12,
          }}
        >
          {resultsGeneral.map((job) => (
            <div key={job.id} style={{ gridColumn: "span 6" }}>
              <JobCard job={job} />
            </div>
          ))}
        </div>

        {!resultsGeneral.length && (
          <p style={{ marginTop: 10, color: "#6b7280" }}>
            No hay ofertas a 2 km de la zona seleccionada.
          </p>
        )}
      </section>

      {/* Buscador específico (10 km) */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 12,
          boxShadow: "0 8px 24px rgba(10,23,45,.06)",
        }}
      >
        <h3 style={{ marginTop: 6, marginBottom: 10 }}>
          Encuentra un trabajo concreto (radio 10 km)
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 12,
            alignItems: "end",
          }}
        >
          <label style={{ gridColumn: "span 4", display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>
              Zona de referencia
            </span>
            <select
              value={zoneSpecific}
              onChange={(e) => setZoneSpecific(e.target.value)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 14,
              }}
            >
              {JOB_ZONES.map((z) => (
                <option key={z.key} value={z.key}>
                  {z.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ gridColumn: "span 5", display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>
              Palabra clave (ej: camarero, recepción…)
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe tu búsqueda"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 14,
              }}
            />
          </label>

          <div style={{ gridColumn: "span 3" }}>
            {zoneSpecificObj ? (
              <MapPlaceholder
                lat={zoneSpecificObj.coords.lat}
                lng={zoneSpecificObj.coords.lng}
                label="Radio 10 km"
              />
            ) : null}
          </div>
        </div>

        <div
          className="sr-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            marginTop: 12,
          }}
        >
          {resultsSpecific.map((job) => (
            <div key={job.id} style={{ gridColumn: "span 6" }}>
              <JobCard job={job} />
            </div>
          ))}
        </div>

        {!resultsSpecific.length && (
          <p style={{ marginTop: 10, color: "#6b7280" }}>
            No hay resultados a 10 km para esa palabra clave en la zona elegida.
          </p>
        )}
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .sr-grid > div { grid-column: span 12; }
        }
      `}</style>
    </main>
  );
}
