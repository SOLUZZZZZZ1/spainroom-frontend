import React, { useState } from 'react'
import SEO from '../components/SEO.jsx'

function Card({title, children}){
  return (
    <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16}}>
      <h3 style={{margin:'0 0 6px'}}>{title}</h3>
      <div style={{color:'#475569'}}>{children}</div>
    </div>
  )
}

export default function Oportunidades(){
  const [empresa,setEmpresa]=useState(''),[contacto,setContacto]=useState('')
  const [email,setEmail]=useState(''),[mensaje,setMensaje]=useState('')

  const enviar=(e)=>{
    e.preventDefault()
    const subject=encodeURIComponent('Oportunidades — Propuesta de colaboración')
    const body=encodeURIComponent(`Empresa: ${empresa}\nContacto: ${contacto}\nEmail: ${email}\n\nMensaje:\n${mensaje}`)
    window.location.href=`mailto:oportunidades@spainroom.es?subject=${subject}&body=${body}`
  }

  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="Oportunidades — SpainRoom" description="Ofertas para inmobiliarias, promociones e inversión en SpainRoom."/>
      <h2 style={{margin:'0 0 10px'}}>Oportunidades</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        <Card title="Para inmobiliarias">• Integración como colaborador SpainRoom.<br/>• Captación y gestión de habitaciones.<br/>• Soporte central y material.</Card>
        <Card title="Habitaciones en promoción">• Publicaciones destacadas.<br/>• Validación de calidad SpainRoom.<br/>• Métricas de conversión.</Card>
        <Card title="Opciones de inversión">• Participación zonal.<br/>• Pipeline de habitaciones.<br/>• Modelo económico transparente.</Card>
      </div>
      <div style={{marginTop:18}}>
        <h3 style={{margin:'0 0 8px'}}>¿Te interesa? Escríbenos</h3>
        <form onSubmit={enviar} className="form" style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16,maxWidth:720}}>
          <label>Empresa</label>
          <input required value={empresa} onChange={e=>setEmpresa(e.target.value)}
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          <label style={{marginTop:8}}>Persona de contacto</label>
          <input required value={contacto} onChange={e=>setContacto(e.target.value)}
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          <label style={{marginTop:8}}>Email</label>
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)}
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          <label style={{marginTop:8}}>Mensaje</label>
          <textarea rows="4" value={mensaje} onChange={e=>setMensaje(e.target.value)}
            style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          <button type="submit" style={{marginTop:10,background:'#0A58CA',color:'#fff',border:'none',padding:'10px 14px',borderRadius:10,fontWeight:800}}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
