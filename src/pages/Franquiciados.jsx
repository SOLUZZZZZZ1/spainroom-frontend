// src/pages/Franquiciados.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";

const API_BASE = (import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com").replace(/\/$/, "");

export default function Franquiciados() {
  // --------- Estados (login/recuperación) ---------
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // --------- Estados (candidatura) ---------
  const [form, setForm] = useState({
    nombre: "", telefono: "", email: "", dni: "",
    provincia: "", municipio: "",
    motivacion: "", // experiencia + motivación + disponibilidad
    acepta: false,
    company: "" // honeypot (debe quedar vacío)
  });
  const [applyBusy, setApplyBusy] = useState(false);
  const [applyMsg, setApplyMsg] = useState("");
  const [applyOk, setApplyOk] = useState(false);

  // --------- Utils ---------
  const normalizePhone = (v) => {
    const s = String(v||"").replace(/[^0-9+]/g,"");
    if (!s) return "";
    if (s.startsWith("+")) return s;
    if (s.startsWith("34")) return "+"+s;
    if (/^(6|7)\d{8,}$/.test(s)) return "+34"+s;
    return s;
  };

  function onChange(e){
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type==="checkbox" ? !!checked : value }));
  }

  // --------- Acciones ---------
  async function sendPasswordLink() {
    setMsg(""); setBusy(true);
    try {
      const t = normalizePhone(phone);
      if (!t) throw new Error("Introduce tu móvil (+34 6XX …)");
      const r = await fetch(`${API_BASE}/api/auth/request_password_link`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Accept":"application/json" },
        body: JSON.stringify({ phone: t })
      });
      const j = await r.json().catch(()=> ({}));
      if (!r.ok || j?.ok !== true) throw new Error(j?.error || "No se pudo enviar el enlace");
      if (j?.demo && j?.link) {
        setMsg("Demo: abre el enlace para crear/recuperar tu contraseña.");
        window.open(j.link, "_blank");
      } else {
        setMsg("Te enviamos un SMS con el enlace para crear/recuperar tu contraseña.");
      }
    } catch(e) {
      setMsg(e.message || "No se pudo enviar el enlace");
    } finally {
      setBusy(false);
    }
  }

  function buildPayload(){
    const zona = `${(form.provincia||"").trim()} - ${(form.municipio||"").trim()}`.trim();
    const mensaje =
      `DNI/NIE: ${(form.dni||"-").trim()}\n` +
      `Zona: ${zona}\n\n` +
      `Experiencia, motivación y disponibilidad:\n${(form.motivacion||"").trim()}`;
    return {
      nombre: (form.nombre||"").trim(),
      telefono: normalizePhone(form.telefono||""),
      email: (form.email||"").trim(),
      zona,
      mensaje
    };
  }

  function validate(){
    if (form.company) return "Error de validación.";
    if ((form.nombre||"").trim().split(" ").length < 2) return "Escribe tu nombre completo.";
    const tel = normalizePhone(form.telefono);
    if (!/^\+\d{9,15}$/.test(tel)) return "Escribe un móvil válido (ej. +34 6XXXXXXXX).";
    if (!/\S+@\S+\.\S+/.test((form.email||"").trim())) return "Escribe un email válido.";
    if (!(form.provincia||"").trim() || !(form.municipio||"").trim()) return "Indica provincia y municipio de interés.";
    if ((form.motivacion||"").trim().length < 30) return "Cuéntanos un poco más (mín. 30 caracteres).";
    if (!form.acepta) return "Debes aceptar que contactemos contigo.";
    return "";
  }

  async function enviarCandidatura(){
    setApplyMsg(""); setApplyOk(false);
    const err = validate();
    if (err){ setApplyMsg(err); return; }
    setApplyBusy(true);
    try{
      const payload = buildPayload();
      const r = await fetch(`${API_BASE}/api/franchise/apply`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Accept":"application/json" },
        body: JSON.stringify(payload)
      });
      const j = await r.json().catch(()=> ({}));
      if (!r.ok || j?.ok !== true){
        throw new Error(j?.error || "No se pudo registrar la candidatura.");
      }
      setApplyOk(true);
      setApplyMsg("¡Gracias! Hemos recibido tu candidatura. Nuestro equipo revisará tu perfil y contactará contigo si encaja con los requisitos y disponibilidad de tu zona.");
      // Opcional: guardar app_id para futuras subidas de docs (j.app_id)
    }catch(e){
      setApplyMsg(e.message || "No se pudo enviar la candidatura.");
    }finally{
      setApplyBusy(false);
    }
  }

  // --------- Estilos rápidos ---------
  const card = { background:"#fff", borderRadius:16, padding:24, border:"1px solid #e2e8f0", color:"#0b1220" };
  const label = { display:"block", marginTop:10, marginBottom:6, fontWeight:600 };
  const input = { width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" };
  const btn = { background:"#0A58CA", color:"#fff", border:"none", padding:"10px 14px", borderRadius:12, fontWeight:800 };
  const linkBtn = { background:"#64748b", color:"#fff", border:"none", padding:"10px 14px", borderRadius:12, fontWeight:800, textDecoration:"none" };

  return (
    <div style={{ background:"#0A58CA" }}>
      <div className="container" style={{ padding:"24px 0" }}>
        <SEO title="Franquiciados — SpainRoom" description="Únete como franquiciado: marca, tecnología y soporte." />

        {/* HERO */}
        <header style={{ textAlign:"center", color:"#fff", marginBottom:24 }}>
          <h1 style={{ fontSize:36, fontWeight:900, margin:0 }}>Franquiciados SpainRoom</h1>
          <p style={{ fontSize:18, marginTop:8, opacity:.98 }}>
            Forma parte de la red SpainRoom: <b>marca</b>, <b>tecnología</b> y <b>soporte</b> para un negocio sólido.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:12, flexWrap:"wrap" }}>
            <a href="/login?next=/dashboard/franquiciado"
               style={{ background:"#fff", color:"#0A58CA", border:"none", padding:"12px 16px",
                        borderRadius:12, fontWeight:900, textDecoration:"none" }}>
              Mi Franquicia (acceder)
            </a>
            <a href="#candidatura" style={{ color:"#fff", textDecoration:"underline" }}>Quiero ser franquiciado</a>
          </div>
        </header>

        {/* EXCLUSIVIDAD Y CRITERIOS */}
        <section style={card}>
          <h2 style={{ margin:"0 0 12px", fontSize:24, fontWeight:800, color:"#0A58CA" }}>No cualquiera puede ser franquiciado SpainRoom</h2>
          <p style={{ margin:0 }}>
            Seleccionamos cuidadosamente a nuestros partners para asegurar <b>profesionalidad</b>, <b>compromiso</b> y <b>exclusividad territorial</b>.
            Cada zona tiene un número limitado de franquicias. Crecemos de forma ordenada y sostenible.
          </p>
          <ul style={{ lineHeight:1.7, marginLeft:18, marginTop:10 }}>
            <li><b>Orientación comercial</b> y trato excelente con propietarios e inquilinos.</li>
            <li><b>Organización</b> y capacidad operativa para gestionar reservas y documentación.</li>
            <li><b>Disponibilidad</b> para atender la zona asignada.</li>
          </ul>
        </section>

        {/* BENEFICIOS (resumen) */}
        <section style={{ ...card, marginTop:18 }}>
          <h2 style={{ margin:"0 0 12px", fontSize:24, fontWeight:800, color:"#0A58CA" }}>Qué te aporta la franquicia</h2>
          <div style={{ display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))" }}>
            <div><h3 style={{margin:"0 0 6px"}}>Marca y confianza</h3><p style={{margin:0}}>Imagen profesional y procesos claros.</p></div>
            <div><h3 style={{margin:"0 0 6px"}}>Tecnología</h3><p style={{margin:0}}>Reservas online, contratos digitales, KYC y gestión.</p></div>
            <div><h3 style={{margin:"0 0 6px"}}>Leads</h3><p style={{margin:0}}>Demanda automática cuando no hay disponibilidad.</p></div>
            <div><h3 style={{margin:"0 0 6px"}}>Soporte</h3><p style={{margin:0}}>Formación, materiales y asistencia del equipo central.</p></div>
          </div>
        </section>

        {/* FORMULARIO DE CANDIDATURA */}
        <section id="candidatura" style={{ ...card, marginTop:18 }}>
          <h2 style={{ margin:"0 0 12px", fontSize:24, fontWeight:800, color:"#0A58CA" }}>Envía tu candidatura</h2>
          <p>Déjanos tus datos y cuéntanos por qué quieres ser franquiciado SpainRoom. <b>Indica claramente tu zona de interés.</b></p>

          {/* Honeypot oculto */}
          <input type="text" name="company" value={form.company} onChange={onChange} style={{position:"absolute", left:"-999em", top:"-999em"}} aria-hidden="true" />

          <label style={label}>Nombre completo *</label>
          <input name="nombre" value={form.nombre} onChange={onChange} style={input} placeholder="Nombre y apellidos" />

          <div style={{ display:"grid", gap:10, gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))" }}>
            <div>
              <label style={label}>Teléfono *</label>
              <input name="telefono" value={form.telefono} onChange={onChange} style={input} placeholder="+34 6XX XXX XXX" inputMode="tel" autoComplete="tel" />
            </div>
            <div>
              <label style={label}>Email *</label>
              <input type="email" name="email" value={form.email} onChange={onChange} style={input} placeholder="tu@email.com" />
            </div>
          </div>

          <div style={{ display:"grid", gap:10, gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", marginTop:6 }}>
            <div>
              <label style={label}>Provincia de interés *</label>
              <input name="provincia" value={form.provincia} onChange={onChange} style={input} placeholder="Provincia" />
            </div>
            <div>
              <label style={label}>Municipio de interés *</label>
              <input name="municipio" value={form.municipio} onChange={onChange} style={input} placeholder="Municipio" />
            </div>
          </div>

          <div style={{ display:"grid", gap:10, gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", marginTop:6 }}>
            <div>
              <label style={label}>DNI/NIE (opcional)</label>
              <input name="dni" value={form.dni} onChange={onChange} style={input} placeholder="DNI/NIE" />
            </div>
          </div>

          <label style={label}>Cuéntanos tu experiencia, motivación y disponibilidad *</label>
          <textarea name="motivacion" value={form.motivacion} onChange={onChange} style={{...input, minHeight:120}} placeholder="Háblanos de ti, tu experiencia (inmobiliaria/comercial/gestión), por qué te interesa SpainRoom y disponibilidad para operar en la zona." />

          <label style={{ display:"flex", gap:8, alignItems:"center", marginTop:10 }}>
            <input type="checkbox" name="acepta" checked={form.acepta} onChange={onChange} />
            <span>Confirmo que la información es veraz y acepto que SpainRoom contacte conmigo.</span>
          </label>

          <div style={{ display:"flex", gap:10, marginTop:12, flexWrap:"wrap" }}>
            <button onClick={enviarCandidatura} disabled={applyBusy} style={btn}>
              {applyBusy ? "Enviando…" : "Enviar candidatura"}
            </button>
            <a href="/oportunidades" style={linkBtn}>Solicitar más información</a>
          </div>

          {applyMsg && (
            <div style={{ marginTop:10, padding:"8px 12px", borderRadius:10, border:`1px solid ${applyOk ? "#16a34a55" : "#dc262655"}`, background:applyOk ? "#e8f8ef" : "#fdecea", color:"#0b1220" }}>
              {applyMsg}
            </div>
          )}
        </section>

        {/* ACCESO / RECUPERAR CONTRASEÑA */}
        <section style={{ ...card, marginTop:18 }}>
          <h3 style={{ margin:"0 0 10px" }}>Mi Franquicia</h3>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:12 }}>
            <a href="/login?next=/dashboard/franquiciado"
               style={{ ...btn, textDecoration:"none", display:"inline-block" }}>
              Acceder
            </a>
            <a href="#recuperar" style={{ color:"#0A58CA", textDecoration:"underline" }}>Crear / recuperar contraseña</a>
          </div>

          <div id="recuperar" style={{ marginTop:8 }}>
            <label style={{ display:"block", marginBottom:6, fontWeight:600 }}>Móvil</label>
            <input
              inputMode="tel" autoComplete="tel" placeholder="+34 6XX XXX XXX"
              value={phone} onChange={(e)=>setPhone(e.target.value)}
              style={input}
            />
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <button onClick={sendPasswordLink} disabled={busy} style={btn}>
                {busy ? "Enviando…" : "Recibir enlace por SMS"}
              </button>
              <a href="/login?next=/dashboard/franquiciado" style={linkBtn}>
                Ir a Login
              </a>
            </div>
            {msg && <div style={{ marginTop:10 }}>{msg}</div>}
          </div>
        </section>

        {/* NOTA FINAL */}
        <p style={{ color:"#fff", opacity:.9, marginTop:18 }}>
          ¿Tienes dudas? Escríbenos desde <a href="/oportunidades" style={{color:"#fff", textDecoration:"underline"}}>Oportunidades</a> y te contactamos.
        </p>
      </div>
    </div>
  );
}
