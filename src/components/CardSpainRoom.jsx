<<<<<<< HEAD
// componente simulado CardSpainRoom.jsx
=======
import React from "react";

export default function CardSpainRoom({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        background: "#fff",
        marginBottom: 16,
      }}
    >
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
>>>>>>> 780c84d (SpainRoom: actualizar App.jsx y VerificacionViviendaSR.jsx)
