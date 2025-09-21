import React, { useEffect, useState } from 'react'
import SEO from '../components/SEO.jsx'

/**
 * Empleo para Inquilinos
 * - Fuentes “Particulares”: abre búsqueda directa (Google) en Milanuncios con la query y la ciudad → va al anuncio original
 * - Fuentes “Portales”: abre InfoJobs / Indeed / LinkedIn con la query y ciudad → listado del portal (también original)
 * - Todo se abre en nueva pestaña (target _blank) para que no “encierre” al usuario
 */

export default function Jobs(){
  const [query, setQuery] = useState('')
  const [city, setCity]   = useState('')
  const [radius, setRadius] = useState(20)

  // Geolocalización opcional (solo para mostrar coordenadas o city hint)
  const [pos, setPos] = useState(null)
  useEffect(()=>{
    if(!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (p)=> setPos({lat:p.coords.latitude, lng:p.coords.longitude}),
      ()=>{}, { enableHighAccuracy:true, timeout:6000 }
    )
  },[])

  const enc = (s)=> encodeURIComponent(s || '')
  const quoted = (s)=> s ? `%22${enc(s)}%22` : ''

  // --------- constructores de URL (siempre _blank) ----------
  const urlMilanuncios = () =>
    `https://www.google.com/search?q=site:milanuncios.com+${enc(query)}+${quoted(city)}+empleo+oferta`

  const urlInfoJobs = () =>
    // si la estructura del portal cambia, el fallback Google asegura resultados
    `https://www.google.com/search?q=site:infojobs.net+${enc(query)}+${quoted(city)}`

  const urlIndeed = () =>
    `https://es.indeed.com/jobs?q=${enc(query)}&l=${enc(city)}`

  const urlLinkedIn = () =>
    `https://www.linkedin.com/jobs/search/?keywords=${enc(query)}&location=${enc(city)}`

  const urlWallapop = () =>
    `https://www.google.com/search?q=site:wallapop.com+${enc(query)}+${quoted(city)}+empleo`

  const open = (href)=>{
    try { window.open(href, '_blank', 'noopener') } catch { location.href = href }
  }

  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="Inquilinos — Empleo cerca de ti" description="Busca trabajo en portales y anuncios de particulares; abrimos siempre el anuncio original en una pestaña nueva."/>
      <h2 style={{margin:'0 0 6px'}}>Empleo para inquilinos</h2>
      <p className="note">Las búsquedas se abren en una pestaña nueva y te llevan al <strong>anuncio original</strong>.</p>

      {/* BÚSQUEDA */}
      <section style={{marginTop:12, background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16}}>
        <form onSubmit={(e)=>{e.preventDefault(); open(urlMilanuncios())}} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap:10}}>
          <input
            value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Ej: recepcionista, dependiente, camarero…"
            aria-label="Puesto a buscar"
            required
            style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:10}}
          />
          <input
            value={city} onChange={e=>setCity(e.target.value)}
            placeholder="Ciudad (opcional)"
            aria-label="Ciudad"
            style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:10}}
          />
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <label style={{fontSize:13, color:'#475569'}}>Radio (km)</label>
            <input
              type="number" min="1" max="50"
              value={radius} onChange={e=>setRadius(parseInt(e.target.value||'20'))}
              style={{width:80, padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:10}}
            />
          </div>
          <button type="submit" style={{background:'#0A58CA', color:'#fff', border:'none', padding:'10px 16px', borderRadius:10, fontWeight:800}}>
            Buscar
          </button>
        </form>

        {/* PISTA GEO */}
        <div className="note" style={{marginTop:8}}>
          {pos ? <>Tu posición aproximada: {pos.lat.toFixed(3)},{pos.lng.toFixed(3)} · puedes ajustar “Ciudad”.</> : 'Si autorizas la ubicación, afinamos los resultados.'}
        </div>
      </section>

      {/* FUENTES: PARTICULARES / PORTALES */}
      <section style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        {/* PARTICULARES */}
        <div style={{background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16}}>
          <h3 style={{margin:'0 0 8px'}}>Particulares</h3>
          <p className="note" style={{margin:'0 0 10px'}}>Abrimos búsqueda directa en su web para ver <strong>anuncios de particulares</strong>.</p>
          <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <button onClick={()=>open(urlMilanuncios())}
                    style={{background:'#0A58CA', color:'#fff', border:'none', padding:'10px 14px', borderRadius:10, fontWeight:800}}>
              Milanuncios
            </button>
            <button onClick={()=>open(urlWallapop())}
                    style={{background:'#0A58CA', color:'#fff', border:'none', padding:'10px 14px', borderRadius:10, fontWeight:800}}>
              Wallapop (búsqueda)
            </button>
          </div>
        </div>

        {/* PORTALES */}
        <div style={{background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16}}>
          <h3 style={{margin:'0 0 8px'}}>Portales</h3>
          <p className="note" style={{margin:'0 0 10px'}}>Listados en cada portal con tu búsqueda.</p>
          <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <button onClick={()=>open(urlInfoJobs())}
                    style={{background:'#fff', color:'#0A58CA', border:'1px solid #0A58CA', padding:'10px 14px', borderRadius:10, fontWeight:800}}>
              InfoJobs
            </button>
            <button onClick={()=>open(urlIndeed())}
                    style={{background:'#fff', color:'#0A58CA', border:'1px solid #0A58CA', padding:'10px 14px', borderRadius:10, fontWeight:800}}>
              Indeed
            </button>
            <button onClick={()=>open(urlLinkedIn())}
                    style={{background:'#fff', color:'#0A58CA', border:'1px solid #0A58CA', padding:'10px 14px', borderRadius:10, fontWeight:800}}>
              LinkedIn
            </button>
          </div>
        </div>
      </section>

      {/* NOTA FINAL */}
      <div className="note" style={{marginTop:12}}>
        Tip: combina “{query || 'recepcionista'}” + “{city || 'Madrid'}” con palabras como “jornada parcial”, “fines de semana”, “sin experiencia” para afinar aún más.
      </div>
    </div>
  )
}
