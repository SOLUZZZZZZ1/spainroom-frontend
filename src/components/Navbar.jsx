// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const activeStyle = {
    background: "linear-gradient(180deg, #ffffff 0%, #eaf3ff 100%)",
    color: "#0b69c7",
    fontWeight: 900,
    border: "2px solid #ffffff",
    borderRadius: "12px",
    boxShadow: "0 0 14px rgba(255,255,255,.65), 0 5px 12px rgba(0,0,0,.22)",
    transform: "translateY(-1px)",
  };

  const normalStyle = {
    color: "#ffffff",
  };

  const tabStyle = (path) => ({
    ...(isActive(path) ? activeStyle : normalStyle),
  });

  return (
    <header className="sr-navbar">
      <div className="sr-row">
        <Link to="/" aria-label="SpainRoom" className="sr-brand">
          <img src="/cabecera.png" alt="SpainRoom" className="sr-logo" />
          <span className="sr-brand-title">SpainRoom</span>
        </Link>

        <nav className="sr-tabs" aria-label="Navegación principal">
          <Link to="/" className="sr-tab" style={tabStyle("/")}>Inicio</Link>
          <Link to="/propietarios" className="sr-tab" style={tabStyle("/propietarios")}>Propietarios</Link>
          <Link to="/inquilinos" className="sr-tab" style={tabStyle("/inquilinos")}>Inquilinos</Link>
          <Link to="/habitaciones" className="sr-tab" style={tabStyle("/habitaciones")}>Habitaciones</Link>
          <Link to="/oportunidades" className="sr-tab" style={tabStyle("/oportunidades")}>Oportunidades</Link>
          <Link to="/franquiciados" className="sr-tab" style={tabStyle("/franquiciados")}>Franquiciados</Link>
          <Link to="/ayuda" className="sr-tab" style={tabStyle("/ayuda")}>Ayuda</Link>
        </nav>
      </div>
      <div className="sr-navbar-underline" />
    </header>
  );
}