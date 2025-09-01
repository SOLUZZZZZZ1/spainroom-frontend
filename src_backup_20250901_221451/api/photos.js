const API = import.meta.env.VITE_API_URL || "/api";

// ya existente:
export async function uploadRoomPhoto(roomId, file) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${API}/rooms/${roomId}/photos`, { method: "POST", body: fd });
  const data = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(data.error || "Error al subir foto");
  return data;
}

// NUEVO: fijar portada por índice (mueve a posición 0 en backend)
export async function setPortada(roomId, index) {
  const r = await fetch(`${API}/rooms/${roomId}/photos/portada`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ index })
  });
  const data = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(data.error || "No se pudo fijar portada");
  return data; // { ok: true, portada: {...} }
}

// NUEVO: guardar/reordenar todo el array de fotos
export async function saveRoomPhotos(roomId, photos) {
  const r = await fetch(`${API}/rooms/${roomId}/photos`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ photos })
  });
  const data = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(data.error || "No se pudo guardar el orden");
  return data; // { ok: true, count: n }
}
