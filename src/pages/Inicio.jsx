// src/pages/Inicio.jsx
import React from "react";
import SOSButton from "../components/SOSButton.jsx";
import "../styles/inicio.css";

export default function Inicio() {
  return (
    <main className="sr-inicio">
      <section className="sr-hero" aria-label="Bienvenida SpainRoom">
        <div className="sr-hero__bg" />
        <div className="sr-hero__overlay" />

        <div className="sr-hero__content">
          <img src="/logo.png" alt="SpainRoom" className="sr-hero__logo" />

          <h1 className="sr-hero__title">Bienvenido a SpainRoom</h1>

          <p className="sr-hero__subtitle">
            Encuentra habitaciones listas para entrar a vivir en las mejores zonas.
            <br />
            SpainRoom conecta personas, viviendas y oportunidades.
            <br />
            Confiable, moderno y cercano.
          </p>
        </div>
      </section>

      <SOSButton />
    </main>
  );
}
