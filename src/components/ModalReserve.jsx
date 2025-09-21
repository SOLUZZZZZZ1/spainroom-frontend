import { useEffect, useRef, useState } from "react";
import "./modalReserve.css";

export default function ModalReserve({ open, room, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    accepted: false,
  });

  useEffect(() => {
    if (open) dialogRef.current?.showModal?.();
    else dialogRef.current?.close?.();
  }, [open]);

  useEffect(() => {
    if (open) setForm({ name: "", email: "", phone: "", date: "", accepted: false });
  }, [room?.id, open]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.date || !form.accepted) {
      alert("Completa todos los campos y acepta la política de privacidad.");
      return;
    }
    onSubmit?.({
      ...form,
      roomId: room?.id,
      roomTitle: room?.title,
      roomLocation: room?.location,
      price: room?.price,
    });
    onClose?.();
  };

  return (
    <dialog ref={dialogRef} className="sr-modal" onCancel={onClose}>
      <form method="dialog" className="sr-modal__content sr-section" onSubmit={handleSubmit}>
        <header className="sr-modal__header">
          <div className="sr-heading" style={{ margin: 0 }}>
            <span className="sr-heading__dot" />
            <h3 className="sr-heading__title" style={{ fontSize: 20, margin: 0 }}>
              Reservar habitación
            </h3>
          </div>
          <button type="button" className="sr-x" onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <section className="sr-modal__room">
          <strong>{room?.title}</strong>
          <span> · {room?.location}</span>
          {room?.price ? (
            <span className="sr-modal__price">
              {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(room.price)}
              /mes
            </span>
          ) : null}
        </section>

        <div className="sr-grid">
          <label className="sr-field">
            <span>Nombre y apellidos</span>
            <input
              className="sr-input sr-input-brand"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </label>

          <label className="sr-field">
            <span>Email</span>
            <input
              type="email"
              className="sr-input sr-input-brand"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </label>

          <label className="sr-field">
            <span>Teléfono</span>
            <input
              className="sr-input sr-input-brand"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </label>

          <label className="sr-field">
            <span>Fecha de entrada</span>
            <input
              type="date"
              className="sr-input sr-input-brand"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              required
            />
          </label>
        </div>

        <label className="sr-check">
          <input
            type="checkbox"
            checked={form.accepted}
            onChange={(e) => update("accepted", e.target.checked)}
            required
          />
          <span>
            Acepto la política de privacidad y consiento el tratamiento de mis datos para gestionar la reserva.
          </span>
        </label>

        <footer className="sr-modal__footer">
          <button type="button" className="sr-btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="sr-btn-brand">
            Enviar solicitud
          </button>
        </footer>
      </form>
    </dialog>
  );
}
