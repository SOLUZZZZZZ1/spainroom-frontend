// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar(){
  const tab = ({ isActive }) =>
  isActive
    ? "sr-tab active"
    : "sr-tab";

  return (
    <header className="sr-navbar">
      <div className="sr-row">
        <Link to="/" aria-label="SpainRoom" className="sr-brand">
          <img src="/cabecera.png" alt="SpainRoom" className="sr-logo" />
          <span className="sr-brand-title">SpainRoom</span>
        </Link>
        <nav className="sr-tabs" aria-label="Navegación principal">
          <NavLink
  to="/"
  end
  className={tab}
  style={({ isActive }) => ({
    background: isActive ? "#ffffff" : "transparent",
    color: isActive ? "#0b69c7" : "#ffffff",
    fontWeight: 900,
    borderRadius: "8px",
    padding: "8px 12px"
  })}
>
  INICIO
</NavLink>
          <NavLink to="/propietarios"  className={tab}>Propietarios</NavLink>
          <NavLink to="/inquilinos"    className={tab}>Inquilinos</NavLink>
          <NavLink to="/habitaciones"  className={tab}>Habitaciones</NavLink>
          <NavLink to="/oportunidades" className={tab}>Oportunidades</NavLink>
          <NavLink to="/franquiciados" className={tab}>Franquiciados</NavLink>
          <NavLink to="/ayuda"         className={tab}>Ayuda</NavLink>
          {/* Sin enlace público a /admin y sin “Mi Franquicia” aquí */}
        </nav>
      </div>
      <div className="sr-navbar-underline" />
    </header>
  );
}
