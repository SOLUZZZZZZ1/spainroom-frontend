import React, { useState } from 'react'
import SEO from '../components/SEO.jsx'

export default function Reservas(){
  const [nombre,setNombre]=useState(''),[email,setEmail]=useState('')
  const [telefono,setTelefono]=useState(''),[fecha,setFecha]=useState('')
  const [habitacion,setHabitacion]=useState(''),[mensaje,setMensaje]=useState('')
  const [ok,setOk]=useState(false)

  const onSubmit = async (e)=>{
    e.preventDefault(); setOk(false)
    try{
      const r = await fetch('/api/reservas',{method:'POST',headers:{'Content-Type':'application/json'},
        body: JSON.stringify({nombre,email,telefono,fecha,habitacion,mensaje})})
      if(!r.ok) throw new Error('HTTP '+r.status)
      setOk(true)
    }catch{
      const subject=encodeURIComponent('Solicitud de reserva/visita — SpainRoom')
      const body=encodeURIComponent(
        `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nFecha: ${fecha}\nHabitación: ${habitacion}\n\nMensaje:\n${mensaje}`
      )
      window.location.href=`mailto:reservas@spainroom.es?subject=${subject}&body=${body}`
    }
  }

  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="Reservas — SpainRoom" description="Confirma disponibilidad, agenda una visita o deja tus datos para que te llamemos."/>
      <h2 style={{margin:'0 0 8px'}}>Reservas y visitas</h2>
      <form onSubmit={onSubmit} className="form" style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16,maxWidth:720}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div><label>Nombre*</label><input required value={nombre} onChange={e=>setNombre(e.target.value)}
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/></div>
          <div><label>Email*</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/></div>
          <div><label>Teléfono</label><input value={telefono} onChange={e=>setTelefono(e.target.value)}
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/></div>
          <div><label>Fecha preferente</label><input type="date" value={fecha} onChange={e=>setFecha(e.target.value)}
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/></div>
        </div>
        <div style={{marginTop:12}}>
          <label>Habitación (ID o enlace)</label>
          <input value={habitacion} onChange={e=>setHabitacion(e.target.value)} placeholder="Ej: /habitacion/123"
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
        </div>
        <div style={{marginTop:12}}>
          <label>Mensaje</label>
          <textarea rows="4" value={mensaje} onChange={e=>setMensaje(e.target.value)}
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
        </div>
        <button type="submit" style={{marginTop:12,background:'#0A58CA',color:'#fff',border:'none',padding:'10px 14px',borderRadius:10,fontWeight:800}}>
          Enviar solicitud
        </button>
        {ok && <div style={{marginTop:8,color:'#065f46'}}>¡Enviado! Te contactaremos pronto.</div>}
      </form>
    </div>
  )
}
