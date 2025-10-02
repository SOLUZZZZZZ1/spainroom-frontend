// src/components/ContactForm.jsx
import React, { useState } from "react";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function normPhone(v=""){
  const s = String(v).replace(/[^\d+]/g,"");
  if (!s) return "";
  if (s.startsWith("+")) return s;
  if (s.startsWith("34")) return "+"+s;
  if (/^\d{9,15}$/.test(s)) return "+34"+s;
  return s;
}

export default function ContactForm(){
  const [data, setData] = useState({ nombre:"", email:"", telefono:"", zona:"", mensaje:"" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  function onChange(e){
    const { name, value } = e.target;
    setData(d => ({...d, [name]: value }));
  }

  function validate(){
    if ((data.nombre||"").trim().split(" ").length < 2) return "Escribe tu nombre y apellidos.";
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) return "Email no válido.";
    if (!data.mensaje || data.mensaje.trim().length < 10) return "Cuéntanos brevemente en qué podemos ayudarte (mín. 10 caracteres).";
    return "";
  }

  async function send(){
    setMsg(""); setOk(false);
    const err = validate();
    if (err){ setMsg(err); return; }
    setBusy(true);
    try{
      const payload = {
        tipo: "oportunidades",
        nombre: data.nombre.trim(),
        email: (data.email||"").trim(),
        telefono: normPhone(data.telefono||""),
        zona: (data.zona||"").trim(),
        mensaje: data.mensaje.trim(),
        via: "web_faq_contacto"
      };
      const res = await fetch(`${API}/api/contacto/oportunidades`, {
        method: "POST",
        headers: { "Content-Type":"application/json", "Accept":"application/json" },
        body: JSON.stringify(payload)
      });
      const j = await res.json().catch(()=> ({}));
      if (!res.ok || j?.ok !== true) throw new Error(j?.error || "No se pudo enviar el mensaje");
      setOk(true);
      setMsg("¡Gracias! Hemos recibido tu solicitud. Te responderemos pronto.");
      setData({ nombre:"", email:"", telefono:"", zona:"", mensaje:"" });
    }catch(e){
      setOk(false);
      setMsg(e.message || "No se pudo enviar el mensaje");
    }finally{
      setBusy(false);
    }
  }

  const label = { display:"block", margin:"10px 0 6px", fontWeight:600, color:"#0b1220" };
  const input = { width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" };
  const card  = { background:"#fff", border:"1px solid #e6ebf3", borderRadius:12, padding:16 };

  return (
    <div style={card}>
      <div style={{marginBottom:8, fontWeight:800, color:"#0b1220"}}>Formulario de contacto</div>
      <label style={label}>Nombre completo *</label>
      <input name="nombre" value={data.nombre} onChange={onChange} style={input} placeholder="Nombre y apellidos" />

      <div style={{display:"grid", gap:10, gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
        <div>
          <label style={label}>Email</label>
          <input name="email" value={data.email} onChange={onChange} style={input} type="email" placeholder="tu@email.com" />
        </div>
        <div>
          <label style={label}>Teléfono</label>
          <input name="telefono" value={data.telefono} onChange={onChange} style={input} inputMode="tel" placeholder="+34 6XX XXX XXX" />
        </div>
      </div>

      <label style={label}>Zona / sector (opcional)</label>
      <input name="zona" value={data.zona} onChange={onChange} style={input} placeholder="Provincia, municipio o sector" />

      <label style={label}>Mensaje *</label>
      <textarea name="mensaje" value={data.mensaje} onChange={onChange} style={{...input, minHeight:120}} placeholder="Cuéntanos tu caso en pocas líneas..." />

      <div style={{display:"flex", gap:10, marginTop:12, flexWrap:"wrap"}}>
        <button onClick={send} disabled={busy} style={{ background:"#0A58CA", color:"#fff", border:"none", padding:"10px 14px", borderRadius:12, fontWeight:800 }}>
          {busy ? "Enviando…" : "Enviar"}
        </button>
      </div>

      {msg && (
        <div style={{ marginTop:10, padding:"8px 12px", borderRadius:10, border:`1px solid ${ok ? "#16a34a55" : "#dc262655"}`, background: ok ? "#e8f8ef" : "#fdecea", color:"#0b1220" }}>
          {msg}
        </div>
      )}
    </div>
  );
}
