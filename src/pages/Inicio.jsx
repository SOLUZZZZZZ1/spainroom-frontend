import { useState } from "react";
import "./inicio.css";
import LogoSpainRoom from "../components/LogoSpainRoom.jsx";

export default function Inicio() {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <main className="sr-hero" role="main">
      <div className="sr-hero__bg" aria-hidden="true" />
      <div className="sr-hero__overlay" />

      <section className="sr-hero__content" aria-label="Bienvenida">
        {!useFallback ? (
          <img
            src="/logo.png"
            alt="Logo SpainRoom"
            className="sr-hero__logo"
            width="260"
            height="auto"
            onError={() => setUseFallback(true)}
          />
        ) : (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <LogoSpainRoom size={220} />
          </div>
        )}

        <h1 className="sr-hero__title">Bienvenido a SpainRoom</h1>

        <p className="sr-hero__subtitle">
          Encuentra habitaciones listas para entrar a vivir en las mejores zonas.
          <br />
          SpainRoom conecta personas, viviendas y oportunidades. Confiable,
          moderno y cercano.
        </p>
      </section>
    </main>
  );
}
