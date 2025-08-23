// (mantén lo que ya tienes y añade lo siguiente al final)
import { sendReservationToApi } from "../services/api.js";

export async function submitReservationHybrid(payload) {
  // Intenta API; si falla, guarda local como fallback
  try {
    const { ok, item } = await sendReservationToApi(payload);
    if (ok && item) return { storage: "api", saved: item };
    throw new Error("Respuesta API inválida");
  } catch (e) {
    // Fallback local
    const local = addReservation(payload);
    return { storage: "local", saved: local, error: e.message };
  }
}
