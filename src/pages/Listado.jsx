// añade este import:
import { submitReservationHybrid } from "../state/reservations.js";

// reemplaza la función existente por esta:
const submitReservation = async (payload) => {
  const { storage, saved, error } = await submitReservationHybrid(payload);
  const via = storage === "api" ? "🟦 Servidor" : "🟨 Local";
  alert(
    [
      `✅ Solicitud enviada (${via})`,
      `ID: ${saved.id}`,
      `Habitación: ${payload.roomTitle} (${payload.roomId})`,
      `Ciudad/Zona: ${payload.roomLocation}`,
      `Precio: ${payload.price} €/mes`,
      `Nombre: ${payload.name}`,
      `Email: ${payload.email}`,
      `Teléfono: ${payload.phone}`,
      `Entrada: ${payload.date}`,
      storage === "local"
        ? `\nAviso: no se pudo conectar con el servidor.\n(${error})\nGuardado en este navegador.`
        : "",
      storage === "local"
        ? "Más tarde podrás reenviar desde la pestaña Reservas."
        : "",
    ].join("\n")
  );
};
