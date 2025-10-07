// src/pages/Propietarios.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";
import VerificacionCedula from "../components/VerificacionCedula.jsx";
import MapaProvinciasGeo from "../components/MapaProvinciasGeo.jsx";
import TablaCedulas from "../components/TablaCedulas.jsx";

export default function Propietarios(){
  const [sel, setSel] = useState(null); // selección del mapa

  const Field = ({ label, value }) => (
    <div style={{marginTop:8}}>
      <div style={{fontSize:12, color:'#64748b'}}>{label}</div>
      <div style={{fontWeight:700, color:'#0b1220'}}>{value || '—'}</div>
    </div>
  );

  const LegendItem = ({color,label}) => (
    <span style={{display:'inline-flex',alignItems:'center',gap:6, fontSize:13, color:'#475569'}}>
      <i style={{display:'inline-block',width:14,height:14,background:color,borderRadius:4,border:'1px solid rgba(0,0,0,.12)'}}/>
      {label}
    </span>
  );
  const Legend = () => (
    <div style={{display:'flex', gap:12, flexWrap:'wrap', marginTop:6}}>
      <LegendItem color="#ef4444" label="Obligatorio" />
      <LegendItem color="#f59e0b" label="Depende" />
      <LegendItem color="#16a34a" label="No obligatorio" />
    </div>
  );

  const ExplicacionMapa = () => (
    <div style={{background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16}}>
      <h3 style={{margin:'0 0 8px', color:'#0b1220'}}>Cómo leer el mapa</h3>
      <Legend />
      <ul style={{margin:'10px 0 0 18px', color:'#0b1220'}}>
        <li><strong>Obligatorio</strong> (rojo): cédula/LPO/2ª ocupación según tu caso.</li>
        <li><strong>Depende</strong> (ámbar): varía por municipio, antigüedad o uso; consulta en tu Ayuntamiento.</li>
        <li><strong>No obligatorio</strong> (verde): no se exige en general; conserva justificantes (altas, IBI, CEE).</li>
      </ul>
      <div className="note" style={{marginTop:10, color:'#64748b'}}>Orientativo; la interpretación final es de tu CCAA/Ayuntamiento.</div>
    </div>
  );

  const PanelDetalle = () => (
    <aside style={{background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16, position:'sticky', top:92}}>
      <h3 style={{margin:'0 0 6px', color:'#0b1220'}}>Detalle</h3>
      <Legend />
      {!sel ? (
        <div className="note" style={{marginTop:8, color:'#64748b'}}>Haz clic en una provincia del mapa para ver el detalle.</div>
      ) : (
        <>
          <div style={{fontSize:18, fontWeight:800, marginTop:8, color:'#0b1220'}}>{sel.prov}</div>
          <Field label="¿Obligatorio?" value={sel.cat==='si'?'Sí':sel.cat==='depende'?'Depende':sel.cat==='no'?'No':'s/d'} />
          <Field label="Documento requerido" value={sel.doc} />
          <Field label="Organismo" value={sel.org} />
          <Field label="Vigencia / Renovación" value={sel.vig} />
          <Field label="Notas" value={sel.notas} />
          <div style={{marginTop:10}}>
            {sel.link
              ? <a href={sel.link} target="_blank" rel="noopener noreferrer"
                   style={{display:'inline-block', background:'#0A58CA', color:'#fff', padding:'10px 14px', borderRadius:10, fontWeight:800, textDecoration:'none'}}>Abrir referencia</a>
              : <span style={{color:'#94a3b8'}}>Sin enlace</span>}
          </div>
        </>
      )}
    </aside>
  );

  const Chip = ({children}) => (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:8, padding:'8px 12px',
      borderRadius:999, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.18)',
      color:'#fff', fontWeight:700
    }}>
      <span style={{
        width:18, height:18, borderRadius:999, background:'rgba(255,255,255,.18)',
        display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:12
      }}>✓</span>
      {children}
    </span>
  );

  return (
    <div className="container" style={{padding:'24px 0', color:'#0b1220'}}>
      <SEO
        title="Propietarios — SpainRoom"
        description="Mapa por provincias y verificador de cédula/licencia para publicar tu habitación con SpainRoom."
      />

      {/* BANDA SUPERIOR con beneficios (no toca verificador ni mapa) */}
      <section
        style={{
          background:'#0b1220',
          color:'#fff',
          borderRadius:16,
          padding:'18px 16px',
          border:'1px solid rgba(255,255,255,.12)',
          marginBottom:12
        }}
      >
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap'}}>
          <div style={{minWidth:260, flex:'1 1 520px'}}>
            <h2 style={{margin:'0 0 6px', color:'#fff'}}>Propietarios</h2>
            <p style={{margin:'0 0 10px', color:'rgba(255,255,255,.85)'}}>
              Publica tu habitación con respaldo legal: comprobamos requisitos por <strong>dirección</strong> o <strong>referencia catastral</strong>, optimizamos fotos y centralizamos las reservas.
            </p>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              <Chip>Verificación legal por dirección/ref. catastral</Chip>
              <Chip>Fotos autoajustadas + ficha clara</Chip>
              <Chip>Leads y reservas en un panel</Chip>
              <Chip>Te ayudamos con los trámites de la cédula de habitabilidad</Chip>
            </div>
          </div>

          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <a href="/login"
               className="sr-tab"
               style={{
                 background:'#0A58CA', color:'#fff',
                 padding:'10px 14px', borderRadius:10, fontWeight:800,
                 textDecoration:'none', border:'1px solid rgba(255,255,255,.25)'
               }}>
              Mi propiedad
            </a>
          </div>
        </div>
      </section>

      {/* Verificador */}
      <section style={{marginBottom:16}}>
        <VerificacionCedula />
      </section>

      {/* Mapa + Panel y explicación */}
      <section id="mapa" style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, alignItems:'start', marginBottom:16}}>
        <div>
          <MapaProvinciasGeo onSelect={setSel} />
          <div style={{marginTop:16}}><ExplicacionMapa /></div>
        </div>
        <PanelDetalle />
      </section>

      {/* Tabla de referencia por provincia */}
      <section>
        <TablaCedulas />
      </section>
    </div>
  );
}
