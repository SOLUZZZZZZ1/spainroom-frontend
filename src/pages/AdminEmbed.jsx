// src/pages/AdminEmbed.jsx
import React from 'react'
import SEO from '../components/SEO.jsx'

export default function AdminEmbed(){
  const url = import.meta.env.VITE_URL_ADMIN || ''

  const openNew = (e)=>{
    if (!url) return
    try{ e?.preventDefault(); window.open(url, '_blank', 'noopener') }catch{ location.href = url }
  }

  return (
    <>
      <SEO title="Admin — SpainRoom" description="Panel de administración de SpainRoom."/>
      <div className="container" style={{padding:'16px 0'}}>
        <h2 style={{margin:'0 0 8px'}}>Admin</h2>

        {!url ? (
          <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:16}}>
            Configura <code>VITE_URL_ADMIN</code> para embebido.  
            <div style={{marginTop:10}}>
              <button onClick={openNew} disabled style={{opacity:.5, cursor:'not-allowed',
                background:'#0A58CA',color:'#fff',border:'none',padding:'10px 14px',borderRadius:10,fontWeight:800}}>
                Abrir Admin
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{margin:'0 0 10px'}}>
              <button onClick={openNew}
                style={{background:'#0A58CA',color:'#fff',border:'none',padding:'10px 14px',borderRadius:10,fontWeight:800}}>
                Abrir en pestaña nueva
              </button>
              <span className="note" style={{marginLeft:12}}>
                Si no carga embebido puede ser por X-Frame-Options/Content-Security-Policy. Usa el botón.
              </span>
            </div>
            <div style={{height:'calc(100vh - 128px)'}}>
              <iframe src={url} title="SpainRoom Admin" style={{width:'100%',height:'100%',border:0}} />
            </div>
          </>
        )}
      </div>
    </>
  )
}
