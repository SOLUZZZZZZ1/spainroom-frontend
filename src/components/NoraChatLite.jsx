import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar(){
  const RAW_PHONE = (import.meta.env.VITE_SUPPORT_PHONE || '+34616232306').replace(/\s+/g,'')
  const PHONE_DISPLAY = '+34 616 23 23 06'

  const linkClass = ({ isActive }) => 'sr-link' + (isActive ? ' active' : '')
  const openNora = () => { try { window.dispatchEvent(new Event('open-nora')) } catch {} }

  const openWA = (e) => {
    try {
      e.preventDefault()
      window.open(WA, '_blank', 'noopener')
    } catch {
      // fallback si el navegador bloquea window.open
      location.href = WA
    }
  }

  return (
    <>
      {/* TOP CONTACT BAR */}
      <div className="sr-topbar">
        <div className="sr-container sr-topbar-inner">
          <div className="sr-topbar-left" style={{gap:12, display:'flex', alignItems:'center'}}>
            <a className="sr-toplink" href={`tel:${RAW_PHONE}`} aria-label="Llamar">
              <span role="img" aria-hidden>ðŸ“ž</span>
              <span className="sr-toplink-text">{PHONE_DISPLAY}</span>
            </a>
            {/* WhatsApp: forzar nueva pestaÃ±a siempre */}
            <a className="sr-toplink" href={WA} onClick={openWA} aria-label="WhatsApp" rel="noopener noreferrer">
              <span role="img" aria-hidden>ðŸŸ¢</span>
              <span className="sr-toplink-text">WhatsApp</span>
            </a>
          </div>
          <div className="sr-topbar-right">
            <button className="sr-nora-btn" onClick={openNora} aria-label="Abrir Nora">
              <span className="sr-nora-dot" /> Nora
            </button>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sr-navbar">
        <div className="sr-container sr-navbar-inner">
          <Link to="/" className="sr-brand">
            <img src="/cabecera.png" alt="SpainRoom" className="sr-logo-nav" />
            <span className="sr-brand-title">SpainRoom</span>
          </Link>
          <nav className="sr-links">
            <NavLink to="/" end className={linkClass}>Inicio</NavLink>
            <NavLink to="/propietarios" className={linkClass} end>Propietarios</NavLink>
            <NavLink to="/inquilinos" className={linkClass} end>Inquilinos</NavLink>
            <NavLink to="/reservas" className={linkClass} end>Reservas</NavLink>
            <NavLink to="/oportunidades" className={linkClass} end>Oportunidades</NavLink>
            <NavLink to="/franquiciados" className={linkClass} end>Franquiciados</NavLink>
            <NavLink to="/pagos" className={linkClass} end>Pagos</NavLink>
            <NavLink to="/admin" className={linkClass} end>Admin</NavLink>
          </nav>
        </div>
      </header>
    </>
  )
}