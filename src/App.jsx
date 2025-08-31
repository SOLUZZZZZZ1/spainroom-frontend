import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

import InicioElegante from './pages/InicioElegante.jsx'
import Jobs from './pages/Jobs.jsx'
import Reservas from './pages/Reservas.jsx'
import Oportunidades from './pages/Oportunidades.jsx'
import Propietarios from './pages/Propietarios.jsx'
import FranquiciadosEmbed from './pages/FranquiciadosEmbed.jsx'
import PagosEmbed from './pages/PagosEmbed.jsx'
import AdminEmbed from './pages/AdminEmbed.jsx'

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<InicioElegante/>} />
        <Route path="/jobs" element={<Jobs/>} />
        <Route path="/reservas" element={<Reservas/>} />
        <Route path="/oportunidades" element={<Oportunidades/>} />
        <Route path="/propietarios" element={<Propietarios/>} />
        <Route path="/franquiciados" element={<FranquiciadosEmbed/>} />
        <Route path="/pagos" element={<PagosEmbed/>} />
        <Route path="/admin" element={<AdminEmbed/>} />
        <Route path="*" element={<InicioElegante/>} />
      </Routes>

      {/* SOS global */}
      <a className="sos-btn" href="tel:+34616232306" aria-label="Llamada SOS SpainRoom">SOS</a>
    </>
  )
}
