import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import NoraChatLite from './components/NoraChatLite.jsx'

import InicioElegante from './pages/InicioElegante.jsx'
import Propietarios from './pages/Propietarios.jsx'
import Inquilinos from './pages/Inquilinos.jsx'
import Reservas from './pages/Reservas.jsx'
import ReservaOk from './pages/ReservaOk.jsx'
import ReservaError from './pages/ReservaError.jsx'
import Oportunidades from './pages/Oportunidades.jsx'
import FranquiciadosEmbed from './pages/FranquiciadosEmbed.jsx'
import PagosEmbed from './pages/PagosEmbed.jsx'
import AdminEmbed from './pages/AdminEmbed.jsx'

function NoraOnlyOnSelectedRoutes() {
  const { pathname } = useLocation()
  const showNora = pathname.startsWith('/propietarios')
                || pathname.startsWith('/inquilinos')
                || pathname.startsWith('/franquiciados')
  return showNora ? <NoraChatLite /> : null
}

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<InicioElegante/>} />
        <Route path="/propietarios" element={<Propietarios/>} />
        <Route path="/inquilinos" element={<Inquilinos/>} />
        <Route path="/jobs" element={<Navigate to="/inquilinos" replace />} />
        <Route path="/reservas" element={<Reservas/>} />
        <Route path="/reservas/ok" element={<ReservaOk/>} />
        <Route path="/reservas/error" element={<ReservaError/>} />
        <Route path="/oportunidades" element={<Oportunidades/>} />
        <Route path="/franquiciados" element={<FranquiciadosEmbed/>} />
        <Route path="/pagos" element={<PagosEmbed/>} />
        <Route path="/admin" element={<AdminEmbed/>} />
        <Route path="*" element={<InicioElegante/>} />
      </Routes>

      {/* SOS global */}
      <a className="sos-btn" href="tel:+34616232306" aria-label="Llamada SOS SpainRoom">SOS</a>

      {/* Nora sólo en rutas seleccionadas */}
      <NoraOnlyOnSelectedRoutes />
    </>
  )
}
