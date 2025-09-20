import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  // clase activa/inactiva para las pestañas
  const tabClass = ({ isActive }) => "sr-tab" + (isActive ? " active" : "");

  return (
    <header className="sr-navbar">
      <div className="sr-row">
        {/* Marca: logo blanco y, si quieres, texto al lado */}
        <Link to="/" aria-label="SpainRoom" className="sr-brand">
          <img
            src="/cabecera.png"        /* C:\spainroom\frontend\public\cabecera.png */
            alt="SpainRoom"
            className="sr-logo"        /* tamaño controlado por CSS */
          />
          <span className="sr-brand-title">SpainRoom</span>
        </Link>

        {/* Navegación principal */}
        <nav className="sr-tabs" aria-label="Navegación principal">
          <NavLink to="/" end className={tabClass}>Inicio</NavLink>
          <NavLink to="/propietarios"   end className={tabClass}>Propietarios</NavLink>
          <NavLink to="/inquilinos"     end className={tabClass}>Inquilinos</NavLink>
          <NavLink to="/oportunidades"  end className={tabClass}>Oportunidades</NavLink>
          <NavLink to="/franquiciados"  end className={tabClass}>Franquiciados</NavLink>
          <NavLink to="/admin"          end className={tabClass}>Admin</NavLink>
        </nav>
      </div>
      {/* subrayado azul oscuro fino */}
      <div className="sr-navbar-underline" />
    </header>
  );
}
