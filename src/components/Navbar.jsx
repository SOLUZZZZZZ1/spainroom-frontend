// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const tabClass = ({ isActive }) => "sr-tab" + (isActive ? " active" : "");

  return (
    <header className="sr-navbar">
      <div className="sr-row">
        {/* Marca: logo pequeño blanco */}
        <Link to="/" aria-label="SpainRoom" className="sr-brand">
          <img src="/cabecera.png" alt="SpainRoom" className="sr-logo" />
          <span className="sr-brand-title">SpainRoom</span>
        </Link>

        {/* Pestañas */}
        <nav className="sr-tabs" aria-label="Navegación principal">
          <NavLink to="/" end className={tabClass}>Inicio</NavLink>
          <NavLink to="/propietarios"   end className={tabClass}>Propietarios</NavLink>
          <NavLink to="/inquilinos"     end className={tabClass}>Inquilinos</NavLink>
          <NavLink to="/habitaciones"   end className={tabClass}>Habitaciones</NavLink>
          <NavLink to="/oportunidades"  end className={tabClass}>Oportunidades</NavLink>
          <NavLink to="/franquiciados"  end className={tabClass}>Franquiciados</NavLink>
          <NavLink to="/reservas"       end className={tabClass}>Reservas</NavLink>
          <NavLink to="/admin"          end className={tabClass}>Admin</NavLink>
        </nav>
      </div>
      <div className="sr-navbar-underline" />
    </header>
  );
}
