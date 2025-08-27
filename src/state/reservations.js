// src/state/reservations.js
import { sendReservationToApi } from "../services/api.js";

const STORAGE_KEY = "sr_reservations_v1";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export function addReservation(res) {
  const list = readAll();
  const enriched = {
    id: `R-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    ...res,
  };
  list.unshift(enriched);
  writeAll(list);
  return enriched;
}

export function getReservations() {
  return readAll();
}

export function clearReservations() {
  writeAll([]);
}

// Envío híbrido: API → si falla, localStorage
export async function submitReservationHybrid(payload) {
  try {
    const { ok, item } = await sendReservationToApi(payload);
    if (ok && item) return { storage: "api", saved: item };
    throw new Error("Invalid API response");
  } catch (e) {
    const local = addReservation(payload);
    return { storage: "local", saved: local, error: e.message };
  }
}
