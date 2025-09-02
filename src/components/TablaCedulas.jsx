// src/components/TablaCedulas.jsx
import React, { useEffect, useMemo, useState } from 'react'

export default function TablaCedulas(){
  const [rows, setRows]   = useState([])
  const [error, setError] = useState('')
  const [q, setQ]         = useState('')
  const [fObl, setFObl]   = useState('') // '', 'si', 'depende', 'no'
  const [lastDate, setLastDate] = useState('')

  const normalize = (s='')=>{
    let x = String(s||'').trim().toLowerCase()
    x = x.normalize('NFD').replace(/\p{Diacritic}/gu,'')
    x = x.replace(/-/g,' ').replace(/\s+/g,' ')
    return x
  }

  useEffect(()=>{
    const run = async ()=>{
      try{
        setError('')
        // rompe caché 1min
        const bust = '?v=' + Math.floor(Date.now()/60000)
        const r = await fetch('/data/mapa_cedula_provincias.csv'+bust, {cache:'no-cache'})
        if(!r.ok) throw new Error('HTTP '+r.status)
        const text = (await r.text()).replace(/\r/g,'').trim()

        // delim
        const headLine = text.split('\n')[0] || ''
        const delim = headLine.includes(';') ? ';' : headLine.includes('\t') ? '\t' : ','
        const lines = text.split('\n').filter(Boolean)
        const head  = lines[0].split(delim)

        // localizar columnas (tolerante a nombres)
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
        const iLink = findCol(['enlace','link','url'], 9)
        const iDate = findCol(['fecha','verificacion','actualizacion'], -1)

        const out = []
        let bestDate = ''
        for(let i=1;i<lines.length;i++){
          const c = lines[i].split(delim)
          const prov   = c[iProv] || ''
          const oblRaw = String(c[iObl]||'').trim().toLowerCase()
          const doc    = c[iDoc]  || ''
          const org    = c[iOrg]  || ''
          const vig    = c[iVig]  || ''
          const notas  = c[iNotas]|| ''
          const link   = c[iLink] || ''
          const fecha  = iDate!=null && iDate>=0 ? (c[iDate]||'') : ''

          // normaliza categoría
          const n = normalize(oblRaw)
          let obligatorio = 'No'
          if (/^(si|sí)/.test(oblRaw)) obligatorio = 'Sí'
          else if (/^(dep|segun|según|variable|consultar)/.test(n)) obligatorio = 'Depende'
          else if (/^no\b|no obligatorio|no aplica|no requerido/.test(n)) obligatorio = 'No'

          out.push({provincia:prov, obligatorio, doc, org, vig, notas, link, fecha})
          if (fecha && (!bestDate || fecha > bestDate)) bestDate = fecha
        }
        setRows(out)
        setLastDate(bestDate)
      }catch(e){
        console.error(e); setError('No se pudo cargar /data/mapa_cedula_provincias.csv')
      }
    }
    run()
  },[])

  const filtered = useMemo(()=>{
    const nq = normalize(q)
    return rows.filter(r=>{
      const okObl = fObl ? normalize(r.obligatorio)===fObl : true
      const okQ   = nq ? (
        normalize(r.provincia).includes(nq) ||
        normalize(r.doc).includes(nq) ||
        normalize(r.org).includes(nq) ||
        normalize(r.vig).includes(nq) ||
        normalize(r.notas).includes(nq)
      ) : true
      return okObl && okQ
    })
  }, [rows, q, fObl])

  return (
    <div style={{marginTop:18, background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:16}}>
      <div style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between', flexWrap:'wrap'}}>
        <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
          <input
            value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar provincia, documento, organismo…"
            style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:10, minWidth:260}}/>
          <select value={fObl} onChange={e=>setFObl(e.target.value)}
            style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:10}}>
            <option value="">Obligatorio: Todos</option>
            <option value="si">Sí</option>
            <option value="depende">Depende</option>
            <option value="no">No</option>
          </select>
        </div>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          {lastDate && <span style={{fontSize:12, color:'#64748b'}}>Última actualización: {lastDate}</span>}
          <a href="/data/mapa_cedula_provincias.csv" target="_blank" rel="noopener noreferrer"
             style={{display:'inline-block', background:'#0A58CA', color:'#fff', padding:'10px 14px',
                     borderRadius:10, fontWeight:800, textDecoration:'none'}}>Descargar CSV</a>
        </div>
      </div>

      {error && <div style={{marginTop:10, color:'#b91c1c'}}>{error}</div>}

      <div style={{overflowX:'auto', marginTop:10}}>
        <table style={{borderCollapse:'collapse', width:'100%'}}>
          <thead>
            <tr>
              {['Provincia','¿Obligatorio?','Documento','Organismo','Vigencia','Notas','Enlace'].map((h,i)=>(
                <th key={i} style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e2e8f0', color:'#475569', fontWeight:800}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r,idx)=>(
              <tr key={idx} style={{borderBottom:'1px solid #eef2f7'}}>
                <td style={{padding:'10px'}}>{r.provincia}</td>
                <td style={{padding:'10px', fontWeight:800,
                  color: r.obligatorio==='Sí' ? '#b91c1c' : r.obligatorio==='Depende' ? '#b45309' : '#065f46'}}>
                  {r.obligatorio}
                </td>
                <td style={{padding:'10px'}}>{r.doc||'—'}</td>
                <td style={{padding:'10px'}}>{r.org||'—'}</td>
                <td style={{padding:'10px'}}>{r.vig||'—'}</td>
                <td style={{padding:'10px'}}>{r.notas||'—'}</td>
                <td style={{padding:'10px'}}>
                  {r.link ? <a href={r.link} target="_blank" rel="noopener noreferrer">Abrir</a> : <span style={{color:'#94a3b8'}}>—</span>}
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={7} style={{padding:'18px', color:'#64748b'}}>Sin resultados para los filtros actuales.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
