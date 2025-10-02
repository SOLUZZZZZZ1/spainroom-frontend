// src/pages/FAQ.jsx
import React, { useMemo, useState } from "react";
import SEO from "../components/SEO.jsx";
import StatusBar from "../components/StatusBar.jsx";
import DashboardLinks from "../components/DashboardLinks.jsx";
import ContactForm from "../components/ContactForm.jsx";

const FAQ_SECTIONS = [
  {
    title: "Inquilinos",
    items: [
      { q: "¿Qué documentación necesito para empezar?", a: "DNI/NIE o pasaporte, factura reciente del móvil declarado y un selfie (verificación de identidad). Si eres estudiante o trabajador, puedes adjuntar matrícula o contrato para agilizar." },
      { q: "¿Cómo reservo una habitación?", a: "Desde la ficha de Habitación puedes ver fotos, descripción y condiciones. Si te interesa, reservas directamente desde ahí abonando un depósito seguro con Stripe. Recibirás confirmación por email y podrás seguir el estado desde tu dashboard." },
      { q: "¿Qué pasa si no hay habitaciones en mi zona?", a: "Puedes dejar tu solicitud: el sistema la registra como lead de demanda. Te avisaremos cuando haya disponibilidad cercana." },
      { q: "¿Es reembolsable el depósito?", a: "Depende del caso y del estado de la reserva/contrato. Consulta las condiciones en el flujo de pago antes de confirmar." },
    ],
  },
  {
    title: "Propietarios",
    items: [
      { q: "¿Qué cédula o requisitos legales necesito?", a: "Varía por comunidad/municipio. Usa el verificador de cédula en Propietarios y completa los datos del inmueble para conocer la situación. El sistema te guiará paso a paso." },
      { q: "¿Cómo cobro los alquileres?", a: "Mediante transferencia. En tu Dashboard de Propietario puedes subir el IBAN y la documentación. El sistema liquida automáticamente según contrato." },
      { q: "¿Quién gestiona a los inquilinos?", a: "SpainRoom actúa como intermediario y gestor. Nos encargamos de la publicación, reservas, verificación y contratos digitales." },
    ],
  },
  {
    title: "Franquiciados",
    items: [
      { q: "¿Cómo me hago franquiciado?", a: "Rellena la candidatura desde la sección Franquiciados y sube la documentación inicial. Tras aprobarse y firmar el contrato, se activa tu panel para publicar habitaciones." },
      { q: "¿Cómo publico una habitación?", a: "Desde el Dashboard de Franquiciado puedes subir fotos y ficha. El sistema adapta las imágenes y publica automáticamente en la web." },
      { q: "¿Cómo funcionan las comisiones?", a: "Según el contrato firmado. Cada habitación tiene una sub_ref con reparto claro; verás liquidaciones mensuales en tu panel." },
    ],
  },
  {
    title: "Pagos y seguridad",
    items: [
      { q: "¿Es seguro pagar con Stripe?", a: "Sí. Stripe es un procesador de pagos líder. No almacenamos tu tarjeta: el pago se realiza en entorno seguro y recibes justificante en tu email." },
      { q: "¿Cómo se guardan mis datos?", a: "Cumplimos principios de minimización y seguridad. Solo pedimos lo necesario y usamos cifrado/controles de acceso. Puedes ejercer tus derechos escribiéndonos desde Ayuda." },
    ],
  },
  {
    title: "Soporte y problemas comunes",
    items: [
      { q: "No recibo el correo de confirmación", a: "Revisa la carpeta de spam. Si no aparece, añade nuestro remitente a contactos y vuelve a intentarlo. También puedes verificar tu email desde el dashboard." },
      { q: "No puedo subir documentos/fotos", a: "Comprueba el tamaño/formatos permitidos (JPG/PNG/PDF). Si persiste, limpia la caché o prueba en ventana privada. Si sigue fallando, avísanos desde Ayuda." },
      { q: "Error al pagar", a: "Asegúrate de que la tarjeta está habilitada para compras online y que los datos son correctos. Si el error continúa, captura pantalla y contáctanos." },
    ],
  },
];

export default function FAQ(){
  const [query, setQuery] = useState("");
  const qn = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!qn) return FAQ_SECTIONS;
    return FAQ_SECTIONS.map(sec => ({
      ...sec,
      items: sec.items.filter(it =>
        it.q.toLowerCase().includes(qn) ||
        it.a.toLowerCase().includes(qn)
      )
    })).filter(sec => sec.items.length > 0);
  }, [qn]);

  // Styles
  const white = { color:"#fff" };
  const black = { color:"#000" };
  const card  = { background:"#fff", border:"1px solid #e6ebf3", borderRadius:12, padding:16 };
  const input = {flex:1, padding:"10px 12px", border:"1px solid #cfd6e4", borderRadius:10, color:"#000", background:"#fff"};

  return (
    <div className="container" style={{ padding:"24px 0" }}>
      <SEO title="Ayuda / FAQ — SpainRoom" description="Preguntas frecuentes para inquilinos, propietarios y franquiciados." />

      <StatusBar />

      <h2 style={{ margin:"12px 0 8px", ...white }}>Ayuda / FAQ</h2>
      <p className="note" style={{ ...white }}>Encuentra respuestas rápidas. Si necesitas más ayuda, escríbenos desde esta misma página.</p>

      {/* Buscador local */}
      <div style={{display:"flex", gap:8, margin:"12px 0"}}>
        <input
          type="search"
          placeholder="Buscar en FAQ (p.ej. 'cédula', 'depósito', 'fotos')"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          style={input}
          aria-label="Buscar en la ayuda"
        />
      </div>

      {/* Contenido */}
      {filtered.length === 0 ? (
        <div style={{marginTop:16, ...white}}>No encontramos resultados para “{query}”. Prueba con otras palabras.</div>
      ) : (
        filtered.map((sec, i) => (
          <section key={i} style={{ marginTop: 14 }}>
            <h3 style={{margin:"0 0 6px", ...white}}>{sec.title}</h3>
            {sec.items.map((it, j) => (
              <details key={j} style={{...card, margin:"8px 0", color:"#000"}}>
                <summary style={{cursor:"pointer", color:"#000"}}>{it.q}</summary>
                <div style={{marginTop:6, color:"#000"}}>{it.a}</div>
              </details>
            ))}
          </section>
        ))
      )}

      {/* Enlaces a paneles según rol */}
      <DashboardLinks />

      {/* Formulario de contacto embebido */}
      <section className="sr-card" style={{ marginTop: 16 }}>
        <h3 style={{ ...white }}>¿Sigue tu duda?</h3>
        <p style={{ ...white }}>Escríbenos desde aquí y te responderemos pronto:</p>
        <ContactForm />
      </section>
    </div>
  );
}
