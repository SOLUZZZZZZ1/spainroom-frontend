import React, { useState } from 'react'

export default function Reservas() {
  const [nombre, setNombre] = useState('')
  const [fecha, setFecha] = useState('')
  const [mensaje, setMensaje] = useState('')

  const reservar = () => {
    if (!nombre || !fecha) {
      alert('⚠️ Completa nombre y fecha para continuar.')
      return
    }
    setMensaje(`✅ Reserva realizada por ${nombre} para el ${fecha}`)
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20, fontFamily: 'system-ui' }}>
      <h1>Reservas</h1>
      <p style={{ color: '#555' }}>Solicita tu reserva en una vivienda SpainRoom.</p>

      <label style={{ display: 'grid', gap: 6, marginTop: 16 }}>
        <span>Nombre</span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
        />
      </label>

      <label style={{ display: 'grid', gap: 6, marginTop: 16 }}>
        <span>Fecha de entrada</span>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
        />
      </label>

      <button
        onClick={reservar}
        style={{
          marginTop: 20, padding: '10px 14px',
          background: '#0a58ca', color: '#fff',
          border: 'none', borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        Confirmar reserva
      </button>

      {mensaje && (
        <div style={{
          marginTop: 20, padding: 12,
          border: '1px solid #22c55e',
          background: '#ecfdf5', borderRadius: 8
        }}>
          {mensaje}
        </div>
      )}
    </div>
  )
}
