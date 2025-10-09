// src/components/VerificacionCedula.jsx
import React, { useMemo, useState } from "react";

const API_BASE = (import.meta.env?.VITE_API_BASE?.trim?.() || "https://backend-spainroom.onrender.com").replace(/\/+$/,"");
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && (window.isSecureContext || location.hostname === "localhost")) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.left = "-9999px";
    document.body.appendChild(ta); ta.focus(); ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}

const badgeStyle = (cat) => {
  const map = {
    si:      { bg:"#ef4444", text:"Obligatorio" },
    depende: { bg:"#f59e0b", text:"Depende" },
    no:      { bg:"#16a34a", text:"No obligatorio" },
  };
  const it = map[(cat||"").toLowerCase()] || { bg:"#64748b", text:"—" };
  return { ...it, css: { background: it.bg, color:"#fff", padding:"6px 10px", borderRadius:10, fontWeight:800 } };
};

export default function VerificacionCedula() {
  // Contacto
  const [nombre, setNombre]       = useState("");
  const [telefono, setTelefono]   = useState("");

  // Dirección / refs
  const [direccion, setDireccion] = useState("Calle Mayor 1");
  const [refCat, setRefCat]       = useState("");
  const [cedulaNum, setCedulaNum] = useState(""); // NUEVO: nº cédula opcional
  const [email, setEmail]         = useState("");
  const [municipio, setMunicipio] = useState("Madrid");
  const [provincia, setProvincia] = useState("Madrid");
  const [cp, setCP]               = useState("");

  // Adjuntos
  const [file, setFile]           = useState(null);

  // Estado UI
  const [busy, setBusy]           = useState(false);
  const [error, setError]         = useState("");
  const [ok, setOk]               = useState(null);

  // Resultados
  const [refcatFinal, setRefcatFinal] = useState(null);
  const [catastroInfo, setCatastroInfo] = useState(null);
  const [requirement, setRequirement] = useState(null);
  const [cedulaStatus, setCedulaStatus] = useState(null);

  const validoRef = useMemo(
    () => /^[A-Za-z0-9]{20}$/.test((refCat || "").trim()),
    [refCat]
  );

  const telDigits = () => (telefono || "").replace(/\s+/g, "");

  const postJSON = async (path, body) => {
    const r = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY },
      body: JSON.stringify(body || {})
    });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
    return j;
  };

  const uploadCopy = async (check_id, file) => {
    const fd = new FormData();
    fd.append("check_id", String(check_id));
    fd.append("file", file, file.name);
    const r = await fetch(`${API_BASE}/api/owner/cedula/upload`, {
      method: "POST",
      headers: { "X-Admin-Key": ADMIN_KEY },
      body: fd
    });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
    return j;
  };

  const requireContact = () => {
    const n = (nombre||"").trim();
    const t = telDigits();
    if (n.split(" ").length < 2) { setError("Introduce tu nombre completo."); return false; }
    if (!/^\+?\d{9,15}$/.test(t)) { setError("Introduce un teléfono válido (9–15 dígitos, opcional +34)."); return false; }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    setRequirement(null); setCatastroInfo(null); setCedulaStatus(null);

    if (!requireContact()) { setBusy(false); return; }

    const hasRef = !!refCat.trim();
    const hasDir = !!direccion.trim() && !!municipio.trim() && !!provincia.trim();
    if (!hasRef && !hasDir) { setBusy(false); setError("Indica dirección+municipio+provincia o referencia catastral."); return; }
    if (hasRef && !validoRef) { setBusy(false); setError("La referencia catastral debe tener 20 caracteres alfanuméricos."); return; }

    try {
      // 1) Registro (no bloquea si falla)
      let check_id = null;
      try {
        const lead = await postJSON("/api/owner/check", {
          tipo:"check_cedula", via: hasRef ? "catastro" : "direccion", status:"pendiente",
          nombre, telefono: telDigits(), email,
          direccion: hasDir ? direccion : undefined, cp: hasDir ? cp : undefined,
          municipio: hasDir ? municipio : undefined, provincia: hasDir ? provincia : undefined,
          refcat: hasRef ? refCat : undefined
        });
        if (lead?.ok) { check_id = lead.id; setOk({ id: lead.id, ts: new Date().toISOString() }); }
      } catch {}

      // 2) Resolver refcat (estricto: puede no resolverse)
      let refcatResolved = hasRef ? refCat.trim() : null;
      if (!refcatResolved && hasDir) {
        try {
          const res = await postJSON("/api/catastro/resolve_direccion", { direccion, municipio, provincia, cp });
          refcatResolved = res?.refcat || null; // puede ser undefined si Catastro está en 503
          setRefcatFinal(refcatResolved);
        } catch { /* Catastro no disponible → seguimos */ }
      } else {
        setRefcatFinal(refcatResolved);
      }

      // 3) Info catastral (opcional; ignora 503 en modo estricto)
      if (refcatResolved) {
        try {
          const c = await postJSON("/api/catastro/consulta_refcat", { refcat: refcatResolved });
          if (c?.ok) setCatastroInfo({ uso: c.uso, superficie_m2: c.superficie_m2, antiguedad: c.antiguedad });
        } catch {}
      }

      // 3.b) ¿Tiene cédula en vigor? (refcat o nº de cédula; si no hay, “No consta”)
      try {
        const payload = {};
        if (refcatResolved) payload.refcat = refcatResolved;
        else if ((cedulaNum || "").trim()) payload.cedula_numero = (cedulaNum || "").trim();

        if (payload.refcat || payload.cedula_numero) {
          const cc = await postJSON("/api/legal/cedula/check", payload);
          if (cc?.ok) {
            setCedulaStatus({
              has_doc: !!cc.has_doc,
              status: cc.status,                 // "vigente" | "caducada" | "no_consta" | "pendiente"
              expires_at: cc?.data?.expires_at || null
            });
          } else {
            setCedulaStatus({ has_doc:false, status:"no_consta", expires_at:null });
          }
        } else {
          setCedulaStatus({ has_doc:false, status:"no_consta", expires_at:null });
        }
      } catch {
        setCedulaStatus({ has_doc:false, status:"no_consta", expires_at:null });
      }

      // 4) Requirement (municipio → provincia)
      try {
        const req = await postJSON("/api/legal/requirement", {
          municipio: hasDir ? municipio : null,
          provincia: hasDir ? provincia : (provincia || null)
        });
        if (req?.ok && req.requirement) setRequirement(req.requirement);
      } catch {}

      // 5) Upload opcional
      if (check_id && file) { try { await uploadCopy(check_id, file); } catch {} }

    } catch (errAny) {
      setError("No se pudo completar la verificación ahora mismo.");
    } finally {
      setBusy(false);
    }
  };

  const renderRequirement = () => {
    if (!requirement) return null;
    const it = badgeStyle(requirement.cat);
    return (
      <div style={{marginTop:12, background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:12, padding:12}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8}}>
          <strong style={{color:"#0b1220"}}>Requisito</strong>
          <span style={it.css}>{it.text}</span>
        </div>
        <div style={{marginTop:8, color:"#0b1220"}}>
          <div><b>Documento:</b> {requirement.doc || "—"}</div>
          <div><b>Organismo:</b> {requirement.org || "—"}</div>
          <div><b>Vigencia:</b> {requirement.vig || "—"}</div>
          <div><b>Notas:</b> {requirement.notas || "—"}</div>
          {requirement.link ? <div><b>Enlace:</b> <a href={requirement.link} target="_blank" rel="noreferrer">{requirement.link}</a></div> : null}
        </div>
      </div>
    );
  };

  const renderCedulaStatus = () => {
    if (!cedulaStatus) return null;
    let txt = "No consta";
    if (cedulaStatus.status === "vigente") txt = "Sí (vigente)";
    else if (cedulaStatus.status === "caducada") txt = "No (caducada)";
    else if (cedulaStatus.status === "pendiente") txt = "Pendiente de verificación";
    return (
      <div style={{marginTop:12, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, padding:12}}>
        <div style={{fontWeight:800, color:"#0b1220"}}>Tiene cédula</div>
        <div style={{marginTop:6, color:"#0b1220"}}>
          <b>Estado:</b> {txt}
          {cedulaStatus.expires_at ? (
            <span> — <b>Caduca:</b> {cedulaStatus.expires_at}</span>
          ) : null}
        </div>
      </div>
    );
  };

  const renderCatastro = () => {
    if (!refcatFinal && !catastroInfo) return null;
    return (
      <div style={{marginTop:12, background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:12}}>
        <div style={{fontWeight:800, color:"#0b1220"}}>Datos catastrales (informativo)</div>
        {refcatFinal && <div style={{marginTop:6}}><b>Ref. catastral:</b> {refcatFinal}</div>}
        {catastroInfo && (
          <div style={{marginTop:6}}>
            <div><b>Uso:</b> {catastroInfo.uso ?? "—"}</div>
            <div><b>Superficie:</b> {catastroInfo.superficie_m2 ?? "—"} m²</div>
            <div><b>Antigüedad:</b> {catastroInfo.antiguedad ?? "—"}</div>
          </div>
        )}
      </div>
    );
  };

  const mailtoHref = () => {
    const subject = encodeURIComponent(`Verificación SpainRoom ${ok?.id || ""}`);
    const body = encodeURIComponent(
      `ID: ${ok?.id || "(pendiente)"}\n` +
      `Nombre: ${nombre || "-"}\n` +
      `Teléfono: ${telefono || "-"}\n` +
      `Dirección: ${direccion || "-"}\n` +
      `Ref. catastral: ${(refcatFinal || refCat || "-")}\n` +
      `Nº cédula: ${(cedulaNum || "-")}\n` +
      `Email: ${email || "-"}\n` +
      `Municipio: ${municipio || "-"}\n` +
      `Provincia: ${provincia || "-")}\n` + // ← ojo: cierra comillas en tu dato real si no usas template literal
      `Requirement: ${(requirement?.cat || "-")} / ${requirement?.doc || ""}\n` +
      `Tiene cédula: ${cedulaStatus ? (cedulaStatus.status === "vigente" ? "Sí" : cedulaStatus.status === "caducada" ? "No (caducada)" : cedulaStatus.status === "pendiente" ? "Pendiente" : "No consta") : "-"}\n` +
      `${cedulaStatus?.expires_at ? "Caduca: " + cedulaStatus.expires_at : ""}\n`
    );
    return `mailto:propietarios@spainroom.es?subject=${subject}&body=${body}`;
  };

  const inputStyle = { width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10 };

  return (
    <div id="verificacion" style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16 }}>
      <h3 style={{ margin:"0 0 6px", color:"#0b1220" }}>Comprobar cédula y requisitos</h3>
      <p className="note" style={{ margin:"0 0 10px", color:"#334155" }}>
        Indica <b>dirección + municipio + provincia</b> (o <b>referencia catastral</b>) y, si lo tienes, el <b>nº de cédula</b>.
        Te devolvemos un <strong>ID</strong>, el <strong>requisito legal</strong> y si <strong>tiene cédula en vigor</strong>.
      </p>

      <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={{color:"#0b1220"}}>Nombre completo *</label>
            <input value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder="Tu nombre y apellidos" style={inputStyle} />
          </div>
          <div>
            <label style={{color:"#0b1220"}}>Teléfono *</label>
            <input value={telefono} onChange={(e)=>setTelefono(e.target.value)} placeholder="+34 6XX XXX XXX" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={{color:"#0b1220"}}>Dirección (portal, piso…)</label>
          <input value={direccion} onChange={(e)=>setDireccion(e.target.value)} placeholder="Calle / Plaza / Avda…" style={inputStyle} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
          <div>
            <label style={{color:"#0b1220"}}>CP (opcional)</label>
            <input value={cp} onChange={(e)=>setCP(e.target.value)} placeholder="28001" style={inputStyle} />
          </div>
          <div>
            <label style={{color:"#0b1220"}}>Municipio</label>
            <input value={municipio} onChange={(e)=>setMunicipio(e.target.value)} placeholder="Madrid" style={inputStyle} />
          </div>
          <div>
            <label style={{color:"#0b1220"}}>Provincia</label>
            <input value={provincia} onChange={(e)=>setProvincia(e.target.value)} placeholder="Madrid" style={inputStyle} />
          </div>
          <div>
            <label style={{color:"#0b1220"}}>Ref. catastral (20 chars)</label>
            <input value={refCat} onChange={(e)=>setRefCat(e.target.value)} placeholder="XXXXXXXXXXXXYYYYYY" maxLength={20} style={inputStyle} />
            {!!refCat && !validoRef && <div style={{color:"#b91c1c", marginTop:6}}>Formato no válido (20 alfanuméricos).</div>}
          </div>
        </div>

        <div>
          <label style={{color:"#0b1220"}}>Nº de cédula (opcional)</label>
          <input value={cedulaNum} onChange={(e)=>setCedulaNum(e.target.value)} placeholder="C-2023-12345" style={inputStyle} />
        </div>

        <div>
          <label style={{color:"#0b1220"}}>Adjuntar escritura/cédula (PDF/JPG/PNG) — uso interno</label>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", flexWrap:"wrap" }}>
          <a href="#mapa" style={{ display:"inline-block", background:"#fff", color:"#0A58CA", border:"1px solid #0A58CA", padding:"10px 14px", borderRadius:10, fontWeight:800, textDecoration:"none" }}>
            Ver mapa por provincia
          </a>
          <button type="submit" disabled={busy}
                  style={{ background: busy ? "#6b7280" : "#0A58CA", color:"#fff", border:"none", padding:"10px 14px", borderRadius:10, fontWeight:800, cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Comprobando..." : "Comprobar"}
          </button>
        </div>

        {error && <div style={{ color:"#b91c1c" }}>{error}</div>}

        {ok && (
          <div style={{ marginTop:12, background:"#eef2ff", border:"1px solid #e0e7ff", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:800, color:"#0b1220" }}>ID de verificación: {ok.id}</div>
            <div className="note" style={{ color:"#334155" }}>Usa este ID como referencia con el equipo.</div>
            <div style={{ display:"flex", gap:10, marginTop:8, flexWrap:"wrap" }}>
              <button
                type="button"
                onClick={async ()=>{
                  const okc = await copyToClipboard(ok.id);
                  alert(okc ? "ID copiado al portapapeles" : "No se pudo copiar. Copia manualmente.");
                }}
                style={{ background:"#fff", color:"#0A58CA", border:"1px solid #0A58CA", padding:"8px 12px", borderRadius:10, fontWeight:800 }}
              >
                Copiar ID
              </button>
              <a
                href={mailtoHref()}
                style={{ display:"inline-block", background:"#0A58CA", color:"#fff", padding:"8px 12px", borderRadius:10, fontWeight:800, textDecoration:"none" }}
              >
                Enviar por email
              </a>
            </div>

            {renderRequirement()}
            {renderCedulaStatus()}
            {renderCatastro()}
          </div>
        )}
      </form>

      <div className="note" style={{ marginTop:10, color:"#334155" }}>
        *Este resultado no sustituye resolución oficial. Si lo necesitas, te ayudamos a tramitarla con tu Ayuntamiento/CCAA.
      </div>
    </div>
  );
}
