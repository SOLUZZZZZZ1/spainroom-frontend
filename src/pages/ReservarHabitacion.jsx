// src/pages/ReservarHabitacion.jsx — reserva específica de habitación
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = (
  import.meta.env?.VITE_ROOMS_BASE?.trim?.() ||
  import.meta.env?.VITE_API_BASE?.trim?.() ||
  "https://backend-spainroom.onrender.com"
).replace(/\/+$/, "");

const DEMO_META = {
  cama: "135x200",
  ventana: true,
  cerradura: true,
  superficie_m2: 18,
  precio: 400,
  estado: "Libre",
  barrio: "Centro",
  orientacion: "exterior",
  planta: "3",
  metro: "L1",
};

export default function ReservarHabitacion() {
  const params = useParams();
  const navigate = useNavigate();

  const roomId = params.roomId || params.id || "DEMO";

  const [room, setRoom] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [acepta, setAcepta] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadRoom() {
      if (roomId === "DEMO") {
        setRoom({
          code: "DEMO",
          ciudad: "—",
          provincia: "—",
          images: { meta: { ...DEMO_META } },
        });
        return;
      }

      try {
        const r = await fetch(`${API_BASE}/api/rooms/${encodeURIComponent(roomId)}`);
        const j = r.ok ? await r.json() : {};
        const images = j?.images || j?.images_json || {};
        const meta = { ...DEMO_META, ...(images.meta || {}) };

        if (!alive) return;
        setRoom({ ...(j || {}), code: j?.code || roomId, images: { ...images, meta } });
      } catch {
        if (!alive) return;
        setRoom({
          code: roomId,
          ciudad: "—",
          provincia: "—",
          images: { meta: { ...DEMO_META } },
        });
      }
    }

    loadRoom();
    return () => {
      alive = false;
    };
  }, [roomId]);

  const code = room?.code || roomId;
  const meta = useMemo(() => room?.images?.meta || {}, [room]);

  const val = (x, suffix = "") => {
    if (x === true) return "Sí";
    if (x === false) return "No";
    if (x === 0) return `0${suffix}`.trim();
    if (x === null || x === undefined || x === "") return "—";
    return `${x}${suffix}`.trim();
  };

  const payDeposit = async () => {
    const success = `/habitaciones/${encodeURIComponent(code)}?reserva=ok`;
    const cancel = `/habitaciones/${encodeURIComponent(code)}?reserva=error`;

    try {
      const r = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 150,
          currency: "eur",
          customer_email: email || null,
          success_path: success,
          cancel_path: cancel,
          metadata: {
            room_code: code,
            nombre,
            telefono,
            startDate,
            endDate,
          },
        }),
      });

      const j = await r.json();

      if (j?.ok && j?.url) {
        window.location.href = j.url;
        return;
      }

      navigate(success);
    } catch {
      navigate(success);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!nombre || !startDate || !endDate || !acepta) {
      setErr("Completa nombre, fechas y acepta la política de reserva.");
      return;
    }

    setBusy(true);
    await payDeposit();
    setBusy(false);
  };

  const card = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 8px 18px rgba(0,0,0,.08)",
    maxWidth: 980,
    margin: "0 auto",
  };

  const btn = (primary = false) => ({
    background: primary ? "var(--sr-blue, #0b65d8)" : "#fff",
    color: primary ? "#fff" : "var(--sr-blue, #0b65d8)",
    border: primary ? "1px solid transparent" : "1px solid #cfe0ff",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", padding: "16px 0" }}>
      <section style={card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <button onClick={() => navigate(`/habitaciones/${encodeURIComponent(code)}`)} style={btn(false)}>
            ← Volver a la ficha
          </button>

          <div style={{ fontWeight: 900, color: "#0b1220" }}>Reservar · {code}</div>

          <div style={{ display: "flex", gap: 8 }}>
            <a href={`/habitaciones/${encodeURIComponent(code)}`} style={btn(false)}>
              Ver ficha
            </a>
            <a href={`/habitaciones/${encodeURIComponent(code)}/fotos`} style={btn(false)}>
              Ver fotos
            </a>
          </div>
        </div>

        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontWeight: 900, color: "var(--sr-blue, #0b65d8)" }}>
            {typeof meta.precio === "number" ? `${meta.precio} €` : val(meta.precio)}
            <span style={{ color: "#64748b", marginLeft: 4, fontSize: 12 }}>/mes</span>
          </div>

          <div style={{ color: "#64748b", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "baseline", marginTop: 4 }}>
            <span>
              {room?.ciudad || "—"}
              {room?.provincia ? `, ${room.provincia}` : ""}
            </span>
            <span>· {val(meta.superficie_m2, " m²")}</span>
            <span>· {val(meta.estado)}</span>
          </div>

          <ul style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0 0", padding: 0, listStyle: "none" }}>
            <li style={{ background: "#eef2ff", border: "1px solid #e0e7ff", borderRadius: 999, padding: "6px 10px", fontWeight: 700 }}>
              Cama: {val(meta.cama)}
            </li>
            <li style={{ background: "#eef2ff", border: "1px solid #e0e7ff", borderRadius: 999, padding: "6px 10px", fontWeight: 700 }}>
              Ventana: {val(meta.ventana)}
            </li>
            <li style={{ background: "#eef2ff", border: "1px solid #e0e7ff", borderRadius: 999, padding: "6px 10px", fontWeight: 700 }}>
              Cerradura: {val(meta.cerradura)}
            </li>
          </ul>

          <div style={{ marginTop: 8, color: "#0b1220" }}>
            Depósito de reserva: <strong>150 €</strong>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#475569" }}>Nombre*</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 10 }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#475569" }}>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 10 }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#475569" }}>Teléfono</span>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+34 ..."
              style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 10 }}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>Entrada*</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 10 }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>Salida*</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 10 }}
              />
            </label>
          </div>

          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#475569" }}>
            <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
            Acepto condiciones de reserva y depósito de 150 €.
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <button type="submit" disabled={busy} style={btn(true)}>
              {busy ? "Procesando…" : "Pagar y reservar (150 €)"}
            </button>

            <button type="button" onClick={() => navigate("/habitaciones")} style={btn(false)}>
              Volver a Habitaciones
            </button>
          </div>

          {err && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
                borderRadius: 10,
                padding: "8px 10px",
              }}
            >
              {err}
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
