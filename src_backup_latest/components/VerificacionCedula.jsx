// =====================================
// FILE: src/components/VerificacionCedula.jsx
// =====================================
import React, { useMemo, useState } from 'react'

export default function VerificacionCedula(){
  const [direccion, setDireccion]   = useState('Calle Mayor 1, Madrid')
  const [refCat, setRefCat]         = useState('')            // 20 chars
  const [email, setEmail]           = useState('')            // opcional
  const [ciudad, setCiudad]         = useState('Madrid')
  const [comunidad, setComunidad]   = useState('Comunidad de Madrid')
  const [error, setError]           = useState('')
  const [ok, setOk]                 = useState(null)          // { id, ts }

  const validoRef = useMemo(() => /^[A-Za-z0-9]{20}$/.test(refCat.trim()), [refCat])

  const genId = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth()+1).padStart(2,'0')
    const dd= String(d.getDate()).padStart(2,'0')
    const rnd = Math.random().toString(36).slice(2,8).toUpperCase()
    return `SRV-${y}${m}${dd}-${rnd}`
  }

  const copiar = async (txt)=> {
    try { await navigator.clipboard.writeText(txt) } catch {}
  }

  const guardarLocal = (entry)=>{
    try{
      const k='srv_verificaciones'
      const arr = JSON.parse(localStorage.getItem(k)||'[]')
      arr.unshift(entry)
      localStorage.setItem(k, JSON.stringify(arr.slice(0,50)))
    }catch{}
  }

  const submit = async (e)=>{
    e.preventDefault()
    setError(''); setOk(null)

    if (!validoRef && !direccion.trim()){
      setError('Indica una dirección o una referencia catastral (20 caracteres).')
      return
    }
    if (refCat && !validoRef){
      setError('La referencia catastral debe tener 20 caracteres alfanuméricos.')
      return
    }

    const id = genId()
    const ts = new Date().toISOString()

    // Opcional: enviar a función serverless (si existe)
    try{
      await fetch('/api/verificacion/create', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          id, ts, direccion, refCat, email, ciudad, comunidad
        })
      }).catch(()=>{})
    }catch{}

    guardarLocal({ id, ts, direccion, refCat, email, ciudad, comunidad })
    setOk({ id, ts })
  }

  const mailtoHref = ()=>{
    const subject = encodeURIComponent(`Verificación SpainRoom ${ok?.id||''}`)
    const body = encodeURIComponent(
`ID: ${ok?.id||'(pendiente)'}
Dirección: ${direccion||'-'}
Ref. catastral: ${refCat||'-'}
Email: ${email||'-'}
Ciudad: ${ciudad||'-'}
Comunidad: ${comunidad||'-'}

Observaciones:
-`
    )
    return `mailto:propietarios@spainroom.es?subject=${subject}&body=${body}`
  }

  return (
    <div id="verificacion" style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16}}>
      <h3 style={{margin:'0 0 6px'}}>Comprobar cédula y requisitos</h3>
      <p className="note" style={{margin:'0 0 10px'}}>
        Indica dirección o referencia catastral (20 caracteres). Te devolvemos un <strong>ID de verificación</strong> consultable en cualquier momento.
      </p>

      <form onSubmit={submit} style={{display:'grid',gap:12}}>
        <div>
          <label>Dirección (opcional si indicas referencia catastral)</label>
          <input value={direccion} onChange={e=>setDireccion(e.target.value)}
                 placeholder="Calle Mayor 1, Madrid"
                 style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
        </div>

        <div>
          <label>Referencia catastral (20 chars)</label>
          <input value={refCat} onChange={e=>setRefCat(e.target.value)}
                 placeholder="XXXXXXXXXXXXYYYYYY"
                 maxLength={20}
                 style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          {!refCat ? <div className="note" style={{marginTop:6}}>Si no la tienes, usa solo la dirección.</div>
                   : !validoRef ? <div style={{color:'#b91c1c',marginTop:6}}>Formato no válido (20 alfanuméricos).</div> : null}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          <div>
            <label>Email (opcional)</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                   placeholder="tu@correo.com"
                   style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          </div>
          <div>
            <label>Ciudad (opcional)</label>
            <input value={ciudad} onChange={e=>setCiudad(e.target.value)}
                   placeholder="Madrid"
                   style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          </div>
          <div>
            <label>Comunidad (opcional)</label>
            <input value={comunidad} onChange={e=>setComunidad(e.target.value)}
                   placeholder="Comunidad de Madrid"
                   style={{width:'100%',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}}/>
          </div>
        </div>

        <div style={{display:'flex',gap:10,justifyContent:'flex-end',flexWrap:'wrap'}}>
          <a href="#mapa" style={{display:'inline-block',background:'#fff',color:'#0A58CA',border:'1px solid #0A58CA',padding:'10px 14px',borderRadius:10,fontWeight:800,textDecoration:'none'}}>
            Ver mapa por provincia
          </a>
          <button type="submit"
                  style={{background:'#0A58CA',color:'#fff',border:'none',padding:'10px 14px',borderRadius:10,fontWeight:800}}>
            Comprobar
          </button>
        </div>

        {error && <div style={{color:'#b91c1c'}}>{error}</div>}

        {ok && (
          <div style={{marginTop:12,background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:12,padding:12}}>
            <div style={{fontWeight:800}}>ID de verificación: {ok.id}</div>
            <div className="note">Guardado en este navegador. Usa este ID para consultar tu expediente.</div>
            <div style={{display:'flex',gap:10,marginTop:8,flexWrap:'wrap'}}>
              <button type="button" onClick={()=>copiar(ok.id)}
                      style={{background:'#fff',color:'#0A58CA',border:'1px solid #0A58CA',padding:'8px 12px',borderRadius:10,fontWeight:800}}>
                Copiar ID
              </button>
              <a href={mailtoHref()} style={{display:'inline-block',background:'#0A58CA',color:'#fff',padding:'8px 12px',borderRadius:10,fontWeight:800,textDecoration:'none'}}>
                Enviar por email
              </a>
            </div>
          </div>
        )}
      </form>
      <div className="note" style={{marginTop:10}}>
        *Esta verificación no sustituye una resolución oficial. SpainRoom te guía y gestiona la tramitación.
      </div>
    </div>
  )
}
