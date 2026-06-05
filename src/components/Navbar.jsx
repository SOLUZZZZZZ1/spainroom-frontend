// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Doble lectura de ruta para evitar problemas raros entre Vercel, navegador y React Router.
  const currentPath =
    (location && location.pathname) ||
    window.location.pathname ||
    "/";

  const cleanPath = currentPath.replace(/\/+$/, "") || "/";

  const isActive = (path) => {
    if (path === "/") return cleanPath === "/";
    return cleanPath === path || cleanPath.startsWith(path + "/");
  };

  const baseTabStyle = {
    background: "rgba(255,255,255,.14)",
    color: "#ffffff",
    fontWeight: 800,
    padding: "8px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,.35)",
    boxShadow: "0 3px 8px rgba(0,0,0,.12)",
  };

  const activeTabStyle = {
    background: "linear-gradient(180deg, #ffffff 0%, #eaf3ff 100%)",
    color: "#0b69c7",
    fontWeight: 950,
    padding: "8px 14px",
    borderRadius: "12px",
    border: "2px solid #ffffff",
    boxShadow:
      "0 0 16px rgba(255,255,255,.75), 0 5px 12px rgba(0,0,0,.24), inset 0 2px 4px rgba(0,0,0,.10)",
    transform: "translateY(-1px)",
  };

  const tabProps = (path) => ({
    className: isActive(path) ? "sr-tab sr-tab--active" : "sr-tab",
    style: isActive(path) ? activeTabStyle : baseTabStyle,
  });

  return (
    <header className="sr-navbar">
      <div className="sr-row">
        <Link to="/" aria-label="SpainRoom" className="sr-brand">
          <img src="/cabecera.png" alt="SpainRoom" className="sr-logo" />
          <span className="sr-brand-title">SpainRoom</span>
        </Link>

        <nav className="sr-tabs" aria-label="Navegación principal">
          <Link to="/" {...tabProps("/")}>Inicio</Link>
          <Link to="/propietarios" {...tabProps("/propietarios")}>Propietarios</Link>
          <Link to="/inquilinos" {...tabProps("/inquilinos")}>Inquilinos</Link>
          <Link to="/habitaciones" {...tabProps("/habitaciones")}>Habitaciones</Link>
          <Link to="/oportunidades" {...tabProps("/oportunidades")}>Oportunidades</Link>
          <Link to="/franquiciados" {...tabProps("/franquiciados")}>Franquiciados</Link>
          <Link to="/ayuda" {...tabProps("/ayuda")}>Ayuda</Link>
        </nav>
      </div>

      <div className="sr-navbar-underline" />
    </header>
  );
}
