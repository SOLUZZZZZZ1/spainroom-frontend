// src/pages/dashboards/DashboardFranquiciado.jsx
// SpainRoom® — Dashboard Franquiciado V2 · Fincas como expediente maestro
import React, { useState } from "react";

const blue = "#0A58CA";

function money(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function Badge({ children, tone = "info" }) {
  const map = {
    ok: ["#ecfdf5", "#047857", "#bbf7d0"],
    wait: ["#fffbeb", "#92400e", "#fde68a"],
    danger: ["#fef2f2", "#991b1b", "#fecaca"],
    info: ["#eff6ff", "#1d4ed8", "#bfdbfe"],
    dark: ["#f1f5f9", "#334155", "#cbd5e1"],
    purple: ["#f5f3ff", "#6d28d9", "#ddd6fe"],
  };
  const [bg, color, border] = map[tone] || map.info;
  return <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:999,fontWeight:900,fontSize:13,background:bg,color,border:`1px solid ${border}`,whiteSpace:"nowrap"}}>{children}</span>;
}

function Card({ title, icon, children, right }) {
  return <section style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:20,padding:18,boxShadow:"0 8px 24px rgba(15,23,42,.06)"}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:40,height:40,borderRadius:14,background:"#eef6ff",display:"grid",placeItems:"center",fontSize:21,flex:"0 0 auto"}}>{icon}</div>
        <h3 style={{margin:0,fontSize:19,fontWeight:950,color:"#0b1220"}}>{title}</h3>
      </div>
      {right}
    </div>
    {children}
  </section>;
}

function KPI({ icon, label, value, hint, tone = "info" }) {
  const bg = tone === "ok" ? "#ecfdf5" : tone === "wait" ? "#fffbeb" : tone === "purple" ? "#f5f3ff" : "#eff6ff";
  return <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:18,padding:16,boxShadow:"0 8px 22px rgba(15,23,42,.06)",minHeight:112}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
      <div>
        <div style={{fontSize:25,fontWeight:950,color:"#0b1220",lineHeight:1.1}}>{value}</div>
        <div style={{color:"#475569",fontWeight:850,marginTop:6}}>{label}</div>
        {hint && <div style={{color:"#64748b",fontSize:13,marginTop:5,lineHeight:1.35}}>{hint}</div>}
      </div>
      <div style={{width:44,height:44,borderRadius:15,background:bg,display:"grid",placeItems:"center",fontSize:23,flex:"0 0 auto"}}>{icon}</div>
    </div>
  </div>;
}

function Button({ children, onClick, secondary = false, danger = false, small = false }) {
  const style = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", borderRadius:13,
    fontWeight:950, cursor:"pointer", fontSize:small ? 13 : 14,
    padding:small ? "8px 10px" : "10px 13px", border:"1px solid", whiteSpace:"nowrap",
    background: danger ? "#fef2f2" : secondary ? "#f8fafc" : blue,
    color: danger ? "#991b1b" : secondary ? blue : "#fff",
    borderColor: danger ? "#fecaca" : secondary ? "#cfe0ff" : blue
  };
  return <button type="button" onClick={onClick} style={style}>{children}</button>;
}

