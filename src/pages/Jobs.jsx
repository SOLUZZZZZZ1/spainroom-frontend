import React from "react";
import CardSpainRoom from "../components/CardSpainRoom.jsx";
import ButtonSpainRoom from "../components/ButtonSpainRoom.jsx";

export default function Jobs() {
  const empleos = [
    { id: 1, titulo: "Camarero/a", detalle: "Turno de tarde, zona centro (2 km)" },
    { id: 2, titulo: "Dependiente/a", detalle: "Tienda de barrio, jornada parcial (1.5 km)" },
    { id: 3, titulo: "Recepcionista", detalle: "Hotel 3*, turnos rotativos (3 km)" },
  ];

  return (
    <section style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 20 }}>Ofertas de empleo</h1>

      {empleos.map((job) => (
        <CardSpainRoom key={job.id} title={job.titulo}>
          <p style={{ margin: "6px 0 12px 0", color: "#374151" }}>{job.detalle}</p>
          <ButtonSpainRoom icon="💼" onClick={() => alert("Postularse a " + job.titulo)}>
            Postularse
          </ButtonSpainRoom>
        </CardSpainRoom>
      ))}
    </section>
  );
}
