import React, { useEffect, useRef, useState } from 'react'

/**
 * Mapa de provincias robusto (embebido + fallback a /public)
 * Colorea por "¿Obligatorio para alquilar? (Sí/No/Depende)"
 * Acepta datos como tu CSV real (52 filas con columnas: Provincia, ¿Obligatorio...?, Documento..., etc.)
 */

export default function MapaProvincias(){
  const wrapRef = useRef(null)
  const [status, setStatus] = useState('cargando')   // cargando | ok | error
  const [hover, setHover]   = useState({prov:'', obligatorio:'', doc:''})
  const [debug, setDebug]   = useState({source:'', csv:'', svg:'', nodes:0, matched:0})

  // 1) Intento embebido (src/assets) usando glob (no rompe el build si no existen)
  //    Si pones los ficheros en src/assets/espana-provincias.svg y src/assets/mapa_cedula_provincias.csv
  const embedded = (() => {
    try {
      const files = import.meta.glob('../assets/*', { as: 'raw', eager: true })
      return {
        svg: files['../assets/espana-provincias.svg'],
        csv: files['../assets/mapa_cedula_provincias.csv']
      }
    } catch {
      return { svg: undefined, csv: undefined }
    }
  })()

  // util: normaliza nombre de provincia
  const normalize = (s='')=>{
    let x = String(s||'').trim().toLowerCase()
    x = x.normalize('NFD').replace(/\p{Diacritic}/gu,'')
    x = x.replace(/-/g,' ').replace(/\s+/g,' ')
    const map = {
      'la coruna':'a coruna','coruna':'a coruna','a coruna':'a coruna',
      'araba':'alava','araba alava':'alava','alava':'alava',
      'alacant':'alicante','castello':'castellon','castello castellon':'castellon',
      'gerona':'girona','lerida':'lleida','orense':'ourense',
      'islas baleares':'baleares','illes balears':'baleares',
      'gipuzkoa':'guipuzcoa','bizkaia':'vizcaya'
    }
    return map[x] || x
  }

  // lee CSV flexible y categoriza
  const parseCSV = (text)=>{
    const raw = (text||'').replace(/\r/g,'').trim()
    const headLine = raw.split('\n')[0] || ''
    const delim = headLine.includes(';') ? ';' : headLine.includes('\t') ? '\t' : ','
    const lines = raw.split('\n').filter(Boolean)
    const head  = lines[0].split(delim)
    const idx   = (fn)=> head.findIndex(h => fn(String(h)))

    const iProv = idx(h=>normalize(h).includes('prov'))
    const iObl  = idx(h=>normalize(h).includes('obligatorio'))
    const iDoc  = idx(h=>/(documento|cedula|c[eé]dula|lpo|ocupacion|ocupaci[oó]n)/.test(normalize(h)))

    const mapa = new Map()
    for (let i=1;i<lines.length;i++){
      const cols = lines[i].split(delim)
      const prov = normalize(cols[iProv] || '')
      const oblRaw = String(cols[iObl]||'').trim().toLowerCase()
      const doc = String(cols[iDoc]||'').trim()
      let cat = 'no'
      if (/^si|sí$/.test(oblRaw) || oblRaw.startsWith('si')) cat='si'
      else if (oblRaw.startsWith('dep')) cat='depende'
      if (prov) mapa.set(prov, {cat, doc})
    }
    return mapa
  }

  const colorByCat = (cat)=>{
    switch(cat){
      case 'si':      return '#ef4444'   // rojo
      case 'depende': return '#f59e0b'   // ámbar
      case 'no':      return '#16a34a'   // verde
      default:        return '#eef5ff'   // neutro
    }
  }

  const pickName = (el)=>{
    const cand = [el.getAttribute('data-name'), el.getAttribute('data-prov'), el.getAttribute('title'), el.id].filter(Boolean)
    if (cand.length) return cand[0]
    const t = el.querySelector && el.querySelector('title')
    return t ? t.textContent : ''
  }

  const paintNode = (node, fill)=>{
    if (!node) return
    const tag = node.tagName.toLowerCase()
    if (tag === 'g'){
      node.querySelectorAll('path,polygon,rect').forEach(c=>{
        c.style.fill = fill
        c.style.stroke = 'rgba(0,0,0,.15)'
        c.style.strokeWidth = '0.6'
      })
    } else {
      node.style.fill = fill
      node.style.stroke = 'rgba(0,0,0,.15)'
      node.style.strokeWidth = '0.6'
    }
  }

  // fetch con fallback
  const fetchText = async (url)=> {
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
          source = 'assets (embebido)'
        } else {
          // fallback a /public (cache-buster minuto)
          const bust = '?v=' + Math.floor(Date.now()/60000)
          if (!svgText) svgText = await fetchText('/maps/espana-provincias.svg' + bust)
          if (!csvText) csvText = await fetchText('/data/mapa_cedula_provincias.csv' + bust)
          source = 'public (fetch)'
        }

        if (cancelled) return
        setDebug(d=>({...d, source, svg: svgText ? 'ok' : 'fail', csv: csvText ? 'ok' : 'fail'}))

        // Inserta SVG
        if (!wrapRef.current) return
        wrapRef.current.innerHTML = svgText
        const svgRoot = wrapRef.current.querySelector('svg')
        if (!svgRoot) throw new Error('SVG no válido (sin <svg>)')

        // Dados
        const mapa = parseCSV(csvText)

        // Colorea y eventos
        const nodes = Array.from(svgRoot.querySelectorAll('g, path, polygon, rect'))
        let matched = 0
        nodes.forEach(el=>{
          const nmRaw = pickName(el)
          const nm    = normalize(nmRaw)
          const item  = mapa.get(nm)
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
          No se pudo cargar el mapa o el CSV (embebido ni /public).<br/>
          <small style={{color:'#475569'}}>Revisa que existan <code>src/assets/espana-provincias.svg</code> y <code>src/assets/mapa_cedula_provincias.csv</code> o sus pares en <code>/public/maps</code> y <code>/public/data</code>.</small>
        </div>
      )}

      <div ref={wrapRef} style={{width:'100%', height:'auto', marginTop:8}} />

      {/* Depuración corta */}
      <div style={{marginTop:10, fontSize:12, color:'#64748b'}}>
        <div>Origen: {debug.source} · SVG: {debug.svg} · CSV: {debug.csv}</div>
        <div>Nodos SVG: {debug.nodes||0} · Provincias casadas: {debug.matched||0}</div>
      </div>
    </div>
  )
}
