// src/pages/Habitacion.jsx
// Ficha pública de habitación — galería primero + precio + reserva + ficha técnica
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Galeria from "../components/Galeria.jsx";

// BASE de HABITACIONES (backend API principal)
const ROOMS_BASE =
  (import.meta.env?.VITE_ROOMS_BASE?.trim?.() ||
    import.meta.env?.VITE_API_BASE?.trim?.() ||
    "https://backend-spainroom.onrender.com");

// Helper imágenes servidas por backend de rooms (/instance/*)
const isAbs = (u) => /^https?:\/\//i.test(u || "");
const withBase = (u) => {
  if (!u) return u;
  if (isAbs(u)) return u;
  if (u.startsWith("/instance/")) return `${ROOMS_BASE}${u}`;
  return u;
};

// Imágenes demo para no dejar la ficha vacía si la API todavía no trae fotos
const LOCAL_IMAGES = [
  "/images/OIP-5-.jpg",
  "/images/OIP-5-.webp",
  "/images/OIP-6-.jpg",
  "/images/OIP-6-.webp",
  "/images/OIP-7-.webp",
  "/images/OIP-3-.webp",
  "/images/OIP-2-.webp",
  "/images/demo-01.jpg",
  "/images/demo-02.jpg",
  "/images/demo-03.jpg",
  "/images/demo-04.jpg",
  "/images/demo-05.jpg",
  "/images/demo-06.jpg",
  "/images/demo-07.jpg",
  "/images/demo-08.jpg",
  "/images/demo-09.jpg",
  "/images/demo-10.jpg",
  "/images/demo-11.jpg",
];

const localFallback = LOCAL_IMAGES.map((u, i) => ({
  id: `local-${i}`,
  url: u,
  thumb: u,
  alt: `Habitación ${i + 1}`,
}));

// Meta demo por defecto para no dejar la vista vacía si la API viene incompleta
const DEMO_META = {
  cama: "135x200",
  ventana: true,
  cerradura: true,
  escritorio: true,
  enchufes: "2",
  bano_privado: false,
  superficie_m2: 18,
  precio: 400,
  estado: "Libre",
  fecha_disponibilidad: "2025-11-01",
  barrio: "Centro",
  orientacion: "exterior",
  planta: "3",
  metro: "L1",
  consumos_incluidos: true,
  normas: "No fumar. No fiestas.",
  otros: "Incluye WiFi y limpieza de zonas comunes.",
  descripcion: "Habitación luminosa con cama 135x200, escritorio y armario.",
};

