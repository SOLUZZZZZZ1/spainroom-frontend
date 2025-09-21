import React from 'react'
import SEO from '../components/SEO.jsx'

export default function ReservaError(){
  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="Pago cancelado — SpainRoom" description="El pago fue cancelado o no se completó."/>
      <h2>Pago cancelado</h2>
      <p className="note">No se completó el pago. Puedes intentarlo de nuevo o contactarnos.</p>
      <div style={{display:'flex',gap:10,marginTop:12,flexWrap:'wrap'}}>
        <a href="/reservas" style={{display:'inline-block',background:'#0A58CA',color:'#fff',padding:'10px 14px',borderRadius:10,fontWeight:800,textDecoration:'none'}}>Volver a Reservas</a>
        <a href="tel:+34616232306" style={{display:'inline-block',background:'#16a34a',color:'#fff',padding:'10px 14px',borderRadius:10,fontWeight:800,textDecoration:'none'}}>Llamar soporte</a>
      </div>
    </div>
  )
}
