import React, { useMemo, useState } from 'react'
import HABITACIONES from '../data/habitaciones.json'

export default function Listado() {
  const [q, setQ] = useState('')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')

  const filtered = useMemo(() =>
    HABITACIONES.filter(r => {
      const txt = q.toLowerCase()
      const byText = q
        ? (r.titulo?.toLowerCase().includes(txt) || r.zona?.toLowerCase().includes(txt))
        : true
      const byMin  = min ? Number(r.precio) >= Number(min) : true
      const byMax  = max ? Number(r.precio) <= Number(max) : true
      return byText && byMin && byMax
    })
  , [q, min, max])

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 20, fontFamily: 'system-ui' }}>
      <h1>Listado de habitaciones</h1>

      {/* Filtros */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr 1fr', marginTop: 12 }}>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Buscar por título o zona…"
          style={{ padding:'10px 12px', borderRadius: 8, border:'1px solid #d0d7de' }}
        />
        <input
          value={min}
          onChange={e=>setMin(e.target.value)}
          type="number"
          min="0"
          placeholder="€ mínimo"
          style={{ padding:'10px 12px', borderRadius: 8, border:'1px solid #d0d7de' }}
        />
        <input
          value={max}
          onChange={e=>setMax(e.target.value)}
          type="number"
          min="0"
          placeholder="€ máximo"
          style={{ padding:'10px 12px', borderRadius: 8, border:'1px solid #d0d7de' }}
        />
      </div>

      {/* Grid de tarjetas */}
      <div style={{
        display:'grid',
        gap:16,
        gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
        marginTop: 20
      }}>
        {filtered.map(r => (
          <article key={r.id} style={{
            border:'1px solid #e5e7eb',
            borderRadius:12,
            overflow:'hidden',
            background:'#fff'
          }}>
            {/* Imagen con fallback */}
            <img
              src={r.imagenes?.[0] || '/casa-diseno.jpg'}
              alt={r.titulo}
              style={{ width:'100%', height:160, objectFit:'cover', display:'block' }}
              onError={(e) => { e.currentTarget.src = '/casa-diseno.jpg' }}
            />
            <div style={{ padding:12 }}>
              <h3 style={{ margin:'0 0 6px' }}>{r.titulo}</h3>
              <div style={{ color:'#555', fontSize:14 }}>
                {r.zona} · {r.metros} m² {r.banho_privado ? '· Baño privado' : ''}
              </div>
              <p style={{ margin:'8px 0', fontSize:14, lineHeight:1.4 }}>{r.descripcion}</p>
              <div style={{ marginTop:8, fontWeight:700 }}>{r.precio} €/mes</div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div style={{
            gridColumn:'1 / -1',
            padding:20,
            border:'1px solid #e5e7eb',
            borderRadius:12,
            background:'#f9fafb'
          }}>
            No hay resultados con esos filtros.
          </div>
        )}
      </div>
    </div>
  )
}
