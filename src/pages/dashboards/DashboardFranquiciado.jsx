// src/pages/dashboards/DashboardFranquiciado.jsx
// SpainRoom® — Centro de Operaciones Franquiciado PRO V1
import React, { useMemo, useState } from "react";

function getUser() {
  try { return JSON.parse(localStorage.getItem("SR_USER") || "{}"); } catch { return {}; }
}
function firstName(name) {
  const clean = String(name || "").trim();
  return clean ? clean.split(/\s+/)[0] : "Franquiciado";
}
function money(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}
function pct(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return `${n.toFixed(2).replace(".", ",")} %`;
}

function Badge({ children, tone = "info" }) {
  const map = {
    ok: ["#ecfdf5", "#047857", "#bbf7d0"],
    wait: ["#fffbeb", "#92400e", "#fde68a"],
    danger: ["#fef2f2", "#991b1b", "#fecaca"],
    orange: ["#fff7ed", "#c2410c", "#fed7aa"],
    info: ["#eff6ff", "#1d4ed8", "#bfdbfe"],
    dark: ["#f1f5f9", "#334155", "#cbd5e1"],
  };
  const [bg, color, border] = map[tone] || map.info;
  return <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:999,fontWeight:900,fontSize:13,background:bg,color,border:`1px solid ${border}`,whiteSpace:"nowrap"}}>{children}</span>;
}

function Card({ title, icon, children, right }) {
  return <section style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:20,padding:18,boxShadow:"0 8px 24px rgba(15,23,42,.06)"}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:40,height:40,borderRadius:14,background:"#eef6ff",display:"grid",placeItems:"center",fontSize:21,flex:"0 0 auto"}}>{icon}</div>
        <h3 style={{margin:0,fontSize:19,fontWeight:950,color:"#0b1220",letterSpacing:"-.01em"}}>{title}</h3>
      </div>
      {right}
    </div>
    {children}
  </section>;
}

