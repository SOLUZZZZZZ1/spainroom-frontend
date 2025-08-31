import React from 'react'
import SEO from '../components/SEO.jsx'
import MapaProvincias from '../components/MapaProvincias.jsx'

export default function Propietarios(){
  return (
    <div className="container" style={{padding:'24px 0', color:'#0b1220'}}>
      <SEO title="Propietarios — SpainRoom"
           description="Publica tu habitación con SpainRoom: gestión completa, filtrado de inquilinos y soporte integral."/>
      <h2 style={{margin:'0 0 10px'}}>Propietarios</h2>
      <p className="note">Publica tu habitación con gestión integral de SpainRoom.</p>

      {/* Tarjetas resumen */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16, marginTop:12}}>
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16}}>
          <h3 style={{margin:'0 0 6px'}}>Gestión completa</h3>
          <div style={{color:'#475569'}}>Publicación, filtrado, visitas y seguimiento. Tú decides la última palabra.</div>
        </div>
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16}}>
          <h3 style={{margin:'0 0 6px'}}>Inquilinos validados</h3>
          <div style={{color:'#475569'}}>Verificación de identidad y solvencia. Contrato y firma electrónica.</div>
        </div>
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16}}>
          <h3 style={{margin:'0 0 6px'}}>Soporte SpainRoom</h3>
          <div style={{color:'#475569'}}>Equipo cercano y moderno. Modelo claro y transparente.</div>
        </div>
      </div>

      {/* Mapa de cédulas */}
      <div style={{marginTop:18}}>
        <MapaProvincias />
      </div>

      {/* CTA */}
      <div style={{marginTop:18}}>
        <h3 style={{margin:'0 0 8px'}}>¿Quieres publicar tu habitación?</h3>
        <a href="mailto:propietarios@spainroom.es?subject=Quiero%20publicar%20mi%20habitaci%C3%B3n%20en%20SpainRoom"
           style={{display:'inline-block',background:'#0A58CA',color:'#fff',padding:'12px 16px',borderRadius:12,fontWeight:800,textDecoration:'none'}}>
          Contactar con SpainRoom
        </a>
      </div>
    </div>
  )
}
