import React from "react";

export default function Home() {
  return (
    <div
      style={{
        /* Alto robusto en todos los navegadores */
        minHeight: "100vh",

        /* Fondo a sangre con overlay */
        backgroundImage:
          'linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.15)), url("/casa-diseno.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",

        /* Centrado perfecto */
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          /* Tarjeta translúcida por encima del fondo */
          background: "rgba(15,23,42,0.25)",
          backdropFilter: "blur(6px) saturate(130%)",
          WebkitBackdropFilter: "blur(6px) saturate(130%)",
          color: "#fff",
          padding: "28px 24px",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,.25)",
          textAlign: "center",
          maxWidth: 980,
          width: "clamp(320px, 92vw, 980px)",
          boxShadow: "0 10px 22px rgba(0,0,0,.18)",
        }}
      >
        <img
          src="/logo.png"
          alt="SpainRoom"
          style={{
            /* Limita tamaño del logo — no se desborda */
            height: "clamp(80px, 14vw, 160px)",
            width: "auto",
            display: "block",
            margin: "0 auto 18px",
            objectFit: "contain",
          }}
        />

        <h1 style={{ margin: 0, fontSize: "clamp(24px, 4.2vw, 40px)", lineHeight: 1.1 }}>
          Bienvenido a SpainRoom
        </h1>

        <p style={{ margin: "12px auto 0", lineHeight: 1.55, fontSize: "clamp(14px, 2vw, 18px)", maxWidth: 820 }}>
          Encuentra habitaciones listas para entrar a vivir en las mejores zonas.
          <br />
          SpainRoom conecta personas, viviendas y oportunidades. Confiable, moderno y cercano.
        </p>

        {/* CTAs opcionales */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 18 }}>
          <a
            href="/propietarios"
            style={{
              background: "#ffffff",
              color: "#0A58CA",
              borderRadius: 999,
              padding: "10px 16px",
              fontWeight: 800,
              border: "1px solid transparent",
            }}
          >
            Soy propietario
          </a>
          <a
            href="/inquilinos"
            style={{
              border: "1px solid rgba(255,255,255,.6)",
              color: "#fff",
              borderRadius: 999,
              padding: "10px 16px",
              fontWeight: 800,
            }}
          >
            Soy inquilino
          </a>
        </div>
      </div>
    </div>
  );
}
