// src/pages/Habitaciones.jsx — buscador + listado (Render) + demo si la API viene vacía
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// BACKEND Render + helper para imágenes servidas por el backend (/instance/*)
const API_BASE =
  (import.meta.env?.VITE_API_BASE?.trim?.() || "https://spainroom-backend-1.onrender.com");
const isAbs = (u) => /^https?:\/\//i.test(u || "");
const withBase = (u) =>
  (u && !isAbs(u) && u.startsWith("/instance/")) ? `${API_BASE}${u}` : u;

// Miniaturas DEMO siempre visibles (usa tus imágenes de /public/images)
const DEMO_IMAGES = [
  "/images/OIP-5-.jpg",
  "/images/OIP-5-.webp",
  "/images/OIP-6-.jpg",
  "/images/OIP-6-.webp",
  "/images/OIP-7-.webp",
  "/images/OIP-3-.webp",
  "/images/OIP-2-.webp",
];

export default function Habitaciones() {
  // Datos
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscador
  const [q, setQ] = useState("");
  const [provincia, setProvincia] = useState("todas");
  const [poblacion, setPoblacion] = useState("todas");
  const [precioMax, setPrecioMax] = useState(1200);
  const [orden, setOrden] = useState("recientes");
  const [soloPublicadas, setSoloPublicadas] = useState(true);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Carga solo /api/rooms/published (tus otras rutas daban 405)
  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`${API_BASE}/api/rooms/published`, { cache: "no-cache", mode: "cors" });
        const j = r.ok ? await r.json() : [];
        if (live) setRows(Array.isArray(j) ? j : (Array.isArray(j?.results) ? j.results : []));
      } catch {
        if (live) setRows([]);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  // Provincias / poblaciones
  const { provincias, mapaPoblaciones } = useMemo(() => {
    const setP = new Set(); const map = {};
    rows.forEach((r) => {
      const prov = (r?.provincia || "").trim();
      const city = (r?.ciudad || "").trim();
      if (prov) {
        setP.add(prov);
        if (!map[prov]) map[prov] = new Set();
        if (city) map[prov].add(city);
      } else if (city) {
        setP.add("—");
        if (!map["—"]) map["—"] = new Set();
        map["—"].add(city);
      }
    });
    const obj = {};
    Object.keys(map).forEach(k => obj[k] = Array.from(map[k]).sort((a,b)=>a.localeCompare(b,"es")));
    return {
      provincias: ["todas", ...Array.from(setP).sort((a,b)=>a.localeCompare(b,"es"))],
      mapaPoblaciones: obj
    };
  }, [rows]);

  const poblacionesDisponibles = useMemo(() => {
    if (provincia === "todas") {
      const all = new Set();
      Object.values(mapaPoblaciones).forEach(s => s.forEach(c => all.add(c)));
      return ["todas", ...Array.from(all).sort((a,b)=>a.localeCompare(b,"es"))];
    }
    const arr = mapaPoblaciones[provincia] || [];
    return ["todas", ...arr];
  }, [provincia, mapaPoblaciones]);

  // Buscar (si /api/rooms/search no existe, recarga published)
  const onSearch = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    try {
      let query = q.trim();
      if (!query) {
        if (provincia !== "todas" && poblacion !== "todas") query = `${poblacion}, ${provincia}`;
        else if (provincia !== "todas") query = provincia !== "—" ? provincia : "";
        else if (poblacion !== "todas") query = poblacion;
      }

      if (query) {
        const params = new URLSearchParams();
        params.set("q", query);
        if (phone) params.set("phone", phone);
        if (email) params.set("email", email);

        const r = await fetch(`${API_BASE}/api/rooms/search?` + params.toString(), { mode: "cors" });
        if (r.ok) {
          const j = await r.json();
          const arr = Array.isArray(j?.results) ? j.results : (Array.isArray(j) ? j : []);
          setRows(arr);
          setLoading(false);
          return;
        }
      }

      // fallback
      const r2 = await fetch(`${API_BASE}/api/rooms/published`, { cache: "no-cache", mode: "cors" });
      const j2 = r2.ok ? await r2.json() : [];
      setRows(Array.isArray(j2) ? j2 : (Array.isArray(j2?.results) ? j2.results : []));
    } catch {
      // sin cartel rojo
    } finally {
      setLoading(false);
    }
  };

  const limpiar = () => {
    setProvincia("todas"); setPoblacion("todas"); setQ(""); setPhone(""); setEmail("");
  };

  // Filtro/orden cliente
  const list = useMemo(() => {
    let arr = rows.slice();
    if (soloPublicadas) {
      const hasPublished = arr.length && typeof arr[0]?.published !== "undefined";
      if (hasPublished) arr = arr.filter(r => r.published);
    }
    arr = arr.filter(r => (typeof r.precio !== "number") || (r.precio <= precioMax));
    switch (orden) {
      case "precio_asc":  arr.sort((a,b) => (a.precio||0) - (b.precio||0)); break;
      case "precio_desc": arr.sort((a,b) => (b.precio||0) - (a.precio||0)); break;
      default:            arr.sort((a,b) => (b.id||0) - (a.id||0));
    }
    return arr;
  }, [rows, soloPublicadas, precioMax, orden]);

  return (
    <main className="min-h-screen" style={{ background:"#f8fafc" }}>
      <section className="container" style={{ padding:"24px 0", maxWidth:1200, margin:"0 auto" }}>
        <h1 style={{ margin:"0 0 12px" }}>Habitaciones</h1>

        {/* Buscador */}
        <form
          onSubmit={onSearch}
          style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16, marginBottom:16, boxShadow:"0 8px 18px rgba(0,0,0,.08)" }}
        >
          <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1.1fr 1.8fr 1fr 1fr 120px", gap:10 }}>
            <select
              value={provincia}
              onChange={e=>{ setProvincia(e.target.value); setPoblacion("todas"); }}
              style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
            >
              {provincias.map(p => <option key={p} value={p}>{p==="todas" ? "Todas las provincias" : p}</option>)}
            </select>

            <select
              value={poblacion}
              onChange={e=> setPoblacion(e.target.value)}
              style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
            >
              {poblacionesDisponibles.map(c => <option key={c} value={c}>{c==="todas" ? "Todas las poblaciones" : c}</option>)}
            </select>

            <input
              value={q}
              onChange={e=> setQ(e.target.value)}
              placeholder="Ciudad o zona (ej. Sevilla / Triana)"
              style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
            />

            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <label style={{ fontSize:12, color:"#475569" }}>Precio máx.</label>
              <input type="range" min={250} max={2000} step={25} value={precioMax} onChange={e=> setPrecioMax(Number(e.target.value))} />
              <span style={{ fontSize:12, color:"#0b1220", fontWeight:800 }}>{precioMax} €</span>
            </div>

            <select
              value={orden}
              onChange={e=> setOrden(e.target.value)}
              style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
            >
              <option value="recientes">Más recientes</option>
              <option value="precio_asc">Precio: de menor a mayor</option>
              <option value="precio_desc">Precio: de mayor a menor</option>
            </select>

            <button type="submit" className="sr-btn sr-btn--primary">Buscar</button>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:10, marginTop:8 }}>
            <input
              value={phone}
              onChange={e=> setPhone(e.target.value)}
              placeholder="Teléfono (opcional)"
              style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
            />
            <input
              value={email}
              onChange={e=> setEmail(e.target.value)}
              placeholder="Email (opcional)"
              style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
            />
            <button type="button" onClick={limpiar} className="sr-btn sr-btn--ghost">Limpiar</button>
          </div>

          <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:12 }}>
            <label style={{ fontSize:12, color:"#475569" }}>
              <input type="checkbox" checked={soloPublicadas} onChange={e=> setSoloPublicadas(e.target.checked)} style={{ marginRight:6 }} />
              Solo publicadas
            </label>
          </div>
        </form>

        {/* DEMO SIEMPRE visible (miniaturas) */}
        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16, marginBottom:16, boxShadow:"0 8px 18px rgba(0,0,0,.08)" }}>
          <div style={{ fontWeight:900, marginBottom:8 }}>Ver galería (demo)</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
            {DEMO_IMAGES.map((u, i) => (
              <a key={i} href="/habitaciones/DEMO/fotos" target="_blank" rel="noreferrer"
                 style={{ display:"block", borderRadius:12, overflow:"hidden", border:"1px solid #e5e7ef" }}>
                <img src={u} alt={`demo ${i+1}`} style={{ width:"100%", height:110, objectFit:"cover", display:"block" }} />
              </a>
            ))}
          </div>
        </div>

        {/* Listado real (si hay) */}
        {!loading && rows.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {rows.map((r, idx) => {
              const images = r?.images || r?.images_json || {};
              const coverObj = images.cover || null;
              const cover = coverObj ? withBase(coverObj.thumb || coverObj.url) : null;
              const code = r.code || r.id || `room-${idx}`;

              return (
                <article key={code}
                         style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:12, boxShadow:"0 8px 18px rgba(0,0,0,.08)" }}>
                  <Link to={`/habitaciones/${code}`} style={{ textDecoration:"none", color:"inherit" }}>
                    {cover
                      ? <img src={cover} alt="" style={{ width:"100%", height:"auto", borderRadius:12, marginBottom:8 }} />
                      : <div style={{ height:160, background:"#f1f5f9", borderRadius:12, marginBottom:8 }} />
                    }
                    <div style={{ display:"flex", justifyContent:"space-between", gap:8, alignItems:"baseline" }}>
                      <h3 style={{ margin:0, fontWeight:900, fontSize:16 }}>
                        {r.ciudad || "—"}{r.provincia ? ` · ${r.provincia}` : ""}
                      </h3>
                      <div style={{ fontWeight:900 }}>
                        {typeof r.precio === "number" ? `${r.precio.toLocaleString("es-ES")} €` : "—"}
                      </div>
                    </div>
                    <div style={{ color:"#475569", marginTop:4 }}>{r.direccion || code}</div>
                  </Link>

                  <div style={{ marginTop:8, display:"flex", gap:8, justifyContent:"space-between" }}>
                    <a href={`/habitaciones/${code}/fotos`} target="_blank" rel="noreferrer" className="sr-btn sr-btn--ghost" style={{ textDecoration:"none" }}>
                      Ver fotos
                    </a>
                    <Link to={`/habitaciones/${code}`} className="sr-btn sr-btn--primary" style={{ textDecoration:"none" }}>
                      Ver ficha
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
