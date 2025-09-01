import React from 'react'
import SEO from '../components/SEO.jsx'
import MapaProvinciasSvg from '../components/MapaProvinciasSvg.jsx'
import TablaCedulas from '../components/TablaCedulas.jsx'

export default function Propietarios(){
  const PHONE = (import.meta.env.VITE_SUPPORT_PHONE || '+34616232306').replace(/\s+/g,'')
  const WA    = 'https://wa.me/' + PHONE.replace(/^\+/, '')

  return (
    <div className="container" style={{padding:'24px 0', color:'#0b1220'}}>
      <SEO title="Propietarios — SpainRoom"
           description="Mapa por provincias y requisitos (cédula/LPO) para publicar tu habitación con SpainRoom." />

      <h2 style={{margin:'0 0 10px'}}>Propietarios</h2>
      <p className="note">Consulta los requisitos por provincia y publica tu habitación con la ayuda de SpainRoom.</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16, marginTop:12}}>
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16}}>
          <h3 style={{margin:'0 0 6px'}}>Gestión completa</h3>
          <div style={{color:'#475569'}}>Publicación, filtrado, visitas y seguimiento.</div>
        </div>
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16}}>
          <h3 style={{margin:'0 0 6px'}}>Inquilinos validados</h3>
          <div style={{color:'#475569'}}>Identidad y solvencia. Contrato y firma electrónica.</div>
        </div>
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16}}>
          <h3 style={{margin:'0 0 6px'}}>Soporte SpainRoom</h3>
          <div style={{color:'#475569'}}>Equipo cercano y moderno. Modelo transparente.</div>
        </div>
      </div>

      <div style={{marginTop:18}}>
        <MapaProvinciasSvg />
      </div>

      <TablaCedulas />

      <div style={{marginTop:24, display:'flex', gap:12, flexWrap:'wrap'}}>
        <a href="mailto:propietarios@spainroom.es?subject=Quiero%20publicar%20mi%20habitaci%C3%B3n%20en%20SpainRoom"
           style={{display:'inline-block',background:'#0A58CA',color:'#fff',padding:'12px 16px',borderRadius:12,fontWeight:800,textDecoration:'none'}}>
          Contactar por Email
        </a>
        <a href={`tel:${PHONE}`}
           style={{display:'inline-block',background:'#16a34a',color:'#fff',padding:'12px 16px',borderRadius:12,fontWeight:800,textDecoration:'none'}}>
          Llamar {PHONE}
        </a>
        <a href={WA} target="_blank" rel="noopener noreferrer"
           style={{display:'inline-block',background:'#25D366',color:'#fff',padding:'12px 16px',borderRadius:12,fontWeight:800,textDecoration:'none'}}>
          WhatsApp
        </a>
      </div>
    </div>
  )
}
