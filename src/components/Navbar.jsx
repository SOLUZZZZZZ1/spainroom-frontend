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
          <nav className="sr-tabs" aria-label="Navegación principal">
  <Link to="/" className="sr-tab">Inicio</Link>
  <Link to="/propietarios" className="sr-tab">Propietarios</Link>
  <Link to="/inquilinos" className="sr-tab">Inquilinos</Link>
  <Link to="/habitaciones" className="sr-tab">Habitaciones</Link>
  <Link to="/oportunidades" className="sr-tab">Oportunidades</Link>
  <Link to="/franquiciados" className="sr-tab">Franquiciados</Link>
  <Link to="/ayuda" className="sr-tab">Ayuda</Link>
</nav>
        </nav>
      </div>
      <div className="sr-navbar-underline" />
    </header>
  );
}
