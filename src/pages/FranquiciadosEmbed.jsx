// src/pages/FranquiciadosEmbed.jsx
import React from 'react'
import SEO from '../components/SEO.jsx'

export default function FranquiciadosEmbed(){
  // URL del micro (configurable por ENV)
  const url = import.meta.env.VITE_URL_FRANQUICIADOS || 'https://frontend-franquiciados.vercel.app'

  return (
    <>
      <SEO title="Franquiciados — SpainRoom" description="Área de franquiciados de SpainRoom."/>
      <div className="container" style={{padding:'16px 0'}}>
        <div style={{
          background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:12,
          marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10
        }}>
          <div>
            <h3 style={{margin:'0 0 4px'}}>Franquiciados</h3>
            <div className="note">Accede a tu área de franquiciado. Si no se muestra embebida, ábrela en una pestaña nueva.</div>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer"
             style={{display:'inline-block',background:'#0A58CA',color:'#fff',padding:'10px 14px',borderRadius:10,fontWeight:800,textDecoration:'none'}}>
            Abrir en nueva pestaña
          </a>
        </div>
      </div>

      {/* embed */}
      <div style={{height:'calc(100vh - 128px)'}}>
        <iframe src={url} title="SpainRoom Franquiciados" style={{width:'100%',height:'100%',border:0}} />
      </div>
    </>
  )
}
