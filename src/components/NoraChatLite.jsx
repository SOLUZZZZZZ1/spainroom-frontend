import React, { useEffect, useRef, useState } from 'react'

export default function NoraChatLite(){
  const STORE = 'noraChatLite_v1'
  const [open, setOpen] = useState(false)   // ← cerrada por defecto
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  const RAW_PHONE = (import.meta.env.VITE_SUPPORT_PHONE || '+34616232306').replace(/\s+/g,'')
  const MAIL      =  import.meta.env.VITE_SUPPORT_EMAIL || 'soporte@spainroom.es'
  const WA        = 'https://wa.me/' + RAW_PHONE.replace(/^\+/, '')

  const norm = (s='') => s.toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim()
  const intent = (txt='')=>{
    const n = norm(txt)
    if (/\binquil/.test(n) || /\bbusco\b.*\bhabitacion/.test(n) || /\balquilar|alquiler\b/.test(n)) return 'inquilinos'
    if (/\bpropiet|dueñ|publicar|cedula|c[e|e]dula|lpo|primera ocup|segunda ocup|2a\s*ocup|2\s*ª\s*ocup/.test(n)) return 'propietarios'
    if (/\bpago|stripe|cobro|tarjeta|checkout\b/.test(n)) return 'pagos'
    if (/\badmin\b|\bpanel\b/.test(n)) return 'admin'
    if (/\bayud|soport|whats|tel|llamar|telefono|contact/.test(n)) return 'soporte'
    return 'generic'
  }

  const push  = (role, text)=> setMessages(m=>[...m, { role, text: String(text) }])
  const reply = (lines)=> push('bot', Array.isArray(lines)? lines.join('\n') : String(lines))

  const send = (text)=>{
    const t = (text||'').trim()
    if (!t) return
    push('user', t); setInput('')
    if (t.toLowerCase()==='/reset'){
      try{ localStorage.removeItem(STORE) }catch{}
      setMessages([
        { role:'bot', text:'Sesión reiniciada. ¡Hola! Soy Nora 💙' },
        { role:'bot', text:`Tel: ${RAW_PHONE} · WhatsApp: https://wa.me/${RAW_PHONE.replace(/^\+/, '')}\nEmail: ${MAIL}` }
      ])
      return
    }
    reply(`Entiendo: “${t}”`)
    switch (intent(t)) {
      case 'propietarios':
        reply(['Propietarios:',
          '• Ver mapa y requisitos: /propietarios',
          '• SpainRoom te ayuda a tramitar cédula/LPO si lo necesitas.',
          '• Email: propietarios@spainroom.es',
          `• Tel/WhatsApp: ${RAW_PHONE}`])
        break
      case 'inquilinos':
        reply(['Inquilinos:',
          '• Recursos y empleo cerca: /inquilinos',
          '• Consejos sobre contrato, fianza y convivencia.',
          `• Tel/WhatsApp: ${RAW_PHONE}`])
        break
      case 'pagos':
        reply(['Pagos:', '• /pagos', `• Soporte pagos: ${MAIL}`]); break
      case 'admin':
        reply(['Admin: /admin']); break
      case 'soporte':
        reply(['Contacto directo:', `• Tel: ${RAW_PHONE}`, `• WhatsApp: https://wa.me/${RAW_PHONE.replace(/^\+/, '')}`, `• Email: ${MAIL}`]); break
      default:
        reply(['Puedo ayudarte con:',
          '• Propietarios: /propietarios',
          '• Inquilinos: /inquilinos',
          '• Reservas: /reservas',
          '• Pagos: /pagos',
          `• Tel/WhatsApp: ${RAW_PHONE}`])
    }
  }

  useEffect(()=>{
    try{
      const saved = JSON.parse(localStorage.getItem(STORE)||'[]')
      if (saved.length) setMessages(saved)
      else {
        const hello = [
          { role:'bot', text:'¡Hola! Soy Nora 💙 ¿En qué te ayudo?' },
          { role:'bot', text:`Tel: ${RAW_PHONE} · WhatsApp: https://wa.me/${RAW_PHONE.replace(/^\+/, '')}\nEmail: ${MAIL}` }
        ]
        setMessages(hello); localStorage.setItem(STORE, JSON.stringify(hello))
      }
    }catch{}
  },[])
  useEffect(()=>{
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
    try{ localStorage.setItem(STORE, JSON.stringify(messages)) }catch{}
  },[messages, open])

  useEffect(()=>{
    const h = ()=> setOpen(true)
    window.addEventListener('open-nora', h)
    return ()=> window.removeEventListener('open-nora', h)
  },[])

  const Quick = ({label, text}) => (
    <button type="button" onClick={()=>send(text)}
      style={{padding:'8px 10px',borderRadius:999,border:'1px solid #cbd5e1',background:'#fff',cursor:'pointer',fontWeight:700}}>
      {label}
    </button>
  )

  return (
    <>
      {!open && (
        <button onClick={()=>setOpen(true)} aria-label="Abrir Nora"
          style={{position:'fixed',left:18,bottom:18,zIndex:41,display:'flex',alignItems:'center',gap:8,
                  background:'#0A58CA',color:'#fff',border:'1px solid rgba(255,255,255,.35)',borderRadius:999,
                  padding:'10px 14px',fontWeight:800,boxShadow:'0 10px 24px rgba(10,88,202,.35),0 2px 6px rgba(0,0,0,.15)'}}>
          <span style={{width:8,height:8,borderRadius:999,background:'#22c55e'}} />
          <span style={{fontSize:14}}>Nora</span>
        </button>
      )}

      {open && (
        <div style={{position:'fixed',left:18,bottom:18,zIndex:42,width:340,maxHeight:'70vh',
                     display:'flex',flexDirection:'column',background:'#fff',color:'#0b1220',
                     border:'1px solid #e2e8f0',borderRadius:16,boxShadow:'0 16px 40px rgba(0,0,0,.18)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',
                       borderBottom:'1px solid #e2e8f0',background:'#f8fafc',borderRadius:'16px 16px 0 0'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:28,height:28,borderRadius:999,background:'#0A58CA',color:'#fff',
                           display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800}}>N</div>
              <div>
                <div style={{fontWeight:800,fontSize:14}}>NoraChatLite</div>
                <div style={{fontSize:12,color:'#64748b'}}>Online — escribe /reset para reiniciar</div>
              </div>
            </div>
            <button onClick={()=>setOpen(false)} aria-label="Minimizar"
                    style={{background:'transparent',border:'none',fontSize:22,cursor:'pointer',color:'#475569'}}>×</button>
          </div>

          <div ref={listRef} style={{padding:10,overflow:'auto',flex:1,background:'#ffffff'}}>
            {messages.map((m,i)=>(
              <div key={i} style={{
                margin:'6px 0',maxWidth:'90%',padding:'10px 12px',borderRadius:12,whiteSpace:'pre-wrap',lineHeight:1.35,fontSize:14,
                background: m.role==='user' ? '#0A58CA' : '#f1f5f9',
                color: m.role==='user' ? '#fff' : '#0b1220',
                marginLeft: m.role==='user' ? 'auto' : 0,
                border: m.role==='user' ? '1px solid rgba(255,255,255,.25)' : '1px solid #e2e8f0'
              }}>{m.text}</div>
            ))}
          </div>

          <div style={{display:'flex',gap:8,flexWrap:'wrap',padding:'8px 10px',borderTop:'1px solid #e2e8f0',background:'#f8fafc'}}>
            <Quick label="Propietarios" text="Quiero ayuda para propietarios" />
            <Quick label="Inquilinos"    text="Quiero ayuda para inquilinos" />
            <Quick label="Pagos"         text="Quiero ayuda con pagos" />
            <Quick label="Soporte"       text="Quiero contactar soporte" />
          </div>

          <form onSubmit={e=>{e.preventDefault(); send(input)}}
                style={{display:'flex',gap:8,padding:10,borderTop:'1px solid #e2e8f0',background:'#fff',borderRadius:'0 0 16px 16px'}}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Escribe aquí… (o /reset)" aria-label="Mensaje para Nora"
                   style={{flex:1,padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10,fontSize:14}} />
            <button type="submit" disabled={!input.trim()}
                    style={{background:'#0A58CA',color:'#fff',border:'none',padding:'10px 14px',borderRadius:10,fontWeight:800,
                            cursor: input.trim()? 'pointer':'not-allowed',opacity: input.trim()?1:.6}}>
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  )
}
