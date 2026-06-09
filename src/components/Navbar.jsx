// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const currentPath =
    (location && location.pathname) ||
    window.location.pathname ||
    "/";

  const cleanPath = currentPath.replace(/\/+$/, "") || "/";

  const isActive = (path) => {
    if (path === "/") return cleanPath === "/";
    return cleanPath === path || cleanPath.startsWith(path + "/");
  };

  const normalButton = {
    background: "rgba(255,255,255,.16)",
    color: "#ffffff",
    fontWeight: 800,
    padding: "8px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,.38)",
    boxShadow: "0 3px 8px rgba(0,0,0,.14)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1.1,
  };

  const activeButton = {
    background: "#ffffff",
    color: "#0b69c7",
    fontWeight: 950,
    padding: "8px 14px",
    borderRadius: "12px",
    border: "2px solid #ffffff",
    boxShadow: "0 0 16px rgba(255,255,255,.75), 0 5px 12px rgba(0,0,0,.24), inset 0 2px 4px rgba(0,0,0,.10)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1.1,
    transform: "translateY(-1px)",
  };

  const tab = (path) => ({
    style: isActive(path) ? activeButton : normalButton,
    "aria-current": isActive(path) ? "page" : undefined,
  });

  return (
    <header className="sr-navbar">
      <div className="sr-row">
        <Link to="/" aria-label="SpainRoom" className="sr-brand">
          <img src="/cabecera.png" alt="SpainRoom" className="sr-logo" />
          <span className="sr-brand-title">
  SpainRoom
  <sup
    style={{
      fontSize: "0.65em",
      marginLeft: "2px",
      verticalAlign: "super",
      fontWeight: 700,
      color: "#ffffff",
    }}
  >
    ®
  </sup>
</span>
        </Link>

        <nav className="sr-tabs" aria-label="Navegación principal">
          <Link to="/" {...tab("/")}>Inicio</Link>
          <Link to="/propietarios" {...tab("/propietarios")}>Propietarios</Link>
          <Link to="/inquilinos" {...tab("/inquilinos")}>Inquilinos</Link>
          <Link to="/habitaciones" {...tab("/habitaciones")}>Habitaciones</Link>
          <Link to="/oportunidades" {...tab("/oportunidades")}>Oportunidades</Link>
          <Link to="/franquiciados" {...tab("/franquiciados")}>Franquiciados</Link>
          <Link to="/ayuda" {...tab("/ayuda")}>Ayuda</Link>
        </nav>
      </div>

      <div className="sr-navbar-underline" />
    </header>
  );
}
