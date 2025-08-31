import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar(){
  const linkClass = ({ isActive }) => 'sr-link' + (isActive ? ' active' : '')

  return (
    <>
      <header className="sr-navbar">
        <div className="sr-container sr-navbar-inner">
          <Link to="/" className="sr-brand">
            <img src="/cabecera.png" alt="SpainRoom" className="sr-logo" />
            <span className="sr-brand-title">SpainRoom</span>
          </Link>

          <nav className="sr-links">
            <NavLink to="/" end className={linkClass}>Inicio</NavLink>
            <NavLink to="/jobs" className={linkClass} end>Jobs</NavLink>
            <NavLink to="/reservas" className={linkClass} end>Reservas</NavLink>
            <NavLink to="/oportunidades" className={linkClass} end>Oportunidades</NavLink>
            <NavLink to="/propietarios" className={linkClass} end>Propietarios</NavLink>
            <NavLink to="/franquiciados" className={linkClass} end>Franquiciados</NavLink>
            <NavLink to="/pagos" className={linkClass} end>Pagos</NavLink>
            <NavLink to="/admin" className={linkClass} end>Admin</NavLink>
          </nav>
        </div>
      </header>

      {/* SOS flotante global */}
      <a className="sos-btn" href="tel:+34616232306" aria-label="Llamada SOS SpainRoom">SOS</a>
    </>
  )
}