function KPI({ label, value, hint, icon, tone = "info" }) {
  const bg = tone === "ok" ? "#ecfdf5" : tone === "danger" ? "#fef2f2" : tone === "wait" ? "#fffbeb" : "#eff6ff";
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

function Button({ children, onClick, href, secondary = false, danger = false, small = false }) {
  const common = {display:"inline-flex",alignItems:"center",justifyContent:"center",textDecoration:"none",borderRadius:13,fontWeight:950,cursor:"pointer",fontSize:small?13:14,padding:small?"8px 10px":"10px 13px",border:"1px solid",whiteSpace:"nowrap"};
  let style = {...common,background:"#0A58CA",color:"#fff",borderColor:"#0A58CA"};
  if (secondary) style = {...common,background:"#f8fafc",color:"#0A58CA",borderColor:"#cfe0ff"};
  if (danger) style = {...common,background:"#fef2f2",color:"#991b1b",borderColor:"#fecaca"};
  if (href) return <a href={href} style={style}>{children}</a>;
  return <button type="button" onClick={onClick} style={style}>{children}</button>;
}

function AdminBanner() {
  const id = new URLSearchParams(window.location.search).get("admin_view_user_id");
  if (!id) return null;
  return <div style={{marginBottom:14,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",borderRadius:16,padding:"12px 14px",fontWeight:900}}>👑 Modo supervisión Admin · Vista usuario ID {id}</div>;
}

function TaskRow({ icon, title, detail, tone, action }) {
  return <div style={{display:"grid",gridTemplateColumns:"42px 1fr auto",gap:10,alignItems:"center",padding:"11px 0",borderBottom:"1px solid #f1f5f9"}}>
    <div style={{fontSize:25}}>{icon}</div>
    <div>
      <div style={{color:"#0b1220",fontWeight:950}}>{title}</div>
      <div style={{color:"#64748b",fontSize:13,marginTop:2}}>{detail}</div>
    </div>
    <Badge tone={tone}>{action}</Badge>
  </div>;
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

function Field({ label, value, onChange, type = "text" }) {
  return <label style={{display:"grid",gap:6}}>
    <span style={{color:"#64748b",fontSize:13,fontWeight:850}}>{label}</span>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{width:"100%",boxSizing:"border-box",border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",color:"#0b1220",fontWeight:750,background:"#fff",outline:"none"}} />
  </label>;
}

function Check({ checked, onChange, label }) {
  return <label style={{display:"inline-flex",alignItems:"center",gap:8,cursor:"pointer",color:"#334155",fontWeight:850,padding:"8px 10px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12}}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    {label}
  </label>;
}

function HealthLine({ label, tone }) {
  const dot = tone === "ok" ? "🟢" : tone === "wait" ? "🟡" : tone === "orange" ? "🟠" : "🔴";
  return <div style={{display:"flex",justifyContent:"space-between",gap:12,padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
    <span style={{color:"#475569",fontWeight:800}}>{label}</span><strong>{dot}</strong>
  </div>;
}

const INITIAL_ROOMS = [
  { id:"SR-H-00125", title:"Centro A", status:"Ocupada", price:335, payment:"ok", convivencia:"wait", docs:"ok", publish:"ok" },
  { id:"SR-H-00126", title:"Centro B", status:"Pendiente fotos", price:310, payment:"ok", convivencia:"ok", docs:"wait", publish:"wait" },
  { id:"SR-H-00127", title:"Eixample A", status:"Lista para publicar", price:360, payment:"ok", convivencia:"ok", docs:"ok", publish:"wait" },
  { id:"SR-H-00128", title:"Manresa Norte", status:"Contrato pendiente", price:290, payment:"danger", convivencia:"ok", docs:"danger", publish:"danger" },
];

const CONTACTS = [
  { id:"SR-C-001", name:"Marta López", type:"Propietaria", phone:"+34 600 000 000", email:"propietario@ejemplo.com", zone:"Manresa", next:"Llamar hoy" },
  { id:"SR-C-002", name:"Javier Ruiz", type:"Propietario", phone:"+34 622 000 000", email:"javier@ejemplo.com", zone:"Terrassa", next:"Enviar simulación" },
  { id:"SR-C-003", name:"Laura M.", type:"Candidata", phone:"+34 633 000 000", email:"laura@ejemplo.com", zone:"Barcelona", next:"Documentación" },
  { id:"SR-C-004", name:"Inmobiliaria Delta", type:"Colaborador", phone:"+34 931 000 000", email:"delta@ejemplo.com", zone:"Sabadell", next:"Reunión" },
];

const OWNERS = [
  { id:"SR-PROP-00125", name:"Marta López", phone:"+34 600 000 000", email:"propietario@ejemplo.com", property:"Calle Mayor 12, Manresa", rooms:4, status:"Simulación enviada" },
  { id:"SR-PROP-00126", name:"Javier Ruiz", phone:"+34 622 000 000", email:"javier@ejemplo.com", property:"Piso Centro B", rooms:2, status:"Pendiente visita" },
  { id:"SR-PROP-00127", name:"Inmobiliaria Delta", phone:"+34 931 000 000", email:"delta@ejemplo.com", property:"Cartera Sabadell", rooms:8, status:"Colaborador" },
];

const TENANTS = [
  { id:"SR-I-00451", name:"Laura M.", phone:"+34 633 000 000", email:"laura@ejemplo.com", room:"SR-H-00125", status:"Documentación" },
  { id:"SR-I-00452", name:"Christian B.", phone:"+34 607 000 000", email:"christian@ejemplo.com", room:"SR-H-00126", status:"Activo" },
  { id:"SR-I-00453", name:"Ana R.", phone:"+34 644 000 000", email:"ana@ejemplo.com", room:"SR-H-00127", status:"Pendiente pago" },
];

const HELP = [
  ["Cómo explicar SpainRoom", "Usted aporta la vivienda. SpainRoom la gestiona. Y usted cobra."],
  ["Qué no decir", "Evita: “le voy a llenar el piso de habitaciones”. Habla de gestión, rentabilidad y tranquilidad."],
  ["Inmobiliarias", "SpainRoom no compite: ayuda a obtener más rentabilidad en determinados inmuebles."],
  ["Fotos y publicación", "Sube las fotos. SpainRoom las adapta automáticamente para publicación."],
];

export default function DashboardFranquiciado() {
  const user = useMemo(getUser, []);
  const [rooms] = useState(INITIAL_ROOMS);
  const [simAddress, setSimAddress] = useState("Calle Mayor 12, Manresa");
  const [ownerName, setOwnerName] = useState("Marta López");
  const [ownerEmail, setOwnerEmail] = useState("propietario@ejemplo.com");
  const [ownerPhone, setOwnerPhone] = useState("+34 600 000 000");
  const [homeValue, setHomeValue] = useState(240000);
  const [managementPct, setManagementPct] = useState(20);
  const [insuranceTenant, setInsuranceTenant] = useState(5);
  const [simRooms, setSimRooms] = useState([
    { id:1, m2:9, bathM2:3, balconyM2:0, bath:true, balcony:false },
    { id:2, m2:12, bathM2:0, balconyM2:2, bath:false, balcony:true },
    { id:3, m2:11, bathM2:0, balconyM2:2, bath:false, balcony:true },
    { id:4, m2:14, bathM2:0, balconyM2:0, bath:false, balcony:false },
  ]);
  const [savedSimulations, setSavedSimulations] = useState(() => {
    try { return JSON.parse(localStorage.getItem("SR_FRANQ_SIMULATIONS") || "[]"); } catch { return []; }
  });
  const [savedNotice, setSavedNotice] = useState("");
  const [peopleTab, setPeopleTab] = useState("owners");
  const [selectedOwnerId, setSelectedOwnerId] = useState("SR-PROP-00125");
  const [detailPanel, setDetailPanel] = useState(null);
  const [manualOpen, setManualOpen] = useState(null);
  const [workPanel, setWorkPanel] = useState(null);
  const [newContact, setNewContact] = useState({ name:"", type:"Propietario", phone:"", email:"", zone:"", next:"" });
  const [extraContacts, setExtraContacts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("SR_FRANQ_EXTRA_CONTACTS") || "[]"); } catch { return []; }
  });
  const [selectedRoomId, setSelectedRoomId] = useState("SR-H-00126");
  const [roomForm, setRoomForm] = useState({
    ownerId: "SR-PROP-00125",
    title: "Centro B",
    description: "Habitación luminosa, amueblada y lista para entrar a vivir. Precio calculado por SpainRoom.",
    m2: 12,
    bathM2: 0,
    balconyM2: 2,
    bath: false,
    balcony: true,
    price: 355,
    photos: [
      { name: "principal.jpg", url: "", principal: true },
      { name: "ventana.jpg", url: "", principal: false },
    ],
  });
  const [roomDrafts, setRoomDrafts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("SR_FRANQ_ROOM_DRAFTS") || "[]"); } catch { return []; }
  });
  const [roomNotice, setRoomNotice] = useState("");

  const activeRooms = 18;
  const recurring = 1125;
  const annual = recurring * 12;
  const paidBack = 1350;
  const canon = 5000;
  const paybackPct = Math.min(100, (paidBack / canon) * 100);

  const maxMonthlyRent = homeValue * 0.0052;
  const totalPrivateM2 = simRooms.reduce((sum, r) => sum + Number(r.m2 || 0) + Number(r.bathM2 || 0) + Number(r.balconyM2 || 0), 0);
  const euroM2 = totalPrivateM2 > 0 ? maxMonthlyRent / totalPrivateM2 : 0;
  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const selectedOwner = OWNERS.find(o => o.id === selectedOwnerId) || OWNERS[0];
  const allContacts = [...CONTACTS, ...extraContacts];

  const calculatedRooms = simRooms.map((r) => {
    const privateM2 = Number(r.m2 || 0) + Number(r.bathM2 || 0) + Number(r.balconyM2 || 0);
    const supplement = (r.bath ? 25 : 0) + (r.balcony ? 25 : 0);
    const rent = Math.round(privateM2 * euroM2 + supplement);
    return { ...r, privateM2, supplement, rent, totalTenant: rent + Number(insuranceTenant || 0) };
  });
  const grossRent = calculatedRooms.reduce((sum, r) => sum + r.rent, 0);
  const ownerMonthly = Math.round(grossRent * (1 - Number(managementPct || 0) / 100));
  const ownerAnnual = ownerMonthly * 12;
  const ownerYield = homeValue > 0 ? (ownerAnnual / homeValue) * 100 : 0;

  function updateSimRoom(id, patch) {
    setSimRooms(rows => rows.map(r => r.id === id ? { ...r, ...patch } : r));
  }
  function addRoom() {
    const nextId = Math.max(...simRooms.map(r => r.id)) + 1;
    setSimRooms(rows => [...rows, { id:nextId, m2:10, bathM2:0, balconyM2:0, bath:false, balcony:false }]);
  }
  function removeRoom(id) {
    setSimRooms(rows => rows.length <= 1 ? rows : rows.filter(r => r.id !== id));
  }

  function buildSimulationPayload() {
    return {
      id: `SR-SIM-${Date.now()}`,
      createdAt: new Date().toLocaleString("es-ES"),
      ownerName,
      ownerEmail,
      ownerPhone,
      simAddress,
      homeValue,
      grossRent,
      ownerMonthly,
      ownerAnnual,
      ownerYield,
      insuranceTenant,
      rooms: calculatedRooms.map((r, idx) => ({
        name: `H${idx + 1}`,
        privateM2: r.privateM2,
        supplement: r.supplement,
        rent: r.rent,
        totalTenant: r.totalTenant,
      })),
    };
  }

  function saveSimulation() {
    const payload = buildSimulationPayload();
    const next = [payload, ...savedSimulations].slice(0, 12);
    setSavedSimulations(next);
    localStorage.setItem("SR_FRANQ_SIMULATIONS", JSON.stringify(next));
    setSavedNotice(`Simulación guardada: ${payload.id}`);
  }

  function emailSimulation() {
    const subject = encodeURIComponent(`Simulación SpainRoom - ${ownerName || simAddress}`);
    const body = encodeURIComponent(
      `Hola ${ownerName || ""},\n\n` +
      `Te envío la simulación orientativa SpainRoom para:\n${simAddress}\n\n` +
      `Ingresos vivienda: ${money(grossRent)} / mes\n` +
      `Ingresos estimados propietario: ${money(ownerMonthly)} / mes\n` +
      `Ingresos estimados propietario: ${money(ownerAnnual)} / año\n` +
      `Rentabilidad estimada: ${pct(ownerYield)}\n\n` +
      `La protección del inquilino se cobra junto al recibo, pero aparece separada del alquiler para mayor claridad.\n\n` +
      `Saludos,\nSpainRoom®`
    );
    window.location.href = `mailto:${ownerEmail || ""}?subject=${subject}&body=${body}`;
  }

  function handlePhotoUpload(files) {
    const uploaded = Array.from(files || []).map((file, idx) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      principal: roomForm.photos.length === 0 && idx === 0,
    }));
    if (uploaded.length === 0) return;
    setRoomForm(f => ({ ...f, photos: [...f.photos, ...uploaded] }));
    setRoomNotice(`${uploaded.length} foto(s) añadida(s).`);
  }

  function addDemoPhoto() {
    const next = { name: `foto-${roomForm.photos.length + 1}.jpg`, url: "", principal: roomForm.photos.length === 0 };
    setRoomForm(f => ({ ...f, photos: [...f.photos, next] }));
  }

  function removeDemoPhoto(name) {
    setRoomForm(f => ({ ...f, photos: f.photos.filter(p => p.name !== name) }));
  }

  function setPrincipalPhoto(name) {
    setRoomForm(f => ({ ...f, photos: f.photos.map(p => ({ ...p, principal: p.name === name })) }));
  }

  function viewOwner(owner) {
    setSelectedOwnerId(owner.id);
    setPeopleTab("owners");
    setDetailPanel({
      type: "owner",
      title: `${owner.id} · ${owner.name}`,
      rows: [
        ["Nombre", owner.name],
        ["Teléfono", owner.phone],
        ["Email", owner.email],
        ["Inmueble", owner.property],
        ["Habitaciones", owner.rooms],
        ["Estado", owner.status],
      ],
      actions: "owner",
    });
    setRoomForm(f => ({ ...f, ownerId: owner.id }));
    setSimAddress(owner.property || simAddress);
    setOwnerName(owner.name || ownerName);
    setOwnerEmail(owner.email || ownerEmail);
    setOwnerPhone(owner.phone || ownerPhone);
  }

  function viewTenant(tenant) {
    setPeopleTab("tenants");
    setDetailPanel({
      type: "tenant",
      title: `${tenant.id} · ${tenant.name}`,
      rows: [
        ["Nombre", tenant.name],
        ["Teléfono", tenant.phone],
        ["Email", tenant.email],
        ["Habitación", tenant.room],
        ["Estado", tenant.status],
      ],
      actions: "tenant",
    });
  }

  function viewContact(contact) {
    setPeopleTab("contacts");
    setDetailPanel({
      type: "contact",
      title: `${contact.id} · ${contact.name}`,
      rows: [
        ["Nombre", contact.name],
        ["Tipo", contact.type],
        ["Teléfono", contact.phone || "Pendiente"],
        ["Email", contact.email || "Pendiente"],
        ["Zona", contact.zone || "Pendiente"],
        ["Siguiente acción", contact.next || "Pendiente"],
      ],
      actions: "contact",
    });
  }

  function openWorkPanel(type) {
    const panels = {
      calls: {
        title: "📞 Llamadas pendientes",
        lines: ["Marta López · Propietaria · Llamar hoy", "Javier Ruiz · Enviar simulación", "Inmobiliaria Delta · Confirmar reunión"],
      },
      agenda: {
        title: "📅 Agenda",
        lines: ["09:30 · Llamar a Marta López", "11:00 · Visita SR-PROP-00125", "16:00 · Subir contrato firmado", "18:15 · Enviar simulación"],
      },
      publish: {
        title: "📸 Publicación",
        lines: ["SR-H-00126 · Pendiente fotos", "SR-H-00127 · Lista para publicar", "SR-H-00128 · Contrato pendiente"],
      },
    };
    setWorkPanel(panels[type]);
  }

  function addContact() {
    if (!newContact.name.trim()) {
      setDetailPanel({
        type: "notice",
        title: "Falta el nombre del contacto",
        rows: [["Aviso", "Añade al menos el nombre para guardar el contacto."]],
      });
      return;
    }
    const item = { id:`SR-C-${Date.now()}`, ...newContact };
    const next = [item, ...extraContacts];
    setExtraContacts(next);
    localStorage.setItem("SR_FRANQ_EXTRA_CONTACTS", JSON.stringify(next));
    setNewContact({ name:"", type:"Propietario", phone:"", email:"", zone:"", next:"" });
    setPeopleTab("contacts");
    viewContact(item);
  }

  function selectRoomForEditing(room) {
    setSelectedRoomId(room.id);
    setRoomForm(f => ({
      ...f,
      title: room.title,
      price: room.price,
      description: f.description || "Habitación lista para publicar con SpainRoom.",
    }));
    setRoomNotice(`Editando ${room.id}.`);
  }

  function buildRoomDraft(status = "Borrador") {
    const owner = OWNERS.find(o => o.id === roomForm.ownerId);
    return {
      id: selectedRoomId || `SR-H-${Date.now()}`,
      createdAt: new Date().toLocaleString("es-ES"),
      ownerId: roomForm.ownerId,
      ownerName: owner?.name || "Propietario",
      title: roomForm.title,
      description: roomForm.description,
      m2: Number(roomForm.m2 || 0),
      bathM2: Number(roomForm.bathM2 || 0),
      balconyM2: Number(roomForm.balconyM2 || 0),
      bath: roomForm.bath,
      balcony: roomForm.balcony,
      price: Number(roomForm.price || 0),
      photos: roomForm.photos.map(p => ({ name: p.name, principal: p.principal })),
      status,
    };
  }

  function saveRoomDraft() {
    const draft = buildRoomDraft("Borrador guardado");
    const next = [draft, ...roomDrafts.filter(d => d.id !== draft.id)].slice(0, 20);
    setRoomDrafts(next);
    localStorage.setItem("SR_FRANQ_ROOM_DRAFTS", JSON.stringify(next));
    setRoomNotice(`Ficha guardada y vinculada a ${draft.ownerName}.`);
  }

  function publishRoom() {
    if (!roomForm.ownerId) return setRoomNotice("Falta vincular propietario.");
    if (!roomForm.title || !roomForm.description) return setRoomNotice("Falta título o descripción.");
    if (roomForm.photos.length === 0) return setRoomNotice("Faltan fotos de la habitación.");
    const draft = buildRoomDraft("Lista para publicar");
    const next = [draft, ...roomDrafts.filter(d => d.id !== draft.id)].slice(0, 20);
    setRoomDrafts(next);
    localStorage.setItem("SR_FRANQ_ROOM_DRAFTS", JSON.stringify(next));
    setRoomNotice(`Habitación ${draft.id} lista para publicar.`);
  }

  function downloadSimulationPDF() {
    const payload = buildSimulationPayload();
    const rows = payload.rooms.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${r.privateM2} m²</td>
        <td>${money(r.supplement)}</td>
        <td><strong>${money(r.rent)}</strong></td>
        <td>${money(r.totalTenant)}</td>
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
          h1 { margin:0 0 8px; }
          .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:18px 0; }
          .box { border:1px solid #e2e8f0; border-radius:12px; padding:14px; }
          .big { font-size:24px; font-weight:800; }
          table { width:100%; border-collapse:collapse; margin-top:14px; }
          th, td { border-bottom:1px solid #e2e8f0; padding:9px; text-align:left; }
          .note { margin-top:18px; color:#475569; font-size:13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SpainRoom® · Simulación de rentabilidad</h1>
          <div>${payload.createdAt}</div>
        </div>

        <h2>Propietario</h2>
        <p><strong>${payload.ownerName || "Propietario"}</strong><br/>
        ${payload.ownerEmail || ""}<br/>
        ${payload.ownerPhone || ""}</p>

        <h2>Inmueble</h2>
        <p>${payload.simAddress}</p>

        <div class="grid">
          <div class="box"><div>Ingresos vivienda</div><div class="big">${money(payload.grossRent)} / mes</div></div>
          <div class="box"><div>Propietario</div><div class="big">${money(payload.ownerMonthly)} / mes</div></div>
          <div class="box"><div>Propietario anual</div><div class="big">${money(payload.ownerAnnual)} / año</div></div>
          <div class="box"><div>Rentabilidad estimada</div><div class="big">${pct(payload.ownerYield)}</div></div>
        </div>

        <h2>Habitaciones</h2>
        <table>
          <thead><tr><th>Hab.</th><th>m² privados</th><th>Suplementos</th><th>Alquiler</th><th>Total inquilino</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>

        <p class="note">
          Simulación orientativa SpainRoom. La protección del inquilino se cobra junto al recibo, pero aparece separada del alquiler para mayor claridad.
        </p>
        <script>window.print();</script>
      </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }

  return <main style={{minHeight:"100vh",background:"#f8fafc",color:"#0b1220",padding:"24px 16px 36px"}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>
      <AdminBanner />

      <section style={{background:"linear-gradient(135deg, #0b65d8 0%, #084fa8 100%)",color:"#fff",borderRadius:24,padding:"28px 24px",marginBottom:18,boxShadow:"0 12px 30px rgba(10,88,202,.24)"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.14)",border:"1px solid rgba(255,255,255,.24)",borderRadius:999,padding:"7px 12px",fontWeight:950,marginBottom:14}}>
              SpainRoom<sup>®</sup> · Centro de Operaciones
            </div>
            <h1 style={{margin:"0 0 8px",fontSize:"clamp(30px,4vw,46px)",lineHeight:1.08,fontWeight:950,letterSpacing:"-.035em"}}>Al ataque, {firstName(user.name)} 👋</h1>
            <p style={{margin:0,maxWidth:890,color:"rgba(255,255,255,.92)",lineHeight:1.6}}>Tu puesto de mando para captar propietarios, publicar habitaciones, controlar pagos, anticipar incidencias y construir una cartera recurrente.</p>
          </div>
          <div style={{background:"rgba(255,255,255,.14)",border:"1px solid rgba(255,255,255,.24)",borderRadius:18,padding:14,minWidth:250}}>
            <div style={{fontWeight:950,marginBottom:8}}>🧠 Asistente SpainRoom</div>
            <div style={{fontSize:14,lineHeight:1.5,color:"rgba(255,255,255,.92)"}}>Tienes 2 habitaciones listas para publicar, 1 convivencia en amarillo y 1 contrato pendiente de subir.</div>
          </div>
        </div>
      </section>

      <section className="sr-pro-kpis" style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:14,marginBottom:18}}>
        <KPI icon="🏠" label="Habitaciones activas" value={activeRooms} hint="Cartera viva" tone="ok" />
        <KPI icon="💶" label="Recurrente mensual" value={money(recurring)} hint="Estimado franquiciado" tone="ok" />
        <KPI icon="📈" label="Anual estimado" value={money(annual)} hint="Si mantiene cartera" />
        <KPI icon="🎯" label="Recuperación canon" value={`${Math.round(paybackPct)} %`} hint={`${money(paidBack)} de ${money(canon)}`} />
        <KPI icon="📸" label="Para publicar" value="4" hint="Fotos/ficha pendientes" tone="wait" />
        <KPI icon="⚠️" label="Alertas" value="3" hint="Pagos, convivencia, docs" tone="danger" />
      </section>

      <section className="sr-pro-grid-main" style={{display:"grid",gridTemplateColumns:"1.05fr .95fr",gap:16,alignItems:"start"}}>
        <div style={{display:"grid",gap:16}}>
          <Card title="Mi trabajo hoy" icon="🎯" right={<Badge tone="danger">Prioridad</Badge>}>
            <TaskRow icon="📞" title="3 llamadas pendientes" detail="Propietarios y candidatos por contactar" tone="danger" action="Llamar" />
            <TaskRow icon="🏠" title="2 visitas programadas" detail="Manresa 11:00 · Terrassa 17:30" tone="orange" action="Visitar" />
            <TaskRow icon="📄" title="1 contrato pendiente de firma" detail="SR-PROP-00125 · contrato propietario" tone="wait" action="Contrato" />
            <TaskRow icon="📸" title="4 habitaciones sin publicar" detail="Faltan fotos, ficha o validación" tone="info" action="Publicar" />
            <TaskRow icon="🟡" title="1 convivencia en amarillo" detail="Ruido y limpieza repetidos en SR-H-00125" tone="wait" action="Revisar" />
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:14}}>
              <Button onClick={() => openWorkPanel("calls")}>📞 Ver llamadas</Button><Button secondary onClick={() => openWorkPanel("agenda")}>📅 Ver agenda</Button><Button secondary onClick={() => openWorkPanel("publish")}>📸 Publicar</Button>
            </div>
            {workPanel && (
              <div style={{marginTop:14,background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:16,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",marginBottom:10}}>
                  <strong>{workPanel.title}</strong>
                  <Button small danger onClick={() => setWorkPanel(null)}>Cerrar</Button>
                </div>
                <div style={{display:"grid",gap:8}}>
                  {workPanel.lines.map(line => <div key={line} style={{padding:"8px 0",borderBottom:"1px solid #e2e8f0",fontWeight:850,color:"#334155"}}>{line}</div>)}
                </div>
              </div>
            )}
          </Card>

          <Card title="Simulador SpainRoom" icon="🧮" right={<Badge tone="ok">Informe propietario</Badge>}>
            <p style={{color:"#64748b",lineHeight:1.55,marginTop:0}}>Introduce los datos del propietario, inmueble y habitaciones. El sistema devuelve una simulación clara para guardar, enviar o descargar.</p>
            <div className="sr-sim-form" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
              <Field label="Nombre propietario" value={ownerName} onChange={setOwnerName} />
              <Field label="Email propietario" value={ownerEmail} onChange={setOwnerEmail} />
              <Field label="Teléfono propietario" value={ownerPhone} onChange={setOwnerPhone} />
            </div>

            <div className="sr-sim-form" style={{display:"grid",gridTemplateColumns:"1.4fr .8fr .8fr .8fr",gap:10,marginBottom:14}}>
              <Field label="Dirección / zona" value={simAddress} onChange={setSimAddress} />
              <Field label="Valor estimado vivienda" type="number" value={homeValue} onChange={v => setHomeValue(Number(v))} />
              <Field label="% gestión SpainRoom" type="number" value={managementPct} onChange={v => setManagementPct(Number(v))} />
              <Field label="Protección inquilino" type="number" value={insuranceTenant} onChange={v => setInsuranceTenant(Number(v))} />
            </div>

            <div style={{display:"grid",gap:10}}>
              {simRooms.map((r, idx) => <div key={r.id} className="sr-room-row" style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr 1fr auto",gap:10,alignItems:"end",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:12}}>
                <div style={{fontWeight:950,color:"#0b1220"}}>H{idx + 1}</div>
                <Field label="m² habitación" type="number" value={r.m2} onChange={v => updateSimRoom(r.id, { m2:Number(v) })} />
                <Field label="m² baño privado" type="number" value={r.bathM2} onChange={v => updateSimRoom(r.id, { bathM2:Number(v), bath:Number(v) > 0 ? true : r.bath })} />
                <Field label="m² balcón privado" type="number" value={r.balconyM2} onChange={v => updateSimRoom(r.id, { balconyM2:Number(v), balcony:Number(v) > 0 ? true : r.balcony })} />
                <div style={{display:"grid",gap:8}}>
                  <Check checked={r.bath} onChange={v => updateSimRoom(r.id, { bath:v })} label="+25 baño" />
                  <Check checked={r.balcony} onChange={v => updateSimRoom(r.id, { balcony:v })} label="+25 balcón" />
                  <Button small danger onClick={() => removeRoom(r.id)}>Quitar</Button>
                </div>
              </div>)}
            </div>
            <div style={{marginTop:12}}><Button secondary onClick={addRoom}>+ Añadir habitación</Button></div>

            <div className="sr-sim-results" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:16}}>
              <KPI icon="🏠" label="Ingresos vivienda" value={money(grossRent)} hint="Alquiler mensual total" tone="ok" />
              <KPI icon="👤" label="Propietario" value={money(ownerMonthly)} hint={`${money(ownerAnnual)} / año`} tone="ok" />
              <KPI icon="📊" label="Rentabilidad propietario" value={pct(ownerYield)} hint="Tras gestión estimada" />
              <KPI icon="🛡️" label="Protección" value={`+${money(insuranceTenant)}`} hint="Se cobra junto al recibo" tone="wait" />
            </div>

            <div style={{marginTop:14,overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                <thead><tr style={{color:"#64748b",textAlign:"left"}}>
                  <th style={th}>Hab.</th><th style={th}>m² privados</th><th style={th}>Suplementos</th><th style={th}>Alquiler</th><th style={th}>Total a cobrar</th>
                </tr></thead>
                <tbody>{calculatedRooms.map((r, idx) => <tr key={r.id}>
                  <td style={td}>H{idx + 1}</td>
                  <td style={td}>{r.privateM2} m²</td>
                  <td style={td}>{money(r.supplement)}</td>
                  <td style={td}><strong>{money(r.rent)}</strong></td>
                  <td style={td}>{money(r.totalTenant)} <span style={{color:"#64748b"}}>(alquiler + protección)</span></td>
                </tr>)}</tbody>
              </table>
            </div>
            <div style={{marginTop:14,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <Button onClick={saveSimulation}>💾 Guardar simulación</Button>
              <Button secondary onClick={emailSimulation}>📧 Enviar por correo</Button>
              <Button secondary onClick={downloadSimulationPDF}>📄 Descargar PDF</Button>
              <Badge tone="ok">✅ Informe listo</Badge>
            </div>
            {savedNotice && <div style={{marginTop:10,color:"#047857",fontWeight:900}}>{savedNotice}</div>}

            {savedSimulations.length > 0 && (
              <div style={{marginTop:14,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
                <div style={{fontWeight:950,color:"#0b1220",marginBottom:8}}>Últimas simulaciones guardadas</div>
                {savedSimulations.slice(0,3).map(s => (
                  <div key={s.id} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"7px 0",borderBottom:"1px solid #e2e8f0"}}>
                    <span style={{color:"#334155",fontWeight:800}}>{s.ownerName || "Propietario"} · {s.simAddress}</span>
                    <span style={{color:"#64748b"}}>{money(s.ownerMonthly)} / mes</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Cartera y publicación" icon="🏠" right={<Badge tone="info">Trabajo productivo</Badge>}>
            <Table columns={[
              { key:"id", label:"Habitación", bold:true },
              { key:"title", label:"Zona" },
              { key:"status", label:"Estado", render:r => <Badge tone={r.status === "Ocupada" ? "ok" : r.status.includes("Pendiente") ? "wait" : "info"}>{r.status}</Badge> },
              { key:"price", label:"Precio", render:r => money(r.price) },
              { key:"health", label:"Salud", render:r => <span title="Pagos · Convivencia · Docs · Publicación">{r.payment === "ok" ? "🟢" : "🔴"} {r.convivencia === "ok" ? "🟢" : "🟡"} {r.docs === "ok" ? "🟢" : "🔴"} {r.publish === "ok" ? "🟢" : r.publish === "wait" ? "🟡" : "🔴"}</span> },
              { key:"actions", label:"Acciones", render:r => <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Button small secondary onClick={() => selectRoomForEditing(r)}>Ficha</Button>
                <Button small secondary onClick={() => selectRoomForEditing(r)}>Fotos</Button>
                <Button small onClick={publishRoom}>Publicar</Button>
              </div> },
            ]} rows={rooms} empty="Sin habitaciones." />
          </Card>

          <Card title="Editor de habitación y publicación" icon="📸" right={<Badge tone="wait">{selectedRoom?.id}</Badge>}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <label style={{display:"grid",gap:6}}>
                <span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Propietario vinculado</span>
                <select value={roomForm.ownerId} onChange={e => setRoomForm(f => ({...f, ownerId:e.target.value}))} style={{border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",fontWeight:800}}>
                  {OWNERS.map(o => <option key={o.id} value={o.id}>{o.id} · {o.name}</option>)}
                </select>
              </label>
              <Field label="Título habitación" value={roomForm.title} onChange={v => setRoomForm(f => ({...f,title:v}))} />
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
              <Field label="m² habitación" type="number" value={roomForm.m2} onChange={v => setRoomForm(f => ({...f,m2:Number(v)}))} />
              <Field label="m² baño privado" type="number" value={roomForm.bathM2} onChange={v => setRoomForm(f => ({...f,bathM2:Number(v),bath:Number(v)>0?true:f.bath}))} />
              <Field label="m² balcón privado" type="number" value={roomForm.balconyM2} onChange={v => setRoomForm(f => ({...f,balconyM2:Number(v),balcony:Number(v)>0?true:f.balcony}))} />
              <Field label="Precio alquiler" type="number" value={roomForm.price} onChange={v => setRoomForm(f => ({...f,price:Number(v)}))} />
            </div>

            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              <Check checked={roomForm.bath} onChange={v => setRoomForm(f => ({...f,bath:v}))} label="+25 baño privado" />
              <Check checked={roomForm.balcony} onChange={v => setRoomForm(f => ({...f,balcony:v}))} label="+25 balcón privado" />
            </div>

            <label style={{display:"grid",gap:6,marginBottom:12}}>
              <span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Descripción para publicar</span>
              <textarea value={roomForm.description} onChange={e => setRoomForm(f => ({...f,description:e.target.value}))} rows={4} style={{border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",fontWeight:750,resize:"vertical"}} />
            </label>

            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:12,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",marginBottom:10}}>
                <strong>Fotos de la habitación</strong>
                <label style={{display:"inline-flex",alignItems:"center",justifyContent:"center",border:"1px solid #cfe0ff",borderRadius:13,padding:"8px 10px",fontWeight:950,color:"#0A58CA",background:"#f8fafc",cursor:"pointer"}}>
                  + Subir fotos
                  <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e => handlePhotoUpload(e.target.files)} />
                </label>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {roomForm.photos.map((photo, idx) => (
                  <div key={`${photo.name}-${idx}`} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:10}}>
                    <div style={{height:92,borderRadius:12,background:"linear-gradient(135deg,#dbeafe,#f8fafc)",display:"grid",placeItems:"center",fontSize:24,overflow:"hidden"}}>
                      {photo.url ? <img src={photo.url} alt={photo.name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : "🖼️"}
                    </div>
                    <div style={{fontWeight:900,marginTop:8}}>{photo.principal ? "Principal" : `Foto ${idx + 1}`}</div>
                    <div style={{color:"#64748b",fontSize:12,wordBreak:"break-word"}}>{photo.name}</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                      <Button small secondary onClick={() => setPrincipalPhoto(photo.name)}>Principal</Button>
                      <Button small danger onClick={() => removeDemoPhoto(photo.name)}>Eliminar</Button>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{color:"#64748b",fontSize:13,margin:"10px 0 0"}}>Vista previa funcional. En producción el backend guardará las fotos y aplicará la adaptación automática SpainRoom.</p>
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Button onClick={saveRoomDraft}>💾 Guardar ficha</Button>
              <label style={{display:"inline-flex",alignItems:"center",justifyContent:"center",border:"1px solid #cfe0ff",borderRadius:13,padding:"10px 13px",fontWeight:950,color:"#0A58CA",background:"#f8fafc",cursor:"pointer"}}>
                📸 Subir fotos
                <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e => handlePhotoUpload(e.target.files)} />
              </label>
              <Button onClick={publishRoom}>🚀 Publicar si está completa</Button>
            </div>
            {roomNotice && <div style={{marginTop:10,color:"#047857",fontWeight:900}}>{roomNotice}</div>}
            {roomDrafts.length > 0 && (
              <div style={{marginTop:14,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
                <div style={{fontWeight:950,marginBottom:8}}>Últimas fichas guardadas</div>
                {roomDrafts.slice(0,3).map(d => (
                  <div key={`${d.id}-${d.createdAt}`} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"7px 0",borderBottom:"1px solid #e2e8f0"}}>
                    <span style={{fontWeight:850,color:"#334155"}}>{d.id} · {d.title} · {d.ownerName}</span>
                    <span style={{color:"#64748b"}}>{d.status}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div style={{display:"grid",gap:16}}>
          <Card title="Mi negocio" icon="💰" right={<Badge tone="ok">Cartera</Badge>}>
            <div style={{display:"grid",gap:10}}>
              <div style={metricLine}><span>Canon inicial</span><strong>{money(canon)}</strong></div>
              <div style={metricLine}><span>Ingresos acumulados</span><strong>{money(paidBack)}</strong></div>
              <div style={metricLine}><span>Recuperación</span><strong>{Math.round(paybackPct)} %</strong></div>
              <div style={metricLine}><span>Ingreso mensual estimado</span><strong>{money(recurring)}</strong></div>
              <div style={metricLine}><span>Ingreso anual estimado</span><strong>{money(annual)}</strong></div>
            </div>
            <div style={{marginTop:14,background:"#f1f5f9",borderRadius:999,height:12,overflow:"hidden"}}><div style={{width:`${paybackPct}%`,height:"100%",background:"#0A58CA"}} /></div>
            <p style={{margin:"12px 0 0",color:"#64748b",lineHeight:1.5}}>Sin objetivos impuestos. Tu objetivo lo marca tu propia cartera activa.</p>
          </Card>

          <Card title="Agenda inmediata" icon="📅">
            {[
              ["09:30", "Llamar a Marta López", "Propietaria"],
              ["11:00", "Visita SR-PROP-00125", "Manresa"],
              ["16:00", "Subir contrato firmado", "Pendiente"],
              ["18:15", "Enviar simulación", "Inmobiliaria Delta"],
            ].map(([time, title, desc]) => <div key={`${time}-${title}`} style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
              <div style={{color:"#0A58CA",fontWeight:950}}>{time}</div>
              <div><div style={{color:"#0b1220",fontWeight:900}}>{title}</div><div style={{color:"#64748b",fontSize:13}}>{desc}</div></div>
            </div>)}
          </Card>

          <Card title="Cartera de personas" icon="👥" right={<Badge tone="info">Propietarios / Inquilinos</Badge>}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              <Button small secondary={peopleTab !== "owners"} onClick={() => setPeopleTab("owners")}>Propietarios</Button>
              <Button small secondary={peopleTab !== "tenants"} onClick={() => setPeopleTab("tenants")}>Inquilinos</Button>
              <Button small secondary={peopleTab !== "contacts"} onClick={() => setPeopleTab("contacts")}>Contactos</Button>
            </div>

            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12,marginBottom:12}}>
              <div style={{fontWeight:950,marginBottom:10}}>Añadir contacto rápido</div>
              <div className="sr-contact-form" style={{display:"grid",gridTemplateColumns:"1fr .7fr .8fr 1fr .8fr",gap:8}}>
                <Field label="Nombre" value={newContact.name} onChange={v => setNewContact(c => ({...c,name:v}))} />
                <label style={{display:"grid",gap:6}}>
                  <span style={{color:"#64748b",fontSize:13,fontWeight:850}}>Tipo</span>
                  <select value={newContact.type} onChange={e => setNewContact(c => ({...c,type:e.target.value}))} style={{border:"1px solid #cbd5e1",borderRadius:12,padding:"10px 11px",fontWeight:800}}>
                    <option>Propietario</option>
                    <option>Inquilino</option>
                    <option>Candidato</option>
                    <option>Colaborador</option>
                    <option>Inmobiliaria</option>
                    <option>Administrador de fincas</option>
                    <option>Asesoría</option>
                  </select>
                </label>
                <Field label="Teléfono" value={newContact.phone} onChange={v => setNewContact(c => ({...c,phone:v}))} />
                <Field label="Email" value={newContact.email} onChange={v => setNewContact(c => ({...c,email:v}))} />
                <Field label="Zona" value={newContact.zone} onChange={v => setNewContact(c => ({...c,zone:v}))} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginTop:8}}>
                <Field label="Siguiente acción" value={newContact.next} onChange={v => setNewContact(c => ({...c,next:v}))} />
                <div style={{display:"grid",alignItems:"end"}}><Button onClick={addContact}>+ Guardar contacto</Button></div>
              </div>
            </div>

            {peopleTab === "owners" && (
              <>
                <Table columns={[
                  { key:"id", label:"Código", bold:true },
                  { key:"name", label:"Propietario", bold:true },
                  { key:"property", label:"Inmueble" },
                  { key:"rooms", label:"Hab." },
                  { key:"status", label:"Estado", render:r => <Badge tone="info">{r.status}</Badge> },
                  { key:"actions", label:"", render:r => (
                    <button
                      type="button"
                      onClick={() => viewOwner(r)}
                      style={{background:"#0A58CA",color:"#fff",border:"1px solid #0A58CA",borderRadius:10,padding:"7px 10px",fontWeight:900,cursor:"pointer"}}
                    >
                      Ver
                    </button>
                  ) },
                ]} rows={OWNERS} empty="Sin propietarios." />

                <div style={{marginTop:14,background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:16,padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",marginBottom:10}}>
                    <strong style={{color:"#0b1220"}}>Propietario seleccionado</strong>
                    <Badge tone="info">{selectedOwner?.id}</Badge>
                  </div>
                  <div style={{display:"grid",gap:7,color:"#334155",fontSize:14}}>
                    <div><strong>Nombre:</strong> {selectedOwner?.name}</div>
                    <div><strong>Teléfono:</strong> {selectedOwner?.phone}</div>
                    <div><strong>Email:</strong> {selectedOwner?.email}</div>
                    <div><strong>Inmueble:</strong> {selectedOwner?.property}</div>
                    <div><strong>Habitaciones:</strong> {selectedOwner?.rooms}</div>
                    <div><strong>Estado:</strong> {selectedOwner?.status}</div>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
                    <button type="button" onClick={() => {
                      setSimAddress(selectedOwner?.property || "");
                      setOwnerName(selectedOwner?.name || "");
                      setOwnerEmail(selectedOwner?.email || "");
                      setOwnerPhone(selectedOwner?.phone || "");
                    }} style={{background:"#f8fafc",color:"#0A58CA",border:"1px solid #cfe0ff",borderRadius:10,padding:"8px 10px",fontWeight:900,cursor:"pointer"}}>
                      Cargar en simulador
                    </button>
                    <button type="button" onClick={() => setRoomForm(f => ({...f, ownerId:selectedOwner?.id || f.ownerId}))} style={{background:"#f8fafc",color:"#0A58CA",border:"1px solid #cfe0ff",borderRadius:10,padding:"8px 10px",fontWeight:900,cursor:"pointer"}}>
                      Vincular a habitación
                    </button>
                  </div>
                </div>
              </>
            )}

            {peopleTab === "tenants" && (
              <Table columns={[
                { key:"id", label:"Código", bold:true },
                { key:"name", label:"Inquilino", bold:true },
                { key:"room", label:"Habitación" },
                { key:"status", label:"Estado", render:r => <Badge tone={r.status === "Activo" ? "ok" : r.status.includes("pago") ? "danger" : "wait"}>{r.status}</Badge> },
                { key:"actions", label:"", render:r => <Button small onClick={() => viewOwner(r)}>Ver</Button> },
              ]} rows={TENANTS} empty="Sin inquilinos." />
            )}

            {peopleTab === "contacts" && (
              <Table columns={[
                { key:"name", label:"Nombre", bold:true },
                { key:"type", label:"Tipo" },
                { key:"phone", label:"Teléfono" },
                { key:"email", label:"Email" },
                { key:"zone", label:"Zona" },
                { key:"next", label:"Siguiente" },
                { key:"call", label:"", render:r => <button type="button" onClick={() => viewContact(r)} style={{background:"#f8fafc",color:"#0A58CA",border:"1px solid #cfe0ff",borderRadius:10,padding:"7px 10px",fontWeight:900,cursor:"pointer"}}>Ver</button> },
              ]} rows={allContacts} empty="Sin contactos." />
            )}

            {detailPanel && (
              <div style={{marginTop:14,background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:16,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",marginBottom:10}}>
                  <strong style={{color:"#0b1220"}}>{detailPanel.title}</strong>
                  <Button small danger onClick={() => setDetailPanel(null)}>Cerrar</Button>
                </div>
                <div style={{display:"grid",gap:7,color:"#334155",fontSize:14}}>
                  {detailPanel.rows.map(([k,v]) => (
                    <div key={k} style={{display:"flex",justifyContent:"space-between",gap:12,borderBottom:"1px solid #e2e8f0",padding:"6px 0"}}>
                      <span style={{color:"#64748b",fontWeight:800}}>{k}</span>
                      <strong style={{textAlign:"right"}}>{v}</strong>
                    </div>
                  ))}
                </div>
                {detailPanel.actions === "owner" && (
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
                    <Button small secondary onClick={() => {
                      const owner = OWNERS.find(o => o.id === selectedOwnerId);
                      setSimAddress(owner?.property || "");
                      setOwnerName(owner?.name || "");
                      setOwnerEmail(owner?.email || "");
                      setOwnerPhone(owner?.phone || "");
                    }}>Cargar en simulador</Button>
                    <Button small secondary onClick={() => setRoomForm(f => ({...f, ownerId:selectedOwnerId}))}>Vincular a habitación</Button>
                    <Button small secondary href={`tel:${selectedOwner?.phone || ""}`}>Llamar</Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card title="Salud de habitaciones" icon="🧠">
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:16,padding:14,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}><strong>SR-H-00125</strong><Badge tone="wait">🟡 Revisar</Badge></div>
              <HealthLine label="Pagos" tone="ok" />
              <HealthLine label="Convivencia" tone="wait" />
              <HealthLine label="Documentación" tone="ok" />
              <HealthLine label="Contrato" tone="ok" />
              <p style={{color:"#64748b",margin:"10px 0 0",lineHeight:1.45}}>Motivos repetidos: ruido nocturno y limpieza de cocina.</p>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Badge tone="ok">🟢 7 comentarios</Badge><Badge tone="wait">🟡 3 comentarios</Badge><Badge tone="orange">🟠 0</Badge><Badge tone="danger">🔴 0</Badge>
            </div>
          </Card>

          <Card title="Centro de ayuda comercial" icon="📚" right={<Badge tone="dark">Manual abierto</Badge>}>
            <div style={{display:"grid",gap:10}}>
              {HELP.map(([title, text]) => (
                <details key={title} open style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:12}}>
                  <summary style={{color:"#0b1220",fontWeight:950,cursor:"pointer"}}>{title}</summary>
                  <div style={{color:"#334155",fontSize:14,marginTop:10,lineHeight:1.55}}>
                    {text}
                    <div style={{marginTop:10,background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:10}}>
                      <strong>Guion rápido:</strong><br/>
                      Propietario: “Usted aporta la vivienda, SpainRoom la gestiona y usted cobra.”<br/>
                      Franquiciado: “Yo capto y acompaño; la plataforma organiza, calcula y documenta.”
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>

    <style>{`
      @media(max-width:1180px){.sr-pro-kpis{grid-template-columns:1fr 1fr 1fr!important}.sr-pro-grid-main{grid-template-columns:1fr!important}}
      @media(max-width:760px){.sr-pro-kpis{grid-template-columns:1fr!important}.sr-sim-form{grid-template-columns:1fr!important}.sr-sim-results{grid-template-columns:1fr!important}.sr-room-row{grid-template-columns:1fr!important}.sr-contact-form{grid-template-columns:1fr!important}}
    `}</style>
  </main>;
}

const metricLine = {display:"flex",justifyContent:"space-between",gap:12,padding:"9px 0",borderBottom:"1px solid #f1f5f9",color:"#475569"};
const th = {padding:"9px 7px",borderBottom:"1px solid #e2e8f0",color:"#64748b"};
const td = {padding:"9px 7px",borderBottom:"1px solid #f1f5f9",color:"#0b1220"};
