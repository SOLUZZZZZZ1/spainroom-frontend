// Punto único de verdad para la URL base del backend.
// .env (local):        VITE_API_URL=http://127.0.0.1:5000
// .env.production:     VITE_API_URL=https://spainroom-backend.onrender.com
const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : "/api";

// Endpoints organizados
export const endpoints = {
  health: `${API_BASE}/health`,
  rooms: `${API_BASE}/rooms`,
  uploadPhoto: `${API_BASE}/upload-room-photo`,
  jobsNearby: `${API_BASE}/jobs/nearby`,
  jobsSearch: `${API_BASE}/jobs/search`,
};

// Helper genérico de fetch con manejo de errores JSON
async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const err = await res.json();
      if (err?.error) msg = err.error;
    } catch (_) { /* ignore */ }
    throw new Error(msg);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

/* ===========================
 * Health
 * =========================== */
export async function getHealth() {
  return request(endpoints.health);
}

/* ===========================
 * Rooms (habitaciones)
 * =========================== */

// Lista de habitaciones
export async function getRooms() {
  return request(endpoints.rooms, { headers: { Accept: "application/json" } });
}

// Detalle
export async function getRoom(roomId) {
  return request(`${endpoints.rooms}/${encodeURIComponent(roomId)}`, {
    headers: { Accept: "application/json" },
  });
}

// Crear habitación (con fotos)
export async function createRoom({ title, price_eur, city, size_m2, availableFrom, features = [], files = [] }) {
  const form = new FormData();
  form.append("title", title);
  form.append("price_eur", String(price_eur));
  if (city) form.append("city", city);
  if (size_m2 != null && size_m2 !== "") form.append("size_m2", String(size_m2));
  if (availableFrom) form.append("availableFrom", availableFrom);
  if (features?.length) form.append("features", JSON.stringify(features));
  files.forEach((f) => form.append("files[]", f));

  return request(endpoints.rooms, { method: "POST", body: form });
}

// Actualizar habitación (añadir/reemplazar fotos y/o datos)
export async function updateRoom(roomId, { title, price_eur, city, size_m2, availableFrom, features, files = [], replace_images = false }) {
  const form = new FormData();
  if (title != null) form.append("title", title);
  if (price_eur != null) form.append("price_eur", String(price_eur));
  if (city != null) form.append("city", city);
  if (size_m2 != null) form.append("size_m2", String(size_m2));
  if (availableFrom != null) form.append("availableFrom", availableFrom);
  if (features != null) form.append("features", JSON.stringify(features));
  form.append("replace_images", String(replace_images));
  files.forEach((f) => form.append("files[]", f));

  return request(`${endpoints.rooms}/${encodeURIComponent(roomId)}`, { method: "PUT", body: form });
}

// Eliminar habitación (borra también sus imágenes en el backend)
export async function deleteRoom(roomId) {
  return request(`${endpoints.rooms}/${encodeURIComponent(roomId)}`, { method: "DELETE" });
}

// Eliminar imágenes concretas de una habitación
// options: { indexes: number[] }  o  { urls: string[] }
export async function deleteRoomImages(roomId, options) {
  return request(`${endpoints.rooms}/${encodeURIComponent(roomId)}/images`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options || {}),
  });
}

// Subida suelta de una foto (devuelve objeto SmartImage listo para SmartImage.jsx)
export async function uploadRoomPhoto(file, room_id) {
  const form = new FormData();
  form.append("file", file);
  if (room_id) form.append("room_id", room_id);
  return request(endpoints.uploadPhoto, { method: "POST", body: form });
}

/* ===========================
 * Jobs (búsqueda de empleo)
 * =========================== */

// Ofertas cercanas (radio 2km por defecto)
export async function getJobsNearby({ lat, lng, radius_km = 2 }) {
  const url = new URL(endpoints.jobsNearby, window.location.origin);
  url.pathname = endpoints.jobsNearby; // asegura ruta absoluta en Vite preview
  url.searchParams.set("lat", lat);
  url.searchParams.set("lng", lng);
  url.searchParams.set("radius_km", radius_km);
  return request(url.toString());
}

// Buscador específico (10km por defecto)
export async function searchJobs({ q = "", lat, lng, radius_km = 10 }) {
  const url = new URL(endpoints.jobsSearch, window.location.origin);
  url.pathname = endpoints.jobsSearch;
  url.searchParams.set("q", q);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lng", lng);
  url.searchParams.set("radius_km", radius_km);
  return request(url.toString());
}

/* ===========================
 * Utilidad: origen de API (por si quieres mostrarlo en Admin)
 * =========================== */
export function getApiOrigin() {
  return API_ORIGIN || "(proxy /api vía vercel.json)";
}
