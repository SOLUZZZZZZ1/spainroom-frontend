import { NavLink, Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <header className="sr-navbar">
      <div className="sr-navbar__container">
        <Link to="/" className="sr-navbar__brand" aria-label="SpainRoom - Inicio">
          <img
            src="/logo.png"
            alt="SpainRoom"
            className="sr-navbar__logo"
            width="100"
            height="auto"
          />
        </Link>

        <nav className="sr-navbar__nav" aria-label="Navegación principal">
          <NavLink to="/" end className="sr-link">
            Inicio
          </NavLink>
          <NavLink to="/listado" className="sr-link">
            Listado
          </NavLink>
          <NavLink to="/jobs" className="sr-link">
            Jobs
          </NavLink>
          <NavLink to="/reservas" className="sr-link">
            Reservas
          </NavLink>
          <NavLink to="/admin" className="sr-link">
            Admin
          </NavLink>
          <NavLink to="/oportunidades" className="sr-link">
            Oportunidades
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
