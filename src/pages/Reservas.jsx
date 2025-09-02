import React, { useState } from 'react'
import SEO from '../components/SEO.jsx'

export default function Reservas(){
  const DEFAULT_DEPOSIT = Number(import.meta.env.VITE_DEFAULT_DEPOSIT_EUR || '50') // €
  const [nombre, setNombre]       = useState('')
  const [email, setEmail]         = useState('')
  const [telefono, setTelefono]   = useState('')
  const [fecha, setFecha]         = useState('')
  const [habitacion, setHabitacion]=useState('')
  const [mensaje, setMensaje]     = useState('')
  const [deposito, setDeposito]   = useState(DEFAULT_DEPOSIT)
  const [loading, setLoading]     = useState(false)
  const [err, setErr]             = useState('')
  const [ok, setOk]               = useState(false)

  const pagarDeposito = async (e)=>{
  e.preventDefault()
  setErr(''); setOk(false)

  if (!email || !nombre) { setErr('Introduce al menos tu nombre y email.'); return }
  if (!deposito || Number(deposito) <= 0) { setErr('Depósito inválido.'); return }

  setLoading(true)
  const readJSON = async (resp)=>{
    // lee como texto y trata de parsear JSON; si falla, devuelve el texto crudo
    const txt = await resp.text()
    try { return JSON.parse(txt) } catch { return { _raw: txt } }
  }

  try {
    const body = {
      amount: Number(deposito),
      currency: 'eur',
      customer_email: email,
      success_path: '/reservas/ok',
      cancel_path:  '/reservas/error',
      metadata: { nombre, email, telefono, fecha, habitacion, mensaje }
    }
    const resp = await fetch('/api/payments/create-checkout-session', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    })

    const data = await readJSON(resp)
    if (!resp.ok || !data?.url) {
      // muestra motivo si lo hay; evita reventar el JSON.parse
      throw new Error(data?.error || 'No se pudo iniciar el pago (endpoint no disponible).')
    }
    // Redirige a Stripe Checkout
    window.location.href = data.url

  } catch (e) {
    setErr(String(e.message || e))
  } finally {
    setLoading(false)
  }
}

    }
    if (!deposito || Number(deposito) <= 0) {
      setErr('Depósito inválido.')
      return
    }

    setLoading(true)
    try {
      const body = {
        amount: Number(deposito),
        currency: 'eur',
        customer_email: email,
        success_path: '/reservas/ok',
        cancel_path:  '/reservas/error',
        metadata: {
          nombre, email, telefono, fecha, habitacion, mensaje
        }
      }
      const r = await fetch('/api/payments/create-checkout-session', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body)
      })
      const data = await r.json()
      if (!r.ok || !data?.url) throw new Error(data?.error || 'No se pudo iniciar el pago.')
      // Redirigir a Stripe
      location.href = data.url
    } catch (e) {
      setErr(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  // Respaldo por email (si alguien no quiere pagar aún)
  const enviarSolicitud = (e)=>{
    e.preventDefault()
    const subject=encodeURIComponent('Solicitud de reserva/visita — SpainRoom')
    const body=encodeURIComponent(
`Nombre: ${nombre}
Email: ${email}
Teléfono: ${telefono}
Fecha: ${fecha}
Habitación: ${habitacion}

Mensaje:
${mensaje}`)
    location.href=`mailto:reservas@spainroom.es?subject=${subject}&body=${body}`
    setOk(true)
  }

  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="Reservas — SpainRoom" description="Afianza tu reserva con un depósito seguro (Stripe Checkout)."/>
      <h2 style={{margin:'0 0 8px'}}>Reservas y visitas</h2>
      <p className="note">Confirma disponibilidad, agenda una visita y afianza tu reserva con un depósito.</p>

      <form className="form" style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16,maxWidth:820}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div>
            <label>Nombre*</label>
            <input required value={nombre} onChange={e=>setNombre(e.target.value)}
                   style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          </div>
          <div>
            <label>Email*</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                   style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          </div>
          <div>
            <label>Teléfono</label>
            <input value={telefono} onChange={e=>setTelefono(e.target.value)}
                   style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          </div>
          <div>
            <label>Fecha preferente</label>
            <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)}
                   style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          </div>
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

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
          <div>
            <label>Depósito (EUR)</label>
            <input type="number" min="1" step="1" value={deposito}
                   onChange={e=>setDeposito(e.target.value)}
                   style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
            <div className="note" style={{marginTop:6}}>Pago seguro con Stripe Checkout.</div>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'end',justifyContent:'flex-end',flexWrap:'wrap'}}>
            <button onClick={pagarDeposito} disabled={loading}
                    style={{background:'#0A58CA',color:'#fff',border:'none',padding:'12px 16px',borderRadius:12,fontWeight:800,minWidth:220}}>
              {loading ? 'Iniciando pago…' : 'Pagar depósito'}
            </button>
            <button onClick={enviarSolicitud} type="button"
                    style={{background:'#fff',color:'#0A58CA',border:'1px solid #0A58CA',padding:'12px 16px',borderRadius:12,fontWeight:800}}>
              Enviar por email
            </button>
          </div>
        </div>

        {err && <div style={{marginTop:10,color:'#b91c1c'}}>{err}</div>}
        {ok  && <div style={{marginTop:10,color:'#065f46'}}>¡Solicitud enviada por email! Te contactaremos muy pronto.</div>}
      </form>
    </div>
  )
}
