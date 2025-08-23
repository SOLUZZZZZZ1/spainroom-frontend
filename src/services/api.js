// Lee la URL del backend desde variables Vite
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function sendReservationToApi(payload) {
  const res = await fetch(`${API_BASE}/api/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`.trim());
  }
  return res.json();
}
