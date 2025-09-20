// src/components/VerificacionCedula.jsx
import React, { useMemo, useState } from "react";

const API_BASE  = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

export default function VerificacionCedula() {
  // contacto obligatorio
  const [nombre, setNombre]       = useState("");
  const [telefono, setTelefono]   = useState("");

  // opcionales y vía
  const [direccion, setDireccion] = useState("Calle Mayor 1, Madrid");
  const [refCat, setRefCat]       = useState("");
  const [email, setEmail]         = useState("");
  const [ciudad, setCiudad]       = useState("Madrid");
  const [comunidad, setComunidad] = useState("Comunidad de Madrid");
  const [file, setFile]           = useState(null);

  const [error, setError] = useState("");
  const [ok, setOk]       = useState(null); // { id, ts, status }

  const validoRef = useMemo(
    () => /^[A-Za-z0-9]{20}$/.test((refCat || "").trim()),
    [refCat]
  );

  const genId = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `SRV-${y}${m}${dd}-${rnd}`;
  };

  async function postJSON(path, body) {
    const r = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": ADMIN_KEY,
      },
      body: JSON.stringify(body),
    });
    return r.json();
  }

  async function uploadCopy(check_id, file) {
    const fd = new FormData();
    fd.append("check_id", String(check_id));
    fd.append("file", file, file.name);
    try {
      await fetch(`${API_BASE}/api/owner/cedula/upload`, {
        method: "POST",
        headers: { "X-Admin-Key": ADMIN_KEY },
        body: fd,
      });
    } catch {
      /* no bloquea */
    }
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(null);

    const telDigits = (telefono || "").replace(/\s+/g, "");

    if ((nombre || "").trim().split(" ").length < 2) {
      setError("Introduce tu nombre completo.");
      return;
    }
    if (!/^\+?\d{9,15}$/.test(telDigits)) {
      setError("Introduce un teléfono válido (9–15 dígitos, opcional +34).");
      return;
    }
    if (!validoRef && !direccion.trim()) {
      setError("Indica una dirección o una referencia catastral (20 caracteres).");
      return;
    }
    if (refCat && !validoRef) {
      setError("La referencia catastral debe tener 20 caracteres alfanuméricos.");
      return;
    }

    // 1) Registrar el check (lead)
    const checkRes = await postJSON("/api/owner/check", {
      tipo: "check_cedula",
      via: refCat ? "catastro" : "direccion",
      status: "pendiente",
      nombre,
      telefono: telDigits,
      email,
      ciudad,
      comunidad,
      refcat: refCat || undefined,
      direccion: direccion || undefined,
    });
    if (!checkRes?.ok) {
      setError("No se pudo registrar la verificación.");
      return;
    }

    const check_id = checkRes.id;

    // 2) Subir copia (si la adjuntan)
    if (file) await uploadCopy(check_id, file);

    // 3) Verificación rápida (mock) para mostrar estado al usuario
    let verify;
    if (refCat) {
      verify = await postJSON("/api/owner/cedula/verify/catastro", {
        refcat: refCat,
      });
    } else {
      verify = await postJSON("/api/owner/cedula/verify/direccion", {
        direccion,
        municipio: ciudad,
        provincia: comunidad,
      });
    }
    const status = verify?.status || "pendiente";
    setOk({ id: genId(), ts: new Date().toISOString(), status });
  };

  const mailtoHref = () => {
    const subject = encodeURIComponent(`Verificación SpainRoom ${ok?.id || ""}`);
    const body = encodeURIComponent(
      `ID: ${ok?.id || "(pendiente)"}\n` +
        `Nombre: ${nombre || "-"}\n` +
        `Teléfono: ${telefono || "-"}\n` +
        `Dirección: ${direccion || "-"}\n` +
        `Ref. catastral: ${refCat || "-"}\n` +
        `Email: ${email || "-"}\n` +
        `Ciudad: ${ciudad || "-"}\n` +
        `Comunidad: ${comunidad || "-"}\n\n` +
        `Resultado: ${ok?.status || "-"}\n`
    );
    return `mailto:propietarios@spainroom.es?subject=${subject}&body=${body}`;
  };

  return (
    <div
      id="verificacion"
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <h3 style={{ margin: "0 0 6px" }}>Comprobar cédula y requisitos</h3>
      <p className="note" style={{ margin: "0 0 10px" }}>
        Indica dirección o referencia catastral (20 caracteres). Te devolvemos un{" "}
        <strong>ID de verificación</strong> consultable en cualquier momento.
      </p>

      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        {/* contacto obligatorio */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <label>Nombre completo *</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre y apellidos"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
              }}
            />
          </div>
          <div>
            <label>Teléfono *</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+34 6XX XXX XXX"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
              }}
            />
          </div>
        </div>

        {/* vía */}
        <div>
          <label>Dirección (opcional si indicas referencia catastral)</label>
          <input
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Calle Mayor 1, Madrid"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 10,
            }}
          />
        </div>

        <div>
          <label>Referencia catastral (20 chars)</label>
          <input
            value={refCat}
            onChange={(e) => setRefCat(e.target.value)}
            placeholder="XXXXXXXXXXXXYYYYYY"
            maxLength={20}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 10,
            }}
          />
          {!refCat ? (
            <div className="note" style={{ marginTop: 6 }}>
              Si no la tienes, usa solo la dirección.
            </div>
          ) : !validoRef ? (
            <div style={{ color: "#b91c1c", marginTop: 6 }}>
              Formato no válido (20 alfanuméricos).
            </div>
          ) : null}
        </div>

        {/* opcionales */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <label>Email (opcional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
              }}
            />
          </div>
          <div>
            <label>Ciudad (opcional)</label>
            <input
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              placeholder="Madrid"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
              }}
            />
          </div>
          <div>
            <label>Comunidad (opcional)</label>
            <input
              value={comunidad}
              onChange={(e) => setComunidad(e.target.value)}
              placeholder="Comunidad de Madrid"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
              }}
            />
          </div>
        </div>

        {/* adjunto opcional */}
        <div>
          <label>Adjuntar copia (PDF/JPG/PNG) — uso interno SpainRoom</label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* acciones */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#mapa"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#0A58CA",
              border: "1px solid #0A58CA",
              padding: "10px 14px",
              borderRadius: 10,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Ver mapa por provincia
          </a>
          <button
            type="submit"
            style={{
              background: "#0A58CA",
              color: "#fff",
              border: "none",
              padding: "10px 14px",
              borderRadius: 10,
              fontWeight: 800,
            }}
          >
            Comprobar
          </button>
        </div>

        {error && <div style={{ color: "#b91c1c" }}>{error}</div>}

        {ok && (
          <div
            style={{
              marginTop: 12,
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 800 }}>
              ID de verificación: {ok.id}
            </div>
            <div className="note">
              Guardado en este navegador. Usa este ID como referencia con el equipo.
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(ok.id)}
                style={{
                  background: "#fff",
                  color: "#0A58CA",
                  border: "1px solid #0A58CA",
                  padding: "8px 12px",
                  borderRadius: 10,
                  fontWeight: 800,
                }}
              >
                Copiar ID
              </button>
              <a
                href={mailtoHref()}
                style={{
                  display: "inline-block",
                  background: "#0A58CA",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: 10,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Enviar por email
              </a>
            </div>

            {/* Resultado al usuario (solo estado, nunca el documento) */}
            <div style={{ marginTop: 10, fontSize: 14 }}>
              <strong>Resultado:</strong>{" "}
              <span
                style={{
                  background:
                    ok.status === "valida"
                      ? "#16a34a"
                      : ok.status === "caducada"
                      ? "#f59e0b"
                      : ok.status === "no_encontrada"
                      ? "#ef4444"
                      : "#64748b",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: 8,
                  fontWeight: 800,
                }}
              >
                {ok.status}
              </span>
            </div>
          </div>
        )}
      </form>

      <div className="note" style={{ marginTop: 10 }}>
        *Esta verificación no sustituye una resolución oficial. SpainRoom te guía y gestiona la tramitación.
      </div>
    </div>
  );
}
