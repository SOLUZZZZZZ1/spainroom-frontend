import { useEffect, useMemo, useState } from "react";
import { getReservations, clearReservations } from "../state/reservations.js";
import { downloadCSV } from "../utils/csv.js";

export default function Reservas() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getReservations());
  }, []);

  const total = useMemo(() => items.length, [items]);

  const exportCSV = () => {
    if (!items.length) return alert("No hay reservas para exportar.");
    downloadCSV("reservas_spainroom.csv", items);
  };

  const sendWebhook = async () => {
    const url = prompt("Pega la URL del webhook (ej: https://hooks.zapier.com/...)");
    if (!url) return;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservations: items }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert("✅ Enviado correctamente al webhook.");
    } catch (e) {
      alert("❌ Error enviando al webhook:\n" + e.message);
    }
  };

  const mailtoCSV = () => {
    if (!items.length) return alert("No hay reservas para enviar.");
    // En mailto no se puede adjuntar archivo; incluimos un resumen en el cuerpo:
    const resumen = items
      .slice(0, 10)
      .map(
        (r) =>
          `• ${r.createdAt} | ${r.roomTitle} (${r.roomId}) | ${r.name} | ${r.email} | ${r.phone} | ${r.date}`
      )
      .join("%0D%0A");
    const subject = encodeURIComponent("Reservas SpainRoom");
    const body = encodeURIComponent(
      "Adjunto resumen de las últimas reservas (recomendado exportar CSV desde la web para archivo):\n\n"
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}${resumen}`;
  };

  const clearAll = () => {
    if (!items.length) return;
    if (!confirm("¿Borrar TODAS las reservas guardadas en este navegador?")) return;
    clearReservations();
    setItems([]);
  };

  return (
    <main style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <div className="sr-heading">
        <span className="sr-heading__dot" />
        <h2 className="sr-heading__title">Reservas</h2>
      </div>
      <p style={{ marginTop: -4, color: "#6b7280" }}>
        Gestiona las solicitudes guardadas localmente. (Más tarde conectaremos backend/email).
      </p>

      <section className="sr-section" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button className="sr-btn-brand" onClick={exportCSV}>Exportar CSV</button>
          <button className="sr-btn-ghost" onClick={sendWebhook}>Enviar a webhook</button>
          <button className="sr-btn-ghost" onClick={mailtoCSV}>Enviar por email</button>
          <div style={{ marginLeft: "auto", color: "#6b7280", fontWeight: 800 }}>
            Total reservas: {total}
          </div>
          <button className="sr-btn-ghost" onClick={clearAll} title="Borrar todo">Borrar todo</button>
        </div>
      </section>

      <section className="sr-section" style={{ marginTop: 12 }}>
        {!items.length ? (
          <p style={{ color: "#6b7280" }}>Aún no hay reservas registradas.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                minWidth: 800,
              }}
            >
              <thead>
                <tr style={{ textAlign: "left", fontWeight: 900 }}>
                  <th style={{ padding: "10px 8px" }}>Fecha</th>
                  <th style={{ padding: "10px 8px" }}>Habitación</th>
                  <th style={{ padding: "10px 8px" }}>Ubicación</th>
                  <th style={{ padding: "10px 8px" }}>Precio</th>
                  <th style={{ padding: "10px 8px" }}>Nombre</th>
                  <th style={{ padding: "10px 8px" }}>Email</th>
                  <th style={{ padding: "10px 8px" }}>Teléfono</th>
                  <th style={{ padding: "10px 8px" }}>Entrada</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "8px" }}>{new Date(r.createdAt).toLocaleString()}</td>
                    <td style={{ padding: "8px" }}>{r.roomTitle} <span style={{ color: "#6b7280" }}>({r.roomId})</span></td>
                    <td style={{ padding: "8px" }}>{r.roomLocation}</td>
                    <td style={{ padding: "8px", fontWeight: 900, color: "#0b65d8" }}>{r.price} €</td>
                    <td style={{ padding: "8px" }}>{r.name}</td>
                    <td style={{ padding: "8px" }}>{r.email}</td>
                    <td style={{ padding: "8px" }}>{r.phone}</td>
                    <td style={{ padding: "8px" }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