export default function Habitacion() {
  const { id, roomId } = useParams();
  const finalId = id || roomId || "DEMO";
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;

    async function load() {
      setLoading(true);
      setError("");

      if (finalId === "DEMO") {
        setRoom({
          code: "DEMO",
          ciudad: "—",
          provincia: "—",
          images: { meta: { ...DEMO_META } },
        });
        setLoading(false);
        return;
      }

      try {
        const r = await fetch(`${ROOMS_BASE}/api/rooms/${encodeURIComponent(finalId)}`);
        const j = await r.json();
        const imgs = j?.images || j?.images_json || {};
        const meta = { ...DEMO_META, ...(imgs.meta || {}) };

        if (!live) return;
        setRoom({ ...(j || {}), images: { ...imgs, meta } });
      } catch {
        if (!live) return;
        setError("No se pudo cargar la habitación. Se muestra ficha demo.");
        setRoom({
          code: finalId,
          ciudad: "—",
          provincia: "—",
          images: { meta: { ...DEMO_META } },
        });
      } finally {
        if (live) setLoading(false);
      }
    }

    load();
    return () => {
      live = false;
    };
  }, [finalId]);

  const images = room?.images || room?.images_json || {};
  const meta = images.meta || {};
  const code = room?.code || finalId;

  const photosRoom = useMemo(() => {
    const gallery = images.gallery || [];
    let arr = gallery.map((p, i) => ({
      id: p.sha || p.id || i,
      url: withBase(p.url),
      thumb: withBase(p.thumb || p.url),
      alt: `Foto habitación ${i + 1}`,
    }));

    if (!arr.length && images.cover) {
      arr = [
        {
          id: images.cover.sha || "cover",
          url: withBase(images.cover.url),
          thumb: withBase(images.cover.thumb || images.cover.url),
          alt: "Portada habitación",
        },
      ];
    }

    if (!arr.length) arr = localFallback;
    return arr;
  }, [images]);

  const val = (x, suffix = "") => {
    if (x === true) return "Sí";
    if (x === false) return "No";
    if (x === 0) return `0${suffix}`.trim();
    if (x === null || x === undefined || x === "") return "—";
    return `${x}${suffix}`.trim();
  };

  const precioToShow =
    typeof meta.precio === "number"
      ? meta.precio
      : typeof room?.precio === "number"
      ? room.precio
      : meta.precio;

  const title = room?.direccion || `Habitación ${code}`;
  const cityLine = `${room?.ciudad || "—"}${room?.provincia ? `, ${room.provincia}` : ""}`;
  const superficie = meta.superficie_m2 || room?.m2;

  const colorText = "#0b1220";
  const colorMuted = "#475569";
  const dtStyle = { color: colorMuted };
  const ddStyle = { margin: 0, fontWeight: 800, color: colorText };

  const reservar = () => {
    navigate(`/habitaciones/${encodeURIComponent(code)}/reservar`);
  };

  return (
    <main className="min-h-screen" style={{ background: "#f8fafc", padding: "16px 0", color: colorText }}>
      <style>{`
        .sr-room-card, .sr-room-card * { color: ${colorText} !important; }
        .sr-room-muted { color: ${colorMuted} !important; }
        .sr-room-card dl dt { color: ${colorMuted} !important; }
        .sr-room-card dl dd { color: ${colorText} !important; }
      `}</style>

      <section className="container" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 16px" }}>
        {/* Barra superior */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/habitaciones")} className="sr-btn sr-btn--ghost">
              ← Volver a Habitaciones
            </button>
            <div style={{ fontWeight: 900 }}>Habitación · {code}</div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={`/habitaciones/${encodeURIComponent(code)}/fotos`} className="sr-btn sr-btn--ghost">
              Ver fotos
            </a>
            <button onClick={reservar} className="sr-btn sr-btn--primary">
              Reservar habitación
            </button>
          </div>
        </div>

        {loading && <div className="sr-hint" style={{ color: colorMuted, marginBottom: 8 }}>Cargando habitación…</div>}
        {error && <div className="sr-hint sr-hint--err" style={{ marginBottom: 8 }}>{error}</div>}

        {/* Galería primero: esto es lo que ve el inquilino al entrar */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 16, boxShadow: "0 10px 24px rgba(0,0,0,.08)", marginBottom: 16 }}>
          <Galeria photos={photosRoom} maxWidth={920} maxHeight={620} />
        </div>

        {/* Resumen comercial */}
        <div className="sr-room-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, boxShadow: "0 8px 18px rgba(0,0,0,.08)", marginBottom: 16 }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0 }}>{title}</h1>
              <div className="sr-room-muted" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "baseline", marginTop: 6 }}>
                <span>{cityLine}</span>
                <span>· {val(superficie, " m²")}</span>
                <span>· {val(meta.estado || room?.estado)}</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 950, color: "var(--sr-blue, #0b65d8)", fontSize: 26 }}>
                {typeof precioToShow === "number" ? `${precioToShow} €` : val(precioToShow)}
                <span style={{ color: "#64748b", marginLeft: 4, fontSize: 13 }}>/mes</span>
              </div>
              <button onClick={reservar} className="sr-btn sr-btn--primary" style={{ marginTop: 8 }}>
                Reservar habitación
              </button>
            </div>
          </header>
        </div>

        {/* Ficha técnica debajo */}
        <div className="sr-room-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, boxShadow: "0 8px 18px rgba(0,0,0,.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div>
              <h3 style={{ fontSize: 16, margin: "0 0 8px" }}>Equipamiento</h3>
              <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", margin: 0 }}>
                <dt style={dtStyle}>Cama</dt><dd style={ddStyle}>{val(meta.cama)}</dd>
                <dt style={dtStyle}>Ventana</dt><dd style={ddStyle}>{val(meta.ventana)}</dd>
                <dt style={dtStyle}>Cerradura</dt><dd style={ddStyle}>{val(meta.cerradura)}</dd>
                <dt style={dtStyle}>Escritorio</dt><dd style={ddStyle}>{val(meta.escritorio)}</dd>
                <dt style={dtStyle}>Enchufes</dt><dd style={ddStyle}>{val(meta.enchufes)}</dd>
                <dt style={dtStyle}>Baño privado</dt><dd style={ddStyle}>{val(meta.bano_privado)}</dd>
              </dl>
            </div>

            <div>
              <h3 style={{ fontSize: 16, margin: "0 0 8px" }}>Especificaciones</h3>
              <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", margin: 0 }}>
                <dt style={dtStyle}>Disponible desde</dt><dd style={ddStyle}>{val(meta.fecha_disponibilidad)}</dd>
                <dt style={dtStyle}>Barrio</dt><dd style={ddStyle}>{val(meta.barrio)}</dd>
                <dt style={dtStyle}>Orientación</dt><dd style={ddStyle}>{val(meta.orientacion)}</dd>
                <dt style={dtStyle}>Planta</dt><dd style={ddStyle}>{val(meta.planta)}</dd>
                <dt style={dtStyle}>Metro / línea</dt><dd style={ddStyle}>{val(meta.metro)}</dd>
                <dt style={dtStyle}>Consumos incluidos</dt><dd style={ddStyle}>{val(meta.consumos_incluidos)}</dd>
              </dl>
            </div>
          </div>

          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Descripción</div>
              <div style={{ color: colorText }}>{val(meta.descripcion)}</div>
            </div>

            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Normas</div>
              <div style={{ color: colorText }}>{val(meta.normas)}</div>
            </div>

            {meta.otros ? (
              <div>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Otros</div>
                <div style={{ color: colorText }}>{val(meta.otros)}</div>
              </div>
            ) : null}
          </div>

          {images?.sheet?.url && (
            <div style={{ marginTop: 14 }}>
              <a className="sr-btn sr-btn--ghost" href={withBase(images.sheet.url)} target="_blank" rel="noreferrer">
                Descargar última ficha
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
