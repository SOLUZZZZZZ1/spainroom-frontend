import { useMemo, useState } from "react";
import { ROOMS } from "../data/rooms.js";
import CardSpainRoom from "../components/CardSpainRoom.jsx";
import FilterSpainRoom from "../components/FilterSpainRoom.jsx";
import ModalReserve from "../components/ModalReserve.jsx";
import { submitReservationHybrid } from "../state/reservations.js";

export default function Listado() {
  const [filters, setFilters] = useState({ city: "", min: null, max: null, promos: false });
  const [reserveOpen, setReserveOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);

  const filtered = useMemo(() => {
    return ROOMS.filter((r) => {
      if (filters.city) {
        const city = (r.location || "").split("—")[0].trim();
        if (city !== filters.city) return false;
      }
      if (filters.min != null && r.price < filters.min) return false;
      if (filters.max != null && r.price > filters.max) return false;
      if (filters.promos && !r.badge) return false;
      return true;
    });
  }, [filters]);

  const handleReserve = (room) => {
    setActiveRoom(room);
    setReserveOpen(true);
  };

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

  return (
    <main style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <header style={{ marginBottom: 12 }}>
        <h2 style={{ margin: "0 0 6px 0" }}>Listado de habitaciones</h2>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Filtros activos: ciudad, rango de precio y promociones.
        </p>
      </header>

      <FilterSpainRoom items={ROOMS} onChange={setFilters} />

      <section
        className="sr-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}
      >
        {filtered.map((r) => (
          <div key={r.id} style={{ gridColumn: "span 4" }}>
            <CardSpainRoom
              id={r.id}
              title={r.title}
              location={r.location}
              price={r.price}
              features={r.features}
              image={r.image}
              badge={r.badge}
              onReserve={() => handleReserve(r)}
            />
          </div>
        ))}
      </section>

      {!filtered.length && (
        <p style={{ marginTop: 12, color: "#6b7280" }}>
          No hay resultados con los filtros seleccionados.
        </p>
      )}

      <style>{`
        @media (max-width: 1024px) { .sr-grid > div { grid-column: span 6; } }
        @media (max-width: 640px) { .sr-grid > div { grid-column: span 12; } }
      `}</style>

      <ModalReserve
        open={reserveOpen}
        room={activeRoom}
        onClose={() => setReserveOpen(false)}
        onSubmit={submitReservation}
      />
    </main>
  );
}