function Field({ label, value, onChange, type = "text" }) {
  return <label style={{display:"grid",gap:6}}>
    <span style={{color:"#64748b",fontSize:13,fontWeight:850}}>{label}</span>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{width:"100%",boxSizing:"border-box",border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",color:"#0b1220",fontWeight:750,background:"#fff",outline:"none"}} />
  </label>;
}

function Table({ columns, rows, empty }) {
  return <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
      <thead><tr style={{color:"#64748b",textAlign:"left"}}>{columns.map(c => <th key={c.key} style={{padding:"9px 7px",borderBottom:"1px solid #e2e8f0"}}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.length === 0 ? <tr><td colSpan={columns.length} style={{padding:18,color:"#64748b",textAlign:"center"}}>{empty}</td></tr> :
          rows.map(row => <tr key={row.id}>{columns.map(c => <td key={c.key} style={{padding:"10px 7px",borderBottom:"1px solid #f1f5f9",color:"#0b1220",fontWeight:c.bold?850:500,verticalAlign:"middle"}}>{c.render ? c.render(row) : row[c.key]}</td>)}</tr>)}
      </tbody>
    </table>
  </div>;
}

function Check({ checked, onChange, label }) {
  return <label style={{display:"inline-flex",alignItems:"center",gap:8,cursor:"pointer",color:"#334155",fontWeight:850,padding:"8px 10px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12}}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    {label}
  </label>;
}

const OWNERS = [
  { id:"SR-PROP-00125", name:"Marta López", phone:"+34 600 000 000", email:"propietario@ejemplo.com", iban:"ES12 **** **** **** 1234", contract:"Declarado correcto", status:"Activo" },
  { id:"SR-PROP-00126", name:"Javier Ruiz", phone:"+34 622 000 000", email:"javier@ejemplo.com", iban:"Pendiente", contract:"Pendiente subir", status:"Pendiente" },
  { id:"SR-PROP-00127", name:"Inmobiliaria Delta", phone:"+34 931 000 000", email:"delta@ejemplo.com", iban:"ES88 **** **** **** 8890", contract:"Declarado correcto", status:"Colaborador" },
];

const ESTATES = [
  {
    id:"SR-IMM-00001", province:"Barcelona", city:"Manresa", zone:"Centro", address:"Calle Mayor 12",
    ownerId:"SR-PROP-00125", franchisee:"SR-FR-00012", status:"Activo", contractStatus:"Declarado correcto",
    servicesIncluded:true, servicesFee:25, insurance:"Pendiente", description:"Piso urbano preparado para explotación por habitaciones, con zonas comunes equipadas y buena comunicación.",
    commonAreas:[
      { id:"CA-01", area:"Cocina", description:"Cocina equipada para uso compartido.", photos:2 },
      { id:"CA-02", area:"Comedor", description:"Mesa comedor 180 x 90, 4 sillas y mueble auxiliar.", photos:3 },
      { id:"CA-03", area:"Lavadero", description:"Zona de lavado con lavadora.", photos:1 },
    ],
    inventory:[
      { id:"INV-01", item:"Frigorífico", brand:"Bosch", model:"KGN39X", status:"Bueno", photos:1 },
      { id:"INV-02", item:"Lavadora", brand:"Samsung", model:"WW90T", status:"Bueno", photos:1 },
      { id:"INV-03", item:"Mesa comedor", brand:"—", model:"180 x 90", status:"Bueno", photos:2 },
    ],
    rooms:[
      { id:"SR-IMM-00001-H01", title:"Habitación Centro A", price:385, basePrice:310, bath:true, balcony:true, services:true, status:"Ocupada", tenantId:"SR-I-00452", photos:5, publish:"ok", incidents:"🟡" },
      { id:"SR-IMM-00001-H02", title:"Habitación Centro B", price:335, basePrice:310, bath:false, balcony:false, services:true, status:"Libre", tenantId:null, photos:2, publish:"wait", incidents:"🟢" },
      { id:"SR-IMM-00001-H03", title:"Habitación Centro C", price:360, basePrice:310, bath:false, balcony:true, services:true, status:"Publicada", tenantId:null, photos:4, publish:"ok", incidents:"🟢" },
      { id:"SR-IMM-00001-H04", title:"Habitación Centro D", price:335, basePrice:310, bath:false, balcony:false, services:true, status:"Pendiente fotos", tenantId:null, photos:0, publish:"danger", incidents:"🟢" },
    ],
    incidents:[
      { id:"INC-001", level:"🟡", subject:"Ruido nocturno en H01", status:"Revisar" },
      { id:"INC-002", level:"🟢", subject:"Comentario limpieza cocina", status:"Seguimiento" },
    ],
  },
  {
    id:"SR-IMM-00002", province:"Barcelona", city:"Terrassa", zone:"Centre", address:"Rambla Nova 8",
    ownerId:"SR-PROP-00126", franchisee:"SR-FR-00018", status:"Pendiente contrato", contractStatus:"Pendiente subir",
    servicesIncluded:true, servicesFee:25, insurance:"No ofertado", description:"Finca en valoración, pendiente de contrato y alta definitiva.",
    commonAreas:[{ id:"CA-11", area:"Cocina", description:"Pendiente inventario.", photos:0 }, { id:"CA-12", area:"Comedor", description:"Pendiente fotos.", photos:0 }],
    inventory:[{ id:"INV-11", item:"Frigorífico", brand:"Pendiente", model:"Pendiente", status:"Pendiente", photos:0 }],
    rooms:[
      { id:"SR-IMM-00002-H01", title:"Habitación Terrassa A", price:350, basePrice:325, bath:false, balcony:false, services:true, status:"Borrador", tenantId:null, photos:1, publish:"danger", incidents:"🟢" },
      { id:"SR-IMM-00002-H02", title:"Habitación Terrassa B", price:375, basePrice:325, bath:true, balcony:false, services:true, status:"Borrador", tenantId:null, photos:0, publish:"danger", incidents:"🟢" },
    ],
    incidents:[],
  },
  {
    id:"SR-IMM-00003", province:"Barcelona", city:"Sabadell", zone:"Eix Macià", address:"Avenida Central 22",
    ownerId:"SR-PROP-00127", franchisee:"SR-FR-00021", status:"Activo", contractStatus:"Declarado correcto",
    servicesIncluded:true, servicesFee:25, insurance:"Pendiente propuesta", description:"Cartera de habitaciones en finca gestionada por colaborador.",
    commonAreas:[{ id:"CA-21", area:"Cocina", description:"Cocina amplia con comedor auxiliar.", photos:4 }, { id:"CA-22", area:"Terraza", description:"Terraza común con mobiliario.", photos:3 }],
    inventory:[{ id:"INV-21", item:"Frigorífico", brand:"LG", model:"GBB72", status:"Bueno", photos:1 }, { id:"INV-22", item:"Sofá", brand:"—", model:"3 plazas", status:"Uso normal", photos:1 }],
    rooms:[
      { id:"SR-IMM-00003-H01", title:"Eix Macià A", price:395, basePrice:345, bath:false, balcony:true, services:true, status:"Ocupada", tenantId:"SR-I-00453", photos:6, publish:"ok", incidents:"🟢" },
      { id:"SR-IMM-00003-H02", title:"Eix Macià B", price:370, basePrice:345, bath:false, balcony:false, services:true, status:"Libre", tenantId:null, photos:4, publish:"ok", incidents:"🟢" },
    ],
    incidents:[],
  },
];

const TENANTS = [
  { id:"SR-I-00452", name:"Christian B.", phone:"+34 607 000 000", email:"christian@ejemplo.com", room:"SR-IMM-00001-H01", status:"Activo" },
  { id:"SR-I-00453", name:"Ana R.", phone:"+34 644 000 000", email:"ana@ejemplo.com", room:"SR-IMM-00003-H01", status:"Activo" },
  { id:"SR-I-00454", name:"Laura M.", phone:"+34 633 000 000", email:"laura@ejemplo.com", room:"Pendiente asignar", status:"Documentación" },
];

const CONTACTS = [
  { id:"SR-C-001", name:"Marta López", type:"Propietaria", phone:"+34 600 000 000", email:"propietario@ejemplo.com", zone:"Manresa", next:"Llamar hoy" },
  { id:"SR-C-002", name:"Javier Ruiz", type:"Propietario", phone:"+34 622 000 000", email:"javier@ejemplo.com", zone:"Terrassa", next:"Contrato" },
  { id:"SR-C-003", name:"Corredor MAPFRE", type:"Corredor seguros", phone:"+34 699 000 000", email:"seguros@ejemplo.com", zone:"Barcelona", next:"Seguro finca" },
];

function estateLiquidation(estate) {
  const gross = estate.rooms.reduce((sum, r) => sum + Number(r.price || 0), 0);
  const services = estate.servicesIncluded ? estate.rooms.length * estate.servicesFee : 0;
  const net = Math.max(0, gross - services);
  const owner = Math.round(net * 0.80);
  const management = Math.round(net * 0.20);
  const franchisee = Math.round(management * 0.60);
  const spainroom = management - franchisee;
  return { gross, services, net, owner, management, franchisee, spainroom };
}

export default function DashboardFranquiciado() {
  const [activeTab, setActiveTab] = useState("fincas");
  const [selectedEstateId, setSelectedEstateId] = useState("SR-IMM-00001");
  const [selectedRoomId, setSelectedRoomId] = useState("SR-IMM-00001-H01");
  const [owners, setOwners] = useState(() => {
    try { return JSON.parse(localStorage.getItem("SR_V2_OWNERS") || "null") || OWNERS; } catch { return OWNERS; }
  });
  const [tenants, setTenants] = useState(() => {
    try { return JSON.parse(localStorage.getItem("SR_V2_TENANTS") || "null") || TENANTS; } catch { return TENANTS; }
  });
  const [contacts, setContacts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("SR_V2_CONTACTS") || "null") || CONTACTS; } catch { return CONTACTS; }
  });
  const [editingOwner, setEditingOwner] = useState(null);
  const [editingTenant, setEditingTenant] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [newContact, setNewContact] = useState({ name:"", type:"Propietario", phone:"", email:"", zone:"", next:"" });
  const [roomDrafts, setRoomDrafts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("SR_V2_ROOM_DRAFTS") || "{}"); } catch { return {}; }
  });
  const [roomNotice, setRoomNotice] = useState("");
  const [contractFileName, setContractFileName] = useState("");
  const [checks, setChecks] = useState({ sameModel:true, noChanges:true, witnessed:true, identity:true, authorized:true, responsible:true });
  const franchisee = { id:"SR-FR-00012", name:"Marta", zone:"Manresa · Bages" };
  const [simHomeValue, setSimHomeValue] = useState(240000);
  const [simServicesIncluded, setSimServicesIncluded] = useState(true);
  const [simServicesFee, setSimServicesFee] = useState(25);
  const [simRooms, setSimRooms] = useState([
    { id:1, m2:9, bathM2:3, balconyM2:0, bath:true, balcony:false },
    { id:2, m2:12, bathM2:0, balconyM2:2, bath:false, balcony:true },
    { id:3, m2:11, bathM2:0, balconyM2:0, bath:false, balcony:false },
    { id:4, m2:14, bathM2:0, balconyM2:0, bath:false, balcony:false },
  ]);
  const [simNotice, setSimNotice] = useState("");

  const selectedEstate = ESTATES.find(e => e.id === selectedEstateId) || ESTATES[0];
  const selectedOwner = owners.find(o => o.id === selectedEstate.ownerId) || owners[0];
  const allRooms = ESTATES.flatMap(e => e.rooms.map(r => ({...r, estateId:e.id, ownerId:e.ownerId})));
  const selectedRoom = allRooms.find(r => r.id === selectedRoomId) || selectedEstate.rooms[0];
  const selectedTenant = selectedRoom?.tenantId ? tenants.find(t => t.id === selectedRoom.tenantId) : null;
  const selectedLiq = estateLiquidation(selectedEstate);
  const simMaxMonthlyRent = simHomeValue * 0.0052;
  const simTotalPrivateM2 = simRooms.reduce((sum, r) => sum + Number(r.m2 || 0) + Number(r.bathM2 || 0) + Number(r.balconyM2 || 0), 0);
  const simEuroM2 = simTotalPrivateM2 > 0 ? simMaxMonthlyRent / simTotalPrivateM2 : 0;
  const calculatedSimRooms = simRooms.map((r, idx) => {
    const privateM2 = Number(r.m2 || 0) + Number(r.bathM2 || 0) + Number(r.balconyM2 || 0);
    const services = simServicesIncluded ? Number(simServicesFee || 0) : 0;
    const supplement = services + (r.bath ? 25 : 0) + (r.balcony ? 25 : 0);
    const finalPrice = Math.round(privateM2 * simEuroM2 + supplement);
    return { ...r, code:`${selectedEstate.id}-H${String(idx + 1).padStart(2, "0")}`, privateM2, services, supplement, finalPrice };
  });
  const simGross = calculatedSimRooms.reduce((sum, r) => sum + r.finalPrice, 0);
  const simServicesCost = calculatedSimRooms.reduce((sum, r) => sum + r.services, 0);
  const simNet = Math.max(0, simGross - simServicesCost);
  const simOwner = Math.round(simNet * 0.80);
  const simManagement = Math.round(simNet * 0.20);
  const simMyIncome = Math.round(simManagement * 0.60);

  const global = ESTATES.reduce((acc, e) => {
    const liq = estateLiquidation(e);
    acc.estates += 1; acc.rooms += e.rooms.length; acc.occupied += e.rooms.filter(r => r.status === "Ocupada").length;
    acc.gross += liq.gross; acc.franchisee += liq.franchisee; acc.spainroom += liq.spainroom; acc.owner += liq.owner;
    return acc;
  }, { estates:0, rooms:0, occupied:0, gross:0, franchisee:0, spainroom:0, owner:0 });

  function openEstate(id) {
    setSelectedEstateId(id);
    const e = ESTATES.find(x => x.id === id);
    if (e?.rooms?.[0]) setSelectedRoomId(e.rooms[0].id);
    setActiveTab("fincas");
  }

  function saveOwner() {
    const next = owners.map(o => o.id === editingOwner.id ? editingOwner : o);
    setOwners(next); localStorage.setItem("SR_V2_OWNERS", JSON.stringify(next)); setEditingOwner(null);
  }
  function saveTenant() {
    const next = tenants.map(t => t.id === editingTenant.id ? editingTenant : t);
    setTenants(next); localStorage.setItem("SR_V2_TENANTS", JSON.stringify(next)); setEditingTenant(null);
  }
  function saveContact() {
    const next = contacts.map(c => c.id === editingContact.id ? editingContact : c);
    setContacts(next); localStorage.setItem("SR_V2_CONTACTS", JSON.stringify(next)); setEditingContact(null);
  }
  function addContact() {
    if (!newContact.name.trim()) return;
    const item = { id:`SR-C-${Date.now()}`, ...newContact };
    const next = [item, ...contacts];
    setContacts(next); localStorage.setItem("SR_V2_CONTACTS", JSON.stringify(next));
    setNewContact({ name:"", type:"Propietario", phone:"", email:"", zone:"", next:"" });
  }

  function saveRoomDraft(patch = {}) {
    const key = selectedRoom.id;
    const current = roomDrafts[key] || {};
    const next = {...roomDrafts, [key]: {...selectedRoom, ...current, ...patch, savedAt:new Date().toLocaleString("es-ES")}};
    setRoomDrafts(next); localStorage.setItem("SR_V2_ROOM_DRAFTS", JSON.stringify(next)); setRoomNotice(`Ficha guardada: ${key}`);
  }

  function handlePhotos(files) {
    const uploaded = Array.from(files || []).map(file => ({ name:file.name, url:URL.createObjectURL(file) }));
    if (!uploaded.length) return;
    const key = selectedRoom.id;
    const current = roomDrafts[key] || {};
    const next = {...roomDrafts, [key]: {...current, photos:[...(current.photos || []), ...uploaded]}};
    setRoomDrafts(next); localStorage.setItem("SR_V2_ROOM_DRAFTS", JSON.stringify(next)); setRoomNotice(`${uploaded.length} foto(s) añadida(s).`);
  }

  function publishRoom() {
    const draft = roomDrafts[selectedRoom.id] || {};
    const photoCount = draft.photos?.length || selectedRoom.photos || 0;
    if (selectedOwner.iban === "Pendiente") return setRoomNotice("Falta IBAN propietario.");
    if (selectedEstate.contractStatus !== "Declarado correcto") return setRoomNotice("Falta contrato propietario declarado correcto.");
    if (!photoCount) return setRoomNotice("Faltan fotos.");
    saveRoomDraft({ status:"Lista para publicar", publish:"ok" });
    setRoomNotice(`Habitación ${selectedRoom.id} lista para publicar.`);
  }

  function updateSimRoom(id, patch) {
    setSimRooms(rows => rows.map(r => r.id === id ? { ...r, ...patch } : r));
  }
  function addSimRoom() {
    const nextId = Math.max(...simRooms.map(r => r.id)) + 1;
    setSimRooms(rows => [...rows, { id:nextId, m2:10, bathM2:0, balconyM2:0, bath:false, balcony:false }]);
  }
  function removeSimRoom(id) {
    setSimRooms(rows => rows.length <= 1 ? rows : rows.filter(r => r.id !== id));
  }
  function saveSimulation() {
    setSimNotice(`Simulación guardada para ${selectedEstate.id}: ${calculatedSimRooms.length} habitación(es) · ${money(simGross)}.`);
  }
  function goOwner(ownerId) {
    const owner = owners.find(o => o.id === ownerId);
    if (owner) setEditingOwner(owner);
    setActiveTab("propietarios");
  }
  function goTenant(tenantId) {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) setEditingTenant(tenant);
    setActiveTab("inquilinos");
  }
  function openRoom(roomId) {
    setSelectedRoomId(roomId);
    setActiveTab("fincas");
    setTimeout(() => document.getElementById("sr-room-detail")?.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
  }

  const linkBtn = { background:"transparent", border:0, color:blue, cursor:"pointer", fontWeight:950, padding:0, textDecoration:"underline" };

  const tabStyle = (tab) => ({
    border:"1px solid " + (activeTab === tab ? blue : "#dbeafe"),
    background:activeTab === tab ? blue : "#fff",
    color:activeTab === tab ? "#fff" : blue,
    borderRadius:14, padding:"10px 12px", fontWeight:950, cursor:"pointer",
  });

  return <main style={{minHeight:"100vh",background:"#f8fafc",color:"#0b1220",padding:"24px 16px 36px"}}>
    <div style={{maxWidth:1380,margin:"0 auto"}}>
      <section style={{background:"linear-gradient(135deg, #0b65d8 0%, #084fa8 100%)",color:"#fff",borderRadius:24,padding:"28px 24px",marginBottom:18,boxShadow:"0 12px 30px rgba(10,88,202,.24)"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.14)",border:"1px solid rgba(255,255,255,.24)",borderRadius:999,padding:"7px 12px",fontWeight:950,marginBottom:14}}>SpainRoom<sup>®</sup> · Dashboard Franquiciado</div>
            <h1 style={{margin:"0 0 8px",fontSize:"clamp(30px,4vw,46px)",lineHeight:1.08,fontWeight:950,letterSpacing:"-.035em"}}>Hola {franchisee.name} 👋</h1>
            <p style={{margin:0,maxWidth:930,color:"rgba(255,255,255,.92)",lineHeight:1.6}}><strong>{franchisee.id}</strong> · Zona {franchisee.zone}. El centro del sistema es la finca: desde un expediente llegas a propietario, habitaciones, inquilinos y liquidaciones.</p>
          </div>
          <div style={{background:"rgba(255,255,255,.14)",border:"1px solid rgba(255,255,255,.24)",borderRadius:18,padding:14,minWidth:270}}>
            <div style={{fontWeight:950,marginBottom:8}}>🏠 Expediente activo</div>
            <div style={{fontSize:14,lineHeight:1.5,color:"rgba(255,255,255,.92)"}}>{selectedEstate.id}<br/>{selectedEstate.city} · {selectedEstate.zone}<br/>Propietario: {selectedOwner.name}</div>
          </div>
        </div>
      </section>

      <section className="sr-pro-kpis" style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:14,marginBottom:18}}>
        <KPI icon="🏠" label="Fincas" value={global.estates} hint="Expedientes maestros" tone="purple" />
        <KPI icon="🚪" label="Habitaciones" value={global.rooms} hint={`${global.occupied} ocupadas`} tone="ok" />
        <KPI icon="💶" label="Ingreso bruto" value={money(global.gross)} hint="Cartera mensual" />
        <KPI icon="🤝" label="Mi ingreso" value={money(global.franchisee)} hint="Cartera activa" tone="ok" />
        <KPI icon="📌" label="Pendientes" value="2" hint="Contrato y fotos" />
        <KPI icon="🎯" label="Canon recuperado" value="27 %" hint="1.350 € de 5.000 €" tone="wait" />
      </section>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <button type="button" style={tabStyle("negocio")} onClick={() => setActiveTab("negocio")}>📊 Mi negocio</button>
        <button type="button" style={tabStyle("simulador")} onClick={() => setActiveTab("simulador")}>🧮 Simulador</button>
        <button type="button" style={tabStyle("fincas")} onClick={() => setActiveTab("fincas")}>🏠 Fincas</button>
        <button type="button" style={tabStyle("propietarios")} onClick={() => setActiveTab("propietarios")}>👤 Propietarios</button>
        <button type="button" style={tabStyle("inquilinos")} onClick={() => setActiveTab("inquilinos")}>👥 Inquilinos</button>
        <button type="button" style={tabStyle("contactos")} onClick={() => setActiveTab("contactos")}>📞 Contactos</button>
        <button type="button" style={tabStyle("liquidaciones")} onClick={() => setActiveTab("liquidaciones")}>💰 Liquidaciones</button>
      </div>

      {activeTab === "negocio" && <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
        <Card title="Mi negocio" icon="💰" right={<Badge tone="ok">Cartera activa</Badge>}>
          <div style={{display:"grid",gap:10}}>
            <div style={metricLine}><span>Canon inicial</span><strong>{money(5000)}</strong></div>
            <div style={metricLine}><span>Ingresos acumulados</span><strong>{money(1350)}</strong></div>
            <div style={metricLine}><span>Recuperación</span><strong>27 %</strong></div>
            <div style={metricLine}><span>Mi ingreso</span><strong>{money(global.franchisee)}</strong></div>
            <div style={metricLine}><span>Ingreso anual</span><strong>{money(global.franchisee * 12)}</strong></div>
          </div>
        </Card>
        <Card title="Resumen de cartera" icon="🧮" right={<Badge tone="dark">Sin porcentajes visibles</Badge>}>
          <div style={{display:"grid",gap:10}}>
            <div style={metricLine}><span>Ingreso bruto habitaciones</span><strong>{money(global.gross)}</strong></div>
            <div style={metricLine}><span>Propietarios</span><strong>{money(global.owner)}</strong></div>
            <div style={metricLine}><span>Mi ingreso</span><strong>{money(global.franchisee)}</strong></div>
            <div style={metricLine}><span>Pendientes</span><strong>2</strong></div>
          </div>
        </Card>
      </section>}

      {activeTab === "simulador" && <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"1fr .8fr",gap:16,alignItems:"start"}}>
        <Card title="Simulador de precios por finca" icon="🧮" right={<Badge tone="ok">{selectedEstate.id}</Badge>}>
          <p style={{color:"#64748b",lineHeight:1.55,marginTop:0}}>Calcula precios finales por habitación. El inquilino solo ve el precio final con servicios incluidos.</p>
          <div className="sr-sim-form" style={{display:"grid",gridTemplateColumns:"1.2fr .8fr .7fr",gap:10,marginBottom:14}}>
            <Field label="Finca" value={`${selectedEstate.id} · ${selectedEstate.city} · ${selectedEstate.zone}`} onChange={() => {}} />
            <Field label="Valor estimado vivienda" type="number" value={simHomeValue} onChange={v => setSimHomeValue(Number(v))} />
            <Field label="Servicios €/hab." type="number" value={simServicesFee} onChange={v => setSimServicesFee(Number(v))} />
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            <Check checked={simServicesIncluded} onChange={setSimServicesIncluded} label="+25 servicios incluidos" />
            <Badge tone="dark">Baño privado +25</Badge>
            <Badge tone="dark">Balcón privado +25</Badge>
          </div>
          <div style={{display:"grid",gap:10}}>
            {simRooms.map((r, idx) => <div key={r.id} className="sr-room-row" style={{display:"grid",gridTemplateColumns:"150px 1fr 1fr 1fr auto",gap:10,alignItems:"end",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:12}}>
              <div><button type="button" style={linkBtn} onClick={() => openRoom(`${selectedEstate.id}-H${String(idx + 1).padStart(2, "0")}`)}>{selectedEstate.id}-H{String(idx + 1).padStart(2, "0")}</button><div style={{fontSize:12,color:"#64748b"}}>Precio final: {money(calculatedSimRooms[idx]?.finalPrice)}</div></div>
              <Field label="m² habitación" type="number" value={r.m2} onChange={v => updateSimRoom(r.id, { m2:Number(v) })} />
              <Field label="m² baño privado" type="number" value={r.bathM2} onChange={v => updateSimRoom(r.id, { bathM2:Number(v), bath:Number(v) > 0 ? true : r.bath })} />
              <Field label="m² balcón privado" type="number" value={r.balconyM2} onChange={v => updateSimRoom(r.id, { balconyM2:Number(v), balcony:Number(v) > 0 ? true : r.balcony })} />
              <div style={{display:"grid",gap:8}}><Check checked={r.bath} onChange={v => updateSimRoom(r.id, { bath:v })} label="+25 baño" /><Check checked={r.balcony} onChange={v => updateSimRoom(r.id, { balcony:v })} label="+25 balcón" /><Button small danger onClick={() => removeSimRoom(r.id)}>Quitar</Button></div>
            </div>)}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:12}}><Button secondary onClick={addSimRoom}>+ Añadir habitación</Button><Button onClick={saveSimulation}>💾 Guardar simulación</Button></div>
          {simNotice && <div style={{marginTop:10,color:"#047857",fontWeight:900}}>{simNotice}</div>}
        </Card>
        <Card title="Resultado" icon="💰" right={<Badge tone="dark">Interno</Badge>}>
          <div style={{display:"grid",gap:10}}>
            <div style={metricLine}><span>Precio final habitaciones</span><strong>{money(simGross)}</strong></div>
            <div style={metricLine}><span>Servicios internos</span><strong>{money(simServicesCost)}</strong></div>
            <div style={metricLine}><span>Propietario</span><strong>{money(simOwner)}</strong></div>
            <div style={metricLine}><span>Mi ingreso</span><strong>{money(simMyIncome)}</strong></div>
          </div>
          <p style={{color:"#64748b",lineHeight:1.55,margin:"12px 0 0"}}>Servicios, baño y balcón justifican diferencias internas. No se muestran porcentajes al franquiciado.</p>
        </Card>
      </section>}

      {activeTab === "fincas" && <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"0.95fr 1.25fr",gap:16,alignItems:"start"}}>
        <div style={{display:"grid",gap:16}}>
          <Card title="Fincas asignadas" icon="🏠" right={<Badge tone="purple">Expediente maestro</Badge>}>
            <Table columns={[
              { key:"id", label:"Finca", bold:true, render:e => <button type="button" style={linkBtn} onClick={() => openEstate(e.id)}>{e.id}</button> },
              { key:"city", label:"Localidad" },
              { key:"zone", label:"Zona" },
              { key:"owner", label:"Propietario", render:e => { const o = owners.find(x => x.id === e.ownerId); return <button type="button" style={linkBtn} onClick={() => goOwner(e.ownerId)}>{o?.name || "—"}</button>; } },
              { key:"rooms", label:"Hab.", render:e => e.rooms.length },
              { key:"status", label:"Estado", render:e => <Badge tone={e.status === "Activo" ? "ok" : "wait"}>{e.status}</Badge> },
              { key:"actions", label:"", render:e => <Button small onClick={() => openEstate(e.id)}>Ver</Button> },
            ]} rows={ESTATES} empty="Sin fincas." />
          </Card>

          <Card title="Propietario de la finca" icon="👤" right={<Badge tone={selectedOwner.iban === "Pendiente" ? "danger" : "ok"}>IBAN {selectedOwner.iban === "Pendiente" ? "pendiente" : "ok"}</Badge>}>
            <div style={{display:"grid",gap:8,color:"#334155"}}>
              <div><strong>{selectedOwner.id}</strong> · {selectedOwner.name}</div>
              <div>📞 {selectedOwner.phone}</div>
              <div>✉️ {selectedOwner.email}</div>
              <div>🏦 {selectedOwner.iban}</div>
              <div>📄 Contrato: {selectedEstate.contractStatus}</div>
              <div><strong>🏠 Mis fincas:</strong> {ESTATES.filter(e => e.ownerId === selectedOwner.id).map(e => <button key={e.id} type="button" style={{...linkBtn, marginLeft:8}} onClick={() => openEstate(e.id)}>{e.id}</button>)}</div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
              <Button small secondary onClick={() => { setEditingOwner(selectedOwner); setActiveTab("propietarios"); }}>Editar propietario</Button>
            </div>
          </Card>

          <Card title="Contrato propietario" icon="📄" right={<Badge tone={selectedEstate.contractStatus === "Declarado correcto" ? "ok" : "wait"}>{selectedEstate.contractStatus}</Badge>}>
            <label style={{display:"inline-flex",alignItems:"center",justifyContent:"center",border:"1px solid #cfe0ff",borderRadius:13,padding:"10px 13px",fontWeight:950,color:blue,background:"#f8fafc",cursor:"pointer"}}>
              Subir contrato firmado
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}} onChange={e => { const f=e.target.files?.[0]; if(f){ setContractFileName(f.name); setRoomNotice(`Contrato recibido: ${f.name}`); } }} />
            </label>
            {contractFileName && <div style={{marginTop:10,color:"#047857",fontWeight:900}}>Archivo: {contractFileName}</div>}
            <div style={{display:"grid",gap:8,marginTop:12}}>
              <Check checked={checks.sameModel} onChange={v => setChecks(c => ({...c,sameModel:v}))} label="Es el modelo SpainRoom remitido" />
              <Check checked={checks.noChanges} onChange={v => setChecks(c => ({...c,noChanges:v}))} label="No contiene modificaciones ni añadidos" />
              <Check checked={checks.witnessed} onChange={v => setChecks(c => ({...c,witnessed:v}))} label="Firma presenciada por el franquiciado" />
              <Check checked={checks.identity} onChange={v => setChecks(c => ({...c,identity:v}))} label="Identidad del firmante comprobada" />
              <Check checked={checks.authorized} onChange={v => setChecks(c => ({...c,authorized:v}))} label="Firmante propietario o autorizado" />
              <Check checked={checks.responsible} onChange={v => setChecks(c => ({...c,responsible:v}))} label="Asumo responsabilidad de la veracidad" />
            </div>
          </Card>
        </div>

        <div style={{display:"grid",gap:16}}>
          <Card title={`${selectedEstate.id} · ${selectedEstate.city} · ${selectedEstate.zone}`} icon="📁" right={<Badge tone="info">{selectedEstate.franchisee}</Badge>}>
            <div className="sr-estate-summary" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
              <KPI icon="🚪" label="Habitaciones" value={selectedEstate.rooms.length} hint={`${selectedEstate.rooms.filter(r => r.status === "Ocupada").length} ocupadas`} tone="ok" />
              <KPI icon="💶" label="Bruto finca" value={money(selectedLiq.gross)} hint="Precio final" />
              <KPI icon="🔌" label="Servicios internos" value={money(selectedLiq.services)} hint={`${selectedEstate.servicesFee} €/hab.`} tone="wait" />
              <KPI icon="🤝" label="Mi ingreso" value={money(selectedLiq.franchisee)} hint="Cartera finca" tone="ok" />
            </div>
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
              <strong>Descripción del inmueble</strong>
              <p style={{color:"#475569",lineHeight:1.55,margin:"8px 0 0"}}>{selectedEstate.description}</p>
            </div>
          </Card>

          <Card title="Zonas comunes" icon="🏘️" right={<Badge tone="dark">Operativo franquiciado</Badge>}>
            <Table columns={[
              { key:"area", label:"Zona", bold:true },
              { key:"description", label:"Descripción" },
              { key:"photos", label:"Fotos" },
            ]} rows={selectedEstate.commonAreas} empty="Sin zonas comunes." />
          </Card>

          <Card title="Inventario visible de la finca" icon="📦" right={<Badge tone="info">Para incidencias</Badge>}>
            <Table columns={[
              { key:"item", label:"Elemento", bold:true },
              { key:"brand", label:"Marca" },
              { key:"model", label:"Modelo / medida" },
              { key:"status", label:"Estado" },
              { key:"photos", label:"Fotos" },
            ]} rows={selectedEstate.inventory} empty="Sin inventario." />
          </Card>

          <Card title="Habitaciones de la finca" icon="🚪" right={<Badge tone="ok">Precio final visible</Badge>}>
            <Table columns={[
              { key:"id", label:"Habitación", bold:true, render:r => <button type="button" style={linkBtn} onClick={() => openRoom(r.id)}>{r.id}</button> },
              { key:"title", label:"Título" },
              { key:"price", label:"Precio", render:r => money(r.price) },
              { key:"features", label:"Extras", render:r => <span>{r.services ? "Servicios " : ""}{r.bath ? "· Baño " : ""}{r.balcony ? "· Balcón" : ""}</span> },
              { key:"status", label:"Estado", render:r => <Badge tone={r.status === "Ocupada" ? "ok" : r.status === "Pendiente fotos" ? "danger" : "info"}>{r.status}</Badge> },
              { key:"actions", label:"", render:r => <Button small onClick={() => openRoom(r.id)}>Abrir</Button> },
            ]} rows={selectedEstate.rooms} empty="Sin habitaciones." />
          </Card>

          <Card title="Simulador de precios de habitación" icon="🧮" right={<Badge tone="ok">Visible en finca</Badge>}>
            <p style={{color:"#64748b",lineHeight:1.55,marginTop:0}}>
              Calcula el precio final por habitación de esta finca. El inquilino solo verá el precio final con servicios incluidos.
            </p>
            <div className="sr-sim-form" style={{display:"grid",gridTemplateColumns:"1.2fr .8fr .7fr",gap:10,marginBottom:14}}>
              <Field label="Finca" value={`${selectedEstate.id} · ${selectedEstate.city} · ${selectedEstate.zone}`} onChange={() => {}} />
              <Field label="Valor vivienda" type="number" value={simHomeValue} onChange={v => setSimHomeValue(Number(v))} />
              <Field label="Servicios €/hab." type="number" value={simServicesFee} onChange={v => setSimServicesFee(Number(v))} />
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              <Check checked={simServicesIncluded} onChange={setSimServicesIncluded} label="+25 servicios incluidos" />
              <Badge tone="dark">Baño privado +25</Badge>
              <Badge tone="dark">Balcón privado +25</Badge>
            </div>
            <div style={{display:"grid",gap:10}}>
              {simRooms.map((r, idx) => <div key={r.id} className="sr-room-row" style={{display:"grid",gridTemplateColumns:"145px 1fr 1fr 1fr auto",gap:10,alignItems:"end",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:12}}>
                <div>
                  <button type="button" style={linkBtn} onClick={() => openRoom(`${selectedEstate.id}-H${String(idx + 1).padStart(2, "0")}`)}>{selectedEstate.id}-H{String(idx + 1).padStart(2, "0")}</button>
                  <div style={{fontSize:12,color:"#64748b"}}>Precio final: {money(calculatedSimRooms[idx]?.finalPrice)}</div>
                </div>
                <Field label="m² habitación" type="number" value={r.m2} onChange={v => updateSimRoom(r.id, { m2:Number(v) })} />
                <Field label="m² baño privado" type="number" value={r.bathM2} onChange={v => updateSimRoom(r.id, { bathM2:Number(v), bath:Number(v) > 0 ? true : r.bath })} />
                <Field label="m² balcón privado" type="number" value={r.balconyM2} onChange={v => updateSimRoom(r.id, { balconyM2:Number(v), balcony:Number(v) > 0 ? true : r.balcony })} />
                <div style={{display:"grid",gap:8}}>
                  <Check checked={r.bath} onChange={v => updateSimRoom(r.id, { bath:v })} label="+25 baño" />
                  <Check checked={r.balcony} onChange={v => updateSimRoom(r.id, { balcony:v })} label="+25 balcón" />
                  <Button small danger onClick={() => removeSimRoom(r.id)}>Quitar</Button>
                </div>
              </div>)}
            </div>
            <div className="sr-sim-results" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:14}}>
              <KPI icon="💶" label="Precio habitaciones" value={money(simGross)} hint="Precio final" />
              <KPI icon="🔌" label="Servicios internos" value={money(simServicesCost)} hint={`${simServicesFee} €/hab.`} tone="wait" />
              <KPI icon="👤" label="Propietario" value={money(simOwner)} hint="Liquidación" tone="ok" />
              <KPI icon="🤝" label="Mi ingreso" value={money(simMyIncome)} hint="Cartera finca" tone="ok" />
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:12}}>
              <Button secondary onClick={addSimRoom}>+ Añadir habitación</Button>
              <Button onClick={saveSimulation}>💾 Guardar simulación</Button>
            </div>
            {simNotice && <div style={{marginTop:10,color:"#047857",fontWeight:900}}>{simNotice}</div>}
          </Card>

          <Card title={<span id="sr-room-detail">{`Ficha habitación · ${selectedRoom?.id || "—"}`}</span>} icon="📸" right={<Badge tone={selectedRoom?.publish === "ok" ? "ok" : "wait"}>{selectedRoom?.status}</Badge>}>
            {selectedRoom && <>
              <div className="sr-room-editor" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
                  <strong>{selectedRoom.title}</strong>
                  <div style={{marginTop:8,color:"#475569",lineHeight:1.55}}>
                    Precio final inquilino: <strong>{money((roomDrafts[selectedRoom.id]?.price ?? selectedRoom.price))}</strong><br/>
                    Servicios incluidos: {selectedRoom.services ? "Sí" : "No"}<br/>
                    Baño privado: {selectedRoom.bath ? "Sí" : "No"}<br/>
                    Balcón privado: {selectedRoom.balcony ? "Sí" : "No"}<br/>
                    Inquilino: {selectedTenant ? <button type="button" style={linkBtn} onClick={() => goTenant(selectedTenant.id)}>{selectedTenant.name}</button> : "Sin asignar"}
                  </div>
                </div>
                <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
                  <strong>Completitud publicación</strong>
                  <div style={{display:"grid",gap:6,marginTop:8}}>
                    <div>Fotos: {(roomDrafts[selectedRoom.id]?.photos?.length || selectedRoom.photos) > 0 ? "✅" : "❌"}</div>
                    <div>Descripción: ✅</div>
                    <div>Propietario: ✅</div>
                    <div>Contrato: {selectedEstate.contractStatus === "Declarado correcto" ? "✅" : "❌"}</div>
                    <div>IBAN: {selectedOwner.iban === "Pendiente" ? "❌" : "✅"}</div>
                  </div>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}} className="sr-room-fields">
                <Field label="Título público" value={roomDrafts[selectedRoom.id]?.title ?? selectedRoom.title} onChange={v => saveRoomDraft({title:v})} />
                <Field label="Precio final" type="number" value={roomDrafts[selectedRoom.id]?.price ?? selectedRoom.price} onChange={v => saveRoomDraft({price:Number(v)})} />
                <Field label="Estado" value={roomDrafts[selectedRoom.id]?.status ?? selectedRoom.status} onChange={v => saveRoomDraft({status:v})} />
              </div>

              <label style={{display:"grid",gap:6,marginBottom:12}}>
                <span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Descripción para publicar</span>
                <textarea value={roomDrafts[selectedRoom.id]?.description ?? "Habitación en finca gestionada por SpainRoom, con servicios incluidos y acceso a zonas comunes equipadas."} onChange={e => saveRoomDraft({description:e.target.value})} rows={4} style={{border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",fontWeight:750,resize:"vertical"}} />
              </label>

              <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:12,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",marginBottom:10}}>
                  <strong>Fotos de la habitación</strong>
                  <label style={{display:"inline-flex",alignItems:"center",justifyContent:"center",border:"1px solid #cfe0ff",borderRadius:13,padding:"8px 10px",fontWeight:950,color:blue,background:"#fff",cursor:"pointer"}}>
                    + Subir fotos
                    <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e => handlePhotos(e.target.files)} />
                  </label>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}} className="sr-photo-grid">
                  {(roomDrafts[selectedRoom.id]?.photos || []).map((photo, idx) => <div key={`${photo.name}-${idx}`} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:10}}>
                    <div style={{height:92,borderRadius:12,background:"linear-gradient(135deg,#dbeafe,#f8fafc)",display:"grid",placeItems:"center",fontSize:24,overflow:"hidden"}}>
                      {photo.url ? <img src={photo.url} alt={photo.name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : "🖼️"}
                    </div>
                    <div style={{fontWeight:900,marginTop:8}}>Foto {idx + 1}</div>
                    <div style={{color:"#64748b",fontSize:12,wordBreak:"break-word"}}>{photo.name}</div>
                  </div>)}
                  {!(roomDrafts[selectedRoom.id]?.photos || []).length && <div style={{gridColumn:"1/-1",color:"#64748b",padding:12}}>Todavía no hay fotos subidas en esta prueba. La habitación indica {selectedRoom.photos} foto(s) registradas en demo.</div>}
                </div>
              </div>

              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <Button onClick={() => saveRoomDraft()}>💾 Guardar ficha</Button>
                <Button secondary onClick={publishRoom}>🚀 Publicar si está completa</Button>
              </div>
              {roomNotice && <div style={{marginTop:10,color:"#047857",fontWeight:900}}>{roomNotice}</div>}
            </>}
          </Card>

          <Card title="Incidencias de la finca" icon="⚠️" right={<Badge tone={selectedEstate.incidents.length ? "wait" : "ok"}>{selectedEstate.incidents.length}</Badge>}>
            <Table columns={[
              { key:"level", label:"Nivel" },
              { key:"subject", label:"Asunto", bold:true },
              { key:"status", label:"Estado" },
            ]} rows={selectedEstate.incidents} empty="Sin incidencias." />
          </Card>
        </div>
      </section>}

      {activeTab === "propietarios" && <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"1.05fr .95fr",gap:16,alignItems:"start"}}>
        <Card title="Propietarios" icon="👤" right={<Badge tone="info">Con fincas asociadas</Badge>}>
          <Table columns={[
            { key:"id", label:"Código", bold:true },
            { key:"name", label:"Nombre", bold:true },
            { key:"phone", label:"Teléfono" },
            { key:"email", label:"Email" },
            { key:"iban", label:"IBAN" },
            { key:"fincas", label:"Fincas", render:o => ESTATES.filter(e => e.ownerId === o.id).length },
            { key:"actions", label:"", render:o => <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Button small onClick={() => setEditingOwner(o)}>Editar</Button><Button small secondary onClick={() => { const e = ESTATES.find(x => x.ownerId === o.id); if (e) openEstate(e.id); }}>Ver fincas</Button></div> },
          ]} rows={owners} empty="Sin propietarios." />
        </Card>

        <Card title="Editar propietario" icon="✏️" right={editingOwner ? <Badge tone="wait">{editingOwner.id}</Badge> : <Badge tone="dark">Selecciona</Badge>}>
          {editingOwner ? <div style={{display:"grid",gap:10}}>
            <Field label="Nombre" value={editingOwner.name || ""} onChange={v => setEditingOwner(o => ({...o,name:v}))} />
            <Field label="Teléfono" value={editingOwner.phone || ""} onChange={v => setEditingOwner(o => ({...o,phone:v}))} />
            <Field label="Email" value={editingOwner.email || ""} onChange={v => setEditingOwner(o => ({...o,email:v}))} />
            <Field label="IBAN" value={editingOwner.iban || ""} onChange={v => setEditingOwner(o => ({...o,iban:v}))} />
            <Field label="Estado contrato" value={editingOwner.contract || ""} onChange={v => setEditingOwner(o => ({...o,contract:v}))} />
            <Button onClick={saveOwner}>💾 Guardar propietario</Button>
          </div> : <p style={{color:"#64748b"}}>Pulsa editar en un propietario.</p>}
        </Card>
      </section>}

      {activeTab === "inquilinos" && <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"1.05fr .95fr",gap:16,alignItems:"start"}}>
        <Card title="Inquilinos" icon="👥" right={<Badge tone="info">Vinculados a habitación</Badge>}>
          <Table columns={[
            { key:"id", label:"Código", bold:true },
            { key:"name", label:"Nombre", bold:true },
            { key:"phone", label:"Teléfono" },
            { key:"email", label:"Email" },
            { key:"room", label:"Habitación" },
            { key:"status", label:"Estado", render:t => <Badge tone={t.status === "Activo" ? "ok" : "wait"}>{t.status}</Badge> },
            { key:"actions", label:"", render:t => <Button small onClick={() => setEditingTenant(t)}>Editar</Button> },
          ]} rows={tenants} empty="Sin inquilinos." />
        </Card>
        <Card title="Editar inquilino" icon="✏️" right={editingTenant ? <Badge tone="wait">{editingTenant.id}</Badge> : <Badge tone="dark">Selecciona</Badge>}>
          {editingTenant ? <div style={{display:"grid",gap:10}}>
            <Field label="Nombre" value={editingTenant.name || ""} onChange={v => setEditingTenant(t => ({...t,name:v}))} />
            <Field label="Teléfono" value={editingTenant.phone || ""} onChange={v => setEditingTenant(t => ({...t,phone:v}))} />
            <Field label="Email" value={editingTenant.email || ""} onChange={v => setEditingTenant(t => ({...t,email:v}))} />
            <Field label="Habitación" value={editingTenant.room || ""} onChange={v => setEditingTenant(t => ({...t,room:v}))} />
            <Field label="Estado" value={editingTenant.status || ""} onChange={v => setEditingTenant(t => ({...t,status:v}))} />
            <Button onClick={saveTenant}>💾 Guardar inquilino</Button>
          </div> : <p style={{color:"#64748b"}}>Pulsa editar en un inquilino.</p>}
        </Card>
      </section>}

      {activeTab === "contactos" && <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"1.05fr .95fr",gap:16,alignItems:"start"}}>
        <div style={{display:"grid",gap:16}}>
          <Card title="Añadir contacto rápido" icon="➕">
            <div className="sr-contact-form" style={{display:"grid",gridTemplateColumns:"1fr .8fr",gap:10}}>
              <Field label="Nombre" value={newContact.name} onChange={v => setNewContact(c => ({...c,name:v}))} />
              <Field label="Tipo" value={newContact.type} onChange={v => setNewContact(c => ({...c,type:v}))} />
              <Field label="Teléfono" value={newContact.phone} onChange={v => setNewContact(c => ({...c,phone:v}))} />
              <Field label="Email" value={newContact.email} onChange={v => setNewContact(c => ({...c,email:v}))} />
              <Field label="Zona" value={newContact.zone} onChange={v => setNewContact(c => ({...c,zone:v}))} />
              <Field label="Siguiente acción" value={newContact.next} onChange={v => setNewContact(c => ({...c,next:v}))} />
            </div>
            <div style={{marginTop:10}}><Button onClick={addContact}>+ Guardar contacto</Button></div>
          </Card>
          <Card title="Contactos" icon="📞">
            <Table columns={[
              { key:"name", label:"Nombre", bold:true },
              { key:"type", label:"Tipo" },
              { key:"phone", label:"Teléfono" },
              { key:"email", label:"Email" },
              { key:"zone", label:"Zona" },
              { key:"next", label:"Siguiente" },
              { key:"actions", label:"", render:c => <Button small onClick={() => setEditingContact(c)}>Editar</Button> },
            ]} rows={contacts} empty="Sin contactos." />
          </Card>
        </div>
        <Card title="Editar contacto" icon="✏️" right={editingContact ? <Badge tone="wait">{editingContact.id}</Badge> : <Badge tone="dark">Selecciona</Badge>}>
          {editingContact ? <div style={{display:"grid",gap:10}}>
            <Field label="Nombre" value={editingContact.name || ""} onChange={v => setEditingContact(c => ({...c,name:v}))} />
            <Field label="Tipo" value={editingContact.type || ""} onChange={v => setEditingContact(c => ({...c,type:v}))} />
            <Field label="Teléfono" value={editingContact.phone || ""} onChange={v => setEditingContact(c => ({...c,phone:v}))} />
            <Field label="Email" value={editingContact.email || ""} onChange={v => setEditingContact(c => ({...c,email:v}))} />
            <Field label="Zona" value={editingContact.zone || ""} onChange={v => setEditingContact(c => ({...c,zone:v}))} />
            <Field label="Siguiente acción" value={editingContact.next || ""} onChange={v => setEditingContact(c => ({...c,next:v}))} />
            <Button onClick={saveContact}>💾 Guardar contacto</Button>
          </div> : <p style={{color:"#64748b"}}>Pulsa editar en un contacto.</p>}
        </Card>
      </section>}

      {activeTab === "liquidaciones" && <Card title="Liquidaciones por finca" icon="💰" right={<Badge tone="ok">Centralizado</Badge>}>
        <Table columns={[
          { key:"id", label:"Finca", bold:true, render:e => <button type="button" style={linkBtn} onClick={() => openEstate(e.id)}>{e.id}</button> },
          { key:"owner", label:"Propietario", render:e => { const o = owners.find(x => x.id === e.ownerId); return <button type="button" style={linkBtn} onClick={() => goOwner(e.ownerId)}>{o?.name || "—"}</button>; } },
          { key:"gross", label:"Bruto", render:e => money(estateLiquidation(e).gross) },
          { key:"services", label:"Servicios internos", render:e => money(estateLiquidation(e).services) },
          { key:"ownerAmount", label:"Propietario", render:e => money(estateLiquidation(e).owner) },
          { key:"franchisee", label:"Mi ingreso", render:e => money(estateLiquidation(e).franchisee) },
          { key:"spainroom", label:"Gestión central", render:e => money(estateLiquidation(e).spainroom) },
          { key:"actions", label:"", render:e => <Button small secondary onClick={() => openEstate(e.id)}>Abrir finca</Button> },
        ]} rows={ESTATES} empty="Sin liquidaciones." />
      </Card>}

      <Card title="Academia SpainRoom" icon="📚" right={<Badge tone="dark">Manual abierto</Badge>}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}} className="sr-help-grid">
          {[
            ["ADN SpainRoom", "Explicamos mucho, presionamos cero. SpainRoom organiza y el propietario decide."],
            ["Necesito pensarlo", "Respuesta: muchas gracias, ya sabe dónde localizarme. Ni una palabra más."],
            ["Cómo explicar SpainRoom", "Usted aporta la finca. SpainRoom la gestiona por habitaciones. Usted cobra con control y trazabilidad."],
            ["Qué no decir", "Evita hablar de fórmulas internas, catastro, método de cálculo o valor inmueble."],
            ["Precio habitación", "El inquilino ve precio final con servicios incluidos. Internamente se registran servicios, baño y balcón."],
            ["Contrato propietario", "Antes de publicar habitaciones debe existir contrato subido y declaración del franquiciado."],
          ].map(([title, text]) => <details key={title} open style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
            <summary style={{color:"#0b1220",fontWeight:950,cursor:"pointer"}}>{title}</summary>
            <div style={{color:"#334155",fontSize:14,marginTop:10,lineHeight:1.55}}>{text}</div>
          </details>)}
        </div>
      </Card>
    </div>

    <style>{`
      @media(max-width:1180px){.sr-pro-kpis{grid-template-columns:1fr 1fr 1fr!important}.sr-pro-grid-main{grid-template-columns:1fr!important}.sr-help-grid{grid-template-columns:1fr 1fr!important}}
      @media(max-width:760px){.sr-pro-kpis{grid-template-columns:1fr!important}.sr-sim-form{grid-template-columns:1fr!important}.sr-room-row{grid-template-columns:1fr!important}.sr-estate-summary{grid-template-columns:1fr!important}.sr-room-editor{grid-template-columns:1fr!important}.sr-room-fields{grid-template-columns:1fr!important}.sr-photo-grid{grid-template-columns:1fr!important}.sr-contact-form{grid-template-columns:1fr!important}.sr-help-grid{grid-template-columns:1fr!important}}
    `}</style>
  </main>;
}

const metricLine = {display:"flex",justifyContent:"space-between",gap:12,padding:"9px 0",borderBottom:"1px solid #f1f5f9",color:"#475569"};

const th = {padding:"9px 7px",borderBottom:"1px solid #e2e8f0",color:"#64748b"};
const td = {padding:"9px 7px",borderBottom:"1px solid #f1f5f9",color:"#0b1220"};
