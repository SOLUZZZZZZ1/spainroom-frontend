import React from 'react'
import { useParams, Link } from 'react-router-dom'
import data from '../data/habitaciones.json'
import CardSpainRoom from '../components/CardSpainRoom.jsx'

export default function HabitacionDetalle() {
  const { id } = useParams()
  const hab = data.find(h => String(h.id) === String(id))

  if (!hab) {
    return (
      <section className="page">
        <p>No se encontrÃ³ la habitaciÃ³n.</p>
        <Link to="/listado" className="btn">Volver al listado</Link>
      </section>
    )
  }

  return (
    <section className="page">
      <Link to="/listado" className="btn" style={{marginBottom: 12}}>â† Volver</Link>
      <div className="detalle">
        <div className="detalle-galeria">
          {hab.imagenes.map((src, idx) => (
            <img key={idx} src={src} alt={hab.titulo + ' ' + (idx+1)} />
          ))}
        </div>
        <CardSpainRoom title={hab.titulo} footer={`${hab.zona} Â· ${hab.precio} â‚¬ / mes`}>
          <p>{hab.descripcion}</p>
          <ul className="specs">
            <li><strong>Metros:</strong> {hab.metros} mÂ²</li>
            <li><strong>BaÃ±o privado:</strong> {hab.banho_privado ? 'SÃ­' : 'No'}</li>
          </ul>
          <button className="btn">Solicitar reserva</button>
        </CardSpainRoom>
      </div>
    </section>
  )
}


