// src/pages/LoginPassword.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const API_BASE =
  import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function LoginPassword() {
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const nav = useNavigate();
  const loc = useLocation();

  const normalizePhone = (v) => {
    const s = String(v || "").replace(/[^0-9+]/g, "");
    if (!s) return "";
    if (s.startsWith("+")) return s;
    if (s.startsWith("34")) return "+" + s;
    if (/^(6|7)\d{8,}$/.test(s)) return "+34" + s;
    return s;
  };

  const safeNext = () => {
    const next = new URLSearchParams(loc.search).get("next");
    if (!next) return "";
    if (!next.startsWith("/") || next.startsWith("//")) return "";
    return next;
  };

  const redirectAfter = (role) => {
    const next = safeNext();
    if (next) return nav(next, { replace: true });

    if (role === "propietario") return nav("/dashboard/propietario", { replace: true });
    if (role === "franquiciado") return nav("/dashboard/franquiciado", { replace: true });
    if (role === "admin") return nav("/admin", { replace: true });
    if (role === "equipo") return nav("/dashboard/equipo", { replace: true });

    return nav("/dashboard/inquilino", { replace: true });
  };

  async function doLogin(e) {
    e?.preventDefault();
    setMsg("");
    setBusy(true);

    try {
      const t = normalizePhone(phone);

      if (!t) throw new Error("Introduce tu móvil en formato +34…");
      if (!pw) throw new Error("Introduce tu contraseña.");

      const r = await fetch(`${API_BASE}/api/auth/login_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ phone: t, password: pw }),
        credentials: "include",
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok || j?.ok !== true || !j?.token) {
        throw new Error(j?.error || "Credenciales no válidas.");
      }

      const user = j.user || null;
      const role = user?.role || "inquilino";

      localStorage.setItem("SR_TOKEN", j.token);
      localStorage.setItem("SR_USER", JSON.stringify(user));

      try {
        window.dispatchEvent(new Event("sr-auth-updated"));
      } catch {}

      redirectAfter(role);
    } catch (e2) {
      setMsg(e2.message || "No se pudo iniciar sesión.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f8fafc",
      }}
    >
      <SEO
        title="Acceso único — SpainRoom"
        description="Accede a tu espacio privado de SpainRoom: habitación, propiedad, franquicia o administración."
      />

      <div
        style={{
          background: "#fff",
          color: "#0b1220",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          width: "min(500px, 94%)",
          padding: 22,
          boxShadow: "0 10px 28px rgba(15, 23, 42, 0.10)",
        }}
      >
        <img
          src="/cabecera.png"
          alt="SpainRoom"
          style={{ height: 64, margin: "0 auto 10px", display: "block" }}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#eef6ff",
            border: "1px solid #cfe0ff",
            color: "#0A58CA",
            borderRadius: 999,
            padding: "7px 12px",
            fontWeight: 900,
            marginBottom: 12,
          }}
        >
          SpainRoom<sup>®</sup> · Acceso único
        </div>

        <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 950 }}>
          Accede a tu espacio privado
        </h1>

        <p style={{ margin: "0 0 16px", color: "#64748b", lineHeight: 1.55 }}>
          Entra con tu móvil y contraseña. SpainRoom te llevará automáticamente a
          tu espacio: habitación, propiedad, franquicia o administración.
        </p>

        <form onSubmit={doLogin} style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 800 }}>
              Móvil
            </label>
            <input
              inputMode="tel"
              autoComplete="tel"
              placeholder="+34 6XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 12px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 800 }}>
              Contraseña
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 12px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            style={{
              background: "#0A58CA",
              color: "#fff",
              border: "none",
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 950,
              cursor: busy ? "not-allowed" : "pointer",
              boxShadow: "0 8px 18px rgba(10,88,202,.22)",
            }}
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div
          style={{
            marginTop: 14,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: 12,
            color: "#475569",
            lineHeight: 1.55,
            fontSize: 14,
          }}
        >
          <strong style={{ color: "#0b1220" }}>Crear o recuperar contraseña:</strong>{" "}
          temporalmente se gestionará desde SpainRoom. Escríbenos a{" "}
          <a href="mailto:admin@spainroom.es" style={{ color: "#0A58CA", fontWeight: 900 }}>
            admin@spainroom.es
          </a>
          .
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 14,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link to="/" style={{ color: "#0A58CA", fontWeight: 900, textDecoration: "none" }}>
            Volver al inicio
          </Link>
          <Link to="/contacto" style={{ color: "#0A58CA", fontWeight: 900, textDecoration: "none" }}>
            Contacto
          </Link>
        </div>

        {msg && (
          <div
            style={{
              marginTop: 12,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              borderRadius: 12,
              padding: "10px 12px",
              fontWeight: 800,
            }}
          >
            {msg}
          </div>
        )}
      </div>
    </main>
  );
}
