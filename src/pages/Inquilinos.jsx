// src/pages/Inquilinos.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const API_BASE =
  import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function Inquilinos() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTel] = useState("");

  // KYC (selfie obligatorio)
  const [kycSession, setKycSession] = useState(null);
  const [kycState, setKycState] = useState("idle");
  const pollRef = useRef(null);

  // Uploads
  const [dniFrontOK, setDniFrontOK] = useState(false);
  const [facturaMovilOK, setFacturaOK] = useState(false);
  const [otrosCount, setOtrosCount] = useState(0);

  const [subiendo, setSubiendo] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const subjectId = (telefono || email || "").trim();

  function requireSubject() {
    if (!subjectId) {
      setErr("Indica teléfono o email antes de subir documentos.");
      return false;
    }
    return true;
  }

  async function startKyc() {
    setErr("");
    setMsg("");

    if (!telefono.trim()) {
      setErr("Indica tu teléfono para enviar el enlace de selfie.");
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/api/kyc/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: telefono.trim() }),
      });

      const j = await r.json();

      if (!r.ok || !j?.ok) {
        throw new Error(j?.error || "No se pudo iniciar KYC.");
      }

      const session = {
        session_id: j.session_id,
        token: j.token,
        link: j.link,
      };

      setKycSession(session);
      localStorage.setItem("kyc_session", JSON.stringify(session));
      setKycState("pending");
      setMsg(
        "Enlace de selfie enviado a tu móvil. Si no te llega, usa el enlace que aparece en pantalla."
      );

      clearInterval(pollRef.current);
      pollRef.current = setInterval(checkKyc, 4000);
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  async function checkKyc() {
    try {
      const sess =
        kycSession || JSON.parse(localStorage.getItem("kyc_session") || "null");

      if (!sess) return;

      const qp = sess.session_id
        ? `session=${sess.session_id}`
        : `token=${sess.token}`;

      const r = await fetch(`${API_BASE}/api/kyc/status?${qp}`, {
        cache: "no-cache",
      });

      const j = await r.json();

      if (!r.ok || !j?.ok) {
        throw new Error(j?.error || "KYC status error");
      }

      if (j.state === "verified") {
        setKycState("verified");
        setMsg("Identidad verificada ✅");
        clearInterval(pollRef.current);
      } else if (j.state === "expired") {
        setKycState("expired");
        setErr("El enlace de selfie ha caducado. Vuelve a solicitarlo.");
        clearInterval(pollRef.current);
      } else if (j.state === "declined") {
        setKycState("declined");
        setErr(
          "Verificación rechazada. Revisa luz, rostro y documento y vuelve a intentarlo."
        );
        clearInterval(pollRef.current);
      }
    } catch (_) {
      // Silencioso para no molestar al usuario durante el polling.
    }
  }

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  async function uploadOne(cat, file) {
    if (!requireSubject()) return false;
    if (!file) return false;

    setSubiendo(true);
    setErr("");
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("role", "tenant");
      fd.append("subject_id", subjectId);
      fd.append("category", cat);
      fd.append("file", file, file.name || `${cat}.bin`);

      const r = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: fd,
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok || !j?.ok) {
        throw new Error(j?.error || `HTTP ${r.status}`);
      }

      if (cat === "dni_front") setDniFrontOK(true);
      if (cat === "factura_movil") setFacturaOK(true);
      if (cat === "otros") setOtrosCount((c) => c + 1);

      setMsg("Documento subido correctamente.");
      return true;
    } catch (e) {
      setErr(String(e.message || e));
      return false;
    } finally {
      setSubiendo(false);
    }
  }

  async function onSelectFile(cat, e) {
    const files = Array.from(e.target.files || []);
    for (const f of files) await uploadOne(cat, f);
    e.target.value = "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (kycState !== "verified") {
      setErr("Debes completar el selfie de verificación primero.");
      return;
    }

    if (!dniFrontOK) {
      setErr("Debes subir el DNI/NIE/Pasaporte.");
      return;
    }

    if (!facturaMovilOK) {
      setErr("Debes subir la factura del móvil del número declarado.");
      return;
    }

    try {
      const body = {
        nombre,
        email,
        telefono,
        via: "web_tenant_prerequest",
      };

      const r = await fetch(`${API_BASE}/api/contacto/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!r.ok) throw new Error("backend");

      setMsg("Solicitud enviada. Te contactaremos muy pronto.");
      setNombre("");
      setEmail("");
      setTel("");
      setKycSession(null);
      setKycState("idle");
      localStorage.removeItem("kyc_session");
      setDniFrontOK(false);
      setFacturaOK(false);
      setOtrosCount(0);
    } catch (_) {
      setMsg("Solicitud enviada (demo). Te contactaremos muy pronto.");
    }
  }

  const card = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  };

  const input = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0b1220",
    outline: "none",
  };

  const label = {
    display: "block",
    marginBottom: 6,
    color: "#334155",
    fontWeight: 800,
    fontSize: 13,
  };

  const statusBadge = () => {
    if (kycState === "verified") return <b className="sr-ok">verificado ✅</b>;
    if (kycState === "pending") return <b className="sr-warning">esperando selfie…</b>;
    if (kycState === "expired") return <b className="sr-error">enlace caducado</b>;
    if (kycState === "declined") return <b className="sr-error">rechazado</b>;
    return <b>pendiente</b>;
  };

  return (
    <main className="sr-scope" style={{ background: "#f8fafc", minHeight: "100vh", color: "#0b1220" }}>
      <SEO
        title="Inquilinos — SpainRoom"
        description="Encuentra habitaciones verificadas y completa tu alta como inquilino con verificación de identidad y documentación."
      />

      <style>{`
        .sr-scope, .sr-scope * { color: #0b1220; box-sizing: border-box; }
        .sr-scope a { color: #0A58CA; text-decoration: none; }
        .sr-scope ::placeholder { color: #64748b; opacity: 1; }
        .sr-success { color: #065f46 !important; }
        .sr-error { color: #b91c1c !important; }
        .sr-warning { color: #b45309 !important; }
        .sr-ok { color: #16a34a !important; }
        .sr-tenant-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .sr-tenant-process { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .sr-tenant-form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .sr-doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 980px) {
          .sr-tenant-grid-4 { grid-template-columns: 1fr 1fr; }
          .sr-tenant-process { grid-template-columns: 1fr; }
          .sr-tenant-form-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 620px) {
          .sr-tenant-grid-4, .sr-doc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section style={{ background: "linear-gradient(135deg, #0b65d8 0%, #084fa8 100%)", color: "#ffffff", padding: "58px 16px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.24)", borderRadius: 999, padding: "7px 12px", fontWeight: 800, marginBottom: 16, color: "#fff" }}>
            SpainRoom<sup style={{ color: "#fff" }}>®</sup> · Habitaciones verificadas
          </div>

          <h1 style={{ margin: 0, color: "#ffffff", fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1.05, fontWeight: 950, letterSpacing: "-.03em", maxWidth: 820 }}>
            Encuentra tu próxima habitación con más seguridad
          </h1>

          <p style={{ margin: "16px 0 0", maxWidth: 760, color: "rgba(255,255,255,.9)", fontSize: 18, lineHeight: 1.6, fontWeight: 600 }}>
            Habitaciones verificadas, reserva online y proceso de identidad para proteger
            tanto a inquilinos como a propietarios.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            <Link to="/habitaciones" style={{ background: "#ffffff", color: "#0A58CA", padding: "12px 16px", borderRadius: 12, fontWeight: 950, boxShadow: "0 10px 24px rgba(0,0,0,.18)" }}>
              Ver habitaciones disponibles
            </Link>

            <a href="#alta-inquilino" style={{ background: "rgba(255,255,255,.14)", color: "#ffffff", padding: "12px 16px", borderRadius: 12, fontWeight: 950, border: "1px solid rgba(255,255,255,.28)" }}>
              Completar verificación
            </a>

            <Link to="/dashboard/inquilino" style={{ background: "rgba(255,255,255,.14)", color: "#ffffff", padding: "12px 16px", borderRadius: 12, fontWeight: 950, border: "1px solid rgba(255,255,255,.28)" }}>
              Mi habitación
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px 44px" }}>
        <div className="sr-tenant-grid-4" style={{ marginBottom: 20 }}>
          <div style={card}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🏠</div>
            <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Habitaciones verificadas</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}>
              Información clara, fotos y datos útiles antes de reservar.
            </p>
          </div>

          <div style={card}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🔑</div>
            <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Reserva online</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}>
              Inicia la reserva desde la ficha de habitación con un flujo guiado.
            </p>
          </div>

          <div style={card}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🛡️</div>
            <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Identidad verificada</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}>
              Aporta seguridad al propietario y al inquilino.
            </p>
          </div>

          <div style={card}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>📄</div>
            <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Documentación segura</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}>
              Centralizamos la documentación necesaria del expediente.
            </p>
          </div>
        </div>

        <div style={{ ...card, marginBottom: 20 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 950 }}>
            Cómo funciona
          </h2>
          <p style={{ margin: "0 0 16px", color: "#64748b", lineHeight: 1.6 }}>
            SpainRoom acompaña el proceso desde la búsqueda hasta la entrada en la habitación.
          </p>

          <div className="sr-tenant-process">
            {[
              ["1", "Busca", "Elige ciudad, zona y habitación."],
              ["2", "Reserva", "Inicia la reserva online."],
              ["3", "Verifica", "Completa selfie e identidad."],
              ["4", "Documenta", "Sube DNI y factura móvil."],
              ["5", "Entra", "Formaliza y entra a vivir."],
            ].map(([num, title, text]) => (
              <div key={num} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 999, display: "grid", placeItems: "center", background: "#0A58CA", color: "#ffffff", fontWeight: 950, marginBottom: 10 }}>
                  {num}
                </div>
                <div style={{ fontWeight: 950, marginBottom: 4 }}>{title}</div>
                <div style={{ color: "#64748b", lineHeight: 1.45 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...card, marginBottom: 20, background: "linear-gradient(135deg, #eef6ff 0%, #ffffff 100%)" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 950 }}>
            Verificación de identidad SpainRoom
          </h2>
          <p style={{ margin: "0 0 14px", color: "#475569", lineHeight: 1.7 }}>
            Para proteger a propietarios e inquilinos, SpainRoom puede solicitar una verificación
            de identidad antes de completar el alta o formalizar una reserva.
          </p>

          <div className="sr-tenant-grid-4">
            <div style={{ fontWeight: 900 }}>✓ Selfie de verificación</div>
            <div style={{ fontWeight: 900 }}>✓ DNI/NIE/Pasaporte</div>
            <div style={{ fontWeight: 900 }}>✓ Factura del móvil</div>
            <div style={{ fontWeight: 900 }}>✓ Expediente documentado</div>
          </div>
        </div>

        <form id="alta-inquilino" onSubmit={onSubmit} style={{ ...card, display: "grid", gap: 14 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>
              Alta y verificación de inquilino
            </h2>
            <p style={{ margin: "8px 0 0", color: "#64748b", lineHeight: 1.6 }}>
              Completa tus datos, verifica tu identidad y sube la documentación obligatoria
              para que SpainRoom pueda revisar tu expediente.
            </p>
          </div>

          <div className="sr-tenant-form-grid">
            <div>
              <label style={label}>Nombre y apellidos</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo" style={input} />
            </div>

            <div>
              <label style={label}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" style={input} />
            </div>

            <div>
              <label style={label}>Teléfono para selfie y factura</label>
              <input value={telefono} onChange={(e) => setTel(e.target.value)} placeholder="+34 6XX XXX XXX" style={input} />
            </div>
          </div>

          <div style={{ display: "grid", gap: 10, border: "1px dashed #cbd5e1", borderRadius: 14, padding: 14, background: "#f8fafc" }}>
            <div style={{ fontWeight: 950, fontSize: 18 }}>
              Selfie de verificación obligatorio
            </div>

            <div style={{ color: "#64748b", lineHeight: 1.6 }}>
              Recibirás un enlace a tu móvil para realizar el selfie en directo. Si no llega el SMS,
              podrás abrir el enlace manualmente desde esta pantalla.
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={startKyc} style={{ background: "#0A58CA", color: "#ffffff", border: 0, padding: "12px 16px", borderRadius: 12, fontWeight: 950, cursor: "pointer" }}>
                Enviar enlace para selfie
              </button>

              {kycSession?.link && (
                <a href={kycSession.link} target="_blank" rel="noopener noreferrer" style={{ background: "#ffffff", color: "#0A58CA", border: "1px solid #cfe0ff", padding: "12px 16px", borderRadius: 12, fontWeight: 950 }}>
                  Abrir enlace
                </a>
              )}
            </div>

            <div>Estado: {statusBadge()}</div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 950 }}>
                Documentación obligatoria
              </h3>
              <p style={{ margin: "6px 0 0", color: "#64748b", lineHeight: 1.6 }}>
                La documentación debe ser clara, legible y coincidir con los datos declarados.
              </p>
            </div>

            <div className="sr-doc-grid">
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
                <label style={label}>DNI / NIE / Pasaporte — Obligatorio</label>
                <input type="file" accept=".pdf,image/*" onChange={(e) => onSelectFile("dni_front", e)} style={input} />
                {dniFrontOK ? (
                  <div className="sr-success" style={{ marginTop: 8, fontWeight: 900 }}>Subido ✅</div>
                ) : (
                  <div style={{ marginTop: 8, color: "#64748b" }}>Sube una imagen legible o PDF.</div>
                )}
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
                <label style={label}>Factura del móvil — Obligatorio</label>
                <input type="file" accept=".pdf,image/*" onChange={(e) => onSelectFile("factura_movil", e)} style={input} />
                {facturaMovilOK ? (
                  <div className="sr-success" style={{ marginTop: 8, fontWeight: 900 }}>Subida ✅</div>
                ) : (
                  <div style={{ marginTop: 8, color: "#64748b" }}>Debe corresponder al número declarado.</div>
                )}
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
                <label style={label}>Otros documentos — Opcional</label>
                <input type="file" accept=".pdf,image/*" multiple onChange={(e) => onSelectFile("otros", e)} style={input} />
                {otrosCount > 0 && (
                  <div className="sr-success" style={{ marginTop: 8, fontWeight: 900 }}>
                    {otrosCount} fichero(s) subido(s)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
            <span style={{ color: "#64748b", lineHeight: 1.6 }}>
              Necesitas: selfie verificado + documento de identidad + factura del móvil.
            </span>

            <button type="submit" disabled={kycState !== "verified" || !dniFrontOK || !facturaMovilOK || subiendo} style={{ background: kycState === "verified" && dniFrontOK && facturaMovilOK && !subiendo ? "#0A58CA" : "#a3a3a3", color: "#ffffff", border: 0, padding: "12px 18px", borderRadius: 12, fontWeight: 950, cursor: kycState === "verified" && dniFrontOK && facturaMovilOK && !subiendo ? "pointer" : "not-allowed" }}>
              {subiendo ? "Subiendo…" : "Enviar alta"}
            </button>
          </div>

          {err && (
            <div className="sr-error" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 12px", fontWeight: 800 }}>
              {err}
            </div>
          )}

          {msg && (
            <div className="sr-success" style={{ background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 12, padding: "10px 12px", fontWeight: 800 }}>
              {msg}
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
