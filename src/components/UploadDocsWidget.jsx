// src/components/UploadDocsWidget.jsx
import React, { useRef, useState } from "react";

const API_BASE  = import.meta.env?.VITE_API_BASE  || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

/**
 * UploadDocsWidget
 * props:
 *  - role: "tenant" | "owner"
 *  - subjectId: identificador lógico (p.ej. teléfono verificado o email)
 *  - categories: array de { key, label, accept } (p.ej. dni_frontal, dni_reverso, selfie, factura_movil)
 *  - allowSelfie: boolean (si true muestra botón de captura con cámara)
 */
export default function UploadDocsWidget({ role="tenant", subjectId="", categories=[], allowSelfie=false }) {
  const [status, setStatus] = useState(null); // {ok,msg}
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  async function uploadFile(category, file) {
    setStatus(null); setLoading(true);
    try{
      const fd = new FormData();
      fd.append("role", role);
      fd.append("subject_id", subjectId || "");
      fd.append("category", category);
      fd.append("file", file, file.name || `${category}.jpg`);

      const r = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        headers: { "X-Admin-Key": ADMIN_KEY },
        body: fd
      });
      const j = await r.json().catch(()=> ({}));
      if (!r.ok || !j?.ok) throw new Error(j?.error || "error subiendo");
      setStatus({ok:true, msg:`Subido: ${category}`});
    }catch(e){
      setStatus({ok:false, msg: `Fallo: ${String(e.message || e)}`});
    }finally{
      setLoading(false);
    }
  }

  async function handleFileChange(cat, e){
    const file = e.target.files?.[0];
    if (file) await uploadFile(cat, file);
    e.target.value = "";
  }

  async function startCamera(){
    try{
      const st = await navigator.mediaDevices.getUserMedia({ video:true, audio:false });
      setStream(st);
      if (videoRef.current) {
        videoRef.current.srcObject = st;
        await videoRef.current.play();
      }
    }catch(e){
      setStatus({ok:false, msg:"No se pudo abrir la cámara"});
    }
  }
  function stopCamera(){
    try{ stream?.getTracks()?.forEach(t=>t.stop()); }catch{}
    setStream(null);
  }
  async function captureSelfie(){
    if (!videoRef.current) return;
    const cv = document.createElement("canvas");
    cv.width  = videoRef.current.videoWidth  || 640;
    cv.height = videoRef.current.videoHeight || 480;
    cv.getContext("2d").drawImage(videoRef.current, 0, 0, cv.width, cv.height);
    cv.toBlob(async (blob)=>{
      if (blob) {
        const file = new File([blob], "selfie.jpg", { type:"image/jpeg" });
        await uploadFile("selfie", file);
      }
    }, "image/jpeg", 0.9);
  }

  return (
    <div style={{border:"1px solid #e2e8f0", borderRadius:16, padding:16, background:"#fff"}}>
      <h4 style={{margin:"0 0 8px"}}>Subir documentación</h4>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        {categories.map(cat=>(
          <div key={cat.key} style={{display:"grid", gap:6}}>
            <label style={{fontWeight:600}}>{cat.label}</label>
            <input type="file" accept={cat.accept || "*"} onChange={e=>handleFileChange(cat.key, e)} />
          </div>
        ))}
      </div>

      {allowSelfie && (
        <div style={{marginTop:12, borderTop:"1px dashed #e2e8f0", paddingTop:12}}>
          <div style={{fontWeight:600, marginBottom:6}}>Selfie (opcional)</div>
          {!stream ? (
            <button className="sr-tab" style={{background:"#0A58CA", color:"#fff"}} onClick={startCamera}>Abrir cámara</button>
          ) : (
            <div style={{display:"grid", gap:8}}>
              <video ref={videoRef} style={{maxWidth:320, borderRadius:12, border:"1px solid #cbd5e1"}} />
              <div style={{display:"flex", gap:8}}>
                <button className="sr-tab" style={{background:"#0A58CA", color:"#fff"}} onClick={captureSelfie}>Capturar y subir</button>
                <button className="sr-tab" style={{background:"#fff", color:"#0A58CA", border:"1px solid #0A58CA"}} onClick={stopCamera}>Cerrar cámara</button>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && <div style={{marginTop:8, color:"#0b1220", opacity:.8}}>Subiendo…</div>}
      {status && <div style={{marginTop:8, color: status.ok ? "#065f46" : "#b91c1c"}}>{status.msg}</div>}
      <div style={{marginTop:8, color:"#475569", fontSize:12}}>
        * Los documentos se guardan en un área privada y se vinculan a tu expediente.
      </div>
    </div>
  );
}
