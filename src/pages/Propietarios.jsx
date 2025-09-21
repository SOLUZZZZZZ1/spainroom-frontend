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
      <div style={{fontWeight:700}}>{value || '—'}</div>
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
      <h3 style={{margin:'0 0 8px'}}>Cómo leer el mapa</h3>
      <Legend />
      <ul style={{margin:'10px 0 0 18px', color:'#0b1220'}}>
        <li><strong>Obligatorio</strong> (rojo): cédula/LPO/2ª ocupación según tu caso.</li>
        <li><strong>Depende</strong> (ámbar): varía por municipio, antigüedad o uso; consulta en tu Ayuntamiento.</li>
        <li><strong>No obligatorio</strong> (verde): no se exige en general; conserva justificantes (altas, IBI, CEE).</li>
      </ul>
      <div className="note" style={{marginTop:10}}>Orientativo; la interpretación final es de tu CCAA/Ayuntamiento.</div>
    </div>
  );

  const PanelDetalle = () => (
    <aside style={{background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16, position:'sticky', top:92}}>
      <h3 style={{margin:'0 0 6px'}}>Detalle</h3>
      <Legend />
      {!sel ? (
        <div className="note" style={{marginTop:8}}>Haz clic en una provincia del mapa para ver el detalle.</div>
      ) : (
        <>
          <div style={{fontSize:18, fontWeight:800, marginTop:8}}>{sel.prov}</div>
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

  return (
    <div className="container" style={{padding:'24px 0', color:'#0b1220'}}>
      <SEO
        title="Propietarios — SpainRoom"
        description="Mapa por provincias y verificador de cédula/licencia para publicar tu habitación con SpainRoom."
      />

      {/* Cabecera + CTA */}
      <header style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:12}}>
        <div>
          <h2 style={{margin:'0 0 6px'}}>Propietarios</h2>
          <p className="note">Comprueba requisitos (cédula/LPO), verifica tu vivienda y sube documentación para el alta.</p>
        </div>
        <a href="/login" className="sr-tab" style={{background:'#0A58CA', color:'#fff'}}>Mi propiedad</a>
      </header>

      {/* Verificador de cédula */}
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
