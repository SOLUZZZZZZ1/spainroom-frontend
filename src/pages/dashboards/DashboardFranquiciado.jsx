// src/pages/dashboards/DashboardFranquiciado.jsx
// SpainRoom® — Dashboard Franquiciado V3 · Guía de alta finca
import React, { useState, useEffect } from "react";

const blue = "#0A58CA";

function money(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function loadList(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}


function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function isFilled(value) {
  const text = String(value ?? "").trim();
  return !!text && !["pendiente", "—", "null", "undefined"].includes(text.toLowerCase());
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

const TASKS = [
  { id:"TASK-001", title:"Llamar a Marta López", type:"Propietario", estateId:"SR-IMM-00001", priority:"Alta", due:"Hoy", done:false },
  { id:"TASK-002", title:"Pedir IBAN a Javier Ruiz", type:"Documentación", estateId:"SR-IMM-00002", priority:"Alta", due:"Hoy", done:false },
  { id:"TASK-003", title:"Subir fotos Habitación Terrassa B", type:"Publicación", estateId:"SR-IMM-00002", priority:"Media", due:"Esta semana", done:false },
  { id:"TASK-004", title:"Revisar ruido nocturno H01", type:"Incidencia", estateId:"SR-IMM-00001", priority:"Media", due:"Hoy", done:false },
];

function estateLiquidation(estate) {
  const rooms = safeArray(estate.rooms);
  const gross = rooms.reduce((sum, r) => sum + Number(r.price || 0), 0);
  const services = estate.servicesIncluded ? rooms.length * estate.servicesFee : 0;
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
  const [estates, setEstates] = useState(() => loadList("SR_V2_ESTATES", ESTATES));
  const [owners, setOwners] = useState(() => loadList("SR_V2_OWNERS", OWNERS));
  const [tenants, setTenants] = useState(() => loadList("SR_V2_TENANTS", TENANTS));
  const [contacts, setContacts] = useState(() => loadList("SR_V2_CONTACTS", CONTACTS));

  useEffect(() => {
    if (!Array.isArray(estates) || estates.length === 0) {
      setEstates(ESTATES);
      localStorage.setItem("SR_V2_ESTATES", JSON.stringify(ESTATES));
    }
  }, [estates]);

  // Protección demo: evita que Propietarios/Inquilinos queden en blanco si alguna versión anterior
  // guardó [] en localStorage o si se guarda un registro nuevo partiendo de estado vacío.
  useEffect(() => {
    if (!Array.isArray(owners) || owners.length === 0) {
      setOwners(OWNERS);
      localStorage.setItem("SR_V2_OWNERS", JSON.stringify(OWNERS));
    }
  }, [owners]);

  useEffect(() => {
    if (!Array.isArray(tenants) || tenants.length === 0) {
      setTenants(TENANTS);
      localStorage.setItem("SR_V2_TENANTS", JSON.stringify(TENANTS));
    }
  }, [tenants]);
  const [taskList, setTaskList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("SR_V2_TASKS") || "null") || TASKS; } catch { return TASKS; }
  });
  const [newTask, setNewTask] = useState({ title:"", type:"Seguimiento", estateId:"SR-IMM-00001", priority:"Media", due:"Hoy" });
  const [globalSearch, setGlobalSearch] = useState("");
  const [editingOwner, setEditingOwner] = useState(null);
  const [ownerPanelMode, setOwnerPanelMode] = useState("view");
  const [editingTenant, setEditingTenant] = useState(null);
  const [tenantPanelMode, setTenantPanelMode] = useState("view");
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
  const [estateOps, setEstateOps] = useState(() => {
    try { return JSON.parse(localStorage.getItem("SR_V2_ESTATE_OPS") || "{}"); } catch { return {}; }
  });
  const [newInventory, setNewInventory] = useState({ item:"", brand:"", model:"", status:"Bueno", photos:0 });
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);
  const [newIncident, setNewIncident] = useState({ level:"🟡", subject:"", roomId:"", status:"Abierta", notes:"" });
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [newCommonArea, setNewCommonArea] = useState({ area:"", description:"", photos:0, photoFiles:[] });
  const [selectedCommonAreaId, setSelectedCommonAreaId] = useState(null);
  const [estateOpsNotice, setEstateOpsNotice] = useState("");

  const selectedEstate = estates.find(e => e.id === selectedEstateId) || estates[0];
  const selectedOwner = owners.find(o => o.id === selectedEstate.ownerId) || owners[0];
  const selectedEstateRooms = safeArray(selectedEstate?.rooms);
  const allRooms = safeArray(estates).flatMap(e => safeArray(e.rooms).map(r => ({...r, estateId:e.id, ownerId:e.ownerId})));
  const selectedEstateOps = estateOps[selectedEstate.id] || {};
  const selectedEstateDetails = selectedEstateOps.estateDetails || {};
  const selectedCommonAreas = Array.isArray(selectedEstateOps.commonAreasFull)
    ? selectedEstateOps.commonAreasFull
    : [...safeArray(selectedEstate.commonAreas), ...safeArray(selectedEstateOps.commonAreas)];
  const selectedCommonArea = selectedCommonAreas.find(x => x.id === selectedCommonAreaId) || null;
  const selectedInventory = [...safeArray(selectedEstate.inventory), ...safeArray(selectedEstateOps.inventory)];
  const selectedIncidents = [...safeArray(selectedEstate.incidents), ...safeArray(selectedEstateOps.incidents)];
  const selectedInventoryItem = selectedInventory.find(x => x.id === selectedInventoryId) || null;
  const selectedIncident = selectedIncidents.find(x => x.id === selectedIncidentId) || null;
  const pendingTasks = taskList.filter(t => !t.done);
  const urgentTasks = pendingTasks.filter(t => t.priority === "Alta" || t.due === "Hoy");
  const searchText = globalSearch.trim().toLowerCase();
  const filteredEstates = !searchText ? estates : estates.filter(e => {
    const owner = owners.find(o => o.id === e.ownerId);
    return [e.id, e.city, e.zone, e.address, owner?.name].filter(Boolean).join(" ").toLowerCase().includes(searchText);
  });
  const filteredOwners = !searchText ? owners : owners.filter(o => {
    const linkedEstates = estates.filter(e => e.ownerId === o.id)
      .flatMap(e => [e.id, e.city, e.zone, e.address]);
    return [o.id,o.name,o.phone,o.email,o.iban, ...linkedEstates].filter(Boolean).join(" ").toLowerCase().includes(searchText);
  });
  const filteredTenants = !searchText ? tenants : tenants.filter(t => {
    const linkedRoom = allRooms.find(r => r.id === t.room);
    const linkedEstate = linkedRoom ? estates.find(e => e.id === linkedRoom.estateId) : null;
    const linkedOwner = linkedEstate ? owners.find(o => o.id === linkedEstate.ownerId) : null;
    return [t.id,t.name,t.phone,t.email,t.room,t.status, linkedEstate?.id, linkedEstate?.city, linkedEstate?.zone, linkedOwner?.name].filter(Boolean).join(" ").toLowerCase().includes(searchText);
  });

  function textOf(parts) {
    return parts.filter(Boolean).join(" ").toLowerCase();
  }

  const globalSearchResults = !searchText ? null : {
    estates: estates.filter(e => {
      const owner = owners.find(o => o.id === e.ownerId);
      const roomsText = e.rooms.flatMap(r => [r.id, r.title, r.status, r.tenantId]).join(" ");
      return textOf([e.id, e.province, e.city, e.zone, e.address, e.status, owner?.id, owner?.name, owner?.phone, owner?.email, roomsText]).includes(searchText);
    }),
    owners: owners.filter(o => {
      const linkedEstates = estates.filter(e => e.ownerId === o.id);
      const linkedRooms = linkedEstates.flatMap(e => e.rooms || []);
      return textOf([o.id, o.name, o.phone, o.email, o.iban, o.contract, ...linkedEstates.flatMap(e => [e.id, e.city, e.zone, e.address, e.status]), ...linkedRooms.flatMap(r => [r.id, r.title, r.status])]).includes(searchText);
    }),
    tenants: tenants.filter(t => {
      const linkedRoom = allRooms.find(r => r.id === t.room);
      const linkedEstate = linkedRoom ? estates.find(e => e.id === linkedRoom.estateId) : null;
      const linkedOwner = linkedEstate ? owners.find(o => o.id === linkedEstate.ownerId) : null;
      return textOf([t.id, t.name, t.phone, t.email, t.room, t.status, linkedRoom?.title, linkedEstate?.id, linkedEstate?.city, linkedEstate?.zone, linkedOwner?.id, linkedOwner?.name]).includes(searchText);
    }),
    rooms: allRooms.filter(r => {
      const estate = estates.find(e => e.id === r.estateId);
      const owner = owners.find(o => o.id === r.ownerId);
      const tenant = r.tenantId ? tenants.find(t => t.id === r.tenantId) : null;
      return textOf([r.id, r.title, r.status, r.price, r.tenantId, tenant?.name, tenant?.phone, tenant?.email, estate?.id, estate?.city, estate?.zone, estate?.address, owner?.id, owner?.name]).includes(searchText);
    }),
    contacts: contacts.filter(c => textOf([c.id, c.name, c.type, c.phone, c.email, c.zone, c.next]).includes(searchText)),
  };
  const globalSearchCount = globalSearchResults ? Object.values(globalSearchResults).reduce((sum, rows) => sum + rows.length, 0) : 0;

  const selectedRoomCandidate = allRooms.find(r => r.id === selectedRoomId);
  const selectedRoom = selectedRoomCandidate?.estateId === selectedEstate.id
    ? selectedRoomCandidate
    : (selectedEstateRooms[0] || null);
  const selectedTenant = selectedRoom?.tenantId ? tenants.find(t => t.id === selectedRoom.tenantId) : null;
  const selectedLiq = estateLiquidation(selectedEstate);
  const estateCity = selectedEstateDetails.city ?? selectedEstate.city;
  const estateZone = selectedEstateDetails.zone ?? selectedEstate.zone;
  const estateAddress = selectedEstateDetails.address ?? selectedEstate.address;
  const estateDescription = selectedEstateDetails.description ?? selectedEstate.description;
  const estateTransport = selectedEstateDetails.transport ?? "";
  const estateServicesNearby = selectedEstateDetails.servicesNearby ?? "";
  const estateObservations = selectedEstateDetails.observations ?? "";
  const estatePhotos = safeArray(selectedEstateDetails.photos);
  const verification = selectedEstateDetails.verification || {};
  const guideSteps = [
    { key:"owner", label:"Propietario", done:!!selectedOwner?.id },
    { key:"estate", label:"Datos inmueble", done:isFilled(estateCity) && isFilled(estateZone) && isFilled(estateAddress) },
    { key:"photos", label:"Fotos inmueble", done:estatePhotos.length > 0 },
    { key:"rooms", label:"Habitaciones", done:selectedEstateRooms.length > 0 },
    { key:"common", label:"Zonas comunes", done:selectedCommonAreas.length > 0 },
    { key:"inventory", label:"Inventario", done:selectedInventory.length > 0 },
    { key:"verification", label:"Verificación", done:!!verification.cedula && !!verification.energy },
    { key:"contract", label:"Contrato", done:selectedEstate.contractStatus === "Declarado correcto" || selectedOwner.contract === "Declarado correcto" },
  ];
  const completedGuideSteps = guideSteps.filter(x => x.done).length;
  const guideProgress = Math.round((completedGuideSteps / guideSteps.length) * 100);
  const nextGuideStep = guideSteps.find(x => !x.done);

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

  const global = estates.reduce((acc, e) => {
    const liq = estateLiquidation(e);
    acc.estates += 1; acc.rooms += safeArray(e.rooms).length; acc.occupied += safeArray(e.rooms).filter(r => r.status === "Ocupada").length;
    acc.gross += liq.gross; acc.franchisee += liq.franchisee; acc.spainroom += liq.spainroom; acc.owner += liq.owner;
    return acc;
  }, { estates:0, rooms:0, occupied:0, gross:0, franchisee:0, spainroom:0, owner:0 });

  function normalizePhone(phone) {
    return String(phone || "").replace(/\s+/g, "");
  }

  function addTask() {
    if (!newTask.title.trim()) return;
    const item = { id:`TASK-${Date.now()}`, ...newTask, done:false };
    const next = [item, ...taskList];
    setTaskList(next); localStorage.setItem("SR_V2_TASKS", JSON.stringify(next));
    setNewTask({ title:"", type:"Seguimiento", estateId:selectedEstate.id, priority:"Media", due:"Hoy" });
  }

  function toggleTask(id) {
    const next = taskList.map(t => t.id === id ? { ...t, done:!t.done } : t);
    setTaskList(next); localStorage.setItem("SR_V2_TASKS", JSON.stringify(next));
  }

  function deleteTask(id) {
    const next = taskList.filter(t => t.id !== id);
    setTaskList(next); localStorage.setItem("SR_V2_TASKS", JSON.stringify(next));
  }

  function exportPortfolioCSV() {
    const header = ["Finca","Ciudad","Zona","Propietario","Habitaciones","Bruto","Propietario","Mi ingreso","Estado"];
    const lines = estates.map(e => {
      const o = owners.find(x => x.id === e.ownerId);
      const liq = estateLiquidation(e);
      return [e.id,e.city,e.zone,o?.name || "",e.rooms.length,liq.gross,liq.owner,liq.franchisee,e.status].map(v => `"${String(v).replace(/"/g,'""')}"`).join(",");
    });
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type:"text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "spainroom-cartera-franquiciado.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function openEstate(id) {
    setGlobalSearch("");
    setSelectedEstateId(id);
    setSelectedInventoryId(null);
    setSelectedIncidentId(null);
    const e = estates.find(x => x.id === id);
    if (safeArray(e?.rooms)[0]) setSelectedRoomId(safeArray(e.rooms)[0].id);
    setActiveTab("fincas");
  }

  function newOwnerCode() {
    return `SR-PROP-${String(Date.now()).slice(-5)}`;
  }

  function newTenantCode() {
    return `SR-I-${String(Date.now()).slice(-5)}`;
  }

  function createOwnerFromTab() {
    setEditingOwner({ id:newOwnerCode(), name:"", phone:"", email:"", iban:"Pendiente", contract:"Pendiente subir", status:"Pendiente", _isNew:true });
    setOwnerPanelMode("edit");
    setActiveTab("propietarios");
  }

  function createTenantFromTab() {
    setEditingTenant({ id:newTenantCode(), name:"", phone:"", email:"", room:"Pendiente asignar", status:"Documentación", _isNew:true });
    setTenantPanelMode("edit");
    setActiveTab("inquilinos");
  }

  function saveOwner() {
    if (!editingOwner?.name?.trim()) {
      alert("Falta el nombre del propietario.");
      return;
    }
    const clean = { ...editingOwner };
    delete clean._isNew;
    const baseOwners = Array.isArray(owners) && owners.length > 0 ? owners : OWNERS;
    const exists = baseOwners.some(o => o.id === clean.id);
    const next = exists ? baseOwners.map(o => o.id === clean.id ? clean : o) : [clean, ...baseOwners];
    setOwners(next);
    localStorage.setItem("SR_V2_OWNERS", JSON.stringify(next));
    setEditingOwner(clean);
    setOwnerPanelMode("view");
  }

  function newEstateCode() {
    const nums = (estates || []).map(e => {
      const m = String(e.id || "").match(/SR-IMM-(\d+)/);
      return m ? Number(m[1]) : 0;
    });
    const next = Math.max(0, ...nums) + 1;
    return `SR-IMM-${String(next).padStart(5, "0")}`;
  }

  function createEstateForOwner(ownerId) {
    const owner = owners.find(o => o.id === ownerId) || editingOwner;
    if (!owner?.id) return;
    const id = newEstateCode();
    const newEstate = {
      id,
      province:"",
      city:"Pendiente",
      zone:"Pendiente",
      address:"Pendiente",
      ownerId:owner.id,
      franchisee:franchisee.id,
      status:"Borrador",
      contractStatus:owner.contract || "Pendiente subir",
      servicesIncluded:true,
      servicesFee:25,
      insurance:"Pendiente",
      description:`Nueva finca asociada a ${owner.name || owner.id}. Pendiente completar dirección, fotos, contrato e inventario.`,
      commonAreas:[],
      inventory:[],
      rooms:[],
      incidents:[],
    };
    const next = [newEstate, ...(Array.isArray(estates) && estates.length ? estates : ESTATES)];
    setEstates(next);
    localStorage.setItem("SR_V2_ESTATES", JSON.stringify(next));
    setSelectedEstateId(id);
    setEditingOwner(owner);
    setOwnerPanelMode("view");
  }

  function assignEstateToOwner(estateId, ownerId) {
    if (!estateId || !ownerId) return;
    const next = (Array.isArray(estates) && estates.length ? estates : ESTATES).map(e => e.id === estateId ? { ...e, ownerId } : e);
    setEstates(next);
    localStorage.setItem("SR_V2_ESTATES", JSON.stringify(next));
    setSelectedEstateId(estateId);
    setOwnerPanelMode("view");
  }

  function saveTenant() {
    if (!editingTenant?.name?.trim()) {
      alert("Falta el nombre del inquilino.");
      return;
    }
    const clean = { ...editingTenant };
    delete clean._isNew;
    const baseTenants = Array.isArray(tenants) && tenants.length > 0 ? tenants : TENANTS;
    const exists = baseTenants.some(t => t.id === clean.id);
    const next = exists ? baseTenants.map(t => t.id === clean.id ? clean : t) : [clean, ...baseTenants];
    setTenants(next);
    localStorage.setItem("SR_V2_TENANTS", JSON.stringify(next));
    setEditingTenant(clean);
    setTenantPanelMode("view");
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

  function restoreDemoData() {
    setOwners(OWNERS);
    setTenants(TENANTS);
    setContacts(CONTACTS);
    setEstates(ESTATES);
    localStorage.setItem("SR_V2_OWNERS", JSON.stringify(OWNERS));
    localStorage.setItem("SR_V2_TENANTS", JSON.stringify(TENANTS));
    localStorage.setItem("SR_V2_CONTACTS", JSON.stringify(CONTACTS));
    localStorage.setItem("SR_V2_ESTATES", JSON.stringify(ESTATES));
    setEditingOwner(null);
    setOwnerPanelMode("view");
    setEditingTenant(null);
    setTenantPanelMode("view");
    setEditingContact(null);
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
    const next = {...roomDrafts, [key]: {...current, photos:[...safeArray(current.photos), ...uploaded]}};
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

  function saveEstateOps(patch) {
    const current = estateOps[selectedEstate.id] || {};
    const next = { ...estateOps, [selectedEstate.id]: { ...current, ...patch } };
    setEstateOps(next);
    localStorage.setItem("SR_V2_ESTATE_OPS", JSON.stringify(next));
  }

  function persistCommonAreas(list, notice = "Zonas comunes actualizadas.") {
    saveEstateOps({ commonAreasFull:list });
    setEstateOpsNotice(notice);
  }

  function addCommonArea() {
    if (!newCommonArea.area.trim()) return;
    const item = {
      id:`CA-${Date.now()}`,
      area:newCommonArea.area,
      description:newCommonArea.description,
      photos:Number(newCommonArea.photos || 0) + (newCommonArea.photoFiles?.length || 0),
      photoFiles:newCommonArea.photoFiles || [],
    };
    const next = [...selectedCommonAreas, item];
    persistCommonAreas(next, `Zona común añadida a ${selectedEstate.id}: ${item.area}.`);
    setSelectedCommonAreaId(item.id);
    setNewCommonArea({ area:"", description:"", photos:0, photoFiles:[] });
  }

  function updateCommonArea(id, patch) {
    const next = selectedCommonAreas.map(x => x.id === id ? { ...x, ...patch } : x);
    persistCommonAreas(next, "Zona común actualizada.");
  }

  function openCommonArea(id) {
    setSelectedCommonAreaId(id);
    setActiveTab("fincas");
  }

  function handleCommonAreaPhotos(id, files) {
    const uploaded = Array.from(files || []).map(file => ({ name:file.name, url:URL.createObjectURL(file) }));
    if (!uploaded.length) return;
    const item = selectedCommonAreas.find(x => x.id === id);
    const previous = item?.photoFiles || [];
    updateCommonArea(id, { photoFiles:[...previous, ...uploaded], photos:Number(item?.photos || 0) + uploaded.length });
    setEstateOpsNotice(`${uploaded.length} foto(s) añadida(s) a ${item?.area || "zona común"}.`);
  }

  function handleNewCommonAreaPhotos(files) {
    const uploaded = Array.from(files || []).map(file => ({ name:file.name, url:URL.createObjectURL(file) }));
    if (!uploaded.length) return;
    setNewCommonArea(x => ({ ...x, photoFiles:[...(x.photoFiles || []), ...uploaded], photos:Number(x.photos || 0) + uploaded.length }));
  }

  function updateEstateDetails(patch) {
    const currentDetails = selectedEstateOps.estateDetails || {};
    saveEstateOps({ estateDetails:{ ...currentDetails, ...patch } });
    setEstateOpsNotice("Datos del inmueble actualizados.");
  }

  function handleEstatePhotos(files) {
    const uploaded = Array.from(files || []).map(file => ({ name:file.name, url:URL.createObjectURL(file) }));
    if (!uploaded.length) return;
    const currentDetails = selectedEstateOps.estateDetails || {};
    updateEstateDetails({ photos:[...safeArray(currentDetails.photos), ...uploaded] });
    setEstateOpsNotice(`${uploaded.length} foto(s) general(es) añadida(s) a ${selectedEstate.id}.`);
  }

  function addRealRoom() {
    const currentRooms = safeArray(selectedEstate.rooms);
    const nextNumber = currentRooms.length + 1;
    const roomId = `${selectedEstate.id}-H${String(nextNumber).padStart(2, "0")}`;
    const item = {
      id:roomId,
      title:`Habitación ${nextNumber}`,
      price:0,
      basePrice:0,
      bath:false,
      balcony:false,
      services:true,
      status:"Pendiente datos",
      tenantId:null,
      photos:0,
      publish:"danger",
      incidents:"🟢",
    };
    const nextEstates = safeArray(estates).map(e => e.id === selectedEstate.id ? { ...e, rooms:[...currentRooms, item] } : e);
    setEstates(nextEstates);
    localStorage.setItem("SR_V2_ESTATES", JSON.stringify(nextEstates));
    setSelectedRoomId(roomId);
    setEstateOpsNotice(`Habitación real creada: ${roomId}.`);
  }

  function addInventoryItem() {
    if (!newInventory.item.trim()) return;
    const item = { id:`INV-${Date.now()}`, ...newInventory, photos:Number(newInventory.photos || 0) };
    saveEstateOps({ inventory:[...(selectedEstateOps.inventory || []), item] });
    setSelectedInventoryId(item.id);
    setNewInventory({ item:"", brand:"", model:"", status:"Bueno", photos:0 });
    setEstateOpsNotice(`Inventario añadido: ${item.item}.`);
  }

  function updateInventoryItem(id, patch) {
    const isDynamic = (selectedEstateOps.inventory || []).some(x => x.id === id);
    if (!isDynamic) return setEstateOpsNotice("Este elemento demo es solo lectura. Añade uno nuevo para editarlo.");
    const nextInventory = (selectedEstateOps.inventory || []).map(x => x.id === id ? { ...x, ...patch } : x);
    saveEstateOps({ inventory:nextInventory });
    setEstateOpsNotice("Inventario actualizado.");
  }

  function addIncident() {
    if (!newIncident.subject.trim()) return;
    const item = { id:`INC-${Date.now()}`, date:new Date().toLocaleDateString("es-ES"), ...newIncident };
    saveEstateOps({ incidents:[...(selectedEstateOps.incidents || []), item] });
    setSelectedIncidentId(item.id);
    setNewIncident({ level:"🟡", subject:"", roomId:"", status:"Abierta", notes:"" });
    setEstateOpsNotice(`Incidencia creada: ${item.subject}.`);
  }

  function updateIncident(id, patch) {
    const isDynamic = (selectedEstateOps.incidents || []).some(x => x.id === id);
    if (!isDynamic) return setEstateOpsNotice("Esta incidencia demo es solo lectura. Crea una nueva para editarla.");
    const nextIncidents = (selectedEstateOps.incidents || []).map(x => x.id === id ? { ...x, ...patch } : x);
    saveEstateOps({ incidents:nextIncidents });
    setEstateOpsNotice("Incidencia actualizada.");
  }

  function openIncident(id) {
    setSelectedIncidentId(id);
    setActiveTab("fincas");
  }

  function openInventoryItem(id) {
    setSelectedInventoryId(id);
    setActiveTab("fincas");
  }

  function downloadSimulationPDF() {
    const rows = calculatedSimRooms.map(r => `
      <tr>
        <td>${r.code}</td>
        <td>${r.privateM2} m²</td>
        <td>${money(r.services)}</td>
        <td>${r.bath ? "+25 €" : "—"}</td>
        <td>${r.balcony ? "+25 €" : "—"}</td>
        <td><strong>${money(r.finalPrice)}</strong></td>
      </tr>
    `).join("");

    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Simulación SpainRoom</title>
        <style>
          body { font-family: Arial, sans-serif; color:#0b1220; padding:32px; }
          .header { background:#0b65d8; color:white; padding:22px; border-radius:16px; }
          h1 { margin:0 0 8px; font-size:28px; }
          h2 { margin-top:22px; }
          .grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin:18px 0; }
          .grid.two { grid-template-columns:1fr 1fr; }
          .actions { display:flex; gap:10px; justify-content:flex-end; margin:0 0 18px; }
          button { border:0; border-radius:10px; padding:10px 14px; font-weight:800; cursor:pointer; }
          .primary { background:#0b65d8; color:white; }
          .secondary { background:#f1f5f9; color:#0b1220; }
          .box { border:1px solid #e2e8f0; border-radius:12px; padding:14px; }
          .big { font-size:24px; font-weight:800; }
          table { width:100%; border-collapse:collapse; margin-top:14px; }
          th, td { border-bottom:1px solid #e2e8f0; padding:9px; text-align:left; }
          .note { margin-top:18px; color:#475569; font-size:13px; line-height:1.45; }
        </style>
      </head>
      <body>
        <div class="actions">
          <button class="secondary" onclick="window.print()">Imprimir / guardar PDF</button>
          <button class="primary" onclick="window.print()">Descargar PDF</button>
        </div>
        <div class="header">
          <h1>SpainRoom® · Simulación de precios por finca</h1>
          <div>${selectedEstate.id} · ${selectedEstate.city} · ${selectedEstate.zone}</div>
        </div>

        <h2>Propietario</h2>
        <p><strong>${selectedOwner.name}</strong><br/>${selectedOwner.email}<br/>${selectedOwner.phone}</p>

        <h2>Resultado</h2>
        <div class="grid two">
          <div class="box"><div>Precio final habitaciones</div><div class="big">${money(simGross)}</div></div>
          <div class="box"><div>Propietario</div><div class="big">${money(simOwner)}</div></div>
        </div>

        <h2>Habitaciones</h2>
        <table>
          <thead><tr><th>Habitación</th><th>m² privados</th><th>Servicios</th><th>Baño</th><th>Balcón</th><th>Precio final</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>

        <p class="note">
          Simulación orientativa SpainRoom para propietario. El inquilino ve el precio final con servicios incluidos.
          El desglose operativo de servicios, baño y balcón queda como criterio interno de SpainRoom.
        </p>

      </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }
  function goOwner(ownerId) {
    openOwner(ownerId);
  }
  function goTenant(tenantId) {
    openTenant(tenantId);
  }
  function openRoom(roomId) {
    setGlobalSearch("");
    const room = allRooms.find(r => r.id === roomId);
    if (room?.estateId) setSelectedEstateId(room.estateId);
    setSelectedRoomId(roomId);
    setActiveTab("fincas");
  }

  function openOwner(ownerId) {
    setGlobalSearch("");
    const owner = owners.find(o => o.id === ownerId);
    if (owner) setEditingOwner(owner);
    setOwnerPanelMode("view");
    setActiveTab("propietarios");
  }

  function editOwner(owner) {
    setEditingOwner(owner);
    setOwnerPanelMode("edit");
    setActiveTab("propietarios");
  }

  function openTenant(tenantId) {
    setGlobalSearch("");
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) setEditingTenant(tenant);
    setTenantPanelMode("view");
    setActiveTab("inquilinos");
  }

  function editTenant(tenant) {
    setEditingTenant(tenant);
    setTenantPanelMode("edit");
    setActiveTab("inquilinos");
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
            <div style={{fontSize:14,lineHeight:1.5,color:"rgba(255,255,255,.92)"}}>{selectedEstate.id}<br/>{estateCity} · {estateZone}<br/>Propietario: {selectedOwner.name}</div>
          </div>
        </div>
      </section>

      <section className="sr-pro-kpis" style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:14,marginBottom:18}}>
        <KPI icon="🏠" label="Fincas" value={global.estates} hint="Expedientes maestros" tone="purple" />
        <KPI icon="🚪" label="Habitaciones" value={global.rooms} hint={`${global.occupied} ocupadas`} tone="ok" />
        <KPI icon="💶" label="Ingreso bruto" value={money(global.gross)} hint="Cartera mensual" />
        <KPI icon="🤝" label="Mi ingreso" value={money(global.franchisee)} hint="Cartera activa" tone="ok" />
        <KPI icon="📌" label="Tareas hoy" value={urgentTasks.length} hint="Seguimiento operativo" />
        <KPI icon="🎯" label="Canon recuperado" value="27 %" hint="1.350 € de 5.000 €" tone="wait" />
      </section>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
        <input value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} placeholder="Buscar finca, propietario, ciudad, email, habitación o teléfono..." style={{flex:"1 1 320px",border:"1px solid #cbd5e1",borderRadius:14,padding:"11px 12px",fontWeight:850,outline:"none"}} />
        {globalSearch && <Button secondary onClick={() => setGlobalSearch("")}>Limpiar</Button>}
        <Button secondary onClick={exportPortfolioCSV}>⬇️ Exportar cartera</Button>
      </div>

      {globalSearch && <section style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:18,padding:14,marginBottom:14,boxShadow:"0 8px 24px rgba(15,23,42,.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
          <strong style={{fontSize:17}}>🔎 Resultados globales: “{globalSearch}”</strong>
          <Badge tone={globalSearchCount ? "ok" : "danger"}>{globalSearchCount} resultado(s)</Badge>
        </div>
        {globalSearchCount === 0 ? <div style={{color:"#64748b",fontWeight:800,padding:10}}>No hay resultados. Prueba con nombre, código, ciudad, teléfono, email o habitación.</div> :
          <div className="sr-global-results" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
            <div style={searchGroupStyle}><strong>🏠 Fincas</strong>{globalSearchResults.estates.map(e => <button key={e.id} type="button" style={searchResultBtn} onClick={() => openEstate(e.id)}><b>{e.id}</b><span>{e.city} · {e.zone}</span></button>)}</div>
            <div style={searchGroupStyle}><strong>👤 Propietarios</strong>{globalSearchResults.owners.map(o => <button key={o.id} type="button" style={searchResultBtn} onClick={() => openOwner(o.id)}><b>{o.name}</b><span>{o.id}</span></button>)}</div>
            <div style={searchGroupStyle}><strong>👥 Inquilinos</strong>{globalSearchResults.tenants.map(t => <button key={t.id} type="button" style={searchResultBtn} onClick={() => openTenant(t.id)}><b>{t.name}</b><span>{t.id} · {t.room}</span></button>)}</div>
            <div style={searchGroupStyle}><strong>🚪 Habitaciones</strong>{globalSearchResults.rooms.map(r => <button key={r.id} type="button" style={searchResultBtn} onClick={() => openRoom(r.id)}><b>{r.id}</b><span>{r.title}</span></button>)}</div>
            <div style={searchGroupStyle}><strong>📞 Contactos</strong>{globalSearchResults.contacts.map(c => <button key={c.id} type="button" style={searchResultBtn} onClick={() => { setEditingContact(c); setActiveTab("contactos"); }}><b>{c.name}</b><span>{c.type} · {c.zone}</span></button>)}</div>
          </div>}
      </section>}

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <button type="button" style={tabStyle("negocio")} onClick={() => setActiveTab("negocio")}>📊 Mi negocio</button>
        <button type="button" style={tabStyle("simulador")} onClick={() => setActiveTab("simulador")}>🧮 Simulador</button>
        <button type="button" style={tabStyle("fincas")} onClick={() => setActiveTab("fincas")}>🏠 Fincas</button>
        <button type="button" style={tabStyle("propietarios")} onClick={() => setActiveTab("propietarios")}>👤 Propietarios</button>
        <button type="button" style={tabStyle("inquilinos")} onClick={() => setActiveTab("inquilinos")}>👥 Inquilinos</button>
        <button type="button" style={tabStyle("contactos")} onClick={() => setActiveTab("contactos")}>📞 Contactos</button>
        <button type="button" style={tabStyle("liquidaciones")} onClick={() => setActiveTab("liquidaciones")}>💰 Liquidaciones</button>
        <button type="button" style={tabStyle("tareas")} onClick={() => setActiveTab("tareas")}>✅ Tareas</button>
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
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:12}}><Button secondary onClick={addSimRoom}>+ Añadir habitación</Button><Button onClick={saveSimulation}>💾 Guardar simulación</Button><Button secondary onClick={downloadSimulationPDF}>📄 Descargar PDF</Button></div>
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
            ]} rows={filteredEstates} empty="Sin fincas." />
          </Card>

          <Card title="Propietario de la finca" icon="👤" right={<Badge tone={selectedOwner.iban === "Pendiente" ? "danger" : "ok"}>IBAN {selectedOwner.iban === "Pendiente" ? "pendiente" : "ok"}</Badge>}>
            <div style={{display:"grid",gap:8,color:"#334155"}}>
              <div><strong>{selectedOwner.id}</strong> · {selectedOwner.name}</div>
              <div>📞 {selectedOwner.phone}</div>
              <div>✉️ {selectedOwner.email}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"6px 0"}}>
                <a href={`tel:${normalizePhone(selectedOwner.phone)}`} style={{...linkBtn,textDecoration:"none"}}>📞 Llamar</a>
                <a href={`mailto:${selectedOwner.email}`} style={{...linkBtn,textDecoration:"none"}}>✉️ Email</a>
                <a href={`https://wa.me/${normalizePhone(selectedOwner.phone).replace("+","")}`} target="_blank" rel="noreferrer" style={{...linkBtn,textDecoration:"none"}}>💬 WhatsApp</a>
              </div>
              <div>🏦 {selectedOwner.iban}</div>
              <div>📄 Contrato: {selectedEstate.contractStatus}</div>
              <div><strong>🏠 Mis fincas:</strong> {estates.filter(e => e.ownerId === selectedOwner.id).map(e => <button key={e.id} type="button" style={{...linkBtn, marginLeft:8}} onClick={() => openEstate(e.id)}>{e.id}</button>)}</div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
              <Button small secondary onClick={() => { setEditingOwner(selectedOwner); setActiveTab("propietarios"); }}>Editar propietario</Button>
            </div>
          </Card>

          <Card title="Verificación inmueble" icon="🛡️" right={<Badge tone={verification.cedula && verification.energy ? "ok" : "wait"}>Antes de publicar</Badge>}>
            <div style={{display:"grid",gap:8}}>
              <Check checked={!!verification.cedula} onChange={v => updateEstateDetails({verification:{...verification, cedula:v}})} label="Cédula de habitabilidad comprobada" />
              <Check checked={!!verification.energy} onChange={v => updateEstateDetails({verification:{...verification, energy:v}})} label="Certificado de eficiencia energética" />
              <Check checked={!!verification.insurance} onChange={v => updateEstateDetails({verification:{...verification, insurance:v}})} label="Seguro vivienda / responsabilidad civil" />
              <Check checked={!!verification.electricity} onChange={v => updateEstateDetails({verification:{...verification, electricity:v}})} label="Instalación eléctrica revisada" />
              <Check checked={!!verification.gas} onChange={v => updateEstateDetails({verification:{...verification, gas:v}})} label="Gas / caldera revisado si existe" />
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
          <Card title={`${selectedEstate.id} · ${estateCity} · ${estateZone}`} icon="📁" right={<Badge tone="info">{selectedEstate.franchisee}</Badge>}>
            <div className="sr-estate-summary" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:12}}>
              <KPI icon="🚪" label="Habitaciones" value={selectedEstateRooms.length} hint={`${selectedEstateRooms.filter(r => r.status === "Ocupada").length} ocupadas`} tone="ok" />
              <KPI icon="💶" label="Bruto finca" value={money(selectedLiq.gross)} hint="Precio final" />
              <KPI icon="🔌" label="Servicios internos" value={money(selectedLiq.services)} hint={`${selectedEstate.servicesFee} €/hab.`} tone="wait" />
              <KPI icon="👤" label="Propietario" value={money(selectedLiq.owner)} hint="Liquidación finca" tone="ok" />
              <KPI icon="🤝" label="Mi ingreso" value={money(selectedLiq.franchisee)} hint="Cartera finca" tone="ok" />
            </div>
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
              <strong>Descripción del inmueble</strong>
              <p style={{color:"#475569",lineHeight:1.55,margin:"8px 0 0"}}>{selectedEstate.description}</p>
              <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #e2e8f0",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,color:"#334155",fontSize:13,fontWeight:850}} className="sr-exact-breakdown">
                <div>Bruto: {money(selectedLiq.gross)}</div>
                <div>Servicios: {money(selectedLiq.services)}</div>
                <div>Propietario: {money(selectedLiq.owner)}</div>
                <div>Mi ingreso: {money(selectedLiq.franchisee)}</div>
              </div>
            </div>
          </Card>

          <Card title="Guía SpainRoom" icon="🐕" right={<Badge tone={guideProgress >= 100 ? "ok" : "wait"}>Progreso {guideProgress}%</Badge>}>
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
                <div>
                  <strong>Objetivo: publicar la finca</strong>
                  <div style={{color:"#64748b",fontSize:13,marginTop:4}}>Finca no publicada = finca inexistente. Si no existe, no se alquila.</div>
                </div>
                <Badge tone={nextGuideStep ? "wait" : "ok"}>{nextGuideStep ? `Siguiente: ${nextGuideStep.label}` : "Lista para publicar"}</Badge>
              </div>
              <div style={{height:10,background:"#e2e8f0",borderRadius:999,overflow:"hidden",marginBottom:12}}>
                <div style={{width:`${guideProgress}%`,height:"100%",background:blue,borderRadius:999}} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}} className="sr-help-grid">
                {guideSteps.map(step => <div key={step.key} style={{background:step.done ? "#ecfdf5" : "#fff",border:`1px solid ${step.done ? "#bbf7d0" : "#e2e8f0"}`,borderRadius:13,padding:"9px 10px",fontWeight:900,color:step.done ? "#047857" : "#475569"}}>{step.done ? "✅" : "☐"} {step.label}</div>)}
              </div>
              {nextGuideStep && <div style={{marginTop:12,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:12,color:"#92400e",fontWeight:900}}>👉 Siguiente acción recomendada: {nextGuideStep.label}</div>}
            </div>
          </Card>

          <Card title="Datos inmueble" icon="🏠" right={<Badge tone={isFilled(estateCity) && isFilled(estateAddress) ? "ok" : "wait"}>Ficha del inmueble</Badge>}>
            <div className="sr-room-fields" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
              <Field label="Provincia" value={selectedEstateDetails.province ?? selectedEstate.province ?? ""} onChange={v => updateEstateDetails({province:v})} />
              <Field label="Ciudad" value={estateCity || ""} onChange={v => updateEstateDetails({city:v})} />
              <Field label="Zona" value={estateZone || ""} onChange={v => updateEstateDetails({zone:v})} />
              <Field label="Dirección" value={estateAddress || ""} onChange={v => updateEstateDetails({address:v})} />
              <Field label="Transporte público" value={estateTransport} onChange={v => updateEstateDetails({transport:v})} />
              <Field label="Servicios cercanos" value={estateServicesNearby} onChange={v => updateEstateDetails({servicesNearby:v})} />
            </div>
            <label style={{display:"grid",gap:6,marginBottom:12}}>
              <span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Descripción general / situación</span>
              <textarea value={estateDescription || ""} onChange={e => updateEstateDetails({description:e.target.value})} rows={4} style={{border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",fontWeight:750,resize:"vertical"}} />
            </label>
            <label style={{display:"grid",gap:6,marginBottom:12}}>
              <span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Observaciones internas</span>
              <textarea value={estateObservations} onChange={e => updateEstateDetails({observations:e.target.value})} rows={3} style={{border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",fontWeight:750,resize:"vertical"}} />
            </label>
          </Card>

          <Card title="Fotos inmueble" icon="📸" right={<Badge tone={estatePhotos.length ? "ok" : "wait"}>{estatePhotos.length} foto(s)</Badge>}>
            <p style={{color:"#64748b",lineHeight:1.55,marginTop:0}}>Fotos generales: fachada, portal, escalera, entrada, calle, entorno y transporte cercano. Salón y cocina van en zonas comunes.</p>
            <label style={{display:"inline-flex",alignItems:"center",justifyContent:"center",border:"1px solid #cfe0ff",borderRadius:13,padding:"10px 13px",fontWeight:950,color:blue,background:"#fff",cursor:"pointer",marginBottom:12}}>
              + Subir fotos inmueble
              <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e => handleEstatePhotos(e.target.files)} />
            </label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}} className="sr-photo-grid">
              {estatePhotos.map((photo, idx) => <div key={`${photo.name}-${idx}`} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:10}}>
                <div style={{height:92,borderRadius:12,background:"linear-gradient(135deg,#dbeafe,#f8fafc)",display:"grid",placeItems:"center",fontSize:24,overflow:"hidden"}}>
                  {photo.url ? <img src={photo.url} alt={photo.name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : "🖼️"}
                </div>
                <div style={{fontWeight:900,marginTop:8}}>Foto inmueble {idx + 1}</div>
                <div style={{color:"#64748b",fontSize:12,wordBreak:"break-word"}}>{photo.name}</div>
              </div>)}
              {!estatePhotos.length && <div style={{gridColumn:"1/-1",color:"#64748b",padding:12}}>Todavía no hay fotos generales del inmueble.</div>}
            </div>
          </Card>

          <Card title="Habitaciones de la finca" icon="🚪" right={<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><Badge tone="ok">Precio final visible</Badge><Button small onClick={addRealRoom}>+ Nueva habitación</Button></div>}>
            <Table columns={[
              { key:"id", label:"Habitación", bold:true, render:r => <button type="button" style={linkBtn} onClick={() => openRoom(r.id)}>{r.id}</button> },
              { key:"title", label:"Título" },
              { key:"price", label:"Precio", render:r => money(r.price) },
              { key:"features", label:"Extras", render:r => <span>{r.services ? "Servicios " : ""}{r.bath ? "· Baño " : ""}{r.balcony ? "· Balcón" : ""}</span> },
              { key:"status", label:"Estado", render:r => <Badge tone={r.status === "Ocupada" ? "ok" : r.status === "Pendiente fotos" ? "danger" : "info"}>{r.status}</Badge> },
              { key:"actions", label:"", render:r => <Button small onClick={() => openRoom(r.id)}>Abrir</Button> },
            ]} rows={selectedEstateRooms} empty="Sin habitaciones." />

            {selectedRoom && selectedRoom.estateId === selectedEstate.id && <div style={{marginTop:12,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:10}}>
                <strong>👁️ Ficha rápida habitación · <button type="button" style={linkBtn} onClick={() => openRoom(selectedRoom.id)}>{selectedRoom.id}</button></strong>
                <Badge tone={selectedRoom.status === "Ocupada" ? "ok" : selectedRoom.status === "Pendiente fotos" ? "danger" : "info"}>{selectedRoom.status}</Badge>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}} className="sr-room-fields">
                <div style={infoBox}><strong>{selectedRoom.title}</strong><br/>Precio final: <strong>{money(roomDrafts[selectedRoom.id]?.price ?? selectedRoom.price)}</strong><br/>Fotos: {safeArray(roomDrafts[selectedRoom.id]?.photos).length || selectedRoom.photos || 0}</div>
                <div style={infoBox}>🏠 Finca:<br/><button type="button" style={linkBtn} onClick={() => openEstate(selectedRoom.estateId)}>{selectedRoom.estateId}</button><br/>👤 Propietario:<br/><button type="button" style={linkBtn} onClick={() => goOwner(selectedRoom.ownerId)}>{owners.find(o => o.id === selectedRoom.ownerId)?.name || selectedRoom.ownerId}</button></div>
                <div style={infoBox}>👥 Inquilino:<br/>{selectedRoom.tenantId ? <button type="button" style={linkBtn} onClick={() => goTenant(selectedRoom.tenantId)}>{tenants.find(t => t.id === selectedRoom.tenantId)?.name || selectedRoom.tenantId}</button> : "Sin asignar"}<br/>Extras: {selectedRoom.services ? "Servicios " : ""}{selectedRoom.bath ? "· Baño " : ""}{selectedRoom.balcony ? "· Balcón" : ""}</div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
                <label style={{display:"inline-flex",alignItems:"center",justifyContent:"center",border:"1px solid #cfe0ff",borderRadius:13,padding:"8px 10px",fontWeight:950,color:blue,background:"#fff",cursor:"pointer",fontSize:13}}>
                  📸 Subir fotos
                  <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e => handlePhotos(e.target.files)} />
                </label>
                <Button small onClick={() => saveRoomDraft()}>💾 Guardar ficha</Button>
                <Button small secondary onClick={publishRoom}>🚀 Publicar si está completa</Button>
              </div>
              {safeArray(roomDrafts[selectedRoom.id]?.photos).length > 0 && <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:10}} className="sr-photo-grid">
                {safeArray(roomDrafts[selectedRoom.id]?.photos).slice(0,4).map((photo, idx) => <div key={`quick-${photo.name}-${idx}`} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:8}}>
                  <div style={{height:72,borderRadius:10,background:"linear-gradient(135deg,#dbeafe,#f8fafc)",display:"grid",placeItems:"center",overflow:"hidden"}}>
                    {photo.url ? <img src={photo.url} alt={photo.name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : "🖼️"}
                  </div>
                  <div style={{color:"#64748b",fontSize:11,marginTop:5,wordBreak:"break-word"}}>{photo.name}</div>
                </div>)}
              </div>}
            </div>}
          </Card>

          <Card title="Zonas comunes" icon="🏘️" right={<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><Badge tone="dark">Operativo franquiciado</Badge><Button small secondary onClick={addCommonArea}>+ Añadir zona</Button></div>}>
            <div className="sr-contact-form" style={{display:"grid",gridTemplateColumns:"1fr 2fr .5fr auto",gap:10,marginBottom:12,alignItems:"end"}}>
              <Field label="Zona común" value={newCommonArea.area} onChange={v => setNewCommonArea(x => ({...x,area:v}))} />
              <Field label="Descripción" value={newCommonArea.description} onChange={v => setNewCommonArea(x => ({...x,description:v}))} />
              <Field label="Fotos" type="number" value={newCommonArea.photos} onChange={v => setNewCommonArea(x => ({...x,photos:Number(v)}))} />
              <label style={{display:"inline-flex",alignItems:"center",justifyContent:"center",border:"1px solid #cfe0ff",borderRadius:13,padding:"10px 12px",fontWeight:950,color:blue,background:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>
                📸 Subir fotos
                <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e => handleNewCommonAreaPhotos(e.target.files)} />
              </label>
            </div>
            {(newCommonArea.photoFiles || []).length > 0 && <div style={{margin:"-4px 0 12px",color:"#047857",fontWeight:900}}>Fotos preparadas: {(newCommonArea.photoFiles || []).length}</div>}
            <Table columns={[
              { key:"area", label:"Zona", bold:true, render:z => <button type="button" style={linkBtn} onClick={() => openCommonArea(z.id)}>{z.area}</button> },
              { key:"description", label:"Descripción" },
              { key:"photos", label:"Fotos", render:z => Number(z.photos || 0) },
              { key:"actions", label:"", render:z => <Button small secondary onClick={() => openCommonArea(z.id)}>Abrir / editar</Button> },
            ]} rows={selectedCommonAreas} empty="Sin zonas comunes." />
            {selectedCommonArea && <div id="sr-common-area-detail" style={{marginTop:12,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",marginBottom:10}}>
                <strong>🏘️ Ficha zona común · {selectedCommonArea.id}</strong>
                <Badge tone="info">{Number(selectedCommonArea.photos || 0)} foto(s)</Badge>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 2fr .5fr",gap:10,marginBottom:12}} className="sr-room-fields">
                <Field label="Zona" value={selectedCommonArea.area || ""} onChange={v => updateCommonArea(selectedCommonArea.id,{area:v})} />
                <Field label="Descripción" value={selectedCommonArea.description || ""} onChange={v => updateCommonArea(selectedCommonArea.id,{description:v})} />
                <Field label="Fotos" type="number" value={selectedCommonArea.photos || 0} onChange={v => updateCommonArea(selectedCommonArea.id,{photos:Number(v)})} />
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                <label style={{display:"inline-flex",alignItems:"center",justifyContent:"center",border:"1px solid #cfe0ff",borderRadius:13,padding:"8px 10px",fontWeight:950,color:blue,background:"#fff",cursor:"pointer"}}>
                  + Subir fotos a esta zona
                  <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e => handleCommonAreaPhotos(selectedCommonArea.id, e.target.files)} />
                </label>
                <Button small secondary onClick={() => setSelectedCommonAreaId(null)}>Cerrar ficha</Button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}} className="sr-photo-grid">
                {(selectedCommonArea.photoFiles || []).map((photo, idx) => <div key={`${photo.name}-${idx}`} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:10}}>
                  <div style={{height:92,borderRadius:12,background:"linear-gradient(135deg,#dbeafe,#f8fafc)",display:"grid",placeItems:"center",fontSize:24,overflow:"hidden"}}>
                    {photo.url ? <img src={photo.url} alt={photo.name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : "🖼️"}
                  </div>
                  <div style={{fontWeight:900,marginTop:8}}>Foto {idx + 1}</div>
                  <div style={{color:"#64748b",fontSize:12,wordBreak:"break-word"}}>{photo.name}</div>
                </div>)}
                {!(selectedCommonArea.photoFiles || []).length && <div style={{gridColumn:"1/-1",color:"#64748b",padding:12}}>Todavía no hay fotos subidas en esta prueba. La zona indica {selectedCommonArea.photos || 0} foto(s) registradas.</div>}
              </div>
            </div>}
            {estateOpsNotice && <div style={{marginTop:10,color:"#047857",fontWeight:900}}>{estateOpsNotice}</div>}
          </Card>

          <Card title="Inventario visible de la finca" icon="📦" right={<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><Badge tone="info">Para incidencias</Badge><Button small secondary onClick={addInventoryItem}>+ Añadir inventario</Button></div>}>
            <div className="sr-inventory-form" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr .8fr .5fr",gap:10,marginBottom:12}}>
              <Field label="Elemento" value={newInventory.item} onChange={v => setNewInventory(x => ({...x,item:v}))} />
              <Field label="Marca" value={newInventory.brand} onChange={v => setNewInventory(x => ({...x,brand:v}))} />
              <Field label="Modelo / medida" value={newInventory.model} onChange={v => setNewInventory(x => ({...x,model:v}))} />
              <Field label="Estado" value={newInventory.status} onChange={v => setNewInventory(x => ({...x,status:v}))} />
              <Field label="Fotos" type="number" value={newInventory.photos} onChange={v => setNewInventory(x => ({...x,photos:Number(v)}))} />
            </div>
            <Table columns={[
              { key:"item", label:"Elemento", bold:true, render:i => <button type="button" style={linkBtn} onClick={() => openInventoryItem(i.id)}>{i.item}</button> },
              { key:"brand", label:"Marca" },
              { key:"model", label:"Modelo / medida" },
              { key:"status", label:"Estado" },
              { key:"photos", label:"Fotos" },
              { key:"actions", label:"", render:i => <Button small secondary onClick={() => openInventoryItem(i.id)}>Abrir</Button> },
            ]} rows={selectedInventory} empty="Sin inventario." />
            {selectedInventoryItem && <div id="sr-inventory-detail" style={{marginTop:12,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",marginBottom:10}}><strong>📦 Ficha inventario · {selectedInventoryItem.id}</strong><Badge tone="dark">{selectedInventoryItem.status}</Badge></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}} className="sr-room-fields">
                <Field label="Elemento" value={selectedInventoryItem.item || ""} onChange={v => updateInventoryItem(selectedInventoryItem.id,{item:v})} />
                <Field label="Marca" value={selectedInventoryItem.brand || ""} onChange={v => updateInventoryItem(selectedInventoryItem.id,{brand:v})} />
                <Field label="Modelo / medida" value={selectedInventoryItem.model || ""} onChange={v => updateInventoryItem(selectedInventoryItem.id,{model:v})} />
                <Field label="Estado" value={selectedInventoryItem.status || ""} onChange={v => updateInventoryItem(selectedInventoryItem.id,{status:v})} />
              </div>
            </div>}
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
                    <div>Fotos: {(safeArray(roomDrafts[selectedRoom.id]?.photos).length || selectedRoom.photos) > 0 ? "✅" : "❌"}</div>
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
                  {safeArray(roomDrafts[selectedRoom.id]?.photos).map((photo, idx) => <div key={`${photo.name}-${idx}`} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:10}}>
                    <div style={{height:92,borderRadius:12,background:"linear-gradient(135deg,#dbeafe,#f8fafc)",display:"grid",placeItems:"center",fontSize:24,overflow:"hidden"}}>
                      {photo.url ? <img src={photo.url} alt={photo.name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : "🖼️"}
                    </div>
                    <div style={{fontWeight:900,marginTop:8}}>Foto {idx + 1}</div>
                    <div style={{color:"#64748b",fontSize:12,wordBreak:"break-word"}}>{photo.name}</div>
                  </div>)}
                  {!safeArray(roomDrafts[selectedRoom.id]?.photos).length && <div style={{gridColumn:"1/-1",color:"#64748b",padding:12}}>Todavía no hay fotos subidas en esta prueba. La habitación indica {selectedRoom.photos} foto(s) registradas en demo.</div>}
                </div>
              </div>

              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <Button onClick={() => saveRoomDraft()}>💾 Guardar ficha</Button>
                <Button secondary onClick={publishRoom}>🚀 Publicar si está completa</Button>
              </div>
              {roomNotice && <div style={{marginTop:10,color:"#047857",fontWeight:900}}>{roomNotice}</div>}
            </>}
          </Card>

          <Card title="Incidencias de la finca" icon="⚠️" right={<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><Badge tone={selectedIncidents.length ? "wait" : "ok"}>{selectedIncidents.length}</Badge><Button small secondary onClick={addIncident}>+ Nueva incidencia</Button></div>}>
            <div className="sr-incident-form" style={{display:"grid",gridTemplateColumns:".5fr 1.3fr 1fr .8fr",gap:10,marginBottom:12}}>
              <Field label="Nivel" value={newIncident.level} onChange={v => setNewIncident(x => ({...x,level:v}))} />
              <Field label="Asunto" value={newIncident.subject} onChange={v => setNewIncident(x => ({...x,subject:v}))} />
              <label style={{display:"grid",gap:6}}><span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Habitación vinculada</span><select value={newIncident.roomId} onChange={e => setNewIncident(x => ({...x,roomId:e.target.value}))} style={{width:"100%",boxSizing:"border-box",border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",color:"#0b1220",fontWeight:750,background:"#fff",outline:"none"}}><option value="">Finca general</option>{selectedEstateRooms.map(r => <option key={r.id} value={r.id}>{r.id}</option>)}</select></label>
              <Field label="Estado" value={newIncident.status} onChange={v => setNewIncident(x => ({...x,status:v}))} />
            </div>
            <label style={{display:"grid",gap:6,marginBottom:12}}><span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Notas de incidencia</span><textarea value={newIncident.notes} onChange={e => setNewIncident(x => ({...x,notes:e.target.value}))} rows={3} style={{border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",fontWeight:750,resize:"vertical"}} /></label>
            <Table columns={[
              { key:"level", label:"Nivel" },
              { key:"subject", label:"Asunto", bold:true, render:i => <button type="button" style={linkBtn} onClick={() => openIncident(i.id)}>{i.subject}</button> },
              { key:"roomId", label:"Habitación", render:i => i.roomId ? <button type="button" style={linkBtn} onClick={() => openRoom(i.roomId)}>{i.roomId}</button> : "Finca" },
              { key:"status", label:"Estado" },
              { key:"actions", label:"", render:i => <Button small secondary onClick={() => openIncident(i.id)}>Abrir</Button> },
            ]} rows={selectedIncidents} empty="Sin incidencias." />
            {selectedIncident && <div id="sr-incident-detail" style={{marginTop:12,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",marginBottom:10}}><strong>⚠️ Ficha incidencia · {selectedIncident.id}</strong><Badge tone={selectedIncident.status === "Cerrada" ? "ok" : "wait"}>{selectedIncident.status}</Badge></div>
              <div style={{display:"grid",gridTemplateColumns:".5fr 1.5fr 1fr 1fr",gap:10}} className="sr-room-fields">
                <Field label="Nivel" value={selectedIncident.level || ""} onChange={v => updateIncident(selectedIncident.id,{level:v})} />
                <Field label="Asunto" value={selectedIncident.subject || ""} onChange={v => updateIncident(selectedIncident.id,{subject:v})} />
                <Field label="Estado" value={selectedIncident.status || ""} onChange={v => updateIncident(selectedIncident.id,{status:v})} />
                <Field label="Fecha" value={selectedIncident.date || "Demo"} onChange={() => {}} />
              </div>
              <div style={{marginTop:10,color:"#334155",fontWeight:850}}>Relaciones: 🏠 <button type="button" style={linkBtn} onClick={() => openEstate(selectedEstate.id)}>{selectedEstate.id}</button>{selectedIncident.roomId && <> · 🚪 <button type="button" style={linkBtn} onClick={() => openRoom(selectedIncident.roomId)}>{selectedIncident.roomId}</button></>} · 👤 <button type="button" style={linkBtn} onClick={() => goOwner(selectedEstate.ownerId)}>{selectedOwner.name}</button></div>
              <label style={{display:"grid",gap:6,marginTop:10}}><span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Notas / seguimiento</span><textarea value={selectedIncident.notes || ""} onChange={e => updateIncident(selectedIncident.id,{notes:e.target.value})} rows={4} style={{border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",fontWeight:750,resize:"vertical"}} /></label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}><Button small secondary onClick={() => updateIncident(selectedIncident.id,{status:"En seguimiento"})}>En seguimiento</Button><Button small onClick={() => updateIncident(selectedIncident.id,{status:"Cerrada"})}>Cerrar incidencia</Button></div>
            </div>}
          </Card>
        </div>
      </section>}

      {activeTab === "propietarios" && <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"1.05fr .95fr",gap:16,alignItems:"start"}}>
        <Card title="Propietarios" icon="👤" right={<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><Badge tone="info">Con fincas asociadas</Badge><Button small onClick={createOwnerFromTab}>+ Nuevo propietario</Button><Button small secondary onClick={restoreDemoData}>Restaurar demo</Button></div>}>
          <Table columns={[
            { key:"id", label:"Código", bold:true, render:o => <button type="button" style={linkBtn} onClick={() => openOwner(o.id)}>{o.id}</button> },
            { key:"name", label:"Nombre", bold:true, render:o => <button type="button" style={linkBtn} onClick={() => openOwner(o.id)}>{o.name}</button> },
            { key:"phone", label:"Teléfono", render:o => <a href={`tel:${normalizePhone(o.phone)}`} style={linkBtn}>{o.phone}</a> },
            { key:"email", label:"Email", render:o => <a href={`mailto:${o.email}`} style={linkBtn}>{o.email}</a> },
            { key:"iban", label:"IBAN" },
            { key:"fincas", label:"Fincas", render:o => <div style={{display:"grid",gap:4}}>{estates.filter(e => e.ownerId === o.id).map(e => <button key={e.id} type="button" style={linkBtn} onClick={() => openEstate(e.id)}>🏠 {e.id}</button>)}</div> },
            { key:"actions", label:"", render:o => <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Button small onClick={() => editOwner(o)}>Editar</Button></div> },
          ]} rows={filteredOwners} empty="Sin propietarios." />
        </Card>

        <Card title={editingOwner?._isNew ? "Nuevo propietario" : ownerPanelMode === "edit" ? "Editar propietario" : "Ficha propietario"} icon={editingOwner?._isNew ? "➕" : ownerPanelMode === "edit" ? "✏️" : "👁️"} right={editingOwner ? <Badge tone={editingOwner._isNew ? "ok" : "wait"}>{editingOwner.id}</Badge> : <Badge tone="dark">Selecciona</Badge>}>
          {editingOwner && ownerPanelMode === "view" ? <div style={{display:"grid",gap:12}}>
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12,lineHeight:1.65}}>
              <div><strong>Código:</strong> <button type="button" style={linkBtn} onClick={() => openOwner(editingOwner.id)}>{editingOwner.id}</button></div>
              <div><strong>Nombre:</strong> {editingOwner.name}</div>
              <div><strong>Teléfono:</strong> <a href={`tel:${normalizePhone(editingOwner.phone)}`} style={linkBtn}>{editingOwner.phone}</a> · <a href={`https://wa.me/${normalizePhone(editingOwner.phone)}`} target="_blank" rel="noreferrer" style={linkBtn}>WhatsApp</a></div>
              <div><strong>Email:</strong> <a href={`mailto:${editingOwner.email}`} style={linkBtn}>{editingOwner.email}</a></div>
              <div><strong>IBAN:</strong> {editingOwner.iban}</div>
              <div><strong>Contrato:</strong> {editingOwner.contract}</div>
            </div>
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
              <strong>🏠 Fincas asociadas</strong>
              <div style={{display:"grid",gap:6,marginTop:8}}>
                {estates.filter(e => e.ownerId === editingOwner.id).map(e => <button key={e.id} type="button" style={linkBtn} onClick={() => openEstate(e.id)}>{e.id} · {e.city} · {e.zone}</button>)}
                {!estates.filter(e => e.ownerId === editingOwner.id).length && <span style={{color:"#64748b"}}>Sin fincas asociadas.</span>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginTop:12,alignItems:"end"}}>
                <label style={{display:"grid",gap:6}}>
                  <span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Asociar finca existente</span>
                  <select defaultValue="" onChange={e => { assignEstateToOwner(e.target.value, editingOwner.id); e.target.value=""; }} style={{width:"100%",boxSizing:"border-box",border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",color:"#0b1220",fontWeight:750,background:"#fff",outline:"none"}}>
                    <option value="" disabled>Seleccionar finca...</option>
                    {estates.filter(e => e.ownerId !== editingOwner.id).map(e => <option key={e.id} value={e.id}>{e.id} · {e.city} · {e.zone} · propietario actual: {owners.find(o => o.id === e.ownerId)?.name || e.ownerId}</option>)}
                  </select>
                </label>
                <Button small secondary onClick={() => createEstateForOwner(editingOwner.id)}>+ Nueva finca</Button>
              </div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Button onClick={() => setOwnerPanelMode("edit")}>✏️ Editar propietario</Button><Button secondary onClick={createOwnerFromTab}>+ Nuevo propietario</Button>{editingOwner && <Button secondary onClick={() => createEstateForOwner(editingOwner.id)}>+ Nueva finca</Button>}</div>
          </div> : editingOwner ? <div style={{display:"grid",gap:10}}>
            <Field label="Nombre" value={editingOwner.name || ""} onChange={v => setEditingOwner(o => ({...o,name:v}))} />
            <Field label="Teléfono" value={editingOwner.phone || ""} onChange={v => setEditingOwner(o => ({...o,phone:v}))} />
            <Field label="Email" value={editingOwner.email || ""} onChange={v => setEditingOwner(o => ({...o,email:v}))} />
            <Field label="IBAN" value={editingOwner.iban || ""} onChange={v => setEditingOwner(o => ({...o,iban:v}))} />
            <Field label="Estado contrato" value={editingOwner.contract || ""} onChange={v => setEditingOwner(o => ({...o,contract:v}))} />
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Button onClick={saveOwner}>{editingOwner?._isNew ? "✅ Crear propietario" : "💾 Guardar propietario"}</Button><Button secondary onClick={() => editingOwner?._isNew ? setEditingOwner(null) : setOwnerPanelMode("view")}>Cancelar</Button></div>
          </div> : <p style={{color:"#64748b"}}>Pulsa un código o nombre para ver la ficha. Pulsa editar solo para modificar.</p>}
        </Card>
      </section>}

      {activeTab === "inquilinos" && <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"1.05fr .95fr",gap:16,alignItems:"start"}}>
        <Card title="Inquilinos" icon="👥" right={<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><Badge tone="info">Vinculados a habitación</Badge><Button small onClick={createTenantFromTab}>+ Nuevo inquilino</Button><Button small secondary onClick={restoreDemoData}>Restaurar demo</Button></div>}>
          <Table columns={[
            { key:"id", label:"Código", bold:true, render:t => <button type="button" style={linkBtn} onClick={() => openTenant(t.id)}>{t.id}</button> },
            { key:"name", label:"Nombre", bold:true, render:t => <button type="button" style={linkBtn} onClick={() => openTenant(t.id)}>{t.name}</button> },
            { key:"phone", label:"Teléfono", render:t => <a href={`tel:${normalizePhone(t.phone)}`} style={linkBtn}>{t.phone}</a> },
            { key:"email", label:"Email", render:t => <a href={`mailto:${t.email}`} style={linkBtn}>{t.email}</a> },
            { key:"room", label:"Habitación", render:t => t.room?.startsWith("SR-IMM") ? <button type="button" style={linkBtn} onClick={() => openRoom(t.room)}>{t.room}</button> : t.room },
            { key:"status", label:"Estado", render:t => <Badge tone={t.status === "Activo" ? "ok" : "wait"}>{t.status}</Badge> },
            { key:"actions", label:"", render:t => <Button small onClick={() => editTenant(t)}>Editar</Button> },
          ]} rows={filteredTenants} empty="Sin inquilinos." />
        </Card>
        <Card title={editingTenant?._isNew ? "Nuevo inquilino" : tenantPanelMode === "edit" ? "Editar inquilino" : "Ficha inquilino"} icon={editingTenant?._isNew ? "➕" : tenantPanelMode === "edit" ? "✏️" : "👁️"} right={editingTenant ? <Badge tone={editingTenant._isNew ? "ok" : "wait"}>{editingTenant.id}</Badge> : <Badge tone="dark">Selecciona</Badge>}>
          {editingTenant && tenantPanelMode === "view" ? (() => {
            const room = allRooms.find(r => r.id === editingTenant.room);
            const estate = room ? estates.find(e => e.id === room.estateId) : null;
            const owner = estate ? owners.find(o => o.id === estate.ownerId) : null;
            return <div style={{display:"grid",gap:12}}>
              <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12,lineHeight:1.65}}>
                <div><strong>Código:</strong> <button type="button" style={linkBtn} onClick={() => openTenant(editingTenant.id)}>{editingTenant.id}</button></div>
                <div><strong>Nombre:</strong> {editingTenant.name}</div>
                <div><strong>Teléfono:</strong> <a href={`tel:${normalizePhone(editingTenant.phone)}`} style={linkBtn}>{editingTenant.phone}</a> · <a href={`https://wa.me/${normalizePhone(editingTenant.phone)}`} target="_blank" rel="noreferrer" style={linkBtn}>WhatsApp</a></div>
                <div><strong>Email:</strong> <a href={`mailto:${editingTenant.email}`} style={linkBtn}>{editingTenant.email}</a></div>
                <div><strong>Estado:</strong> {editingTenant.status}</div>
              </div>
              <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12,lineHeight:1.65}}>
                <div><strong>🚪 Habitación:</strong> {editingTenant.room?.startsWith("SR-IMM") ? <button type="button" style={linkBtn} onClick={() => openRoom(editingTenant.room)}>{editingTenant.room}</button> : editingTenant.room}</div>
                <div><strong>🏠 Finca:</strong> {estate ? <button type="button" style={linkBtn} onClick={() => openEstate(estate.id)}>{estate.id} · {estate.city}</button> : "—"}</div>
                <div><strong>👤 Propietario:</strong> {owner ? <button type="button" style={linkBtn} onClick={() => openOwner(owner.id)}>{owner.name}</button> : "—"}</div>
              </div>
              <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
                <strong>📁 Documentación</strong>
                <div style={{display:"grid",gap:6,marginTop:8,color:"#334155",fontWeight:850}}>
                  <div>✅ Identidad / DNI</div>
                  <div>✅ Teléfono verificado</div>
                  <div>✅ Contrato vinculado</div>
                  <div>🟡 Logalty pendiente de integración real</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Button onClick={() => setTenantPanelMode("edit")}>✏️ Editar inquilino</Button><Button secondary onClick={createTenantFromTab}>+ Nuevo inquilino</Button></div>
            </div>;
          })() : editingTenant ? <div style={{display:"grid",gap:10}}>
            <Field label="Nombre" value={editingTenant.name || ""} onChange={v => setEditingTenant(t => ({...t,name:v}))} />
            <Field label="Teléfono" value={editingTenant.phone || ""} onChange={v => setEditingTenant(t => ({...t,phone:v}))} />
            <Field label="Email" value={editingTenant.email || ""} onChange={v => setEditingTenant(t => ({...t,email:v}))} />
            <Field label="Habitación" value={editingTenant.room || ""} onChange={v => setEditingTenant(t => ({...t,room:v}))} />
            <Field label="Estado" value={editingTenant.status || ""} onChange={v => setEditingTenant(t => ({...t,status:v}))} />
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Button onClick={saveTenant}>{editingTenant?._isNew ? "✅ Crear inquilino" : "💾 Guardar inquilino"}</Button><Button secondary onClick={() => editingTenant?._isNew ? setEditingTenant(null) : setTenantPanelMode("view")}>Cancelar</Button></div>
          </div> : <p style={{color:"#64748b"}}>Pulsa un código o nombre para ver la ficha. Pulsa editar solo para modificar.</p>}
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

      {activeTab === "tareas" && <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"1fr .8fr",gap:16,alignItems:"start"}}>
        <Card title="Tareas operativas" icon="✅" right={<Badge tone={urgentTasks.length ? "wait" : "ok"}>{pendingTasks.length} pendientes</Badge>}>
          <Table columns={[
            { key:"done", label:"", render:t => <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} /> },
            { key:"title", label:"Tarea", bold:true, render:t => <span style={{textDecoration:t.done ? "line-through" : "none", color:t.done ? "#94a3b8" : "#0b1220"}}>{t.title}</span> },
            { key:"type", label:"Tipo" },
            { key:"estateId", label:"Finca", render:t => <button type="button" style={linkBtn} onClick={() => openEstate(t.estateId)}>{t.estateId}</button> },
            { key:"priority", label:"Prioridad", render:t => <Badge tone={t.priority === "Alta" ? "danger" : t.priority === "Media" ? "wait" : "info"}>{t.priority}</Badge> },
            { key:"due", label:"Vence" },
            { key:"actions", label:"", render:t => <Button small danger onClick={() => deleteTask(t.id)}>Borrar</Button> },
          ]} rows={taskList} empty="Sin tareas." />
        </Card>
        <div style={{display:"grid",gap:16}}>
          <Card title="Añadir tarea" icon="➕" right={<Badge tone="dark">CRM diario</Badge>}>
            <div style={{display:"grid",gap:10}}>
              <Field label="Tarea" value={newTask.title} onChange={v => setNewTask(t => ({...t,title:v}))} />
              <Field label="Tipo" value={newTask.type} onChange={v => setNewTask(t => ({...t,type:v}))} />
              <Field label="Finca" value={newTask.estateId} onChange={v => setNewTask(t => ({...t,estateId:v}))} />
              <Field label="Prioridad" value={newTask.priority} onChange={v => setNewTask(t => ({...t,priority:v}))} />
              <Field label="Vence" value={newTask.due} onChange={v => setNewTask(t => ({...t,due:v}))} />
              <Button onClick={addTask}>+ Guardar tarea</Button>
            </div>
          </Card>
          <Card title="Hoy hay que mirar" icon="🎯">
            <div style={{display:"grid",gap:9}}>
              {urgentTasks.slice(0,6).map(t => <div key={t.id} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:10}}>
                <div style={{fontWeight:950}}>{t.title}</div>
                <div style={{fontSize:13,color:"#64748b",marginTop:4}}>{t.estateId} · {t.type} · {t.due}</div>
              </div>)}
              {!urgentTasks.length && <div style={{color:"#64748b"}}>No hay tareas urgentes.</div>}
            </div>
          </Card>
        </div>
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
        ]} rows={estates} empty="Sin liquidaciones." />
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
      @media(max-width:1180px){.sr-global-results{grid-template-columns:1fr 1fr!important}.sr-pro-kpis{grid-template-columns:1fr 1fr 1fr!important}.sr-pro-grid-main{grid-template-columns:1fr!important}.sr-help-grid{grid-template-columns:1fr 1fr!important}}
      @media(max-width:760px){.sr-inventory-form{grid-template-columns:1fr!important}.sr-incident-form{grid-template-columns:1fr!important}.sr-global-results{grid-template-columns:1fr!important}.sr-pro-kpis{grid-template-columns:1fr!important}.sr-sim-form{grid-template-columns:1fr!important}.sr-room-row{grid-template-columns:1fr!important}.sr-estate-summary{grid-template-columns:1fr!important}.sr-room-editor{grid-template-columns:1fr!important}.sr-room-fields{grid-template-columns:1fr!important}.sr-photo-grid{grid-template-columns:1fr!important}.sr-contact-form{grid-template-columns:1fr!important}.sr-help-grid{grid-template-columns:1fr!important}}
    `}</style>
  </main>;
}

const searchGroupStyle = {background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:10,display:"grid",gap:8,alignContent:"start"};
const searchResultBtn = {display:"grid",gap:2,textAlign:"left",background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"8px 9px",cursor:"pointer",color:"#0b1220"};
const metricLine = {display:"flex",justifyContent:"space-between",gap:12,padding:"9px 0",borderBottom:"1px solid #f1f5f9",color:"#475569"};
const infoBox = {background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:12,color:"#334155",lineHeight:1.55};

const th = {padding:"9px 7px",borderBottom:"1px solid #e2e8f0",color:"#64748b"};
const td = {padding:"9px 7px",borderBottom:"1px solid #f1f5f9",color:"#0b1220"};
