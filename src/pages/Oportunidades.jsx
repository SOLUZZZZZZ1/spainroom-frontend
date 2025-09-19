import React from 'react'
import SEO from '../components/SEO.jsx'

function Card({ title, children }){
  return (
    <div style={{
      background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16,
      display:'flex', flexDirection:'column', gap:8, height:'100%'
    }}>
      <h3 style={{margin:0}}>{title}</h3>
      <div style={{color:'#475569'}}>{children}</div>
    </div>
  )
}

export default function Oportunidades(){
  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="Oportunidades — SpainRoom" description="Colaboraciones, promociones destacadas e inversión en SpainRoom."/>
      <h2 style={{margin:'0 0 10px', textAlign:'center'}}>Oportunidades</h2>
      <p className="note" style={{textAlign:'center', margin:'0 0 16px'}}>
        Colabora con SpainRoom: inmobiliarias, promociones e inversión por zonas.
      </p>

      {/* GRID 3 columnas (responsive a 1 columna en móvil) */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(3, 1fr)',
        gap:16
      }}>
        <Card title="Inmobiliarias">
          <ul style={{margin:'0 0 0 18px'}}>
            <li>Integración como colaborador SpainRoom.</li>
            <li>Captación y gestión de habitaciones.</li>
            <li>Soporte central, material comercial y trazabilidad.</li>
          </ul>
        </Card>

        <Card title="Promociones destacadas">
          <ul style={{margin:'0 0 0 18px'}}>
            <li>Publicaciones premium en zonas objetivo.</li>
            <li>Validación de calidad SpainRoom.</li>
            <li>Métricas de conversión y seguimiento.</li>
          </ul>
        </Card>

        <Card title="Inversión por zonas">
          <ul style={{margin:'0 0 0 18px'}}>
            <li>Participación por territorio.</li>
            <li>Pipeline de habitaciones.</li>
            <li>Modelo económico claro y reportes.</li>
          </ul>
        </Card>
      </div>

      {/* CTA centrada */}
      <div style={{marginTop:18, textAlign:'center'}}>
        <a
          href="mailto:oportunidades@spainroom.es?subject=Oportunidades%20de%20colaboraci%C3%B3n"
          style={{display:'inline-block',background:'#0A58CA',color:'#fff',padding:'12px 16px',borderRadius:12,fontWeight:800,textDecoration:'none'}}
        >
          Escribir a SpainRoom
        </a>
      </div>

      {/* Responsive helper */}
      <style>{`
        @media (max-width: 900px){
          .container > div[style*="grid"]{
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
