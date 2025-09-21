// src/pages/PagosEmbed.jsx
import React, { useEffect, useState } from 'react'
import SEO from '../components/SEO.jsx'

export default function PagosEmbed(){
  const url = import.meta.env.VITE_URL_PAGOS || ''
  const [fallback, setFallback] = useState(false)

  // si el iframe no carga en unos segundos (CSP/X-Frame-Options), mostramos botón
  useEffect(()=>{
    const t = setTimeout(()=> setFallback(true), 3500)
    return ()=> clearTimeout(t)
  },[])

  if (!url) {
    return (
      <div className="container" style={{padding:'24px 0'}}>
        <SEO title="Pagos — SpainRoom" description="Sistema de pagos de SpainRoom."/>
        <h2 style={{margin:'0 0 8px'}}>Pagos</h2>
        <p className="note">Falta configurar <code>VITE_URL_PAGOS</code> en Vercel.</p>
      </div>
    )
  }

  return (
    <>
      <SEO title="Pagos — SpainRoom" description="Sistema de pagos de SpainRoom."/>
      <div style={{height:'calc(100vh - 128px)'}}>
        {!fallback ? (
          <iframe src={url} title="SpainRoom Pagos" style={{width:'100%',height:'100%',border:0}} />
        ) : (
          <div className="container" style={{padding:'24px 0'}}>
            <h2 style={{margin:'0 0 8px'}}>Pagos</h2>
            <p className="note">No se pudo mostrar embebido (política de seguridad del sitio). Ábrelo en una pestaña nueva:</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{display:'inline-block',background:'#0A58CA',color:'#fff',padding:'10px 14px',borderRadius:10,fontWeight:800,textDecoration:'none'}}
            >
              Abrir Pagos
            </a>
          </div>
        )}
      </div>
    </>
  )
}
