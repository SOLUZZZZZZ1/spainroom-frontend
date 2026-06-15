// src/components/VerificacionCedula.jsx
import React, { useMemo, useState } from "react";

const API_BASE = (import.meta.env?.VITE_API_BASE?.trim?.() || "https://backend-spainroom.onrender.com").replace(/\/+$/,"");
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

// util: copiar al portapapeles
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
  const map = { si:{bg:"#ef4444",text:"Obligatorio"}, depende:{bg:"#f59e0b",text:"Depende"}, no:{bg:"#16a34a",text:"No obligatorio"} };
  const it = map[(cat || "").toLowerCase()] || { bg:"#64748b", text:"—" };
  return { ...it, css: { background: it.bg, color:"#fff", padding:"6px 10px", borderRadius:10, fontWeight:800 } };
};

export default function VerificacionCedula() {
  // contacto
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  // dirección / identificadores
  const [direccion, setDireccion] = useState("");
  const [cp, setCP] = useState("");                 // ← CP visible
  const [municipio, setMunicipio] = useState("");
  const [provincia, setProvincia] = useState("");
  const [refCat, setRefCat] = useState("");         // 20 chars
  const [cedulaNum, setCedulaNum] = useState("");   // opcional
  const [email, setEmail] = useState("");

  // adjunto
  const [file, setFile] = useState(null);

  // estado UI
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(null);               // id verificación

  // resultados
  const [requirement, setRequirement] = useState(null);
  const [cedulaStatus, setCedulaStatus] = useState(null);
  const [refcatFinal, setRefcatFinal] = useState(null);
  const [catastroInfo, setCatastroInfo] = useState(null);

  const validoRef = useMemo(() => /^[A-Za-z0-9]{20}$/.test((refCat || "").trim()), [refCat]);
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

  const uploadCopy = async (check_id, fileObj) => {
    const fd = new FormData();
    fd.append("check_id", String(check_id));
    fd.append("file", fileObj, fileObj.name);
    const r = await fetch(`${API_BASE}/api/owner/cedula/upload`, { method:"POST", headers:{ "X-Admin-Key": ADMIN_KEY }, body: fd });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
    return j;
  };

  const requireContact = () => {
    const n = (nombre || "").trim();
    const t = telDigits();
    if (n.split(" ").length < 2) { setError("Introduce tu nombre completo."); return false; }
    if (!/^\+?\d{9,15}$/.test(t)) { setError("Introduce un teléfono válido (9–15 dígitos; opcional +34)."); return false; }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    // limpia resultados y asegura que el bloque se vea
    setRequirement(null);
    setRefcatFinal(null);
    setCatastroInfo(null);
    setCedulaStatus({ has_doc:false, status:"no_consta", expires_at:null });
    setOk(null);

    if (!requireContact()) { setBusy(false); return; }

    const hasRef = !!refCat.trim();
    const hasDir = !!direccion.trim() && !!municipio.trim() && !!provincia.trim();

    if (!hasRef && !hasDir) {
      setBusy(false); setError("Indica dirección + municipio + provincia o referencia catastral."); return;
    }
    if (hasRef && !validoRef) {
      setBusy(false); setError("La referencia catastral debe tener 20 caracteres alfanuméricos."); return;
    }

    try {
      // 1) registro
      try {
        const lead = await postJSON("/api/owner/check", {
          tipo:"check_cedula", via: hasRef ? "catastro" : "direccion", status:"pendiente",
          nombre, telefono: telDigits(), email,
          direccion: hasDir ? direccion : undefined,
          cp: hasDir ? cp : undefined,
          municipio: hasDir ? municipio : undefined,
          provincia: hasDir ? provincia : undefined,
          refcat: hasRef ? refCat : undefined
        });
        if (lead?.ok) setOk({ id: lead.id, ts: new Date().toISOString() });
      } catch {}

      // 2) resolver refcat si no viene
      let refcatResolved = hasRef ? refCat.trim() : null;
      if (!refcatResolved && hasDir) {
        try {
          const res = await postJSON("/api/catastro/resolve_direccion", { direccion, municipio, provincia, cp });
          refcatResolved = res?.refcat || null;
          setRefcatFinal(refcatResolved);
        } catch { setRefcatFinal(null); }
      } else { setRefcatFinal(refcatResolved); }

      // 3) cédula en vigor (por refcat o nº cédula)
      try {
        const payload = {};
        if (refcatResolved) payload.refcat = refcatResolved;
        else if ((cedulaNum || "").trim()) payload.cedula_numero = cedulaNum.trim();
        if (payload.refcat || payload.cedula_numero) {
          const cc = await postJSON("/api/legal/cedula/check", payload);
          if (cc?.ok) setCedulaStatus({ has_doc: !!cc.has_doc, status: cc.status, expires_at: cc?.data?.expires_at || null });
        }
      } catch {}

      // 4) requisito legal
      try {
        const req = await postJSON("/api/legal/requirement", {
          municipio: hasDir ? municipio : null,
          provincia: hasDir ? provincia : (provincia || null)
        });
        if (req?.ok && req.requirement) setRequirement(req.requirement);
      } catch {}

      // 5) info catastral (opcional)
      if (refcatResolved) {
        try {
          const c = await postJSON("/api/catastro/consulta_refcat", { refcat: refcatResolved });
          if (c?.ok) setCatastroInfo({ uso:c.uso ?? "—", superficie_m2:c.superficie_m2 ?? "—", antiguedad:c.antiguedad ?? "—" });
        } catch {}
      }

      // 6) upload opcional
      if (ok?.id && file) { try { await uploadCopy(ok.id, file); } catch {} }

    } catch { setError("No se pudo completar la verificación ahora mismo."); }
    finally { setBusy(false); }
  };

  // render bloques de resultado
  const renderRequirement = () => {
    if (!requirement) return null;
    const it = badgeStyle(requirement.cat);
    return (
      <div style={{ marginTop:12, background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:12, padding:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
          <strong style={{ color:"#0b1220" }}>Requisito</strong>
          <span style={it.css}>{it.text}</span>
        </div>
        <div style={{ marginTop:8, color:"#0b1220" }}>
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
    let txt = "Pendiente de revisión documental";
    if (cedulaStatus.status === "vigente") txt = "Documento aportado / pendiente de validación";
    else if (cedulaStatus.status === "caducada") txt = "Documento caducado / requiere revisión";
    else if (cedulaStatus.status === "pendiente") txt = "Pendiente de revisión documental";
    return (
      <div style={{ marginTop:12, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, padding:12 }}>
        <div style={{ fontWeight:800, color:"#0b1220" }}>Estado documental</div>
        <div style={{ marginTop:6, color:"#0b1220" }}>
          <b>Estado:</b> {txt}
          {cedulaStatus.expires_at ? (<span> — <b>Fecha informada:</b> {cedulaStatus.expires_at}</span>) : null}
        </div>
        <div style={{ marginTop:8, color:"#475569", lineHeight:1.55 }}>
          SpainRoom ha identificado el inmueble y los requisitos legales aplicables.
          La existencia y vigencia de la cédula de habitabilidad no se confirma automáticamente:
          debe revisarse con la documentación aportada o mediante comprobación posterior.
        </div>
      </div>
    );
  };

  const renderCatastro = () => {
    if (!refcatFinal && !catastroInfo) return null;
    return (
      <div style={{ marginTop:12, background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:12 }}>
        <div style={{ fontWeight:800, color:"#0b1220" }}>Datos catastrales (informativo)</div>
        {refcatFinal ? <div style={{ marginTop:6 }}><b>Ref. catastral:</b> {refcatFinal}</div> : null}
        {catastroInfo ? (
          <div style={{ marginTop:6 }}>
            <div><b>Uso:</b> {catastroInfo.uso ?? "—"}</div>
            <div><b>Superficie:</b> {catastroInfo.superficie_m2 ?? "—"} m²</div>
            <div><b>Antigüedad:</b> {catastroInfo.antiguedad ?? "—"}</div>
          </div>
        ) : null}
      </div>
    );
  };

  // estilos inputs
  const inputStyle = { width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10 };

  return (
    <div id="verificacion" style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16 }}>
      <h3 style={{ margin:"0 0 6px", color:"#0b1220" }}>Verificación previa de habitabilidad</h3>
      <p style={{ color:"#334155", lineHeight:1.6 }}>
        Introduce <b>dirección</b>, <b>CP</b>, <b>municipio</b> y <b>provincia</b>, o una <b>referencia catastral</b>.
        SpainRoom identificará el inmueble, mostrará los <b>requisitos legales aplicables</b>
        y generará un <b>expediente de revisión documental</b>.
        La existencia y vigencia de la cédula deberá confirmarse mediante documentación aportada
        o revisión posterior.
      </p>

      {/* FORMULARIO */}
      <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nombre completo *" style={inputStyle} />
          <input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="Teléfono *" style={inputStyle} />
        </div>

        <input value={direccion} onChange={e=>setDireccion(e.target.value)} placeholder="Dirección (portal, piso…)" style={inputStyle} />

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          <input value={cp} onChange={e=>setCP(e.target.value)} placeholder="CP" style={inputStyle} />           {/* ← CP visible */}
          <input value={municipio} onChange={e=>setMunicipio(e.target.value)} placeholder="Municipio" style={inputStyle} />
          <input value={provincia} onChange={e=>setProvincia(e.target.value)} placeholder="Provincia" style={inputStyle} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <input value={refCat} onChange={e=>setRefCat(e.target.value)} placeholder="Ref. catastral (20 chars)" style={inputStyle} />
          <input value={cedulaNum} onChange={e=>setCedulaNum(e.target.value)} placeholder="Nº de cédula (opcional)" style={inputStyle} />
        </div>

        <div>
          <label style={{ color:"#0b1220", fontSize:12 }}>Adjuntar escritura/cédula (PDF/JPG/PNG) — uso interno</label>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e=>setFile(e.target.files?.[0] || null)} />
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", flexWrap:"wrap" }}>
          <button type="submit" disabled={busy}
                  style={{ background: busy ? "#6b7280" : "#0A58CA", color:"#fff", border:"none", padding:"10px 14px", borderRadius:10, fontWeight:800, cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Revisando..." : "Iniciar revisión"}
          </button>
        </div>

        {error && <div style={{ color:"#b91c1c" }}>{error}</div>}

        {/* BLOQUE DE RESULTADOS (siempre tras enviar) */}
        {(ok || requirement || cedulaStatus || refcatFinal || catastroInfo) && (
          <div style={{ marginTop:12, background:"#eef2ff", border:"1px solid #e0e7ff", borderRadius:12, padding:12 }}>
            {ok && (
              <div style={{ fontWeight:800, color:"#0b1220", marginBottom:6 }}>
                ID de verificación: {ok.id}{" "}
                <button type="button" onClick={async()=>{ const c=await copyToClipboard(ok.id); alert(c?"ID copiado":"No se pudo copiar"); }}
                        style={{ marginLeft:8, background:"#fff", color:"#0A58CA", border:"1px solid #0A58CA", padding:"4px 8px", borderRadius:8, fontWeight:800 }}>
                  Copiar ID
                </button>
              </div>
            )}
            {renderRequirement()}
            {renderCedulaStatus()}
            {renderCatastro()}
          </div>
        )}
      </form>
    </div>
  );
}
