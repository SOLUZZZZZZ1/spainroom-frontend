import React, { useEffect, useRef, useState } from 'react'

/**
 * Mapa de provincias (GeoJSON) sin librerías.
 * Carga con fetch desde /public (varias rutas de respaldo + cache-buster).
 * Colorea por "¿Obligatorio para alquilar? (Sí/No/Depende)" según el CSV real.
 */
export default function MapaProvinciasGeo(){
  const svgRef = useRef(null)
  const [status, setStatus] = useState('cargando')   // cargando | ok | error
  const [hover, setHover]   = useState(null)         // {prov, cat, doc}
  const [debug, setDebug]   = useState({ sourceGeo:'', sourceCSV:'', paths:0, matched:0 })

  // Normaliza nombres para casar CSV ↔ GeoJSON
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
    return alias[x] || x
  }

  // CSV → Map(provNorm → {cat, doc})
  const parseCSV = (text)=>{
    const raw = (text||'').replace(/\r/g,'').trim()
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

  const colorByCat = (cat)=>{
    switch(cat){
      case 'si': return '#ef4444'
      case 'depende': return '#f59e0b'
      case 'no': return '#16a34a'
      default: return '#eef5ff'
    }
  }

  // Proyección Web Mercator
  const project = (lon, lat)=>{
    const λ = lon * Math.PI/180
    const φ = Math.max(-85, Math.min(85, lat)) * Math.PI/180
    const x = λ
    const y = Math.log(Math.tan(Math.PI/4 + φ/2))
    return [x, y]
  }

  // (Multi)Polygon → atributo d
  const pathFromCoords = (coords, proj, scale, tx, ty)=>{
    const polys = Array.isArray(coords[0][0][0]) ? coords : [coords]
    let d = ''
    polys.forEach(poly=>{
      poly.forEach(ring=>{
        ring.forEach(([lon,lat], idx)=>{
          const [X,Y] = proj(lon,lat)
          const x = X*scale + tx, y = -Y*scale + ty
          d += (idx===0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2)
        })
        d += 'Z'
      })
    })
    return d
  }

  const fetchText = async (url)=>{
    const r = await fetch(url, {cache:'no-cache'})
    if(!r.ok) throw new Error(`HTTP ${r.status} al cargar ${url}`)
    return await r.text()
  }

  useEffect(()=>{
    let cancelled = false
    const load = async ()=>{
      try{
        setStatus('cargando')
        const bust = '?v=' + Math.floor(Date.now()/60000)

        // Rutas en /public (varios candidatos por nombre)
        const geoCandidates = [
          '/assets/spain-provinces.geojson',
          '/assets/espana-provincias.geojson',
          '/maps/spain-provinces.geojson',
          '/maps/espana-provincias.geojson'
        ]
        const csvCandidates = [
          '/assets/mapa_cedula_provincias.csv',
          '/data/mapa_cedula_provincias.csv'
        ]

        let geoText = '', csvText = '', srcGeo = '', srcCSV = ''
        for (const p of geoCandidates){ try { geoText = await fetchText(p+bust); srcGeo = p; break } catch {} }
        for (const p of csvCandidates){ try { csvText = await fetchText(p+bust); srcCSV = p; break } catch {} }
        if (!geoText || !csvText) throw new Error('No encontré GeoJSON o CSV en /public')

        const geo = JSON.parse(geoText)
        const mapCSV = parseCSV(csvText)

        // BBox proyectada
        const xs=[], ys=[]
        geo.features.forEach(f=>{
          const g=f.geometry; if (!g) return
          const collect = (cs)=>{
            const polys = Array.isArray(cs[0][0][0]) ? cs : [cs]
            polys.forEach(poly=>poly.forEach(ring=>{
              ring.forEach(([lon,lat])=>{
                const [x,y]=project(lon,lat); xs.push(x); ys.push(y)
              })
            }))
          }
          if (g.type==='Polygon' || g.type==='MultiPolygon') collect(g.coordinates)
        })
        const minX=Math.min(...xs), maxX=Math.max(...xs)
        const minY=Math.min(...ys), maxY=Math.max(...ys)
        const padding=20, targetW=900, targetH=650
        const scale = Math.min((targetW-2*padding)/(maxX-minX||1),(targetH-2*padding)/(maxY-minY||1))
        const tx = padding + (-minX)*scale
        const ty = padding + ( maxY)*scale

        // Dibujo
        const svg = svgRef.current
        if (!svg) return
        while (svg.firstChild) svg.removeChild(svg.firstChild)

        let matched=0
        geo.features.forEach(f=>{
          const g=f.geometry; if (!g || (g.type!=='Polygon' && g.type!=='MultiPolygon')) return
          const p = f.properties || {}
          const rawName = (p.NAME_2 || p.name || p.provincia || p.Provname || p.PROVINCIA || p.NAMEUNIT || p.title || p.id || 'Provincia')
          const norm    = normalize(rawName)
          const info    = mapCSV.get(norm)
          if (info) matched++

          const d = pathFromCoords(g.coordinates, project, scale, tx, ty)
          const el = document.createElementNS('http://www.w3.org/2000/svg','path')
          el.setAttribute('d', d)
          const cat = info?.cat || 'neutro'
          el.setAttribute('fill', cat==='si' ? '#ef4444' : cat==='depende' ? '#f59e0b' : cat==='no' ? '#16a34a' : '#eef5ff')
          el.setAttribute('stroke', 'rgba(0,0,0,.15)')
          el.setAttribute('stroke-width', '0.6')
          el.style.cursor='pointer'
          el.addEventListener('mouseenter', ()=> setHover({prov:rawName, cat, doc:info?.doc||''}))
          el.addEventListener('mouseleave', ()=> setHover(null))
          svg.appendChild(el)
        })

        if (cancelled) return
        setDebug({ sourceGeo: srcGeo, sourceCSV: srcCSV, paths: svg.childNodes.length, matched })
        setStatus('ok')
      }catch(e){
        console.error(e)
        setStatus('error')
      }
    }

    load()
    return ()=>{ cancelled = true }
  },[])

  return (
    <div style={{background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
        <h3 style={{margin:0}}>Mapa de cédulas por provincia</h3>
        {hover && (
          <div style={{fontSize:14,color:'#0b1220'}}>
            <strong>{hover.prov}</strong> — {hover.cat==='si'?'Sí':hover.cat==='depende'?'Depende':'No'}{hover.doc?` · ${hover.doc}`:''}
          </div>
        )}
      </div>

      {status==='cargando' && <div style={{padding:'12px 0', color:'#64748b'}}>Cargando datos…</div>}
      {status==='error' && (
        <div style={{padding:'12px 0', color:'#b91c1c'}}>
          No se pudo renderizar el mapa. Asegúrate de tener en <code>public</code>:
          <code>/assets/spain-provinces.geojson</code> y <code>/data/mapa_cedula_provincias.csv</code>.
          <div style={{marginTop:6, fontSize:12, color:'#64748b'}}>
            Origen Geo: {debug.sourceGeo||'-'} · Origen CSV: {debug.sourceCSV||'-'} · Paths: {debug.paths||0} · Coincidencias CSV: {debug.matched||0}
          </div>
        </div>
      )}

      <svg ref={svgRef} viewBox="0 0 900 650" style={{width:'100%', height:'auto', display:'block', marginTop:8}} />

      <div style={{marginTop:10, fontSize:12, color:'#64748b'}}>
        Origen Geo: {debug.sourceGeo||'-'} · Origen CSV: {debug.sourceCSV||'-'} · Paths: {debug.paths||0} · Coincidencias CSV: {debug.matched||0}
      </div>
    </div>
  )
}
