import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROOMS } from "../data/rooms.js";
import MapPlaceholder from "../components/MapPlaceholder.jsx";
import ModalReserve from "../components/ModalReserve.jsx";
import { submitReservationHybrid } from "../state/reservations.js";
import "./habitacionDetalle.css";

export default function HabitacionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const room = useMemo(() => ROOMS.find((r) => r.id === id) || null, [id]);
  const [reserveOpen, setReserveOpen] = useState(false);

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
        storage === "local" ? `\nAviso: no se pudo conectar con el servidor.\n(${error})\nGuardado en este navegador.` : "",
        storage === "local" ? "Más tarde podrás reenviar desde la pestaña Reservas." : "",
      ].join("\n")
    );
  };

  if (!room) {
    return (
      <main className="sr-room">
        <div className="sr-room__wrap">
          <p>No se encontró la habitación solicitada.</p>
          <button className="sr-btn sr-btn--ghost" onClick={() => navigate("/listado")}>
            Volver al listado
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="sr-room">
      <div className="sr-room__hero">
        <img src={room.image} alt={room.title} className="sr-room__img" />
        {room.badge ? <span className="sr-room__badge">{room.badge}</span> : null}
      </div>

      <div className="sr-room__wrap">
        <header className="sr-room__header">
          <h2 className="sr-room__title">{room.title}</h2>
          <div className="sr-room__price">
            {new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(room.price)}
            <span className="sr-room__period">/mes</span>
          </div>
        </header>

        <p className="sr-room__location">{room.location}</p>

        <ul className="sr-room__features">
          {room.features?.map((f, i) => (
            <li key={i} className="sr-chip">{f}</li>
          ))}
        </ul>

        {room.description ? <p className="sr-room__desc">{room.description}</p> : null}

        <div className="sr-room__actions">
          <button className="sr-btn sr-btn--primary" onClick={() => setReserveOpen(true)}>
            Reservar ahora
          </button>
          <button className="sr-btn sr-btn--ghost" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <MapPlaceholder
          lat={room.coords?.lat}
          lng={room.coords?.lng}
          label={room.mapLabel || room.location}
        />
      </div>

      <ModalReserve
        open={reserveOpen}
        room={room}
        onClose={() => setReserveOpen(false)}
        onSubmit={submitReservation}
      />
    </main>
  );
}
