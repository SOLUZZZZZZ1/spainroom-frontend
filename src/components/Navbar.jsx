<<<<<<< HEAD
// componente simulado Navbar.jsx
=======
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo blanco (pared recta): coloca /public/logo-blanco.svg */}
        <NavLink to="/" className="brand" aria-label="Ir al inicio" onClick={close}>
          <img src="/logo-blanco.svg" alt="SpainRoom" className="brand-logo" />
          <span className="brand-text">SpainRoom</span>
        </NavLink>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menú">
          <span></span><span></span><span></span>
        </button>

        <div className={`nav-links ${open ? "open" : ""}`} onClick={close}>
          <NavLink to="/"            className="navbtn">Inicio</NavLink>
          <NavLink to="/listado"    className="navbtn">Listado</NavLink>
          <NavLink to="/jobs"       className="navbtn">Jobs</NavLink>
          <NavLink to="/reservas"   className="navbtn">Reservas</NavLink>
          <NavLink to="/oportunidades" className="navbtn">Oportunidades</NavLink>
          <NavLink to="/admin"      className="navbtn">Admin</NavLink>
          <NavLink to="/propietarios" className="navbtn">Propietarios</NavLink>
        </div>
      </div>
    </nav>
  );
}
>>>>>>> 780c84d (SpainRoom: actualizar App.jsx y VerificacionViviendaSR.jsx)
