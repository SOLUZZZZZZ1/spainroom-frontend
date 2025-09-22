// src/pages/Reservas.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";

export default function Reservas() {
  const DEFAULT_DEPOSIT = Number(import.meta.env.VITE_DEFAULT_DEPOSIT_EUR || "150"); // €
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [habitacion, setHabitacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [deposito, setDeposito] = useState(DEFAULT_DEPOSIT);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  const readJSON = async (resp) => {
    const txt = await resp.text();
    try { return JSON.parse(txt); } catch { return { _raw: txt }; }
  };

  const pagarDeposito = async (e) => {
    e.preventDefault();
    setErr(""); setOk(false);

    if (!email || !nombre) { setErr("Introduce al menos tu nombre y email."); return; }
    if (!deposito || Number(deposito) <= 0) { setErr("Depósito inválido."); return; }

    setLoading(true);
    try {
      const body = {
        amount: Number(deposito),
        currency: "eur",
        customer_email: email,
        success_path: "/reservas/ok",
        cancel_path: "/reservas/error",
        metadata: { nombre, email, telefono, fecha, habitacion, mensaje },
      };
      const resp = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await readJSON(resp);
      if (!resp.ok || !data?.url) {
        throw new Error(data?.error || "No se pudo iniciar el pago (endpoint no disponible).");
      }
      window.location.href = data.url; // Stripe Checkout
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const enviarSolicitud = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("Solicitud de reserva/visita — SpainRoom");
    const body = encodeURIComponent(
`Nombre: ${nombre}
Email: ${email}
Teléfono: ${telefono}
Fecha: ${fecha}
Habitación: ${habitacion}

Mensaje:
${mensaje}`
    );
    window.location.href = `mailto:reservas@spainroom.es?subject=${subject}&body=${body}`;
    setOk(true);
  };

  return (
    <div className="container" style={{ padding: "24px 0", color: "#0b1220" }}>
      <SEO
        title="Reservas — SpainRoom"
        description="Afianza tu reserva con un depósito seguro (Stripe Checkout)."
      />

      <h2 style={{ margin: 0 }}>Reservas y visitas</h2>

      {/* Banner destacado del subtítulo */}
      <div
        style={{
          margin: "10px 0 16px",
          background: "#f1f5fe",
          border: "1px solid #c7d8ff",
          color: "#0b1220",
          padding: "12px 14px",
          borderRadius: 12,
          fontSize: 16,
          lineHeight: 1.5,
          fontWeight: 700,
        }}
      >
        Confirma disponibilidad, agenda una visita y afianza tu reserva con un depósito.
      </div>

      {/* Estilos locales modo claro */}
      <style>{`
        .sr-form { color:#0b1220; }
        .sr-label { display:block; color:#0b1220; margin-bottom:6px; font-weight:600; }
        .sr-input, .sr-textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0b1220;
          outline: none;
        }
        .sr-input::placeholder, .sr-textarea::placeholder { color:#64748b; }
        .sr-input:focus, .sr-textarea:focus {
          border-color:#0b69c7; box-shadow:0 0 0 2px rgba(11,105,199,.20);
        }
        .sr-card {
          background:#fff;
          border:1px solid #e2e8f0;
          border-radius:16px;
          padding:16px;
          box-shadow: 0 4px 16px rgba(0,0,0,.06);
        }
        .sr-note { color:#64748b; }
        .sr-btn-primary {
          background:#0A58CA; color:#fff; border:none; padding:12px 16px;
          border-radius:12px; font-weight:800; min-width:220px; cursor:pointer;
        }
        .sr-btn-secondary {
          background:#fff; color:#0A58CA; border:1px solid #0A58CA;
          padding:12px 16px; border-radius:12px; font-weight:800; cursor:pointer;
        }
        .sr-err { margin-top:10px; color:#b91c1c; }
        .sr-ok  { margin-top:10px; color:#065f46; }
      `}</style>

      <form className="sr-form sr-card" onSubmit={pagarDeposito} style={{ maxWidth: 820 }}>
        {/* Datos principales */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label className="sr-label">Nombre*</label>
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="sr-input"
              placeholder="Nombre y apellidos"
            />
          </div>
          <div>
            <label className="sr-label">Email*</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sr-input"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="sr-label">Teléfono</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="sr-input"
              placeholder="+34 6XX XXX XXX"
            />
          </div>
          <div>
            <label className="sr-label">Fecha preferente</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="sr-input"
              placeholder="dd/mm/aaaa"
            />
          </div>
        </div>

        {/* Habitación / Mensaje */}
        <div style={{ marginTop: 12 }}>
          <label className="sr-label">Habitación (ID o enlace)</label>
          <input
            value={habitacion}
            onChange={(e) => setHabitacion(e.target.value)}
            className="sr-input"
            placeholder="Ej: /habitacion/123"
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="sr-label">Mensaje</label>
          <textarea
            rows={4}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="sr-textarea"
            placeholder="Cuéntanos tus preferencias o dudas"
          />
        </div>

        {/* Depósito + botones */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <div>
            <label className="sr-label">Depósito (EUR)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={deposito}
              onChange={(e) => setDeposito(e.target.value)}
              className="sr-input"
              placeholder="50"
            />
            <div className="sr-note" style={{ marginTop: 6 }}>
              Pago seguro con Stripe Checkout.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "end",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <button type="submit" disabled={loading} className="sr-btn-primary">
              {loading ? "Iniciando pago…" : "Pagar depósito"}
            </button>
            <button onClick={enviarSolicitud} type="button" className="sr-btn-secondary">
              Enviar por email
            </button>
          </div>
        </div>

        {err && <div className="sr-err">{err}</div>}
        {ok && (
          <div className="sr-ok">¡Solicitud enviada por email! Te contactaremos muy pronto.</div>
        )}
      </form>
    </div>
  );
}
