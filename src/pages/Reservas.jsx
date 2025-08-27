import { useState } from "react";
import { FormCard, Field, Input, Textarea, Button, Alert } from "../components/SRForm";

export default function Reservas() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const r = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("backend");
      setStatus({ ok: true, msg: "Reserva enviada correctamente. Te contactaremos en breve." });
      e.currentTarget.reset();
    } catch (err) {
      // DEMO: si no hay backend, confirmamos simulando éxito
      setStatus({
        ok: true,
        msg: "Reserva registrada (demo). Backend no conectado. Pronto te contactaremos.",
      });
      e.currentTarget.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 px-4 md:px-6 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Solicitar Reserva</h1>
        <p className="text-gray-700 mt-2">
          Cuéntanos cuándo quieres entrar y en qué ciudad. Te ayudamos a encontrar tu habitación SpainRoom.
        </p>
      </header>

      {status && (
        <Alert
          kind={status.ok ? "success" : "error"}
          onClose={() => setStatus(null)}
          autoHideMs={6000}
        >
          {status.msg}
        </Alert>
      )}

      <FormCard title="Datos de la solicitud" subtitle="Rellena los campos y enviamos tu solicitud a nuestro equipo.">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre y apellidos" required>
            <Input name="nombre" required placeholder="Tu nombre completo" />
          </Field>
          <Field label="Email" required>
            <Input name="email" type="email" required placeholder="tu@email.com" />
          </Field>
          <Field label="Teléfono" required>
            <Input name="telefono" required placeholder="+34 6XX XXX XXX" />
          </Field>
          <Field label="Ciudad de interés">
            <Input name="ciudad" placeholder="Madrid, Barcelona, Valencia…" />
          </Field>
          <Field label="Fecha de entrada" required>
            <Input name="entrada" type="date" required />
          </Field>
          <Field label="Fecha de salida (opcional)">
            <Input name="salida" type="date" />
          </Field>
          <Field label="ID habitación (si ya la tienes)">
            <Input name="habitacion_id" placeholder="Ej. 1023" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Mensaje adicional">
              <Textarea name="mensaje" rows={4} placeholder="Cuéntanos necesidades, zona ideal, presupuesto, etc." />
            </Field>
          </div>
          <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
            <p className="text-xs text-gray-500">
              Al enviar aceptas ser contactad@ por SpainRoom para gestionar tu reserva.
            </p>
            <Button type="submit" loading={loading}>Enviar solicitud</Button>
          </div>
        </form>
      </FormCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormCard title="Transparencia" subtitle="Sin letra pequeña">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Precios claros y sin sorpresas.</li>
            <li>Habitaciones listas para entrar a vivir.</li>
            <li>Atención cercana durante toda tu estancia.</li>
          </ul>
        </FormCard>
        <FormCard title="Seguridad" subtitle="Selección responsable">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Inquilinos verificados.</li>
            <li>Propietarios informados y comprometidos.</li>
            <li>Soporte para incidencias.</li>
          </ul>
        </FormCard>
        <FormCard title="Flexibilidad" subtitle="Nos adaptamos a ti">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Estancias medias y largas.</li>
            <li>Opciones por zona y presupuesto.</li>
            <li>Cambios sin complicaciones.</li>
          </ul>
        </FormCard>
      </div>
    </div>
  );
}
