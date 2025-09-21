import React, { useState } from "react";
import REQUISITOS_CCAA from "../data/requisitosCCAA";

// Colores por requisito (operativa SpainRoom)
const colorFor = (ccaa) => {
  if (ccaa === "Cataluña" || ccaa === "Illes Balears") return "#1e3a8a"; // Cédula obligatoria
  if (ccaa === "Comunidad Valenciana") return "#2563eb";                 // Equivalente
  return "#9ca3af";                                                      // LPO resto
};

export default function MapaHabitabilidad() {
  const [hover, setHover] = useState(null);

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        width="100%"
        height="auto"
        style={{ maxWidth: 720, margin: "0 auto", display: "block" }}
      >
        {/* Bloque base (península) – simplificado */}
        <path
          d="M120,260 L640,260 L680,320 L640,380 L600,420 L520,460 L460,480 L360,520 L180,460 L140,400 L110,340 Z"
          fill={colorFor("Madrid")}
          stroke="#ffffff"
          strokeWidth={2}
          onMouseEnter={() => setHover("Madrid")}
          onMouseLeave={() => setHover(null)}
        />

        {/* Cataluña – zona derecha-superior (simplificada) */}
        <path
          d="M600,260 L680,260 L700,300 L660,340 L620,320 Z"
          fill={colorFor("Cataluña")}
          stroke="#ffffff"
          strokeWidth={2}
          onMouseEnter={() => setHover("Cataluña")}
          onMouseLeave={() => setHover(null)}
        />

        {/* Comunidad Valenciana – franja derecha media (simplificada) */}
        <path
          d="M620,320 L660,340 L640,400 L600,420 L580,380 Z"
          fill={colorFor("Comunidad Valenciana")}
          stroke="#ffffff"
          strokeWidth={2}
          onMouseEnter={() => setHover("Comunidad Valenciana")}
          onMouseLeave={() => setHover(null)}
        />

        {/* Illes Balears – punto a la derecha */}
        <circle
          cx={740}
          cy={360}
          r={14}
          fill={colorFor("Illes Balears")}
          stroke="#ffffff"
          strokeWidth={2}
          onMouseEnter={() => setHover("Illes Balears")}
          onMouseLeave={() => setHover(null)}
        />
      </svg>

      {/* Tooltip con requisito SpainRoom */}
      {hover && REQUISITOS_CCAA[hover] && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 14,
            maxWidth: 320
          }}
        >
          <strong>{hover}</strong>: {REQUISITOS_CCAA[hover].tipo}
          <div style={{ opacity: 0.85, marginTop: 2 }}>{REQUISITOS_CCAA[hover].msg}</div>
        </div>
      )}
    </div>
  );
}
