// src/components/Navbar.jsx
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar(){
  // Teléfono desde ENV con fallback (formateo amigable)
  const RAW_PHONE = (import.meta.env.VITE_SUPPORT_PHONE || '+34616232306').replace(/\s+/g,'')
  const formatPhone = (raw) => {
    try{
      const digits = raw.replace(/[^\d]/g,'')
      // Si viene con +34 y 9 dígitos: +34 616 23 23 06
      if (raw.startsWith('+34') && digits.length >= 11){
        const n = digits.slice(2) // sin 34
        return `+34 ${n.slice(0,3)} ${n.slice(3,5)} ${n.slice(5,7)} ${n.slice(7,9)}`
      }
      // Si trae + internacional, déjalo como está
      if (raw.startsWith('+')) return raw
      // Fallback
      return '+34 616 23 23 06'
    }catch{ return '+34 616 23 23 06' }
  }
  const PHONE_DISPLAY = formatPhone(RAW_PHONE)

  // Link de WhatsApp (si no trae prefijo, lo normalizamos a 34)
  const WA = (() => {
    const digits = RAW_PHONE.replace(/[^\d]/g,'')
    const withCC  = digits.startsWith('34') ? digits : `34${digits}`
    return 'https://wa.me/' + withCC
  })()

  // Clases de navegación (activa/inactiva)
  const linkClass = ({ isActive }) => 'sr-link' + (isActive ? ' active' : '')

  // Abrir Nora (burbuja) desde la barra superior
  const openNora = () => {
    try { window.dispatchEvent(new Event('open-nora')) } catch {}
  }

  // Forzar WhatsApp a nueva pestaña
  const openWA = (e) => {
    try {
      e.preventDefault()
      window.open(WA, '_blank', 'noopener')
    } catch {
      // Fallback por si el navegador bloquea window.open
      location.href = WA
    }
  }

  return (
    <>
      {/* ======= TOP CONTACT BAR ======= */}
      <div className="sr-topbar">
        <div className="sr-container sr-topbar-inner">
          <div className="sr-topbar-left" style={{display:'flex',alignItems:'center',gap:12}}>
            <a className="sr-toplink" href={`tel:${RAW_PHONE}`} aria-label="Llamar por teléfono">
              <span role="img" aria-hidden>📞</span>
              <span className="sr-toplink-text">{PHONE_DISPLAY}</span>
            </a>

            {/* WhatsApp: SIEMPRE nueva pestaña */}
            <a className="sr-toplink" href={WA} onClick={openWA} aria-label="WhatsApp" rel="noopener noreferrer">
              <span role="img" aria-hidden>🟢</span>
              <span className="sr-toplink-text">WhatsApp</span>
            </a>
          </div>

          <div className="sr-topbar-right" style={{display:'flex',alignItems:'center',gap:10}}>
            <button className="sr-nora-btn" onClick={openNora} aria-label="Abrir Nora">
              <span className="sr-nora-dot" /> Nora
            </button>
          </div>
        </div>
      </div>

      {/* ======= NAVBAR ======= */}
      <header className="sr-navbar">
        <div className="sr-container sr-navbar-inner">
          <Link to="/" className="sr-brand" aria-label="SpainRoom inicio">
            {/* Logo pequeño controlado por CSS: .sr-logo-nav */}
            <img src="/cabecera.png" alt="SpainRoom" className="sr-logo-nav" />
            <span className="sr-brand-title">SpainRoom</span>
          </Link>

          <nav className="sr-links" aria-label="Navegación principal">
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
