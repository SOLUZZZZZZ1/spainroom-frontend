import React from "react";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "calc(100dvh - 64px)",
        backgroundImage: 'url("/casa-diseno.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,.45)",
          color: "#fff",
          padding: "28px 24px",
          borderRadius: 14,
          textAlign: "center",
          maxWidth: 980,
          width: "clamp(300px, 90vw, 980px)"
        }}
      >
        <img
          src="/logo.png"
          alt="SpainRoom"
          style={{ height: 200, maxWidth: "85vw", display: "block", margin: "0 auto 18px" }}
        />
        <h1 style={{ margin: 0, fontSize: 28 }}>Bienvenido a SpainRoom</h1>
        <p style={{ margin: "12px 0 0", lineHeight: 1.55, fontSize: 16 }}>
          Encuentra habitaciones listas para entrar a vivir en las mejores zonas.
          <br />
          SpainRoom conecta personas, viviendas y oportunidades. Confiable, moderno y cercano.
        </p>
      </div>
    </div>
  );
}
