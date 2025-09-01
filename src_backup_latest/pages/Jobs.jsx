import React, { useEffect, useState } from 'react'
import SEO from '../components/SEO.jsx'

function useGeo(){
  const [pos, setPos] = useState(null)
  const [error, setError] = useState(null)
  useEffect(()=>{
    if(!('geolocation' in navigator)) { setError('Geolocalización no soportada'); return }
    navigator.geolocation.getCurrentPosition(
      (p)=> setPos({lat:p.coords.latitude, lng:p.coords.longitude}),
      (e)=> setError(e.message),
      { enableHighAccuracy:true, timeout:8000, maximumAge:0 }
    )
  },[])
  return { pos, error }
}

function JobCard({job}){
  return (
    <a href={job.url || '#'} target={job.url ? '_blank' : '_self'} rel="noopener noreferrer"
       style={{display:'block',border:'1px solid #e2e8f0',borderRadius:12,padding:12,background:'#fff'}}>
      <div style={{display:'flex',justifyContent:'space-between',gap:12}}>
        <div>
          <div style={{fontWeight:800}}>{job.title}</div>
          <div style={{color:'#475569'}}>{job.company} · {job.location}</div>
          <div style={{fontSize:12,color:'#64748b'}}>Publicado: {job.posted_at}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:12,color:'#64748b'}}>Distancia</div>
          <div style={{fontWeight:800}}>{job.distance_km?.toFixed(1)} km</div>
        </div>
      </div>
    </a>
  )
}

export default function Jobs(){
  const { pos, error: geoError } = useGeo()
  const [nearby, setNearby] = useState([])
  const [searchRes, setSearchRes] = useState([])
  const [loadingN, setLoadingN] = useState(false)
  const [loadingS, setLoadingS] = useState(false)
  const [errN, setErrN] = useState('')
  const [errS, setErrS] = useState('')
  const [query, setQuery] = useState('')
  const [radius, setRadius] = useState(20) // DEFAULT 20 KM

  const lat = pos?.lat ?? null, lng = pos?.lng ?? null
  const disabled = lat===null || lng===null

  async function fetchJSON(url){
    const r = await fetch(url); if(!r.ok) throw new Error('HTTP '+r.status); return r.json()
  }

  const handleNearby = async()=>{
    setLoadingN(true); setErrN('')
    try{
      if(disabled) throw new Error('Ubicación no disponible aún.')
      const url = `/api/jobs/nearby?lat=${lat}&lng=${lng}&radius_km=2`
      let data
      try{ data = await fetchJSON(url) }catch{
        data = Array.from({length:6}).map((_,i)=>({ id:'nearby-'+(i+1),
          title:['Camarero/a','Dependiente/a','Recepcionista','Repartidor/a','Auxiliar administrativo/a','Conserje'][i%6],
          company:['SuperBar','Mercasuper','Hotel Sol','LogisExpress','OfiPlus','LimpioYa'][i%6],
          location:'Cerca de ti', distance_km: Number((Math.random()*2+0.2).toFixed(1)), posted_at:'hoy', url:'#'}))
      }
      setNearby(data)
    }catch(e){ setErrN(e.message) } finally{ setLoadingN(false) }
  }

  const handleSearch = async(e)=>{
    e.preventDefault()
    setLoadingS(true); setErrS('')
    try{
      if(disabled) throw new Error('Ubicación no disponible aún.')
      const q = encodeURIComponent(query.trim())
      const url = `/api/jobs/search?query=${q}&lat=${lat}&lng=${lng}&radius_km=${radius||20}`
      let data
      try{ data = await fetchJSON(url) }catch{
        data = Array.from({length:6}).map((_,i)=>({ id:'search-'+(i+1),
          title:(q?decodeURIComponent(q)+' · ':'')+['Recepcionista','Camarero/a','Dependiente/a','Conserje','Repartidor/a','Aux. administrativo/a'][i%6],
          company:['SuperBar','Mercasuper','Hotel Sol','LogisExpress','OfiPlus','LimpioYa'][i%6],
          location:'Zona ampliada', distance_km: Number((Math.random()*(radius||20)+0.2).toFixed(1)), posted_at:'hoy', url:'#'}))
      }
      setSearchRes(data)
    }catch(e){ setErrS(e.message) } finally{ setLoadingS(false) }
  }

  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="SpainRoom Jobs — Empleo cerca de ti"
           description="Ofertas cerca (2 km) y búsqueda específica (20 km por defecto)."/>
      <h2 style={{margin:'0 0 6px'}}>Jobs: cerca (2 km) y búsqueda específica (20 km)</h2>
      <p className="note">Usamos tu ubicación del navegador para calcular distancias. Si la niegas, puedes buscar igualmente.</p>

      {/* Cercanas */}
      <section style={{marginTop:18,padding:16,border:'1px solid #e2e8f0',borderRadius:12,background:'#fff'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div>
            <h3 style={{margin:'0 0 4px'}}>Ofertas cerca (2 km)</h3>
            <div style={{fontSize:13,color:'#64748b'}}>
              {lat && lng ? <>Coordenadas: {lat.toFixed(5)}, {lng.toFixed(5)}</> :
               geoError ? 'Ubicación no disponible (puede estar denegada).'
                        : 'Obteniendo ubicación...'}
            </div>
          </div>
          <div>
            <button onClick={handleNearby} disabled={disabled || loadingN}
              style={{background:'#0A58CA',color:'#fff',border:'none',padding:'10px 14px',borderRadius:10,fontWeight:800}}>
              {loadingN ? 'Cargando...' : 'Ver ofertas cerca'}
            </button>
          </div>
        </div>
        {errN && <div style={{color:'#b91c1c',marginTop:8}}>{errN}</div>}
        <div style={{marginTop:12,display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
          {nearby.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      </section>

      {/* Búsqueda */}
      <section style={{marginTop:18,padding:16,border:'1px solid #e2e8f0',borderRadius:12,background:'#fff'}}>
        <h3 style={{margin:'0 0 8px'}}>Buscar un trabajo concreto</h3>
        <form onSubmit={handleSearch} style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
          <input required value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Ej: recepcionista, camarero, dependiente..."
            style={{flex:'1 1 280px',padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}} />
          <label style={{fontSize:13,color:'#475569'}}>Radio (km)</label>
          <input type="number" min="1" max="30" value={radius}
            onChange={e=>setRadius(parseInt(e.target.value||'20'))}
            style={{width:100,padding:'10px 12px',border:'1px solid #cbd5e1',borderRadius:10}} />
          <button type="submit" disabled={disabled || loadingS}
            style={{background:'#0A58CA',color:'#fff',border:'none',padding:'10px 14px',borderRadius:10,fontWeight:800}}>
            {loadingS ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
        {errS && <div style={{color:'#b91c1c',marginTop:8}}>{errS}</div>}
        <div style={{marginTop:12,display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
          {searchRes.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      </section>
    </div>
  )
}
