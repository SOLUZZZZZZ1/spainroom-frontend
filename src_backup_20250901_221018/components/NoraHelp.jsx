import React from 'react'

export default function NoraHelp({ title = '¿Necesitas ayuda?', bullets = [] }) {
  const RAW_PHONE = (import.meta.env.VITE_SUPPORT_PHONE || '+34616232306').replace(/\s+/g,'')
  const PHONE_DISPLAY = '+34 616 23 23 06'
  const WA = 'https://wa.me/' + RAW_PHONE.replace(/^\+/, '')

  const openNora = () => { try { window.dispatchEvent(new Event('open-nora')) } catch {} }
  const openWA = (e) => {
    try { e.preventDefault(); window.open(WA, '_blank', 'noopener') }
    catch { location.href = WA }
  }

  return (
    <div style={{
      background:'#fff',
      border:'1px solid #e2e8f0',
      borderRadius:16,
      padding:16,
      display:'grid',
      gridTemplateColumns:'1fr 1fr',
      gap:12,
      alignItems:'center'
    }}>
      <div>
        <h3 style={{margin:'0 0 6px'}}>{title}</h3>
        {bullets.length>0 && (
          <ul style={{margin:'6px 0 0 18px', color:'#475569'}}>
            {bullets.map((b,i)=><li key={i}>{b}</li>)}
          </ul>
        )}
      </div>
      <div style={{display:'flex', gap:10, justifyContent:'flex-end', flexWrap:'wrap'}}>
        <button
          onClick={openNora}
          type="button"
          style={{background:'#0A58CA',color:'#fff',border:'none',padding:'10px 14px',borderRadius:10,fontWeight:800}}
        >
          Hablar con Nora
        </button>
        {/* WhatsApp: abre nueva pestaña siempre */}
        <a
          href={WA}
          onClick={openWA}
          rel="noopener noreferrer"
          style={{display:'inline-block',background:'#25D366',color:'#fff',padding:'10px 14px',borderRadius:10,fontWeight:800,textDecoration:'none'}}
        >
          WhatsApp
        </a>
        <a
          href={`tel:${RAW_PHONE}`}
          style={{display:'inline-block',background:'#16a34a',color:'#fff',padding:'10px 14px',borderRadius:10,fontWeight:800,textDecoration:'none'}}
        >
          Llamar {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  )
}
