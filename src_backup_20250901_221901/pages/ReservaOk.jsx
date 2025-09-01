// ==============================
// FILE: src/pages/ReservaOk.jsx
// ==============================
import React from 'react'
import SEO from '../components/SEO.jsx'

export default function ReservaOk(){
  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="Reserva confirmada — SpainRoom" description="Depósito recibido correctamente."/>
      <h2>¡Depósito confirmado! 🎉</h2>
      <p className="note">Hemos recibido tu pago. En breve nos pondremos en contacto para confirmar la reserva y siguientes pasos.</p>
      <a href="/"
         style={{display:'inline-block', marginTop:12, background:'#0A58CA', color:'#fff', padding:'10px 14px', borderRadius:10, fontWeight:800, textDecoration:'none'}}>
        Volver al inicio
      </a>
    </div>
  )
}
