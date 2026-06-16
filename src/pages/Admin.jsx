// src/pages/Admin.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  outline: "none",
  background: "#fff",
  color: "#0b1220",
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: 800,
  color: "#0b1220",
};

function normalizePhone(v) {
  const s = String(v || "").replace(/[^\d+]/g, "");
  if (!s) return "";
  if (s.startsWith("+")) return s;
  if (s.startsWith("34")) return "+" + s;
  if (/^(6|7)\d{8,}$/.test(s)) return "+34" + s;
  return s;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

function Card({ title, icon, children, footer }) {
  return (
    <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 18, boxShadow: "0 8px 22px rgba(15, 23, 42, 0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "#eef6ff", display: "grid", placeItems: "center", fontSize: 20 }}>{icon}</div>
        <h3 style={{ margin: 0, color: "#0b1220", fontSize: 19, fontWeight: 900 }}>{title}</h3>
      </div>
      <div style={{ color: "#334155", lineHeight: 1.55 }}>{children}</div>
      {footer && <div style={{ marginTop: 14 }}>{footer}</div>}
    </section>
  );
}

function Row({ label, value, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ color: "#64748b" }}>{label}</span>
      <span style={{ color: "#0b1220", fontWeight: strong ? 900 : 700, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Status({ children, tone = "info" }) {
  const styles = {
    ok: { bg: "#ecfdf5", color: "#047857", border: "#bbf7d0" },
    wait: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    info: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    danger: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
  };
  const s = styles[tone] || styles.info;
  return <span style={{ display: "inline-flex", borderRadius: 999, padding: "6px 10px", fontWeight: 900, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 13 }}>{children}</span>;
}

function Button({ children, onClick, href, secondary = false, disabled = false }) {
  const style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    background: secondary ? "#f8fafc" : "#0A58CA",
    color: secondary ? "#0A58CA" : "#fff",
    border: secondary ? "1px solid #cfe0ff" : "1px solid #0A58CA",
    padding: "10px 13px",
    borderRadius: 12,
    fontWeight: 900,
    fontSize: 14,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };
  if (href) return <a href={href} style={style}>{children}</a>;
  return <button type="button" onClick={onClick} disabled={disabled} style={style}>{children}</button>;
}

export default function Admin() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", role: "inquilino" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [activationLink, setActivationLink] = useState("");
  const [recentUsers, setRecentUsers] = useState([]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function createUserAndAccess(e) {
    e?.preventDefault?.();
    setBusy(true);
    setMsg("");
    setOk(false);
    setActivationLink("");

    try {
      const name = form.name.trim();
      const phone = normalizePhone(form.phone);
      const email = form.email.trim().toLowerCase();

      if (!name || name.split(" ").length < 2) throw new Error("Introduce nombre y apellidos.");
      if (!phone || !/^\+?\d{9,15}$/.test(phone)) throw new Error("Introduce un teléfono válido.");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Introduce un email válido o déjalo vacío.");

      const r = await fetch(`${API_BASE}/api/auth/create_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY },
        body: JSON.stringify({ name, phone, email: email || undefined, role: form.role }),
      });

      const j = await r.json().catch(() => ({}));
      if (!r.ok || j?.ok !== true) throw new Error(j?.message || j?.error || "No se pudo crear el usuario.");

      let link = "";
      try {
        const passRes = await fetch(`${API_BASE}/api/auth/request_password_link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        const pass = await passRes.json().catch(() => ({}));
        if (passRes.ok && pass?.ok === true && pass?.link) link = pass.link;
      } catch {}

      setActivationLink(link);
      setRecentUsers((prev) => [{ id: j.user?.id || Date.now(), name, phone, email, role: form.role, createdAt: new Date().toLocaleString("es-ES"), link }, ...prev].slice(0, 8));
      setOk(true);
      setMsg(link ? "Usuario creado y enlace de activación generado." : "Usuario creado. No se ha podido generar enlace automático.");
    } catch (e2) {
      setOk(false);
      setMsg(e2.message || "No se pudo completar la operación.");
    } finally {
      setBusy(false);
    }
  }

  async function copyWelcomeText() {
    const phone = normalizePhone(form.phone);
    const roleText = {
      inquilino: "Inquilino",
      propietario: "Propietario",
      franquiciado: "Franquiciado",
      equipo: "Equipo",
      admin: "Admin",
    }[form.role] || form.role;

    const text = `Bienvenido/a a SpainRoom.

Tu cuenta ha sido creada correctamente.

Rol: ${roleText}
Usuario: ${phone}

Para activar tu acceso, crea tu contraseña desde este enlace:
${activationLink || "[ENLACE DE ACTIVACIÓN]"}

Después podrás entrar desde:
https://spainroom.es/login

El equipo SpainRoom`;

    const copied = await copyToClipboard(text);
    alert(copied ? "Texto de bienvenida copiado." : "No se pudo copiar.");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#0b1220", padding: "24px 16px 36px" }}>
      <SEO title="Centro de Control — SpainRoom" description="Panel interno de gestión de usuarios, roles, accesos y operación SpainRoom." />

      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <section style={{ background: "linear-gradient(135deg, #0b65d8 0%, #084fa8 100%)", color: "#fff", borderRadius: 22, padding: "28px 24px", marginBottom: 18, boxShadow: "0 10px 26px rgba(10,88,202,.22)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.24)", borderRadius: 999, padding: "7px 12px", fontWeight: 900, marginBottom: 14 }}>
            SpainRoom<sup>®</sup> · Equipo/Admin
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(30px,4vw,46px)", lineHeight: 1.08, fontWeight: 950, letterSpacing: "-.03em" }}>
            Centro de Control SpainRoom
          </h1>
          <p style={{ margin: 0, maxWidth: 900, color: "rgba(255,255,255,.92)", lineHeight: 1.6 }}>
            El cerebro operativo de la plataforma: usuarios, roles, accesos, bienvenida, documentación, habitaciones, pagos e incidencias.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <Status tone="ok">🔐 Alta controlada</Status>
            <Status tone="info">👤 Roles por SpainRoom</Status>
            <Status tone="wait">📧 Bienvenida / activación</Status>
          </div>
        </section>

        <section className="sr-admin-kpis" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
          <Card title="Usuarios" icon="👥"><div style={{ fontSize: 24, fontWeight: 950 }}>Controlados</div><div>Altas creadas por Equipo/Admin.</div></Card>
          <Card title="Roles" icon="🔐"><div style={{ fontSize: 24, fontWeight: 950 }}>5</div><div>Inquilino, propietario, franquiciado, equipo y admin.</div></Card>
          <Card title="Accesos" icon="🔑"><div style={{ fontSize: 24, fontWeight: 950 }}>Por enlace</div><div>El usuario crea su propia contraseña.</div></Card>
          <Card title="Alertas" icon="🚨"><div style={{ fontSize: 24, fontWeight: 950 }}>0</div><div>Sin alertas críticas visibles.</div></Card>
        </section>

        <section className="sr-admin-main" style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 16, alignItems: "start" }}>
          <Card title="Crear usuario y acceso" icon="👤" footer={<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Button onClick={createUserAndAccess} disabled={busy}>{busy ? "Creando..." : "Crear usuario + generar acceso"}</Button><Button secondary onClick={copyWelcomeText} disabled={!activationLink}>Copiar bienvenida</Button></div>}>
            <form onSubmit={createUserAndAccess} style={{ display: "grid", gap: 12 }}>
              <div><label style={labelStyle}>Nombre y apellidos</label><input name="name" value={form.name} onChange={onChange} placeholder="Nombre completo" style={inputStyle} /></div>
              <div className="sr-admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Teléfono</label><input name="phone" value={form.phone} onChange={onChange} placeholder="+34 6XX XXX XXX" style={inputStyle} /></div>
                <div><label style={labelStyle}>Email</label><input name="email" type="email" value={form.email} onChange={onChange} placeholder="correo@ejemplo.com" style={inputStyle} /></div>
              </div>
              <div>
                <label style={labelStyle}>Rol</label>
                <select name="role" value={form.role} onChange={onChange} style={inputStyle}>
                  <option value="inquilino">Inquilino</option>
                  <option value="propietario">Propietario</option>
                  <option value="franquiciado">Franquiciado</option>
                  <option value="equipo">Equipo</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 12 }}>
                <strong>Flujo:</strong> SpainRoom crea la cuenta y asigna el rol. El usuario recibe enlace para crear su contraseña.
              </div>
            </form>

            {msg && <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 12, fontWeight: 800, background: ok ? "#ecfdf5" : "#fef2f2", border: ok ? "1px solid #bbf7d0" : "1px solid #fecaca", color: ok ? "#065f46" : "#991b1b" }}>{msg}</div>}

            {activationLink && (
              <div style={{ marginTop: 12, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14, padding: 12 }}>
                <div style={{ fontWeight: 900, color: "#0b1220", marginBottom: 6 }}>Enlace de activación</div>
                <div style={{ wordBreak: "break-all", color: "#1d4ed8", fontSize: 13 }}>{activationLink}</div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Button secondary onClick={async () => { const copied = await copyToClipboard(activationLink); alert(copied ? "Enlace copiado." : "No se pudo copiar."); }}>Copiar enlace</Button>
                  <Button href={activationLink}>Abrir enlace</Button>
                </div>
              </div>
            )}
          </Card>

          <div style={{ display: "grid", gap: 16 }}>
            <Card title="Gestión de roles" icon="🔐">
              <Row label="Inquilino" value="Dashboard Inquilino" />
              <Row label="Propietario" value="Dashboard Propietario" />
              <Row label="Franquiciado" value="Dashboard Franquiciado" />
              <Row label="Equipo" value="Centro de Control" />
              <Row label="Admin" value="Centro de Control completo" />
            </Card>

            <Card title="Accesos rápidos" icon="⚡">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button href="/dashboard/inquilino" secondary>Ver inquilino</Button>
                <Button href="/dashboard/propietario" secondary>Ver propietario</Button>
                <Button href="/dashboard/franquiciado" secondary>Ver franquiciado</Button>
                <Button href="/propietarios" secondary>Ver propietarios</Button>
              </div>
            </Card>

            <Card title="Próximos módulos" icon="🧠">
              <Row label="Documentación" value="Pendiente" />
              <Row label="Habitaciones" value="Pendiente" />
              <Row label="Pagos" value="Pendiente" />
              <Row label="Incidencias" value="Pendiente" />
              <Row label="SpainRoom Ventajas" value="Futuro" />
              <Row label="Jobs / Mercado" value="Futuro" />
            </Card>
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
          <Card title="Últimos usuarios creados en esta sesión" icon="📋">
            {recentUsers.length === 0 ? (
              <p style={{ margin: 0, color: "#64748b" }}>Todavía no se ha creado ningún usuario desde este panel en esta sesión.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#64748b" }}>
                      <th style={{ padding: "8px 6px", borderBottom: "1px solid #e2e8f0" }}>Nombre</th>
                      <th style={{ padding: "8px 6px", borderBottom: "1px solid #e2e8f0" }}>Teléfono</th>
                      <th style={{ padding: "8px 6px", borderBottom: "1px solid #e2e8f0" }}>Email</th>
                      <th style={{ padding: "8px 6px", borderBottom: "1px solid #e2e8f0" }}>Rol</th>
                      <th style={{ padding: "8px 6px", borderBottom: "1px solid #e2e8f0" }}>Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u) => (
                      <tr key={`${u.id}-${u.phone}`}>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f1f5f9", fontWeight: 800 }}>{u.name}</td>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f1f5f9" }}>{u.phone}</td>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f1f5f9" }}>{u.email || "—"}</td>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f1f5f9" }}>{u.role}</td>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f1f5f9" }}>{u.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </section>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .sr-admin-kpis { grid-template-columns: 1fr 1fr !important; }
          .sr-admin-main { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .sr-admin-kpis { grid-template-columns: 1fr !important; }
          .sr-admin-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
