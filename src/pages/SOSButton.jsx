import React from "react";

export default function SOSButton() {
  return (
    <a
      href="#sos"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 100,
        padding: "12px 20px",
        background: "#dc2626",
        color: "#fff",
        fontWeight: 700,
        borderRadius: 12,
        textDecoration: "none",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 16,
      }}
    >
      <span role="img" aria-label="alarma">🚨</span>
      SOS
    </a>
  );
}
