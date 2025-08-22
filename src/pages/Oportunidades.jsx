import React, { useState } from 'react'

export default function Oportunidades() {
  const [contacto, setContacto] = useState('')
  const [mensaje, setMensaje] = useState('')

  const enviar = () => {
    if (!contacto) {
      alert('⚠️ Introduce tu email o teléfono.')
      return
    }
    setMensaje(`✅ Gracias, nos pondremos en contacto contigo en ${contacto}`)
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20, fontFamily: 'system-ui' }}>
      <h1>Oportunidades</h1>
      <p style={{ color: '#555' }}>
        Ofertas para inmobiliarias, habitaciones en promoción y opciones de inversión en SpainRoom.
      </p>

      <ul style={{ marginTop: 16, paddingLeft: 20 }}>
        <li>🏘️ Colaboraciones con inmobiliarias tradicionales</li>
        <li>💶 Promociones especiales en habitaciones</li>
        <li>📈 Posibilidades de inversión en SpainRoom</li>
      </ul>

      <div style={{ marginTop: 24, padding: 16, border: '1px solid #d0d7de', borderRadius: 12 }}>
        <h2>📩 Contacto</h2>
        <input
          type="text"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
          placeholder="Tu email o teléfono"
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', width: '100%', marginBottom: 12 }}
        />
        <button
          onClick={enviar}
          style={{
            padding: '10px 14px',
            background: '#0a58ca', color: '#fff',
            border: 'none', borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Enviar
        </button>

        {mensaje && (
          <div style={{
            marginTop: 12, padding: 12,
            border: '1px solid #22c55e',
            background: '#ecfdf5', borderRadius: 8
          }}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  )
}
