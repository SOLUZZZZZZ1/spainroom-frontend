const API_BASE = import.meta.env.VITE_API_BASE;

const res = await fetch(`${API_BASE}/api/cedula/verificar`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
