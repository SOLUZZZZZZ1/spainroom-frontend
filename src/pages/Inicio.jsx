import React from "react";

export default function Inicio() {
  const WRAP = { paddingTop: 88 };
  const hero = { textAlign: "center", padding: "40px 20px" };
  const logo = { width: 200, height: "auto", marginBottom: 20 };
  const h1 = { fontSize: "2.5rem", marginBottom: 10 };
  const sub = { fontSize: "1.2rem", lineHeight: 1.6, maxWidth: 600, margin: "0 auto" };

  return (
    <div style={WRAP}>
      <section style={hero}>
        <img src="/cabezera.png" style={logo} alt="SpainRoom" />
        <h1 style={h1}>Bienvenido a SpainRoom</h1>
        <p style={sub}>
          Encuentra habitaciones listas para entrar a vivir en las mejores zonas.
          <br />
          SpainRoom conecta personas, viviendas y oportunidades.
          <br />
          Confiable, moderno y cercano.
        </p>
      </section>
    </div>
  );
}
