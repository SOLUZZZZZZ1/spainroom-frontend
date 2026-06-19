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

function Field({ label, value }) {
  return <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
    <div style={{color:"#64748b",fontSize:13,fontWeight:800}}>{label}</div>
    <div style={{color:"#0b1220",fontWeight:900,marginTop:3}}>{value || "Pendiente"}</div>
  </div>;
}

export default function DashboardFranquiciado() {
  const user = useMemo(getUser, []);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [pipeline, setPipeline] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [inc, setInc] = useState([]);
  const profile = {
    codigo:"SR-F-PENDIENTE", zona:"Pendiente de asignación", provincia:"Pendiente", municipio:"Pendiente",
    estado:"Onboarding", canon:"Pendiente", contrato:"Pendiente de firma", documentacion:"Pendiente",
    factura:"Pendiente", cuenta_pago:"Pendiente"
  };
  const kpi = { leads:4, rooms:5, visits:2, contracts:1, incidents:2, income:6120 };

  useEffect(() => {
    setLoading(true);
    setErr("");
    try {
      setPipeline([
        { id:"LEAD-2101", nombre:"Laura M.", rol:"Inquilino", fase:"Lead", ciudad:"Madrid", zona:"Centro", tel:"+34 ***", prioridad:"Alta" },
        { id:"LEAD-2102", nombre:"Carlos R.", rol:"Propietario", fase:"Visita", ciudad:"Madrid", zona:"Chamberí", tel:"+34 ***", prioridad:"Media" },
        { id:"LEAD-2103", nombre:"Ana A.", rol:"Inquilino", fase:"Contrato", ciudad:"Madrid", zona:"Salamanca", tel:"+34 ***", prioridad:"Alta" },
        { id:"LEAD-2104", nombre:"Julia V.", rol:"Propietario", fase:"Onboarding", ciudad:"Madrid", zona:"Latina", tel:"+34 ***", prioridad:"Media" },
      ]);
      setRooms([
        { id:"ROOM-022", titulo:"Centro A", propietario:"Prop. 001", estado:"Ocupada", precio:580, doc:"OK" },
        { id:"ROOM-023", titulo:"Centro B", propietario:"Prop. 001", estado:"Ocupada", precio:540, doc:"OK" },
        { id:"ROOM-031", titulo:"Chamberí A", propietario:"Prop. 002", estado:"Libre", precio:520, doc:"Pendiente" },
        { id:"ROOM-047", titulo:"Salamanca A", propietario:"Prop. 003", estado:"Reserva", precio:650, doc:"OK" },
        { id:"ROOM-015", titulo:"Latina A", propietario:"Prop. 004", estado:"Limpieza", precio:490, doc:"Pendiente" },
      ]);
      setInc([
        { id:"INC-901", fecha:"2026-06-12", tipo:"Mantenimiento", room:"ROOM-015", estado:"abierta" },
        { id:"INC-902", fecha:"2026-06-17", tipo:"Ruido", room:"ROOM-023", estado:"cerrada" },
      ]);
    } catch(e) { setErr(e.message || "Error cargando datos"); }
    finally { setLoading(false); }
  }, []);

  return <main style={{minHeight:"100vh",background:"#f8fafc",color:"#0b1220",padding:"24px 16px 36px"}}>
    <div style={{maxWidth:1240,margin:"0 auto"}}>
      <AdminBanner />
      <Hero role="Franquiciado" name={firstName(user.name, "Franquiciado")} text="Desde aquí podrás controlar leads, propietarios, habitaciones, visitas, contratos, documentación, incidencias e ingresos de tu zona." />

      <section className="sr-kpis" style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:14,marginBottom:18}}>
        <KPI icon="📞" label="Leads" value={kpi.leads} hint="Pendientes/activos" />
        <KPI icon="🏠" label="Habitaciones" value={kpi.rooms} hint="Gestionadas" />
        <KPI icon="🚶" label="Visitas" value={kpi.visits} hint="Programadas" />
        <KPI icon="📄" label="Contratos" value={kpi.contracts} hint="En curso" />
        <KPI icon="🛠️" label="Incidencias" value={kpi.incidents} hint="Abiertas/cerradas" />
        <KPI icon="💶" label="Ingresos mes" value={money(kpi.income)} hint="Estimado" />
      </section>

      <section className="sr-grid2" style={{display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:16,alignItems:"start"}}>
        <Card title="Ficha del franquiciado" icon="🤝" right={<Badge tone="wait">{profile.estado}</Badge>}>
          <div className="sr-fields" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            <Field label="Código" value={profile.codigo} />
            <Field label="Provincia" value={profile.provincia} />
            <Field label="Municipio/Zona" value={profile.municipio} />
            <Field label="Canon de entrada" value={profile.canon} />
            <Field label="Contrato" value={profile.contrato} />
            <Field label="Documentación" value={profile.documentacion} />
            <Field label="Factura franquiciado" value={profile.factura} />
            <Field label="Cuenta de pago" value={profile.cuenta_pago} />
            <Field label="Estado zona" value={profile.zona} />
          </div>
        </Card>
        <Card title="Datos que debe recoger" icon="📋" right={<Badge tone="info">Onboarding</Badge>}>
          <div style={{display:"grid",gap:8,color:"#334155",lineHeight:1.5}}>
            <div>✅ Datos personales / empresa</div>
            <div>✅ DNI/NIE/CIF y domicilio</div>
            <div>✅ Zona solicitada y municipios</div>
            <div>✅ Teléfono, email y cuenta bancaria</div>
            <div>✅ Contrato firmado y factura de canon</div>
            <div>✅ Leads, propietarios, habitaciones y visitas</div>
            <div>✅ Documentación de habitaciones y fotos</div>
          </div>
        </Card>
      </section>

      <section style={{display:"grid",gridTemplateColumns:"1fr",gap:16,marginTop:18}}>
        <Card title="Pipeline comercial" icon="📞" right={<Badge tone="ok">Activo</Badge>}>
          <Table columns={[
            { key:"id", label:"ID", bold:true },
            { key:"nombre", label:"Nombre" },
            { key:"rol", label:"Tipo" },
            { key:"fase", label:"Fase", render:r=><Badge tone={r.fase==="Contrato"?"ok":r.fase==="Lead"?"wait":"info"}>{r.fase}</Badge> },
            { key:"ciudad", label:"Ciudad" },
            { key:"zona", label:"Zona" },
            { key:"tel", label:"Teléfono" },
            { key:"prioridad", label:"Prioridad", render:r=><Badge tone={r.prioridad==="Alta"?"danger":"info"}>{r.prioridad}</Badge> },
          ]} rows={pipeline} empty="Sin leads." />
        </Card>
        <Card title="Mis habitaciones" icon="🏠">
          <Table columns={[
            { key:"id", label:"ID", bold:true },
            { key:"titulo", label:"Habitación" },
            { key:"propietario", label:"Propietario" },
            { key:"estado", label:"Estado", render:r=><Badge tone={r.estado==="Ocupada"?"ok":r.estado==="Libre"?"info":"wait"}>{r.estado}</Badge> },
            { key:"precio", label:"Precio", render:r=>money(r.precio) },
            { key:"doc", label:"Documentación", render:r=><Badge tone={r.doc==="OK"?"ok":"wait"}>{r.doc}</Badge> },
          ]} rows={rooms} empty="Sin habitaciones." />
        </Card>
        <Card title="Incidencias" icon="🛠️">
          <Table columns={[
            { key:"id", label:"ID", bold:true },
            { key:"fecha", label:"Fecha" },
            { key:"tipo", label:"Tipo" },
            { key:"room", label:"Habitación" },
            { key:"estado", label:"Estado", render:r=><Badge tone={r.estado==="cerrada"?"ok":"danger"}>{r.estado}</Badge> },
          ]} rows={inc} empty="Sin incidencias." />
        </Card>
      </section>

      {loading && <div style={{marginTop:14,color:"#64748b"}}>Cargando...</div>}
      {err && <div style={{marginTop:14,color:"#991b1b",fontWeight:800}}>{err}</div>}
    </div>
    <style>{`@media(max-width:1150px){.sr-kpis{grid-template-columns:1fr 1fr 1fr!important}.sr-grid2{grid-template-columns:1fr!important}.sr-fields{grid-template-columns:1fr 1fr!important}}@media(max-width:700px){.sr-kpis{grid-template-columns:1fr!important}.sr-fields{grid-template-columns:1fr!important}}`}</style>
  </main>;
}
