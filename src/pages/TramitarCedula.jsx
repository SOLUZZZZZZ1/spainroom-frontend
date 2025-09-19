import React from "react";
import { Link } from "react-router-dom";

export default function TramitarCedula() {
  const wrap = { padding: 24, color: "#fff" };
  const box = { background: "rgba(255,255,255,.06)", borderRadius: 12, padding: 16, marginBottom: 16 };
  const h1 = { fontSize: 24, fontWeight: 700, marginTop: 0 };
  const btn = {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: 10,
    background: "#0b69c7",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800,
    boxShadow: "0 6px 16px rgba(0,0,0,.25)",
    marginRight: 8,
  };

  const tel = "616232306";
  const prettyTel = "616 23 23 06";
  const wa =
    `https://wa.me/34${tel}?text=` +
    encodeURIComponent("Hola, quiero tramitar mi cédula de habitabilidad con SpainRoom.");

  return (
    <main style={wrap}>
      <div style={box}>
        <h1 style={h1}>Tramitar Cédula de Habitabilidad</h1>
        <p style={{ opacity: 0.9 }}>
          Gestionamos tu cédula de habitabilidad de forma ágil y transparente. Te indicamos la
          documentación necesaria, presentamos la solicitud y hacemos seguimiento hasta la resolución.
        </p>
        <ul style={{ opacity: 0.95, marginTop: 8, paddingLeft: 18 }}>
          <li>Asesoramiento según provincia/municipio y normativa vigente.</li>
          <li>Revisión de requisitos y preparación de documentación.</li>
          <li>Presentación telemática y seguimiento hasta resolución.</li>
          <li>Soporte por WhatsApp y teléfono.</li>
        </ul>
      </div>

      <div style={box}>
        <h2 style={{ marginTop: 0 }}>Coste del servicio</h2>
        <p style={{ opacity: 0.9, marginBottom: 8 }}>
          El coste depende de la provincia y de las tasas municipales/autonómicas aplicables. Te
          ofrecemos <strong>presupuesto cerrado</strong> antes de iniciar el trámite (tasas aparte).
        </p>
        <div>
          <a href={wa} target="_blank" rel="noreferrer" style={btn}>
            Pedir presupuesto por WhatsApp
          </a>
          <a href={`tel:+34${tel}`} style={{ ...btn, background: "#0a58a6" }}>
            Llamar {prettyTel}
          </a>
          <Link to="/propietarios" style={{ ...btn, background: "#4b5563" }}>
            Volver a Propietarios
          </Link>
        </div>
      </div>
    </main>
  );
}
