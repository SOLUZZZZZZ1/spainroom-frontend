// src/pages/Inicio.jsx
import React from "react";

export default function Inicio() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          'linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.15)), url("/casa-diseno.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
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
          src="/cabecera.png"
          alt="SpainRoom"
          style={{
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
          Habitaciones listas para entrar a vivir. Verificación, contratos digitales y soporte real.
        </p>
      </div>
    </div>
  );
}
