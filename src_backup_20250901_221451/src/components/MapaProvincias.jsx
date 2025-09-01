import React, { useEffect, useRef, useState } from 'react'

// Intenta embebido (src/assets). Si no existen, quedarán undefined y caeremos a /public.
let embedded = { svg: undefined, csv: undefined }
try {
  const files = import.meta.glob('../assets/*', { as: 'raw', eager: true })
  embedded.svg = files['../assets/espana-provincias.svg']
  embedded.csv = files['../assets/mapa_cedula_provincias.csv']
} catch {}

export default function MapaProvincias(){
  const wrapRef = useRef(null)
  const [status, setStatus] = useState('cargando')    // cargando | ok | error
  const [hover,  setHover]  = useState({prov:'', obligatorio:'', doc:''})
  const [debug,  setDebug]  = useState({source:'', nodes:0, matched:0})

  // --- mapas auxiliares ---
  const codeToName = {
    'ES-C':'a coruna','ES-VI':'alava','ES-AB':'albacete','ES-A':'alicante','ES-AL':'almeria',
    'ES-O':'asturias','ES-AV':'avila','ES-BA':'badajoz','ES-B':'barcelona','ES-BU':'burgos',
    'ES-CC':'caceres','ES-CA':'cadiz','ES-S':'cantabria','ES-CS':'castellon','ES-CR':'ciudad real',
    'ES-CO':'cordoba','ES-CU':'cuenca','ES-GI':'girona','ES-GR':'granada','ES-GU':'guadalajara',
    'ES-SS':'guipuzcoa','ES-H':'huelva','ES-HU':'huesca','ES-IB':'baleares','ES-J':'jaen',
    'ES-LO':'la rioja','ES-GC':'las palmas','ES-LE':'leon','ES-L':'lleida','ES-LU':'lugo',
    'ES-M':'madrid','ES-MA':'malaga','ES-MU':'murcia','ES-NA':'navarra','ES-OR':'ourense',
    'ES-P':'palencia','ES-PO':'pontevedra','ES-SA':'salamanca','ES-TF':'santa cruz de tenerife',
    'ES-SG':'segovia','ES-SE':'sevilla','ES-SO':'soria','ES-T':'tarragona','ES-TE':'teruel',
    'ES-TO':'toledo','ES-V':'valencia','ES-VA':'valladolid','ES-BI':'vizcaya','ES-ZA':'zamora',
    'ES-Z':'zaragoza','ES-CE':'ceuta','ES-ML':'melilla'
  }

  const normalize = (s='')=>{
    let x = String(s||'').trim().toLowerCase()
    x = x.normalize('NFD').replace(/\p{Diacritic}/gu,'')
    x = x.replace(/-/g,' ').replace(/\s+/g,' ')
    const alias = {
      'la coruna':'a coruna','coruna':'a coruna','a coruna':'a coruna',
      'araba':'alava','araba alava':'alava','alava':'alava',
      'alacant':'alicante','castello':'castellon','castello castellon':'castellon',
      'gerona':'girona','lerida':'lleida','orense':'ourense',
      'islas baleares':'baleares','illes balears':'baleares',
      'gipuzkoa':'guipuzcoa','bizkaia':'vizcaya'
    }
    // Si ya viene como código ES-XX
    if (/^es-[a-z0-9]+$/i.test(x)) return codeToName[x.toUpperCase()] || x
    return alias[x] || x
  }

  const parseCSV = (text)=>{
    const raw = (text||'').replace(/\r/g,'').trim()
    const headLine = raw.split('\n')[0] || ''
    const delim = headLine.includes(';') ? ';' : headLine.includes('\t') ? '\t' : ','
    const lines = raw.split('\n').filter(Boolean)
    const head  = lines[0].split(delim)
    const idx = (fn)=> head.findIndex(h => fn(String(h)))
    const iProv = idx(h => normalize(h).includes('prov'))
    const iObl  = idx(h => normalize(h).includes('obligatorio'))
    const iDoc  = idx(h => /(documento|cedula|c[eé]dula|lpo|ocupacion|ocupaci[oó]n)/.test(normalize(h)))

    const mapa = new Map()
    for (let i=1;i<lines.length;i++){
      const cols = lines[i].split(delim)
      const prov   = normalize(cols[iProv]||'')
      const oblRaw = String(cols[iObl]||'').trim().toLowerCase()
      const doc    = String(cols[iDoc]||'').trim()
      let cat = 'no'
      if (/^si|sí$/.test(oblRaw) || oblRaw.startsWith('si')) cat='si'
      else if (oblRaw.startsWith('dep')) cat='depende'
      if (prov) mapa.set(prov, {cat, doc})
    }
    return mapa
  }

  const colorByCat = (cat)=>{
    switch(cat){
      case 'si':      return '#ef4444'
      case 'depende': return '#f59e0b'
      case 'no':      return '#16a34a'
      default:        return '#eef5ff'
    }
  }

  const pickName = (el)=>{
    // intenta atributos de nombre
    const cand = [
      el.getAttribute('data-name'),
      el.getAttribute('data-prov'),
      el.getAttribute('aria-label'),
      el.getAttribute('title'),
      el.id
    ].filter(Boolean)
    let nm = cand.length ? cand[0] : ''
    // si es código ES-XX en id/title
    if (/^ES-[A-Z0-9]+$/.test(nm)) return codeToName[nm] || nm
    return nm
  }

  const paintNode = (node, fill)=>{
    if (!node) return
    const tag = node.tagName.toLowerCase()
    if (tag === 'g'){
      node.querySelectorAll('path,polygon').forEach(c=>{
        c.style.fill = fill
        c.style.stroke = 'rgba(0,0,0,.15)'
        c.style.strokeWidth = '0.6'
      })
    } else if (tag === 'use'){
      node.setAttribute('fill', fill)
      node.setAttribute('stroke', 'rgba(0,0,0,.15)')
      node.setAttribute('stroke-width', '0.6')
    } else if (tag === 'path' || tag === 'polygon'){
      node.style.fill = fill
      node.style.stroke = 'rgba(0,0,0,.15)'
      node.style.strokeWidth = '0.6'
    }
  }

  const fetchText = async (url)=>{
    const r = await fetch(url, {cache:'no-cache'})
    if(!r.ok) throw new Error(`HTTP ${r.status} al cargar ${url}`)
    return await r.text()
  }

  useEffect(()=>{
    let cancelled = false
    const run = async ()=>{
      try{
        setStatus('cargando')
        let svgText = embedded.svg
        let csvText = embedded.csv
        let source  = ''

        if (svgText && csvText) {
          source = 'assets'
        } else {
          const bust = '?v=' + Math.floor(Date.now()/60000) // rompe caché cada minuto
          if (!svgText) svgText = await fetchText('/maps/espana-provincias.svg' + bust)
          if (!csvText) csvText = await fetchText('/data/mapa_cedula_provincias.csv' + bust)
          source = 'public'
        }

        if (cancelled) return
        setDebug(d=>({...d, source }))

        // Inserta SVG
        if (!wrapRef.current) return
        wrapRef.current.innerHTML = svgText
        const svgRoot = wrapRef.current.querySelector('svg')
        if (!svgRoot) throw new Error('SVG no válido')

        const mapa = parseCSV(csvText)

        // Selecciona solo nodos válidos de provincia (NO rectángulos)
        const nodes = Array.from(svgRoot.querySelectorAll('g, path, polygon, use'))
        let matched = 0

        nodes.forEach(el=>{
          const tag = el.tagName.toLowerCase()
          if (tag === 'rect') return // ignorar rectángulos
          // Nombre: si es <use>, a veces el id real está en el href del símbolo
          let nmRaw = pickName(el)
          if ((!nmRaw || /^ES-/.test(nmRaw)) && tag === 'use'){
            const href = el.getAttribute('href') || el.getAttribute('xlink:href') || ''
            if (href && href.startsWith('#')){
              const ref = href.slice(1)
              nmRaw = ref
            }
          }
          let nm = normalize(nmRaw)
          if (/^es-[a-z0-9]+$/.test(nm)) nm = codeToName[nm.toUpperCase()] || nm

          const item = mapa.get(nm)
          paintNode(el, colorByCat(item?.cat))
          el.style.cursor = 'pointer'
          el.addEventListener('mouseenter', ()=> setHover({
            prov: nmRaw || 'Provincia',
            obligatorio: item ? (item.cat==='si'?'Sí':item.cat==='depende'?'Depende':'No') : 's/d',
            doc: item?.doc || ''
          }))
          el.addEventListener('mouseleave', ()=> setHover({prov:'', obligatorio:'', doc:''}))
          if (item) matched++
        })

        setDebug(d=>({...d, nodes: nodes.length, matched }))
        setStatus('ok')
      }catch(e){
        console.error(e)
        setStatus('error')
      }
    }
    run()
    return ()=>{ cancelled = true; if (wrapRef.current) wrapRef.current.innerHTML = '' }
  },[])

  return (
    <div style={{background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
        <h3 style={{margin:0}}>Mapa de cédulas por provincia</h3>
        {hover.prov && (
          <div style={{fontSize:14, color:'#0b1220'}}>
            <strong>{hover.prov}</strong> — {hover.obligatorio}{hover.doc ? ` · ${hover.doc}` : ''}
          </div>
        )}
      </div>

      {status==='cargando' && <div style={{padding:'12px 0', color:'#64748b'}}>Cargando datos…</div>}
      {status==='error' && (
        <div style={{padding:'12px 0', color:'#b91c1c'}}>
          No se pudo cargar el mapa o el CSV (embebido o /public). Revisa que existan los archivos.<br/>
          <small style={{color:'#475569'}}>Origen: {debug.source || '-'} · Nodos detectados: {debug.nodes||0} · Provincias casadas: {debug.matched||0}</small>
        </div>
      )}

      <div ref={wrapRef} style={{width:'100%', height:'auto', marginTop:8}} />

      <div style={{marginTop:10, fontSize:12, color:'#64748b'}}>
        Origen: {debug.source || '-'} · Nodos: {debug.nodes||0} · Provincias casadas: {debug.matched||0}
      </div>
    </div>
  )
}
