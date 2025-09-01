// ==============================
// FILE: src/components/Navbar.jsx  (COMPLETO)
// ==============================
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar(){
  const linkClass = ({ isActive }) => 'sr-link' + (isActive ? ' active' : '')

  return (
    <header className="sr-navbar">
      <div className="sr-container sr-navbar-inner">
        <Link to="/" className="sr-brand">
          {/* LOGO DE CABECERA (pequeño, controlado) */}
          <img src="/cabecera.png" alt="SpainRoom" className="sr-logo-nav" />
          <span className="sr-brand-title">SpainRoom</span>
        </Link>

        <nav className="sr-links">
          <NavLink to="/" end className={linkClass}>Inicio</NavLink>
          <NavLink to="/propietarios" className={linkClass} end>Propietarios</NavLink>
          <NavLink to="/jobs" className={linkClass} end>Jobs</NavLink>
          <NavLink to="/reservas" className={linkClass} end>Reservas</NavLink>
          <NavLink to="/oportunidades" className={linkClass} end>Oportunidades</NavLink>
          <NavLink to="/franquiciados" className={linkClass} end>Franquiciados</NavLink>
          <NavLink to="/pagos" className={linkClass} end>Pagos</NavLink>
          <NavLink to="/admin" className={linkClass} end>Admin</NavLink>
        </nav>
      </div>
    </header>
  )
}
