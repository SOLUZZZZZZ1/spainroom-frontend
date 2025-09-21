// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function Login(){
  const nav = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState("+34616XXXXXX"); // preferencia teléfono
  const [email, setEmail] = useState("");             // alternativo
  const [code, setCode]   = useState("");
  const [step, setStep]   = useState(1);
  const [msg, setMsg]     = useState("");

  async function reqOtp(e){
    e.preventDefault(); setMsg("");
    try{
      const r = await fetch(`${API_BASE}/api/auth/request_otp`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ phone: phone || undefined, email: email || undefined })
      });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "No se pudo solicitar OTP");
      setStep(2); setMsg("Código enviado (demo).");
    }catch(e){ setMsg(String(e.message||e)); }
  }
  async function verify(e){
    e.preventDefault(); setMsg("");
    try{
      const r = await fetch(`${API_BASE}/api/auth/verify_otp`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ phone: phone || undefined, email: email || undefined, code })
      });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "OTP no válido");
      login({ token:j.token, user:j.user });
      // Redirección por rol
      if (j.user.role === "admin") nav("/admin", { replace:true });
      else if (j.user.role === "franquiciado") nav("/dashboard/franquiciado", { replace:true });
      else if (j.user.role === "propietario") nav("/dashboard/propietario", { replace:true });
      else nav("/");
    }catch(e){ setMsg(String(e.message||e)); }
  }

  return (
    <div className="container" style={{padding:"24px 0", color:"#0b1220"}}>
      <h2 style={{margin:"0 0 8px"}}>Acceso</h2>
      <p className="note">Introduce tu teléfono o email y te enviaremos un código (OTP).</p>

      {step===1 && (
        <form onSubmit={reqOtp} className="sr-card" style={{maxWidth:520}}>
          <label style={{display:"block", marginBottom:6, fontWeight:600}}>Teléfono</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+34 6XX XXX XXX"
                 style={{width:"100%",padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:10}}/>
          <div style={{margin:"8px 0", color:"#64748b"}}>o utiliza tu email:</div>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com"
                 style={{width:"100%",padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:10}}/>
          <button className="sr-tab" style={{background:"#0A58CA", color:"#fff", border:"none", marginTop:12}}>Enviar código</button>
          {msg && <div style={{marginTop:8}}>{msg}</div>}
        </form>
      )}

      {step===2 && (
        <form onSubmit={verify} className="sr-card" style={{maxWidth:520}}>
          <label style={{display:"block", marginBottom:6, fontWeight:600}}>Código recibido</label>
          <input value={code
