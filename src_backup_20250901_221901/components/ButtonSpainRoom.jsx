import React from "react";

export default function ButtonSpainRoom({ icon = "🏠", children, ...props }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0b5ed7",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: "1rem",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "filter .2s ease"
  };
  return (
    <button
      {...props}
      style={base}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
    >
      <span>{icon}</span>
      {children}
    </button>
  );
}
