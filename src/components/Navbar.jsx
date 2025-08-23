import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";
import LogoSpainRoom from "./LogoSpainRoom.jsx";

export default function Navbar() {
  const [useFallbackLogo, setUseFallbackLogo] = useState(false);
  const linkClass = ({ isActive }) => `sr-link${isActive ? " active" : ""}`;

  return (
    <header className="sr-navbar">
      <div className="sr-navbar__container">
        <Link to="/" className="sr-navbar__brand" aria-label="SpainRoom - Inicio">
          {!useFallbackLogo ? (
            <img
              src="/logo.png"
              alt="SpainRoom"
              className="sr-navbar__logo"
              width="100"
              height="auto"
              onError={() => setUseFallbackLogo(true)}
            />
          ) : (
            <LogoSpainRoom className="sr-navbar__logo" size={88} />
          )}
        </Link>

        <nav className="sr-navbar__nav" aria-label="Navegación principal">
          <NavLink to="/" end className={linkClass}>
            Inicio
          </NavLink>
          <NavLink to="/listado" className={linkClass}>
            Listado
          </NavLink>
          <NavLink to="/jobs" className={linkClass}>
            Jobs
          </NavLink>
          <NavLink to="/reservas" className={linkClass}>
            Reservas
          </NavLink>
          <NavLink to="/propietarios" className={linkClass}>
            Propietarios
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
          <NavLink to="/oportunidades" className={linkClass}>
            Oportunidades
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
