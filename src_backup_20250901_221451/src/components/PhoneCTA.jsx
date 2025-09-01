import { useMemo, useState } from "react";

const PHONE = (import.meta.env.VITE_PHONE || "").trim();     // +34616232306
const RAW_WAPP = (import.meta.env.VITE_WAPP || "");          // 34616232306
const WAPP = RAW_WAPP.replace(/[^\d]/g, "");
const MAIL  = (import.meta.env.VITE_MAIL  || "atencion@spainroom.es").trim();

// formatea bonito si es +34 mÃ³vil (opcional)
function prettyPhone(e164) {
  const m = /^\+34(\d{9})$/.exec(e164.replace(/\s+/g,""));
  if (!m) return e164 || "â€”";
  const n = m[1]; // 9 dÃ­gitos
  return `+34 ${n.slice(0,3)} ${n.slice(3,5)} ${n.slice(5,7)} ${n.slice(7)}`;
}

export default function PhoneCTA() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [num,  setNum]  = useState("");
  const [slot, setSlot] = useState("10:00â€“13:00");

  const isMobile = useMemo(
    () => /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent),
    []
  );

  const wappText = encodeURIComponent(
    `Hola, soy propietario. Quiero informaciÃ³n para rentabilizar mi vivienda con seguridad.
PÃ¡gina: ${document.title}
URL: ${location.href}`
  );

  function openWhatsApp(e) {
    e?.preventDefault?.();
    if (!WAPP) return;
    const waApp = `whatsapp://send?phone=${WAPP}&text=${wappText}`; // app
    if (isMobile) {
      const t = setTimeout(() => { window.open(waWeb, "_blank", "noopener"); }, 800);
      window.location.href = waApp;
      setTimeout(() => clearTimeout(t), 1200);
    } else {
      window.open(waWeb, "_blank", "noopener");
    }
  }

  const mailtoHref = () => {
    const subject = encodeURIComponent("Solicitud de llamada â€” Propietarios SpainRoom");
    const body = encodeURIComponent(
      `Nombre: ${name || "â€”"}\nTelÃ©fono: ${num || "â€”"}\nFranja preferida: ${slot}\n\nOrigen: Propietarios / Web`
    );
    return `mailto:${MAIL}?subject=${subject}&body=${body}`;
  };

  async function copyPhone() {
    try { await navigator.clipboard.writeText(PHONE); alert("NÃºmero copiado"); } catch {}
  }

  return (
    <>
      {!open && (
        <button title="AtenciÃ³n telefÃ³nica" onClick={()=>setOpen(true)} style={fabBtn}>ðŸ“ž</button>
      )}

      {open && (
        <div style={panel}>
          <div style={head}>
            <b>AtenciÃ³n telefÃ³nica</b>
            <button onClick={()=>setOpen(false)} style={xBtn}>Ã—</button>
          </div>

          <div style={{padding:12, display:"grid", gap:10}}>
            {/* LÃ­nea SIEMPRE visible con el nÃºmero (PC y mÃ³vil) */}
            {PHONE && (
              <div style={phoneLine}>
                <span>ðŸ“ž</span>
                <a href={`tel:${PHONE}`} style={phoneLink}>{prettyPhone(PHONE)}</a>
                <button onClick={copyPhone} style={copyBtn}>Copiar</button>
              </div>
            )}

            {/* BotÃ³n â€œLlamar ahoraâ€ SOLO en mÃ³vil (acciÃ³n directa) */}
            {isMobile && PHONE && (
              <a href={`tel:${PHONE}`} style={btnPrimary}>Llamar ahora</a>
            )}

            {/* WhatsApp */}
            {WAPP && (
              <a href="#" onClick={openWhatsApp} style={btnWapp}>
                WhatsApp (respuesta en minutos)
              </a>
            )}

            {/* Te llamamos */}
            <div style={box}>
              <div style={{fontWeight:700, marginBottom:6}}>Â¿Te llamamos?</div>
              <input placeholder="Tu nombre" value={name} onChange={e=>setName(e.target.value)} style={inp}/>
              <input placeholder="Tu telÃ©fono" value={num} onChange={e=>setNum(e.target.value)} style={inp}/>
              <select value={slot} onChange={e=>setSlot(e.target.value)} style={inp}>
                <option>10:00â€“13:00</option>
                <option>13:00â€“16:00</option>
                <option>16:00â€“19:00</option>
              </select>
              <a href={mailtoHref()} style={btnGhost}>Enviar solicitud</a>
              <small style={{color:"#64748b"}}>*Enviamos un email a {MAIL}. Uso interno.</small>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* estilos */
const fabBtn = {
  position:"fixed", right:18, bottom:88, zIndex:70,
  width:56, height:56, borderRadius:999, border:"none",
  background:"#16a34a", color:"#fff", fontSize:22, fontWeight:900, cursor:"pointer",
  boxShadow:"0 12px 28px rgba(22,163,74,.35)"
};
const panel = {
  position:"fixed", right:18, bottom:88, zIndex:71,
  width:320, maxWidth:"96vw", background:"#fff", border:"1px solid #e5e7eb",
  borderRadius:16, boxShadow:"0 18px 40px rgba(0,0,0,0.18)", overflow:"hidden"
};
const head = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderBottom:"1px solid #e5e7eb", background:"#f8fafc" };
const xBtn = { border:"none", background:"transparent", fontSize:20, lineHeight:1, cursor:"pointer", color:"#64748b" };

const phoneLine = { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", border:"1px solid #e2e8f0", borderRadius:10 };
const phoneLink = { color:"#0f172a", textDecoration:"none", fontWeight:800, letterSpacing:0.3 };
const copyBtn  = { marginLeft:"auto", padding:"6px 10px", borderRadius:8, border:"1px solid #cbd5e1", background:"#fff", cursor:"pointer" };

const btnPrimary = { display:"inline-block", textAlign:"center", padding:"10px 14px", borderRadius:10, textDecoration:"none", background:"#2563eb", color:"#fff", fontWeight:800, boxShadow:"0 8px 22px rgba(37,99,235,.25)" };
const btnWapp    = { ...btnPrimary, background:"#25D366", boxShadow:"0 8px 22px rgba(37,211,102,.25)" };
const btnGhost   = { ...btnPrimary, background:"#f1f5f9", color:"#1f2937", boxShadow:"none", border:"1px solid #e5e7eb" };

const box = { border:"1px solid #e5e7eb", borderRadius:12, padding:10, display:"grid", gap:8 };
const inp = { width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #e2e8f0", outline:"none" };