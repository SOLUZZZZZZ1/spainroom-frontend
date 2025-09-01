import React from 'react'
import SEO from '../components/SEO.jsx'

export default function FranquiciadosEmbed(){
  const url = import.meta.env.VITE_URL_FRANQUICIADOS || ''
  if(!url) return <div className="container" style={{padding:'24px 0'}}>Configura VITE_URL_FRANQUICIADOS.</div>
  return (
    <>
      <SEO title="Franquiciados — SpainRoom" description="Área de franquiciados de SpainRoom."/>
      <div style={{height:'calc(100vh - 92px)'}}>
        <iframe src={url} title="SpainRoom Franquiciados" style={{width:'100%',height:'100%',border:0}} />
      </div>
    </>
  )
}
