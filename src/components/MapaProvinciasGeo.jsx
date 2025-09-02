import React, { useEffect, useRef, useState } from 'react'

export default function MapaProvinciasGeo({ onSelect = () => {} }){
  const svgRef = useRef(null)
  const [status, setStatus] = useState('cargando') // cargando | ok | error
  const [hover, setHover]   = useState(null)
  const [diag, setDiag]     = useState({ geo:'-', csv:'-', paths:0, matched:0 })

  const normalize = (s='')=>{
    let x = String(s||'').trim().toLowerCase()
    x = x.normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/-/g,' ').replace(/\s+/g,' ')
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

  const parseCSV = (text)=>{
    const raw = (text||'').replace(/\r/g,'').trim()
    if (!raw) return new Map()
    const headLine = raw.split('\n')[0] || ''
    const delim = headLine.includes(';') ? ';' : headLine.includes('\t') ? '\t' : ','
    const lines = raw.split('\n').filter(Boolean)
    const head  = lines[0].split(delim)

    const findCol = (matchers, fb=null)=>{
      const idx = head.findIndex(h => matchers.some(m => normalize(h).includes(m)))
      return idx>=0 ? idx : fb
    }
    const iProv = findCol(['prov'], 0)
    const iObl  = findCol(['obligatorio'], 3)
    const iDoc  = findCol(['documento','cedula','lpo','ocupacion'], 2)
    const iOrg  = findCol(['organismo'], 5)
    const iVig  = findCol(['vigencia','renovacion'], 6)
    const iNotas= findCol(['excepcion','nota'], 7)
    const iLink = findCol(['enlace'], 9)

    const toCat = (oblRaw='')=>{
      const v = String(oblRaw).trim().toLowerCase()
      const n = v.normalize('NFD').replace(/\p{Diacritic}/gu,'')
      if (/^(si|sí)/.test(v)) return 'si'
      if (/^(dep|segun|según|variable|consultar)/.test(n)) return 'depende'
      if (/^(no|no obligatorio|no aplica|no requerido)/.test(n)) return 'no'
      if (/^no\b/.test(n)) return 'no'
      return 'neutro'
    }

    const m = new Map()
    for (let i=1;i<lines.length;i++){
      const c = lines[i].split(delim)
      const prov = normalize(c[iProv]||'')
      const info = {
        cat:  toCat(c[iObl]||''),
        doc:  c[iDoc]  || '',
        org:  c[iOrg]  || '',
        vig:  c[iVig]  || '',
        notas:c[iNotas]|| '',
        link: c[iLink] || ''
      }
      if (prov) m.set(prov, info)
    }
    return m
  }

  const colorBy = (cat)=> cat==='si' ? '#ef4444' : cat==='depende' ? '#f59e0b' : cat==='no' ? '#16a34a' : '#eef5ff'

  const project = (lon, lat)=>{
    const λ = lon * Math.PI/180
    const φ = Math.max(-85, Math.min(85, lat)) * Math.PI/180
    return [λ, Math.log(Math.tan(Math.PI/4 + φ/2))]
  }

  const pathFrom = (coords, scale, tx, ty)=>{
    const polys = Array.isArray(coords[0][0][0]) ? coords : [coords]
    let d=''
    polys.forEach(poly=>{
      poly.forEach(ring=>{
        ring.forEach(([lon,lat], i)=>{
          const [X,Y]=project(lon,lat)
          const x=X*scale+tx, y=-Y*scale+ty
          d += (i===0?'M':'L')+x.toFixed(2)+' '+y.toFixed(2)
        })
        d+='Z'
      })
    })
    return d
  }

  const fetchText = async (url)=>{
    const r = await fetch(url, {cache:'no-cache'})
    if(!r.ok) throw new Error(`HTTP ${r.status} ${url}`)
    return await r.text()
  }

  useEffect(()=>{
    let cancelled=false
    const run = async ()=>{
      try{
        setStatus('cargando')
        const bust='?v='+Math.floor(Date.now()/60000)

        // Rutas candidatas (probamos varias)
        const geoCandidates = [
          '/assets/spain-provinces.geojson',
          '/assets/espana-provincias.geojson',
          '/maps/spain-provinces.geojson',
          '/maps/espana-provincias.geojson'
        ]
        const csvCandidates = [
          '/data/mapa_cedula_provincias.csv',
          '/assets/mapa_cedula_provincias.csv'
        ]

        let geoText='', csvText='', usedGeo='', usedCSV=''
        let lastErr=''
        for (const p of geoCandidates){
          try { geoText = await fetchText(p + bust); usedGeo = p; break } catch(e){ lastErr=String(e) }
        }
        for (const p of csvCandidates){
          try { csvText = await fetchText(p + bust); usedCSV = p; break } catch(e){ lastErr=String(e) }
        }
        if (!geoText || !csvText) throw new Error(lastErr || 'No encontré GeoJSON o CSV')

        const geo = JSON.parse(geoText)
        const mapCSV = parseCSV(csvText)

        // BBox y escala
        const xs=[], ys=[]
        geo.features.forEach(f=>{
          const g=f.geometry; if(!g|| (g.type!=='Polygon' && g.type!=='MultiPolygon')) return
          const polys = Array.isArray(g.coordinates[0][0][0]) ? g.coordinates : [g.coordinates]
          polys.forEach(poly=>poly.forEach(r=>r.forEach(([lon,lat])=>{
            const [x,y]=project(lon,lat); xs.push(x); ys.push(y)
          })))
        })
        const minX=Math.min(...xs), maxX=Math.max(...xs)
        const minY=Math.min(...ys), maxY=Math.max(...ys)
        const pad=20, W=900, H=650
        const scale = Math.min((W-2*pad)/(maxX-minX||1),(H-2*pad)/(maxY-minY||1))
        const tx=pad+(-minX)*scale, ty=pad+(maxY)*scale

        // Dibujo
        const svg = svgRef.current
        if(!svg) return
        while(svg.firstChild) svg.removeChild(svg.firstChild)

        let matched=0
        geo.features.forEach(f=>{
          const g=f.geometry; if(!g|| (g.type!=='Polygon' && g.type!=='MultiPolygon')) return
          const p=f.properties||{}
          const rawName = (p.NAME_2 || p.name || p.provincia || p.Provname || p.PROVINCIA || p.NAMEUNIT || p.title || p.id || 'Provincia')
          const info = mapCSV.get(normalize(rawName))
          if(info) matched++

          const el=document.createElementNS('http://www.w3.org/2000/svg','path')
          el.setAttribute('d', pathFrom(g.coordinates, scale, tx, ty))
          el.setAttribute('fill', colorBy(info?.cat))
          el.setAttribute('stroke','rgba(0,0,0,.15)')
          el.setAttribute('stroke-width','0.6')
          el.style.cursor='pointer'
          el.setAttribute('tabindex','0')
          el.setAttribute('role','button')
          el.setAttribute('aria-label', rawName)

          const select = ()=> onSelect({
            prov: rawName, cat: info?.cat || 'neutro',
            doc: info?.doc || '', org: info?.org || '',
            vig: info?.vig || '', notas: info?.notas || '', link: info?.link || ''
          })

          el.addEventListener('mouseenter', ()=> setHover({prov:rawName, cat:info?.cat||'neutro', doc:info?.doc||''}))
          el.addEventListener('mouseleave', ()=> setHover(null))
          el.addEventListener('click', select)
          el.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' ') select() })

          svg.appendChild(el)
        })

        if(cancelled) return
        setDiag({ geo: usedGeo, csv: usedCSV, paths: svg.childNodes.length, matched })
        setStatus('ok')
      }catch(e){
        console.error(e)
        if(!cancelled) setStatus('error')
      }
    }
    run()
    return ()=>{ cancelled=true }
  },[onSelect])

  return (
    <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <h3 style={{margin:0}}>Mapa de cédulas por provincia</h3>
        {hover && (
          <div style={{fontSize:14,color:'#0b1220'}}>
            <strong>{hover.prov}</strong> — {hover.cat==='si'?'Sí':hover.cat==='depende'?'Depende':'No'}{hover.doc?` · ${hover.doc}`:''}
          </div>
        )}
      </div>

      {status==='cargando' && <div style={{padding:'12px 0',color:'#64748b'}}>Cargando datos…</div>}
      {status==='error'    && <div style={{padding:'12px 0',color:'#b91c1c'}}>
        No se pudo renderizar el mapa. Revisa que existan <code>/assets/spain-provinces.geojson</code> y <code>/data/mapa_cedula_provincias.csv</code>.
      </div>}

      <svg ref={svgRef} viewBox="0 0 900 650" style={{width:'100%',height:'auto',display:'block',marginTop:8}} />

      <div style={{marginTop:10,fontSize:12,color:'#64748b'}}>
        Geo: <code>{diag.geo}</code> · CSV: <code>{diag.csv}</code> · Paths: {diag.paths||0} · Coincidencias: {diag.matched||0}
      </div>
    </div>
  )
}
