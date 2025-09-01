import React, { useEffect, useRef, useState } from 'react'

export default function MapaProvinciasSvg(){
  const wrapRef = useRef(null)
  const [status, setStatus] = useState('cargando')
  const [hover, setHover]   = useState({prov:'', cat:'', doc:''})
  const [diag, setDiag]     = useState({nodes:0, matched:0})

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
    if (/^es-[a-z0-9]+$/i.test(x)) return codeToName[x.toUpperCase()] || x
    return alias[x] || x
  }

  const parseCSV = (text)=>{
    const raw = text.replace(/\r/g,'').trim()
    if (!raw) return new Map()
    const headLine = raw.split('\n')[0] || ''
    const delim = headLine.includes(';') ? ';' : headLine.includes('\t') ? '\t' : ','
    const lines = raw.split('\n').filter(Boolean)
    const head  = lines[0].split(delim)
    const find  = (pred, fb=null)=> {
      const idx = head.findIndex(h => pred(String(h)))
      return idx>=0 ? idx : fb
    }
    const iProv = find(h=>normalize(h).includes('prov'), 0)
    const iObl  = find(h=>normalize(h).includes('obligatorio'), 3)
    const iDoc  = find(h=>/(documento|cedula|c[eé]dula|lpo|ocupaci)/.test(normalize(h)), 2)

    const m = new Map()
    for (let i=1;i<lines.length;i++){
      const cols = lines[i].split(delim)
      const prov = normalize(cols[iProv]||'')
      const obl  = String(cols[iObl]||'').trim().toLowerCase()
      const doc  = String(cols[iDoc]||'').trim()
      let cat='no'
      if (/^si|sí$/.test(obl) || obl.startsWith('si')) cat='si'
      else if (obl.startsWith('dep')) cat='depende'
      if (prov) m.set(prov, {cat, doc})
    }
    return m
  }

  const colorBy = (cat)=> cat==='si' ? '#ef4444' : cat==='depende' ? '#f59e0b' : cat==='no' ? '#16a34a' : '#eef5ff'

  const pickName = (el)=>{
    const cand = [
      el.getAttribute('data-name'),
      el.getAttribute('data-prov'),
      el.getAttribute('aria-label'),
      el.getAttribute('title'),
      el.id
    ].filter(Boolean)
    let nm = cand.length ? cand[0] : ''
    if (/^ES-[A-Z0-9]+$/.test(nm)) return codeToName[nm] || nm
    return nm
  }

  const paintNode = (node, fill)=>{
    if (!node) return
    const tag = node.tagName.toLowerCase()
    if (tag === 'rect') return
    if (tag === 'g'){
      node.querySelectorAll('path,polygon').forEach(c=>{
        c.style.fill = fill
        c.style.stroke = 'rgba(0,0,0,.15)'
        c.style.strokeWidth = '0.6'
      })
    } else if (tag === 'path' || tag === 'polygon' || tag === 'use'){
      if (tag === 'use'){
        node.setAttribute('fill', fill)
        node.setAttribute('stroke', 'rgba(0,0,0,.15)')
        node.setAttribute('stroke-width', '0.6')
      } else {
        node.style.fill = fill
        node.style.stroke = 'rgba(0,0,0,.15)'
        node.style.strokeWidth = '0.6'
      }
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
        const bust='?v='+Math.floor(Date.now()/60000)

        const [svgMarkup, csvText] = await Promise.all([
          fetchText('/maps/espana-provincias.svg'+bust),
          fetchText('/data/mapa_cedula_provincias.csv'+bust)
        ])

        if (!wrapRef.current) return
        wrapRef.current.innerHTML = svgMarkup
        const svgRoot = wrapRef.current.querySelector('svg')
        if (!svgRoot) throw new Error('SVG no válido')

        const mapa = parseCSV(csvText)

        const nodes = Array.from(svgRoot.querySelectorAll('g, path, polygon, use'))
        let matched = 0
        nodes.forEach(el=>{
          const tag = el.tagName.toLowerCase()
          if (tag === 'rect') return
          let nmRaw = pickName(el)
          if ((!nmRaw || /^ES-/.test(nmRaw)) && tag==='use'){
            const href = el.getAttribute('href') || el.getAttribute('xlink:href') || ''
            if (href?.startsWith('#')) nmRaw = href.slice(1)
          }
          const nm = normalize(nmRaw)
          const info = mapa.get(nm)
          paintNode(el, colorBy(info?.cat))
          el.style.cursor='pointer'
          el.addEventListener('mouseenter', ()=> setHover({
            prov: nmRaw || 'Provincia',
            cat: info ? info.cat : 'neutro',
            doc: info?.doc || ''
          }))
          el.addEventListener('mouseleave', ()=> setHover({prov:'',cat:'',doc:''}))
          if (info) matched++
        })

        if (cancelled) return
        setDiag({nodes:nodes.length, matched})
        setStatus('ok')
      }catch(e){
        console.error(e)
        setStatus('error')
      }
    }
    run()
    return ()=>{ cancelled=true; if (wrapRef.current) wrapRef.current.innerHTML='' }
  },[])

  return (
    <div style={{background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
        <h3 style={{margin:0}}>Mapa de cédulas por provincia</h3>
        {hover.prov && (
          <div style={{fontSize:14, color:'#0b1220'}}>
            <strong>{hover.prov}</strong> — {
              hover.cat==='si' ? 'Sí' : hover.cat==='depende' ? 'Depende' : hover.cat==='no' ? 'No' : 's/d'
            }{hover.doc ? ` · ${hover.doc}` : ''}
          </div>
        )}
      </div>

      {status==='cargando' && <div style={{padding:'12px 0', color:'#64748b'}}>Cargando datos…</div>}
      {status==='error' && (
        <div style={{padding:'12px 0', color:'#b91c1c'}}>
          No se pudo renderizar el mapa. Verifica que existen y son accesibles:<br/>
          <code>/maps/espana-provincias.svg</code> y <code>/data/mapa_cedula_provincias.csv</code>.
        </div>
      )}

      <div ref={wrapRef} style={{width:'100%', height:'auto', marginTop:8}} />

      <div style={{marginTop:10, fontSize:12, color:'#64748b'}}>
        Nodos: {diag.nodes||0} · Coincidencias CSV: {diag.matched||0}
      </div>
    </div>
  )
}
