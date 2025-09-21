import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

export default function RoomDetail({ roomId, onClose, userRole = "owner" }) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRoom(null);
    setLoading(true);
    fetch(`${API_BASE}/api/rooms/${roomId}`)
      .then((r) => r.json())
      .then((data) => {
        setRoom(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [roomId]);

  const verifyCedula = async () => {
    const res = await fetch(`${API_BASE}/api/rooms/${roomId}/cedula/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Role": userRole, // admin o spainroom para que funcione
      },
    });
    const data = await res.json();
    if (data.ok) {
      alert("✅ Cédula verificada");
      setRoom({ ...room, cedula: { ...room.cedula, status: "verified", verification: "auto" } });
    } else {
      alert("❌ Error: " + (data.error || "desconocido"));
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 100%)",
          background: "#fff",
          borderRadius: 14,
          padding: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
            {loading ? "Cargando..." : room?.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              border: "1px solid #e5e7eb",
              background: "#fff",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#6b7280" }}>Cargando datos...</p>
        ) : (
          <>
            {/* Imagen principal */}
            <div style={{ marginTop: 12 }}>
              <img
                src={room.images?.[0] ? `/${room.images[0]}` : ""}
                alt={room.title}
                style={{
                  width: "100%",
                  height: 300,
                  objectFit: "cover",
                  borderRadius: 10,
                  background: "#f3f4f6",
                }}
              />
            </div>

            {/* Bloque detalles */}
            <div
              style={{
                marginTop: 14,
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800 }}>Detalles</h4>
              <p><b>Ciudad:</b> {room.city || "—"}</p>
              <p><b>Precio:</b> {room.price_eur} € / mes</p>
              <p><b>Tamaño:</b> {room.size_m2} m²</p>
              <p>
                <b>Disponible desde:</b>{" "}
                {room.availableFrom ? new Date(room.availableFrom).toLocaleDateString() : "—"}
              </p>
            </div>

            {/* Bloque cédula */}
            <div
              style={{
                marginTop: 14,
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800 }}>
                Estado del documento (cédula/licencia)
              </h4>
              <p><b>Estado:</b> {room.cedula?.status || "—"}</p>
              <p><b>Referencia:</b> {room.cedula?.ref || "—"}</p>
              <p><b>Verificación:</b> {room.cedula?.verification || "—"}</p>
              <p>
                <b>Documento:</b>{" "}
                {room.cedula?.doc_url ? (
                  <a href={room.cedula.doc_url} target="_blank" rel="noreferrer">
                    Ver PDF
                  </a>
                ) : (
                  "—"
                )}
              </p>

              {/* Botón solo visible si el rol lo permite */}
              {["admin", "spainroom"].includes(userRole.toLowerCase()) && (
                <button
                  onClick={verifyCedula}
                  style={{
                    marginTop: 10,
                    background: "#16a34a",
                    color: "#fff",
                    border: 0,
                    borderRadius: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Verificar cédula
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
