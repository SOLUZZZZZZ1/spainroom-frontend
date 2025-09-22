// src/pages/FAQ.jsx
import React from "react";
import SEO from "../components/SEO.jsx";

export default function FAQ(){
  return (
    <div className="container" style={{ padding:"24px 0", color:"#0b1220" }}>
      <SEO title="Ayuda / FAQ — SpainRoom" description="Preguntas frecuentes para inquilinos, propietarios y franquiciados." />
      <h2 style={{ margin:"0 0 8px" }}>Ayuda / FAQ</h2>
      <p className="note">Resolvemos las dudas más comunes. Si necesitas más ayuda, escríbenos.</p>

      <section className="sr-card" style={{ marginTop: 12 }}>
        <h3>Inquilinos</h3>
        <details><summary>¿Qué documentación necesito?</summary><div>
          DNI/NIE o pasaporte, factura de móvil del número declarado y, si aplica, matrícula o contrato laboral.
        </div></details>
        <details><summary>¿Cómo reservo una habitación?</summary><div>
          Desde <b>Reservas</b> puedes pagar un depósito seguro (Stripe) y agendar visita. Recibirás confirmación por email.
        </div></details>
      </section>

      <section className="sr-card" style={{ marginTop: 12 }}>
        <h3>Propietarios</h3>
        <details><summary>¿Es obligatoria la cédula de habitabilidad?</summary><div>
          Depende de tu CCAA/municipio. Consulta el <b>mapa</b> y verifica la dirección para conocer requisitos.
        </div></details>
        <details><summary>¿Cómo cobro?</summary><div>
          Transferencia. En tu <b>Dashboard Propietario</b> puedes subir IBAN y documentación.
        </div></details>
      </section>

      <section className="sr-card" style={{ marginTop: 12 }}>
        <h3>Franquiciados</h3>
        <details><summary>¿Cómo publico una habitación?</summary><div>
          Con el contrato firmado, sube <b>fotos</b> y <b>ficha</b> en tu dashboard; la publicación es automática.
        </div></details>
        <details><summary>¿Cómo cobro mis comisiones?</summary><div>
          Según reparto acordado en el contrato (por habitación, <i>sub_ref</i>), con liquidaciones mensuales.
        </div></details>
      </section>
    </div>
  );
}
