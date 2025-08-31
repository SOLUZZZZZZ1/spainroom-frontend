import { useEffect, useRef, useState } from "react";

/**
 * NoraChat (solo frontend)
 * - Si VITE_API_BASE está vacío: responde con reglas simples (FAQ).
 * - Si VITE_API_BASE tiene URL: hace POST a `${VITE_API_BASE}/api/nora/chat`.
 * - Botón flotante, ventana minimal, scroll a último mensaje.
 */
const API_BASE = (import.meta.env.VITE_API_BASE || "").trim();
const ENDPOINT = API_BASE ? `${API_BASE.replace(/\/+$/, "")}/api/nora/chat` : null;

const PRESET = [
  {
    k: [/hola|buenas|buenos días|buenas tardes/i],
    a: "¡Hola! Soy Nora 🤖. ¿Eres propietario? Puedo decirte qué documento necesitas (Cédula/LPO/2ª Ocupación), crear una verificación con ID y resolver dudas."
  },
  {
    k: [/propietari|alquilar|rentabil/i],
    a: "En Propietarios, SpainRoom te ayuda a rentabilizar con seguridad: verificación con ID, cobertura legal y guía paso a paso. ¿Quieres comprobar tu vivienda ahora?"
  },
  {
    k: [/c[eé]dula|lpo|ocupaci[oó]n|requisit/i],
    a: "Indícame provincia/ciudad y te digo el documento: Cédula, LPO o 2ª Ocupación/DR. También puedes usar el mapa por provincia en esta página."
  },
  {
    k: [/verificaci[oó]n|id|comprobar/i],
    a: "Para crear la verificación con ID, usa el formulario “Comprobar cédula” (arriba). Si quieres, te explico cómo rellenarlo."
  },
  {
    k: [/tel[eé]fono|whats|llamar|contact/i],
    a: "Puedes llamarnos (📞), escribir por WhatsApp o pedir “Te llamamos”. Tienes los botones abajo a la derecha."
  }
];

function localAnswer(q) {
  for (const r of PRESET) if (r.k.some(re => re.test(q))) return r.a;
  return "Te escucho. Puedo ayudarte con requisitos por provincia, verificación con ID y pasos para publicar con seguridad.";
}

export default function NoraChat() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [inpt, setInpt] = useState("");
  const [msgs, setMsgs] = useState([{ from: "nora", text: "Hola, soy Nora 🤖. ¿En qué te ayudo?" }]);
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [msgs, open]);

  async function send() {
    const text = inpt.trim();
    if (!text) return;
    setMsgs(m => [...m, { from: "you", text }]);
    setInpt("");
    setBusy(true);

    try {
      if (!ENDPOINT) {
        // Modo sin backend (respuestas locales)
        const a = localAnswer(text);
        await new Promise(r => setTimeout(r, 250));
        setMsgs(m => [...m, { from: "nora", text: a }]);
      } else {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text })
        });
        const j = await res.json();
        setMsgs(m => [...m, { from: "nora", text: j?.reply || "…" }]);
      }
    } catch {
      setMsgs(m => [...m, { from: "nora", text: "Ahora mismo no puedo responder. Puedes usar los botones de contacto." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button title="Habla con Nora"
          onClick={() => setOpen(true)}
          style={fab}>
          💬
        </button>
      )}

      {open && (
        <div style={wrap} role="dialog" aria-label="Nora Chat">
          <div style={head}>
            <b>Nora · Atención</b>
            <button onClick={()=>setOpen(false)} style={xBtn}>×</button>
          </div>
          <div style={box} ref={boxRef}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent: m.from==="you"?"flex-end":"flex-start", margin:"6px 0" }}>
                <div style={{
                  padding:"8px 12px", borderRadius:12, maxWidth:"80%",
                  background: m.from==="you" ? "#2563eb" : "#f1f5f9",
                  color: m.from==="you" ? "#fff" : "#0f172a",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={bar}>
            <input
              value={inpt}
              onChange={e=>setInpt(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && !busy && send()}
              placeholder="Escribe tu consulta…"
              style={inp}
            />
            <button onClick={send} disabled={busy} style={sendBtn}>{busy ? "..." : "Enviar"}</button>
          </div>
        </div>
      )}
    </>
  );
}

/* estilos */
const fab = {
  position:"fixed", right:18, bottom:158, zIndex:72,
  width:56, height:56, borderRadius:999, border:"none",
  background:"#0ea5e9", color:"#fff", fontWeight:900, fontSize:20, cursor:"pointer",
  boxShadow:"0 12px 28px rgba(14,165,233,.35)"
};
const wrap = {
  position:"fixed", right:18, bottom:158, zIndex:73,
  width:340, maxWidth:"96vw", background:"#fff", border:"1px solid #e5e7eb",
  borderRadius:16, boxShadow:"0 18px 40px rgba(0,0,0,.18)", overflow:"hidden",
  display:"flex", flexDirection:"column"
};
const head = { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background:"#f8fafc", borderBottom:"1px solid #e5e7eb" };
const xBtn = { border:"none", background:"transparent", fontSize:20, lineHeight:1, cursor:"pointer", color:"#64748b" };
const box = { padding:10, height:280, overflow:"auto" };
const bar = { display:"flex", gap:8, borderTop:"1px solid #e5e7eb", padding:10 };
const inp = { flex:1, padding:"10px 12px", borderRadius:10, border:"1px solid #e2e8f0", outline:"none" };
const sendBtn = { padding:"10px 12px", border:"none", borderRadius:10, background:"#0ea5e9", color:"#fff", fontWeight:700, cursor:"pointer" };
