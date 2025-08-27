import { useState } from "react";
import { FormCard, Field, Input, Select, Textarea, Button, Alert } from "../components/SRForm";

export default function Oportunidades() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const r = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...payload, origen: "oportunidades" }),
      });
      if (!r.ok) throw new Error("backend");
      setStatus({ ok: true, msg: "Mensaje enviado. Te contactaremos muy pronto." });
      e.currentTarget.reset();
    } catch {
      setStatus({ ok: true, msg: "Mensaje enviado (demo). Backend no conectado." });
      e.currentTarget.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 px-4 md:px-6 max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Oportunidades</h1>
        <p className="text-gray-700 mt-2">
          Colabora con nosotros como inmobiliaria, descubre promociones o consulta opciones de inversión.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormCard title="Inmobiliarias" subtitle="Conecta tu cartera con demanda real">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Publicación de habitaciones gestionada por SpainRoom.</li>
            <li>Selección y soporte a inquilinos.</li>
            <li>Proceso claro de reservas y seguimiento.</li>
          </ul>
        </FormCard>
        <FormCard title="Promociones" subtitle="Accesos y beneficios para usuarios SpainRoom">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Visibilidad a tu oferta.</li>
            <li>Segmentación por zonas y perfiles.</li>
            <li>Colaboraciones win-win.</li>
          </ul>
        </FormCard>
        <FormCard title="Inversión" subtitle="Modelo escalable con ingresos recurrentes">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Zonas prioritarias y roadmap.</li>
            <li>Soporte de la central y marca registrada.</li>
            <li>Datos y previsiones realistas.</li>
          </ul>
        </FormCard>
      </div>

      <FormCard title="Contacto" subtitle="Cuéntanos en qué te interesa colaborar con SpainRoom">
        {status && (
          <div className="mb-4">
            <Alert kind={status.ok ? "success" : "error"} onClose={() => setStatus(null)} autoHideMs={6000}>
              {status.msg}
            </Alert>
          </div>
        )}
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre y apellidos" required>
            <Input name="nombre" required placeholder="Tu nombre completo" />
          </Field>
          <Field label="Email" required>
            <Input name="email" type="email" required placeholder="empresa@email.com" />
          </Field>
          <Field label="Teléfono">
            <Input name="telefono" placeholder="+34 6XX XXX XXX" />
          </Field>
          <Field label="Interés" required>
            <Select name="interes" required defaultValue="">
              <option value="" disabled>Selecciona…</option>
              <option value="inmobiliaria">Inmobiliaria</option>
              <option value="promocion">Promoción</option>
              <option value="inversion">Inversión</option>
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Mensaje">
              <Textarea name="mensaje" rows={4} placeholder="Cuéntanos cómo podemos colaborar contigo" />
            </Field>
          </div>
          <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
            <p className="text-xs text-gray-500">
              Al enviar aceptas ser contactad@ por SpainRoom para esta colaboración.
            </p>
            <Button type="submit" loading={loading}>Enviar</Button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
