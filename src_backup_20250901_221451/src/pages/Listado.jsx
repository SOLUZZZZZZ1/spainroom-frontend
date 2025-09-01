import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5001";

export default function Listado() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/rooms`)
      .then((r) => r.json())
      .then((data) => setRooms(Array.isArray(data) ? data : data.items || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main style={{ padding: 16 }}>Cargando habitaciones…</main>;
  }

  if (!rooms.length) {
    return (
      <main style={{ padding: 16 }}>
        <h1 style={{ margin: "10px 0 14px", fontSize: 22, fontWeight: 800 }}>
          Listado de habitaciones
        </h1>
        No hay habitaciones disponibles todavía.
      </main>
    );
  }

  const getImgSrc = (img) => {
    if (!img) return "";
    // Si ya viene con 'images/' lo respetamos; si no, lo añadimos
    return img.startsWith("images/") ? `/${img}` : `/images/${img}`;
  };

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ margin: "10px 0 14px", fontSize: 22, fontWeight: 800 }}>
        Listado de habitaciones
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 14,
        }}
      >
        {rooms.map((r) => {
          const img0 = r.images?.[0] || "";
          const src = getImgSrc(img0);

          return (
            <div
              key={r.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                background: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              <img
                src={src}
                alt={r.title}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 8,
                  background: "#f3f4f6",
                }}
                onError={(e) => {
                  e.currentTarget.style.opacity = 0.6;
                }}
              />
              <h3 style={{ marginTop: 10 }}>{r.title}</h3>
              <p style={{ margin: 0, color: "#6b7280" }}>{r.city}</p>
              <p style={{ margin: "6px 0 0", color: "#2563eb", fontWeight: 700 }}>
                {r.price_eur} € / mes
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
