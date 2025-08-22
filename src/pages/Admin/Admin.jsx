import React, { useState } from 'react'

export default function Admin() {
  const [solicitudes, setSolicitudes] = useState([
    { id: 1, nombre: 'Juan Pérez', tipo: 'Reserva', estado: 'Pendiente' },
    { id: 2, nombre: 'Inmobiliaria López', tipo: 'Colaboración', estado: 'Pendiente' }
  ])

  const actualizarEstado = (id, nuevoEstado) => {
    setSolicitudes(prev =>
      prev.map(s => (s.id === id ? { ...s, estado: nuevoEstado } : s))
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 20, fontFamily: 'system-ui' }}>
      <h1>Panel de Administración</h1>
      <p style={{ color: '#555' }}>Gestión interna de SpainRoom: solicitudes y colaboradores.</p>

      <table style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>ID</th>
            <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Nombre</th>
            <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Tipo</th>
            <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Estado</th>
            <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map(s => (
            <tr key={s.id}>
              <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{s.id}</td>
              <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{s.nombre}</td>
              <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{s.tipo}</td>
              <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{s.estado}</td>
              <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>
                {s.estado === 'Pendiente' ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => actualizarEstado(s.id, 'Aprobado')}
                      style={{ padding: '6px 10px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                      ✅ Aprobar
                    </button>
                    <button
                      onClick={() => actualizarEstado(s.id, 'Rechazado')}
                      style={{ padding: '6px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                ) : (
                  <span style={{ fontWeight: 600 }}>
                    {s.estado === 'Aprobado' ? '✅ Aprobado' : '❌ Rechazado'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
