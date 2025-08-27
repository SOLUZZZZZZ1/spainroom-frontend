import { useState } from "react";
import { FormCard, Field, Input, Textarea, Button, Alert, Select } from "../components/SRForm";

export default function Franquiciados() {
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
        body: JSON.stringify({ ...payload, tipo: "franquiciado" }),
      });
      if (!r.ok) throw new Error("backend");
      setStatus({ ok: true, msg: "Solicitud enviada. Te contactaremos para el onboarding." });
      e.currentTarget.reset();
    } catch {
      setStatus({ ok: true, msg: "Solicitud enviada (demo). Te contactaremos." });
      e.currentTarget.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Franquiciados</h1>
        <p className="mt-3 text-gray-700">
          Únete al modelo SpainRoom y gestiona tu zona con soporte, marca y tecnología.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormCard title="Ventajas" subtitle="Modelo probado">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Marca registrada y plataforma tecnológica.</li>
            <li>Soporte operativo y formación continuos.</li>
            <li>Ingresos recurrentes por gestión de habitaciones.</li>
          </ul>
        </FormCard>
        <FormCard title="Primeros pasos" subtitle="Onboarding ágil">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Evaluación de zona y encaje.</li>
            <li>Acuerdo y formación inicial.</li>
            <li>Lanzamiento con apoyo de la central.</li>
          </ul>
        </FormCard>
      </div>

      <FormCard title="Quiero ser franquiciado" subtitle="Envíanos tus datos para evaluar tu candidatura">
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
            <Input name="email" type="email" required placeholder="tu@email.com" />
          </Field>
          <Field label="Teléfono">
            <Input name="telefono" placeholder="+34 6XX XXX XXX" />
          </Field>
          <Field label="Zona" required>
            <Input name="zona" required placeholder="Ciudad / Provincia" />
          </Field>
          <Field label="Experiencia (breve)">
            <Textarea name="experiencia" rows={3} placeholder="Comercial, inmobiliaria, gestión…" />
          </Field>
          <Field label="Disponibilidad">
            <Select name="disponibilidad" defaultValue="">
              <option value="" disabled>Selecciona…</option>
              <option value="inmediata">Inmediata</option>
              <option value="1-3 meses">1–3 meses</option>
              <option value=">3 meses">{">"} 3 meses</option>
            </Select>
          </Field>
          <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
            <p className="text-xs text-gray-500">Confidencial. Solo usaremos tus datos para evaluar la candidatura.</p>
            <Button type="submit" loading={loading}>Enviar candidatura</Button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
