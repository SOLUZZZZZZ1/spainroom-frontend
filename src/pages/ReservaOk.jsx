import React from 'react'
import SEO from '../components/SEO.jsx'

export default function ReservaOk(){
  const params = new URLSearchParams(location.search)
  const sid = params.get('session_id') || ''
  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="Reserva confirmada — SpainRoom" description="Depósito recibido correctamente."/>
      <h2>¡Depósito confirmado! 🎉</h2>
      <p className="note">Hemos recibido tu pago. En breve nos pondremos en contacto para confirmar la reserva.</p>
      {sid && <p className="note">ID de sesión de pago: <code>{sid}</code></p>}
      <a href="/" style={{display:'inline-block',marginTop:12,background:'#0A58CA',color:'#fff',padding:'10px 14px',borderRadius:10,fontWeight:800,textDecoration:'none'}}>Volver al inicio</a>
    </div>
  )
}
