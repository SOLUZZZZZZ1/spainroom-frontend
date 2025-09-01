import { useEffect, useState } from "react";

export default function ClaimBubble() {
  const KEY = "sr_prop_bubble_hidden_until";
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const until = Number(localStorage.getItem(KEY) || 0);
    if (Date.now() < until) setHidden(true);
  }, []);

  const hide7d = () => {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(KEY, String(Date.now() + sevenDays));
    setHidden(true);
  };

  if (hidden) return null;

  return (
    <>
      {!open && (
        <button title="Maximice su rentabilidad con seguridad"
          onClick={() => setOpen(true)}
          style={{
            position:"fixed", right:18, bottom:18, zIndex:70, width:56, height:56,
            border:"none", borderRadius:999, background:"#2563eb", color:"#fff",
            fontWeight:900, fontSize:20, cursor:"pointer",
            boxShadow:"0 12px 28px rgba(37,99,235,.35)"
          }}>
          🛡️
        </button>
      )}

      {open && (
        <div role="dialog" aria-label="Reclamo propietarios"
          style={{
            position:"fixed", right:18, bottom:18, zIndex:71, width:320, maxWidth:"96vw",
            background:"#fff", border:"1px solid #e5e7eb", borderRadius:16,
            boxShadow:"0 18px 40px rgba(0,0,0,.18)", overflow:"hidden"
          }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"10px 12px", background:"#f8fafc", borderBottom:"1px solid #e5e7eb"}}>
            <b>Seguridad para Propietarios</b>
            <button onClick={()=>setOpen(false)} style={{border:"none",background:"transparent",fontSize:20,cursor:"pointer"}}>×</button>
          </div>

          <div style={{padding:12}}>
            <span style={{display:"inline-block",padding:"4px 8px",borderRadius:999,fontSize:11,
              letterSpacing:1,fontWeight:800,background:"#e8f0ff",color:"#2563eb",marginBottom:8}}>
              SEGURIDAD
            </span>
            <h4 style={{margin:"0 0 6px 0",fontSize:18,lineHeight:1.35,color:"#0f172a"}}>
              ¿Propietario de uno o varios inmuebles?
            </h4>
            <p style={{margin:0,color:"#334155",lineHeight:1.6}}>
              <b>Rentabilice su inversión</b> con <b>cobertura legal</b>, <b>ID verificable</b> y <b>soporte experto</b>.
            </p>
            <div style={{display:"flex",gap:10,marginTop:10,color:"#0f172a",opacity:.9,flexWrap:"wrap"}}>
              <span>🔒 Datos cifrados</span><span>✔ ID verificable</span><span>🛡️ Soporte</span>
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:12}}>
              <a href="#comprobar-cedula" style={btnPrimary}>Comprobar</a>
              <a href="#mapa" style={btnGhost}>Ver requisitos</a>
            </div>

            <div style={{marginTop:8,textAlign:"right"}}>
              <button onClick={hide7d} style={{border:"none",background:"transparent",
                color:"#64748b",cursor:"pointer",fontSize:12,textDecoration:"underline"}}>
                No molestar 7 días
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const btnPrimary = {
  display:"inline-block", padding:"10px 14px", borderRadius:10,
  background:"#2563eb", color:"#fff", fontWeight:800, textDecoration:"none",
  boxShadow:"0 8px 22px rgba(37,99,235,.35)",
};
const btnGhost = {
  ...btnPrimary, background:"#f1f5f9", color:"#1f2937", boxShadow:"none", border:"1px solid #e5e7eb"
};
