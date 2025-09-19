// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  // Clases de enlace activo/inactivo
  const linkClass = ({ isActive }) => "sr-link" + (isActive ? " active" : "");

  return (
    <>
      {/* ======= NAVBAR ======= */}
      <header className="sr-navbar">
        <div className="sr-container sr-navbar-inner">
          {/* Marca: logo blanco + texto blanco "SpainRoom" */}
          <Link to="/" className="sr-brand" aria-label="SpainRoom inicio">
            <img
              src="/cabecera.png"             // <= TU LOGO BUENO en public/cabecera.png
              alt="SpainRoom"
              className="sr-logo-nav"          // alto limitado por CSS
            />
            <span className="sr-brand-title" style={{ color: "#fff" }}>
              SpainRoom
            </span>
          </Link>

          {/* Navegación principal */}
          <nav className="sr-links" aria-label="Navegación principal">
            <NavLink to="/" end className={linkClass}>Inicio</NavLink>
            <NavLink to="/propietarios" className={linkClass} end>Propietarios</NavLink>
            <NavLink to="/inquilinos" className={linkClass} end>Inquilinos</NavLink>
            <NavLink to="/reservas" className={linkClass} end>Reservas</NavLink>
            <NavLink to="/oportunidades" className={linkClass} end>Oportunidades</NavLink>
            <NavLink to="/franquiciados" className={linkClass} end>Franquiciados</NavLink>
            <NavLink to="/admin" className={linkClass} end>Admin</NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}
