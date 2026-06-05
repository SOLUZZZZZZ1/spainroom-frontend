// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar(){
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const tabClass = (path) => "sr-tab" + (isActive(path) ? " sr-tab--active" : "");

  return (
    <header className="sr-navbar">
      <div className="sr-row">
        <Link to="/" aria-label="SpainRoom" className="sr-brand">
          <img src="/cabecera.png" alt="SpainRoom" className="sr-logo" />
          <span className="sr-brand-title">SpainRoom</span>
        </Link>

        <nav className="sr-tabs" aria-label="Navegación principal">
          <Link to="/" className={tabClass("/")}>Inicio</Link>
          <Link to="/propietarios" className={tabClass("/propietarios")}>Propietarios</Link>
          <Link to="/inquilinos" className={tabClass("/inquilinos")}>Inquilinos</Link>
          <Link to="/habitaciones" className={tabClass("/habitaciones")}>Habitaciones</Link>
          <Link to="/oportunidades" className={tabClass("/oportunidades")}>Oportunidades</Link>
          <Link to="/franquiciados" className={tabClass("/franquiciados")}>Franquiciados</Link>
          <Link to="/ayuda" className={tabClass("/ayuda")}>Ayuda</Link>
        </nav>
      </div>
      <div className="sr-navbar-underline" />
    </header>
  );
}