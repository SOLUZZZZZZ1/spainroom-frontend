// src/pages/Inquilinos.jsx
import React, { useEffect, useRef, useState } from "react";
import SEO from "../components/SEO.jsx";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function Inquilinos(){
  const [nombre, setNombre]   = useState("");
  const [email, setEmail]     = useState("");
  const [telefono, setTel]    = useState("");

  // KYC (selfie obligatorio)
  const [kycSession, setKycSession] = useState(null); // {session_id, token, link}
  const [kycState, setKycState]     = useState("idle"); // idle|pending|verified|expired|declined
  const pollRef = useRef(null);

  // Uploads
  const [dniFrontOK, setDniFrontOK]     = useState(false);
  const [facturaMovilOK, setFacturaOK]  = useState(false);
  const [otrosCount, setOtrosCount]     = useState(0);

  const [subiendo, setSubiendo] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Remesas (próximamente)
  const [showRemesas, setShowRemesas] = useState(false);
  const [amt, setAmt] = useState("");
  const [pais, setPais] = useState("Colombia");

  const subjectId = (telefono || email || "").trim();

  function requireSubject() {
    if (!subjectId) { setErr("Indica teléfono o email antes de subir documentos."); return false; }
    return true;
  }

  // -------------------- KYC (selfie) --------------------
  async function startKyc() {
    setErr(""); setMsg("");
    if (!telefono.trim()){ setErr("Indica tu teléfono para enviar el enlace de selfie."); return; }
    try{
      const r = await fetch(`${API_BASE}/api/kyc/start`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ phone: telefono.trim() })
      });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "No se pudo iniciar KYC.");
      const session = { session_id: j.session_id, token: j.token, link: j.link };
      setKycSession(session);
      localStorage.setItem("kyc_session", JSON.stringify(session));
      setKycState("pending");
      setMsg("Enlace de selfie enviado a tu móvil (si no te llega, usa el link que aparece en pantalla).");

      clearInterval(pollRef.current);
      pollRef.current = setInterval(checkKyc, 4000);
    }catch(e){ setErr(String(e.message||e)); }
  }

  async function checkKyc() {
    try{
      const sess = kycSession || JSON.parse(localStorage.getItem("kyc_session")||"null");
      if (!sess) return;
      const qp = sess.session_id ? `session=${sess.session_id}` : `token=${sess.token}`;
      const r = await fetch(`${API_BASE}/api/kyc/status?${qp}`, { cache:"no-cache" });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "KYC status error");
      if (j.state === "verified"){
        setKycState("verified");
        setMsg("Identidad verificada ✅");
        clearInterval(pollRef.current);
      }else if (j.state === "expired"){
        setKycState("expired");
        setErr("El enlace de selfie ha caducado. Vuelve a solicitarlo.");
        clearInterval(pollRef.current);
      }else if (j.state === "declined"){
        setKycState("declined");
        setErr("Verificación rechazada. Revisa luz/rostro/documento y vuelve a intentarlo.");
        clearInterval(pollRef.current);
      }
    }catch(_){ /* silencio */ }
  }
  useEffect(()=>()=>clearInterval(pollRef.current),[]);

  // -------------------- Uploads --------------------
  async function uploadOne(cat, file){
    if (!requireSubject()) return false;
    if (!file) return false;
    setSubiendo(true); setErr(""); setMsg("");
    try{
      const fd = new FormData();
      fd.append("role", "tenant");
      fd.append("subject_id", subjectId);
      fd.append("category", cat); // dni_front | factura_movil | otros
      fd.append("file", file, file.name || `${cat}.bin`);
      const r = await fetch(`${API_BASE}/api/upload`, { method:"POST", body: fd });
      const j = await r.json().catch(()=> ({}));
      if (!r.ok || !j?.ok) throw new Error(j?.error || `HTTP ${r.status}`);
      if (cat === "dni_front") setDniFrontOK(true);
      if (cat === "factura_movil") setFacturaOK(true);
      if (cat === "otros") setOtrosCount(c => c+1);
      setMsg(`Subido: ${cat}`);
      return true;
    }catch(e){ setErr(String(e.message||e)); return false; }
    finally{ setSubiendo(false); }
  }

  async function onSelectFile(cat, e){
    const files = Array.from(e.target.files || []);
    for (const f of files) await uploadOne(cat, f);
    e.target.value = "";
  }

  // -------------------- Envío de alta --------------------
  async function onSubmit(e){
    e.preventDefault(); setErr(""); setMsg("");
    if (kycState !== "verified"){ setErr("Debes completar el selfie de verificación primero."); return; }
    if (!dniFrontOK){ setErr("Debes subir el DNI/NIE/Pasaporte (frontal)."); return; }
    if (!facturaMovilOK){ setErr("Debes subir la factura del móvil del número declarado."); return; }

    try{
      const body = { nombre, email, telefono, via:"web_tenant_prerequest" };
      const r = await fetch(`${API_BASE}/api/contacto/tenants`, {
        method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body)
      });
      if (!r.ok) throw new Error("backend");
      setMsg("Solicitud enviada. Te contactaremos muy pronto.");
      setNombre(""); setEmail(""); setTel("");
      setKycSession(null); setKycState("idle"); localStorage.removeItem("kyc_session");
      setDniFrontOK(false); setFacturaOK(false); setOtrosCount(0);
    }catch(_){
      setMsg("Solicitud enviada (demo). Te contactaremos muy pronto.");
    }
  }

  // -------------------- UI --------------------
  const card = { background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16 };

  const estimarDestino = (euros) => {
    const valor = Number(euros||0);
    if (!valor || valor<=0) return "-";
    // DEMO: tipo 1€ = 1.05 USD; comisión 2.5%
    const usd = valor * 1.05;
    const neto = usd * 0.975;
    return `≈ ${neto.toFixed(2)} USD (demo)`;
  };

  return (
    <div className="sr-scope container" style={{ padding:"24px 0" }}>
      {/* Scoped CSS con !important para vencer temas globales */}
      <style>{`
        .sr-scope, .sr-scope * { color: #111 !important; }
        .sr-scope a { color: #0A58CA !important; text-decoration: none; }
        .sr-scope ::placeholder { color: #555 !important; opacity: 1 !important; }
        /* Estados / mensajes con prioridad sobre la regla general */
        .sr-scope .sr-success { color: #065f46 !important; }
        .sr-scope .sr-error { color: #b91c1c !important; }
        .sr-scope .sr-warning { color: #b45309 !important; }
        .sr-scope .sr-ok { color: #16a34a !important; }
        /* Botones */
        .sr-scope .btn-primary { color: #fff !important; background: #0A58CA !important; border: none !important; }
        .sr-scope .btn-outline { color: #0A58CA !important; background: #fff !important; border: 1px solid #0A58CA !important; }
        .sr-scope .btn-disabled { color: #fff !important; background: #a3a3a3 !important; border: none !important; }
        /* Inputs/selects */
        .sr-scope input, .sr-scope select, .sr-scope textarea {
          color: #111 !important;
          border: 1px solid #cbd5e1 !important;
        }
      `}</style>

      <SEO title="Inquilinos — SpainRoom" description="Alta con verificación de identidad (selfie) y subida de documentación." />

      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap"}}>
        <h2 style={{ margin:"0 0 8px" }}>Inquilinos</h2>
        <a href="/dashboard/inquilino" className="btn-primary" style={{display:"inline-block", padding:"10px 14px",
                   borderRadius:10, fontWeight:900}}>
          Mi habitación
        </a>
      </div>

      <p className="note">Documentación obligatoria: <b>DNI/NIE/Pasaporte</b>, <b>factura de móvil</b> y <b>selfie</b> (verificación de identidad).</p>

      {/* Alta con KYC y documentos */}
      <form onSubmit={onSubmit} className="sr-card" style={{ display:"grid", gap:12, maxWidth: 920, ...card }}>
        {/* Datos básicos */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          <div>
            <label>Nombre y apellidos</label>
            <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre completo"
                   style={{ width:"100%", padding:"10px 12px", borderRadius:10 }}/>
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com"
                   style={{ width:"100%", padding:"10px 12px", borderRadius:10 }}/>
          </div>
          <div>
            <label>Teléfono (para selfie y factura)</label>
            <input value={telefono} onChange={e=>setTel(e.target.value)} placeholder="+34 6XX XXX XXX"
                   style={{ width:"100%", padding:"10px 12px", borderRadius:10 }}/>
          </div>
        </div>

        {/* KYC (selfie) */}
        <div style={{ display:"grid", gap:10, border:"1px dashed #cbd5e1", borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:800 }}>Verificación de identidad (selfie obligatorio)</div>
          <div className="note">Recibirás un enlace a tu móvil para realizar el selfie en directo.</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button type="button" onClick={startKyc}
                    className="btn-primary"
                    style={{ padding:"12px 16px", borderRadius:12, fontWeight:900 }}>
              Enviar enlace para selfie
            </button>
            {kycSession?.link && (
              <a href={kycSession.link} target="_blank" rel="noopener noreferrer"
                 className="btn-outline"
                 style={{ padding:"12px 16px", borderRadius:12, fontWeight:900 }}>
                Abrir enlace (si no llega el SMS)
              </a>
            )}
          </div>
          <div>
            Estado:{" "}
            {kycState==="idle"     && <b>pendiente</b>}
            {kycState==="pending"  && <b>esperando selfie…</b>}
            {kycState==="verified" && <b className="sr-ok">verificado ✅</b>}
            {kycState==="expired"  && <b className="sr-error">enlace caducado</b>}
            {kycState==="declined" && <b className="sr-error">rechazado</b>}
          </div>
        </div>

        {/* Subida de documentos */}
        <div style={{ display:"grid", gap:12 }}>
          <div style={{ fontWeight:800 }}>Documentación</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label>DNI / NIE / Pasaporte (frontal) — <b>Obligatorio</b></label>
              <input type="file" accept=".pdf,image/*" onChange={e=>onSelectFile("dni_front", e)}/>
              {dniFrontOK ? <div className="sr-success">Subido ✅</div> : <div className="note">Sube una imagen legible o PDF.</div>}
            </div>
            <div>
              <label>Factura del móvil (número declarado) — <b>Obligatorio</b></label>
              <input type="file" accept=".pdf,image/*" onChange={e=>onSelectFile("factura_movil", e)}/>
              {facturaMovilOK ? <div className="sr-success">Subida ✅</div> : <div className="note">PDF o imagen clara.</div>}
            </div>
            <div>
              <label>Otros documentos (opcional)</label>
              <input type="file" accept=".pdf,image/*" multiple onChange={e=>onSelectFile("otros", e)}/>
              {otrosCount>0 && <div className="sr-success">{otrosCount} fichero(s) subido(s)</div>}
            </div>
          </div>
        </div>

        {/* Enviar alta */}
        <div style={{ display:"flex", gap:10, justifyContent:"space-between", alignItems:"center", flexWrap:"wrap" }}>
          <span className="note">
            Necesitas: Selfie verificado + DNI/NIE/Pasaporte + factura del móvil
          </span>
          <button type="submit"
                  disabled={kycState!=="verified" || !dniFrontOK || !facturaMovilOK || subiendo}
                  className={(kycState==="verified" && dniFrontOK && facturaMovilOK && !subiendo) ? "btn-primary" : "btn-disabled"}
                  style={{ padding:"12px 16px", borderRadius:12, fontWeight:900 }}>
            {subiendo ? "Subiendo…" : "Enviar alta"}
          </button>
        </div>

         {err && <div className="sr-error">{err}</div>}
        {msg && <div className="sr-success">{msg}</div>}
      </form>
    </div>
  );
}