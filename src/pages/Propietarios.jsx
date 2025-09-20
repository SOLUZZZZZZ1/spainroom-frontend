// src/pages/Propietarios.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";
import VerificacionCedula from "../components/VerificacionCedula.jsx";
import MapaProvinciasGeo from "../components/MapaProvinciasGeo.jsx";
import TablaCedulas from "../components/TablaCedulas.jsx";

export default function Propietarios(){
  const [sel, setSel] = useState(null);

  return (
    <div className="container" style={{padding:"24px 0", color:"#0b1220"}}>
      <SEO title="Propietarios — SpainRoom" description="Mapa por provincias y verificación de cédula/LPO para publicar con SpainRoom."/>
      <header style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:12}}>
        <div>
          <h2 style={{margin:"0 0 6px"}}>Propietarios</h2>
          <p className="note">Verifica cédula/LPO según tu zona y tramita con SpainRoom (presupuesto cerrado).</p>
        </div>
        <a href="/login" className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>Mi propiedad</a>
      </header>

      <VerificacionCedula />

      <div id="mapa" style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, alignItems:"start", marginTop:16}}>
        <div>
          <MapaProvinciasGeo onSelect={setSel} />
        </div>
        <aside style={{background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16, position:"sticky", top:92}}>
          <h3 style={{margin:"0 0 6px"}}>Detalle</h3>
          {!sel ? <div className="note" style={{marginTop:8}}>Haz clic en una provincia del mapa.</div> :
            <div style={{marginTop:8}}>
              <div style={{fontSize:18, fontWeight:800}}>{sel.prov}</div>
              <div style={{marginTop:6}}><b>¿Obligatorio?</b> {sel.cat==='si'?'Sí':sel.cat==='depende'?'Depende':sel.cat==='no'?'No':'s/d'}</div>
              <div><b>Documento:</b> {sel.doc || '—'}</div>
              <div><b>Organismo:</b> {sel.org || '—'}</div>
              <div><b>Vigencia:</b> {sel.vig || '—'}</div>
              <div><b>Notas:</b> {sel.notas || '—'}</div>
              <div style={{marginTop:10}}>
                {sel.link ? <a href={sel.link} target="_blank" rel="noopener noreferrer" className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>Abrir referencia</a>
                          : <span className="note">Sin enlace</span>}
              </div>
            </div>}
        </aside>
      </div>

      <div style={{marginTop:18}}>
        <TablaCedulas />
      </div>
    </div>
  );
}
