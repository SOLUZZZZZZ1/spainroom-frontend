// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const { requestOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState("phone"); // phone | code
  const [phone, setPhone] = useState("");
  const [code, setCode]   = useState("");
  const [err, setErr]     = useState("");
  const [ok, setOk]       = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // segundos

  useEffect(() => {
    let t;
    if (cooldown > 0) t = setTimeout(()=>setCooldown(cooldown-1), 1000);
    return () => t && clearTimeout(t);
  }, [cooldown]);

  const normalizePhone = (p="") => {
    const d = String(p).replace(/[^\d+]/g,"").trim();
    if (d.startsWith("+")) return d;
    if (d.startsWith("34")) return "+"+d;
    if (/^\d{9,15}$/.test(d)) return "+34"+d;
    return d;
  };

  const onRequest = async (e) => {
    e.preventDefault(); setErr(""); setOk("");
    const ph = normalizePhone(phone);
    if (!/^\+?\d{9,15}$/.test(ph)) { setErr("Introduce un teléfono válido (+34 6XX...)"); return; }
    setLoading(true);
    try {
      const res = await requestOtp(ph);
      setOk(`Código enviado. ${res?.hint ? "Número: "+res.hint : ""}`);
      setStep("code");
      setCooldown(30); // reenvío en 30s
    } catch (e) {
      setErr(String(e.message || e));
    } finally { setLoading(false); }
  };

  const onVerify = async (e) => {
    e.preventDefault(); setErr(""); setOk("");
    if (!/^\d{4,8}$/.test(code.trim())) { setErr("Código inválido"); return; }
    setLoading(true);
    try{
      await verifyOtp(phone, code);
      setOk("¡Bienvenido!");
      // redirige a donde quieras (ej. /admin)
      setTimeout(()=> location.href = "/admin", 600);
    }catch(e){ setErr(String(e.message || e)); }
    finally{ setLoading(false); }
  };

  return (
    <main style={{
      minHeight:"calc(100vh - 64px)", display:"grid", placeItems:"center",
      padding:24, background:"linear-gradient(#0b1320,#111827)"
    }}>
      <div style={{
        width:"clamp(320px, 92vw, 520px)",
        background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.18)",
        borderRadius:16, padding:18, color:"#fff", boxShadow:"0 8px 24px rgba(0,0,0,.28)"
      }}>
        <h2 style={{margin:"0 0 8px"}}>Acceso a SpainRoom</h2>
        <p style={{margin:"0 0 12px", opacity:.8}}>
          Entra con tu <b>teléfono</b> — te enviamos un código de verificación por SMS.
        </p>

        {step === "phone" && (
          <form onSubmit={onRequest} style={{display:"grid", gap:12}}>
            <div>
              <label>Teléfono (con prefijo)</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)}
                     placeholder="+34 6XX XXX XXX"
                     style={{width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #334155", background:"#0f172a", color:"#fff"}} />
            </div>
            <div style={{display:"flex", gap:10, justifyContent:"flex-end", alignItems:"center"}}>
              {err && <span style={{color:"#fca5a5"}}>{err}</span>}
              {ok  && <span style={{color:"#86efac"}}>{ok}</span>}
              <button disabled={loading}
                      style={{background:"#0b69c7", color:"#fff", border:"none", padding:"10px 14px", borderRadius:10, fontWeight:800}}>
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </div>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={onVerify} style={{display:"grid", gap:12}}>
            <div>
              <label>Código recibido</label>
              <input value={code} onChange={e=>setCode(e.target.value)} inputMode="numeric"
                     placeholder="123456"
                     style={{width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #334155", background:"#0f172a", color:"#fff"}} />
            </div>
            <div style={{display:"flex", gap:10, justifyContent:"space-between", alignItems:"center"}}>
              <button type="button" disabled={cooldown>0 || loading}
                      onClick={onRequest}
                      style={{background:"#111827", color:"#fff", border:"1px solid #334155", padding:"10px 14px", borderRadius:10}}>
                {cooldown>0 ? `Reenviar (${cooldown}s)` : "Reenviar código"}
              </button>
              <div style={{display:"flex", gap:10, alignItems:"center"}}>
                {err && <span style={{color:"#fca5a5"}}>{err}</span>}
                {ok  && <span style={{color:"#86efac"}}>{ok}</span>}
                <button disabled={loading}
                        style={{background:"#16a34a", color:"#fff", border:"none", padding:"10px 14px", borderRadius:10, fontWeight:800}}>
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
