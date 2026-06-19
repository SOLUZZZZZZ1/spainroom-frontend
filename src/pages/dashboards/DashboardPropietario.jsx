// Archivo generado por Nora para SpainRoom
import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

function getUser() {
  try { return JSON.parse(localStorage.getItem("SR_USER") || "{}"); } catch { return {}; }
}
function firstName(name, fallback) {
  const clean = String(name || "").trim();
  return clean ? clean.split(/\s+/)[0] : fallback;
}
function money(n) {
  return typeof n === "number" ? n.toLocaleString("es-ES", { style: "currency", currency: "EUR" }) : (n || "—");
}
function Badge({ children, tone = "info" }) {
  const map = {
    ok: ["#ecfdf5", "#047857", "#bbf7d0"],
    wait: ["#fffbeb", "#92400e", "#fde68a"],
    danger: ["#fef2f2", "#991b1b", "#fecaca"],
    info: ["#eff6ff", "#1d4ed8", "#bfdbfe"],
  };
  const [bg, color, border] = map[tone] || map.info;
  return <span style={{display:"inline-flex",padding:"6px 10px",borderRadius:999,fontWeight:900,fontSize:13,background:bg,color,border:`1px solid ${border}`}}>{children}</span>;
}
function Card({ title, icon, children, right }) {
  return <section style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:18,padding:18,boxShadow:"0 8px 22px rgba(15,23,42,.06)"}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:38,height:38,borderRadius:12,background:"#eef6ff",display:"grid",placeItems:"center",fontSize:20}}>{icon}</div>
        <h3 style={{margin:0,fontSize:19,fontWeight:950,color:"#0b1220"}}>{title}</h3>
      </div>
      {right}
    </div>
    {children}
  </section>;
}
function KPI({ label, value, hint, icon }) {
  return <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:18,padding:16,boxShadow:"0 8px 22px rgba(15,23,42,.06)"}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
      <div>
        <div style={{fontSize:25,fontWeight:950,color:"#0b1220",lineHeight:1.1}}>{value}</div>
        <div style={{color:"#475569",fontWeight:800,marginTop:5}}>{label}</div>
        {hint && <div style={{color:"#64748b",fontSize:13,marginTop:4}}>{hint}</div>}
      </div>
      <div style={{width:42,height:42,borderRadius:14,background:"#eff6ff",display:"grid",placeItems:"center",fontSize:22}}>{icon}</div>
    </div>
  </div>;
}
function Table({ columns, rows, empty }) {
  return <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
      <thead><tr style={{color:"#64748b",textAlign:"left"}}>{columns.map(c => <th key={c.key} style={{padding:"9px 7px",borderBottom:"1px solid #e2e8f0"}}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.length === 0 ? <tr><td colSpan={columns.length} style={{padding:18,color:"#64748b",textAlign:"center"}}>{empty}</td></tr> :
          rows.map(row => <tr key={row.id}>{columns.map(c => <td key={c.key} style={{padding:"9px 7px",borderBottom:"1px solid #f1f5f9",color:"#0b1220",fontWeight:c.bold?800:500}}>{c.render ? c.render(row) : row[c.key]}</td>)}</tr>)
        }
      </tbody>
    </table>
  </div>;
}
function Hero({ role, name, text }) {
  return <section style={{background:"linear-gradient(135deg, #0b65d8 0%, #084fa8 100%)",color:"#fff",borderRadius:22,padding:"28px 24px",marginBottom:18,boxShadow:"0 10px 26px rgba(10,88,202,.22)"}}>
    <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.14)",border:"1px solid rgba(255,255,255,.24)",borderRadius:999,padding:"7px 12px",fontWeight:900,marginBottom:14}}>SpainRoom<sup>®</sup> · {role}</div>
    <h1 style={{margin:"0 0 8px",fontSize:"clamp(30px,4vw,44px)",lineHeight:1.08,fontWeight:950,letterSpacing:"-.03em"}}>Hola, {name} 👋</h1>
    <p style={{margin:0,maxWidth:900,color:"rgba(255,255,255,.92)",lineHeight:1.6}}>{text}</p>
  </section>;
}
function AdminBanner() {
  const id = new URLSearchParams(window.location.search).get("admin_view_user_id");
  if (!id) return null;
  return <div style={{marginBottom:14,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",borderRadius:16,padding:"12px 14px",fontWeight:900}}>👑 Modo supervisión Admin · Vista usuario ID {id}</div>;
}
const btn = {background:"#0A58CA",color:"#fff",border:"none",padding:"11px 14px",borderRadius:12,fontWeight:900,cursor:"pointer"};

export default function DashboardPropietario() {
  const user = useMemo(getUser, []);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [propsList, setPropsList] = useState([]);
  const [moves, setMoves] = useState([]);
  const kpi = { properties_count: 4, rooms_count: 7, income_month: 2180, balance: 3450, pending: 320, next_payout: "2026-07-05" };

  useEffect(() => {
    setLoading(true);
    setErr("");
    try {
      setPropsList([
        { id:"P-001", titulo:"Piso Centro A", ciudad:"Madrid", habitaciones:"2", estado:"Operativa", ocupacion:"100%" },
        { id:"P-002", titulo:"Piso Centro B", ciudad:"Madrid", habitaciones:"1", estado:"Operativa", ocupacion:"95%" },
        { id:"P-003", titulo:"Piso Eixample", ciudad:"Barcelona", habitaciones:"3", estado:"Operativa", ocupacion:"90%" },
        { id:"P-004", titulo:"Piso Triana", ciudad:"Sevilla", habitaciones:"1", estado:"Pendiente doc.", ocupacion:"—" },
      ]);
      setMoves([
        { id:"M-1001", fecha:"2026-06-01", concepto:"Alquiler ROOM-022", tipo:"+", importe:580 },
        { id:"M-1002", fecha:"2026-06-05", concepto:"Limpieza mensual", tipo:"-", importe:40 },
        { id:"M-1003", fecha:"2026-06-10", concepto:"Alquiler ROOM-023", tipo:"+", importe:540 },
        { id:"M-1004", fecha:"2026-06-15", concepto:"Incidencia fontanería", tipo:"-", importe:120 },
      ]);
    } catch(e) { setErr(e.message || "Error cargando datos"); }
    finally { setLoading(false); }
  }, []);

  return <main style={{minHeight:"100vh",background:"#f8fafc",color:"#0b1220",padding:"24px 16px 36px"}}>
    <div style={{maxWidth:1240,margin:"0 auto"}}>
      <AdminBanner />
      <Hero role="Propietario" name={firstName(user.name, "Propietario")} text="Desde aquí podrás controlar tus propiedades, habitaciones, documentación, ingresos, contratos e incidencias." />

      <section className="sr-kpis" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:18}}>
        <KPI icon="🏠" label="Propiedades" value={kpi.properties_count} hint="Activos registrados" />
        <KPI icon="🚪" label="Habitaciones" value={kpi.rooms_count} hint="Gestionables" />
        <KPI icon="💶" label="Ingresos mes" value={money(kpi.income_month)} hint="Estimado mensual" />
        <KPI icon="🏦" label="Balance" value={money(kpi.balance)} hint="Pendiente liquidación" />
        <KPI icon="📅" label="Próxima liquidación" value={kpi.next_payout} hint="Fecha prevista" />
      </section>

      <section className="sr-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
        <Card title="Mis propiedades" icon="🏘️" right={<Badge tone="ok">Operativo</Badge>}>
          <Table columns={[
            { key:"id", label:"ID", bold:true },
            { key:"titulo", label:"Propiedad" },
            { key:"ciudad", label:"Ciudad" },
            { key:"habitaciones", label:"Hab." },
            { key:"estado", label:"Estado", render:r=><Badge tone={r.estado.includes("Pendiente")?"wait":"ok"}>{r.estado}</Badge> },
            { key:"ocupacion", label:"Ocupación" },
          ]} rows={propsList} empty="Sin propiedades registradas." />
        </Card>
        <Card title="Movimientos" icon="📊" right={<Badge tone="info">Últimos</Badge>}>
          <Table columns={[
            { key:"fecha", label:"Fecha" },
            { key:"concepto", label:"Concepto", bold:true },
            { key:"tipo", label:"Tipo", render:r=><Badge tone={r.tipo==="+"?"ok":"danger"}>{r.tipo==="+"?"Ingreso":"Gasto"}</Badge> },
            { key:"importe", label:"Importe", render:r=>money(r.importe) },
          ]} rows={moves} empty="Sin movimientos." />
        </Card>
      </section>

      <section className="sr-grid2" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginTop:18}}>
        <Card title="Documentación" icon="📂">
          <div style={{display:"grid",gap:10}}>
            <div><Badge tone="ok">DNI / CIF OK</Badge></div>
            <div><Badge tone="wait">Cédula pendiente</Badge></div>
            <div><Badge tone="wait">Contrato propietario pendiente firma</Badge></div>
            <p style={{margin:"8px 0 0",color:"#64748b"}}>Próximamente se conectará a documentación real, cédulas, contratos y validación interna.</p>
          </div>
        </Card>
        <Card title="Acceso rápido" icon="⚡">
          <div style={{display:"grid",gap:10}}>
            <button style={btn}>Subir documentación</button>
            <button style={btn}>Ver incidencias</button>
            <button style={btn}>Exportar movimientos</button>
          </div>
        </Card>
      </section>

      {loading && <div style={{marginTop:14,color:"#64748b"}}>Cargando...</div>}
      {err && <div style={{marginTop:14,color:"#991b1b",fontWeight:800}}>{err}</div>}
    </div>
    <style>{`@media(max-width:1050px){.sr-kpis{grid-template-columns:1fr 1fr!important}.sr-grid2{grid-template-columns:1fr!important}}@media(max-width:640px){.sr-kpis{grid-template-columns:1fr!important}}`}</style>
  </main>;
}
