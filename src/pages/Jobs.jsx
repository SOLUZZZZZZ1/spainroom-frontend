import { useEffect, useMemo, useState } from "react";
import { getJobsNearby, searchJobs } from "../lib/api";

function ResultCard({ job }) {
  return (
    <div className="rounded-2xl border p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900">{job.title}</h3>
        {job.distance_km != null && (
          <span className="text-xs rounded-lg bg-blue-50 text-blue-700 px-2 py-1">
            {job.distance_km.toFixed(1)} km
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {job.company || "Empresa no indicada"} · {job.location || "Ubicación"}
      </p>
      {job.salary && <p className="text-sm text-gray-700 mt-1">{job.salary}</p>}
      <div className="mt-3 flex items-center gap-2">
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-blue-600 text-white text-sm px-3 py-2 hover:bg-blue-700"
          >
            Ver oferta
          </a>
        )}
        {job.source && <span className="text-xs text-gray-500">Fuente: {job.source}</span>}
      </div>
    </div>
  );
}

const demoNearby = (lat, lng) => ([
  {
    id: "demo-1",
    title: "Dependiente/a tienda barrio",
    company: "Comercio Local",
    location: "Cerca de tu ubicación",
    distance_km: 0.7,
    salary: "1.100–1.300 € / mes",
    url: "#",
    source: "Demo",
    lat, lng,
  },
  {
    id: "demo-2",
    title: "Camarero/a fin de semana",
    company: "Bar La Plaza",
    location: "Zona centro",
    distance_km: 1.8,
    salary: "8–10 € / hora",
    url: "#",
    source: "Demo",
    lat, lng,
  },
]);

const demoSearch = (q) => ([
  {
    id: "demo-s1",
    title: `(${q || "General"}) Reponedor/a supermercado`,
    company: "SuperMax",
    location: "Distrito norte",
    distance_km: 4.2,
    salary: "1.200–1.400 € / mes",
    url: "#",
    source: "Demo",
  },
  {
    id: "demo-s2",
    title: `(${q || "General"}) Recepcionista hotel`,
    company: "Hotel Centro",
    location: "Centro ciudad",
    distance_km: 6.9,
    salary: "1.300–1.600 € / mes",
    url: "#",
    source: "Demo",
  },
]);

export default function Jobs() {
  // Geolocalización
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState(null);

  // General (2 km)
  const [nearby, setNearby] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [errNearby, setErrNearby] = useState(null);

  // Búsqueda (10 km)
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [errSearch, setErrSearch] = useState(null);

  // Pedir geolocalización al cargar
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalización no disponible en este navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoError(null);
      },
      (err) => {
        setGeoError("No se pudo obtener tu ubicación (permiso denegado o error).");
        // Aun así seguimos con demo en fallback
        setCoords(null);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 120000 }
    );
  }, []);

  // Cargar “cerca de mí” (2 km) cuando hay coords
  useEffect(() => {
    async function run() {
      setLoadingNearby(true);
      setErrNearby(null);
      try {
        if (coords) {
          const data = await getJobsNearby({ lat: coords.lat, lng: coords.lng, radius_km: 2 });
          setNearby(Array.isArray(data) ? data : data.items || []);
        } else {
          // Fallback demo si no hay coords
          setNearby(demoNearby());
        }
      } catch (e) {
        setErrNearby(e.message || "Error cargando ofertas cercanas");
        setNearby(demoNearby(coords?.lat, coords?.lng));
      } finally {
        setLoadingNearby(false);
      }
    }
    run();
  }, [coords]);

  const canSearch = useMemo(() => coords != null, [coords]);

  // Ejecutar búsqueda específica (10 km)
  async function onSearch(e) {
    e?.preventDefault();
    setSearching(true);
    setErrSearch(null);
    try {
      if (coords) {
        const data = await searchJobs({ q, lat: coords.lat, lng: coords.lng, radius_km: 10 });
        setResults(Array.isArray(data) ? data : data.items || []);
      } else {
        setResults(demoSearch(q));
      }
    } catch (e) {
      setErrSearch(e.message || "Error buscando ofertas");
      setResults(demoSearch(q));
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Ofertas de empleo cerca de ti</h1>
      {geoError && (
        <div className="mb-4 rounded-xl bg-yellow-50 text-yellow-800 text-sm p-3">
          {geoError} — Mostrando resultados de demostración.
        </div>
      )}

      {/* Buscador general (2 km) */}
      <section className="rounded-2xl border bg-white p-4 mb-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">General (radio 2 km)</h2>
          <button
            className="rounded-xl bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
            onClick={() => {
              // Forzar recarga
              setCoords((c) => (c ? { ...c } : c));
            }}
            disabled={loadingNearby}
          >
            {loadingNearby ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {errNearby && (
          <div className="mt-3 rounded-xl bg-red-50 text-red-700 text-sm p-3">{errNearby}</div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loadingNearby
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border p-4 bg-gray-50 h-28" />
              ))
            : nearby.map((job) => <ResultCard key={job.id || job.title} job={job} />)}
        </div>
      </section>

      {/* Buscador específico (10 km) */}
      <section className="rounded-2xl border bg-white p-4">
        <h2 className="font-semibold">Búsqueda específica (radio 10 km)</h2>
        <form onSubmit={onSearch} className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="Ej. camarero, dependiente, recepcionista…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="rounded-xl bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
            disabled={searching || !canSearch}
          >
            {searching ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {!canSearch && (
          <p className="text-xs text-gray-500 mt-2">
            Activa la geolocalización para resultados reales. De momento verás ejemplos.
          </p>
        )}

        {errSearch && (
          <div className="mt-3 rounded-xl bg-red-50 text-red-700 text-sm p-3">{errSearch}</div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {searching
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border p-4 bg-gray-50 h-28" />
              ))
            : results.map((job) => <ResultCard key={job.id || `${job.title}-${job.company}`} job={job} />)}
        </div>
      </section>
    </div>
  );
}
