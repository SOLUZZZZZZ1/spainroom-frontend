import React, { useEffect, useState } from 'react'
import SEO from '../components/SEO.jsx'

export default function PagosEmbed(){
  const url = import.meta.env.VITE_URL_PAGOS || ''
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFallback(true), 4000)
    return () => clearTimeout(t)
  }, [])

  if (!url) {
    return <div className="container" style={{padding:'24px 0'}}>
      Falta configurar <code>VITE_URL_PAGOS</code>.
    </div>
  }

  return (
    <>
      <SEO title="Pagos — SpainRoom" description="Sistema de pagos de SpainRoom."/>
      <div style={{height:'calc(100vh - 92px)'}}>
        {!fallback ? (
          <iframe src={url} title="SpainRoom Pagos"
                  style={{width:'100%',height:'100%',border:0}} />
        ) : (
          <div className="container" style={{padding:'24px'}}>
            <p>No se pudo mostrar embebido. Ábrelo en una pestaña nueva:</p>
            <a href={url} target="_blank" rel="noopener noreferrer"
               style={{display:'inline-block',background:'#0A58CA',color:'#fff',padding:'10px 14px',borderRadius:10,fontWeight:800}}>
              Abrir Pagos
            </a>
          </div>
        )}
      </div>
    </>
  )
}
