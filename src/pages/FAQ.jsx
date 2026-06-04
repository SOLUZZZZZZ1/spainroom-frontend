// src/pages/FAQ.jsx
import React, { useMemo, useState } from "react";
import SEO from "../components/SEO.jsx";
import DashboardLinks from "../components/DashboardLinks.jsx";
import ContactForm from "../components/ContactForm.jsx";

const FAQ_SECTIONS = [
  {
    title: "Inquilinos",
    intro: "Todo lo necesario para encontrar, reservar y entrar en una habitación.",
    items: [
      {
        q: "¿Qué documentación necesito para empezar?",
        a: "DNI/NIE o pasaporte, factura reciente del móvil declarado y un selfie para verificación de identidad. Si eres estudiante o trabajador, puedes adjuntar matrícula, contrato o justificante para agilizar el proceso.",
      },
      {
        q: "¿Cómo reservo una habitación?",
        a: "Desde la ficha de la habitación puedes ver fotos, descripción y condiciones. Si te interesa, reservas directamente desde ahí abonando un depósito seguro con Stripe. Recibirás confirmación por email y podrás seguir el estado desde tu panel.",
      },
      {
        q: "¿Qué pasa si no hay habitaciones en mi zona?",
        a: "Puedes dejar tu solicitud. El sistema la registra como demanda activa y te avisaremos cuando haya disponibilidad cercana.",
      },
      {
        q: "¿Es reembolsable el depósito?",
        a: "Depende del estado de la reserva y de las condiciones aceptadas antes del pago. Siempre revisa las condiciones del flujo de reserva antes de confirmar.",
      },
    ],
  },
  {
    title: "Propietarios",
    intro: "Información para publicar viviendas, validar requisitos y gestionar cobros.",
    items: [
      {
        q: "¿Qué cédula o requisitos legales necesito?",
        a: "Depende de la comunidad autónoma y del municipio. Desde la sección Propietarios puedes completar los datos del inmueble y revisar la situación. SpainRoom te guiará paso a paso.",
      },
      {
        q: "¿Cómo cobro los alquileres?",
        a: "Mediante transferencia bancaria. En tu panel podrás añadir el IBAN y la documentación necesaria. Las liquidaciones se realizan conforme al contrato firmado.",
      },
      {
        q: "¿Quién gestiona a los inquilinos?",
        a: "SpainRoom actúa como intermediario y gestor. Nos encargamos de la publicación, reservas, verificación documental y contratos digitales.",
      },
    ],
  },
  {
    title: "Franquiciados",
    intro: "Dudas habituales sobre candidatura, zona de trabajo y publicación de habitaciones.",
    items: [
      {
        q: "¿Cómo me hago franquiciado?",
        a: "Rellena la candidatura desde la sección Franquiciados y cuéntanos tu zona de interés. Tras revisar la solicitud y aprobarla, se activa el proceso de firma y acceso a tu panel.",
      },
      {
        q: "¿Cómo publico una habitación?",
        a: "Desde el panel de franquiciado puedes subir fotos, completar la ficha y preparar la publicación. El sistema adapta las imágenes y deja la habitación lista para mostrarse en la web.",
      },
      {
        q: "¿Cómo funcionan las comisiones?",
        a: "Las condiciones económicas se regulan en el contrato firmado. Cada operación queda identificada para que el reparto y las liquidaciones sean claros.",
      },
    ],
  },
  {
    title: "Pagos y seguridad",
    intro: "Pagos, datos personales y protección de la operación.",
    items: [
      {
        q: "¿Es seguro pagar con Stripe?",
        a: "Sí. Stripe es un procesador de pagos reconocido. SpainRoom no almacena los datos de tu tarjeta: el pago se realiza en un entorno seguro y recibes justificante por email.",
      },
      {
        q: "¿Cómo se guardan mis datos?",
        a: "Aplicamos criterios de minimización y seguridad. Solo pedimos la información necesaria para gestionar reservas, contratos y verificaciones. Puedes ejercer tus derechos escribiéndonos desde Ayuda.",
      },
    ],
  },
  {
    title: "Soporte y problemas comunes",
    intro: "Soluciones rápidas para incidencias habituales.",
    items: [
      {
        q: "No recibo el correo de confirmación",
        a: "Revisa la carpeta de spam o correo no deseado. Si no aparece, comprueba que el email esté bien escrito y vuelve a intentarlo.",
      },
      {
        q: "No puedo subir documentos o fotos",
        a: "Comprueba que el archivo sea JPG, PNG o PDF y que no supere el tamaño permitido. Si continúa el problema, prueba en ventana privada o desde otro navegador.",
      },
      {
        q: "Error al pagar",
        a: "Verifica que la tarjeta esté habilitada para compras online y que los datos sean correctos. Si el error continúa, guarda una captura de pantalla y contacta con nosotros desde esta página.",
      },
    ],
  },
];

export default function FAQ() {
  const [query, setQuery] = useState("");
  const qn = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!qn) return FAQ_SECTIONS;

    return FAQ_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const question = item.q.toLowerCase();
        const answer = item.a.toLowerCase();
        return question.includes(qn) || answer.includes(qn);
      }),
    })).filter((section) => section.items.length > 0);
  }, [qn]);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f4f8ff",
      padding: "32px 0 56px",
      color: "#0f172a",
    },
    wrap: {
      width: "min(1120px, calc(100% - 32px))",
      margin: "0 auto",
    },
    hero: {
      background: "linear-gradient(135deg, #0b65d8 0%, #0f7df0 100%)",
      borderRadius: 24,
      padding: "36px 34px",
      color: "#ffffff",
      boxShadow: "0 18px 45px rgba(11, 101, 216, 0.22)",
      marginBottom: 22,
    },
    eyebrow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(255,255,255,0.16)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: 999,
      padding: "7px 12px",
      fontWeight: 800,
      fontSize: 13,
      marginBottom: 14,
    },
    title: {
      margin: 0,
      fontSize: "clamp(30px, 4vw, 48px)",
      lineHeight: 1.08,
      letterSpacing: "-0.03em",
      color: "#ffffff",
    },
    subtitle: {
      margin: "14px 0 0",
      maxWidth: 760,
      fontSize: 17,
      lineHeight: 1.65,
      color: "rgba(255,255,255,0.92)",
    },
    searchCard: {
      background: "#ffffff",
      border: "1px solid #e3ebf7",
      borderRadius: 18,
      padding: 16,
      boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
      marginBottom: 22,
    },
    searchInput: {
      width: "100%",
      boxSizing: "border-box",
      padding: "15px 16px",
      border: "1px solid #cdd9ea",
      borderRadius: 14,
      color: "#0f172a",
      background: "#ffffff",
      fontSize: 15,
      outline: "none",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 18,
      alignItems: "start",
    },
    sectionCard: {
      background: "#ffffff",
      border: "1px solid #e3ebf7",
      borderRadius: 20,
      padding: 18,
      boxShadow: "0 12px 35px rgba(15, 23, 42, 0.06)",
    },
    sectionTitle: {
      margin: "0 0 6px",
      color: "#0b65d8",
      fontSize: 22,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    sectionIntro: {
      margin: "0 0 14px",
      color: "#475569",
      fontSize: 14,
      lineHeight: 1.55,
    },
    detail: {
      background: "#f8fbff",
      border: "1px solid #dfe8f5",
      borderRadius: 14,
      padding: "12px 14px",
      margin: "10px 0",
      color: "#0f172a",
    },
    summary: {
      cursor: "pointer",
      color: "#0f172a",
      fontWeight: 800,
      lineHeight: 1.45,
    },
    answer: {
      marginTop: 9,
      paddingTop: 9,
      borderTop: "1px solid #e5edf8",
      color: "#334155",
      lineHeight: 1.65,
      fontSize: 14,
    },
    noResults: {
      background: "#ffffff",
      border: "1px solid #e3ebf7",
      borderRadius: 18,
      padding: 20,
      color: "#334155",
      boxShadow: "0 12px 35px rgba(15, 23, 42, 0.06)",
    },
    panels: {
      marginTop: 22,
      background: "#ffffff",
      border: "1px solid #e3ebf7",
      borderRadius: 20,
      padding: 18,
      boxShadow: "0 12px 35px rgba(15, 23, 42, 0.06)",
    },
    contact: {
      marginTop: 22,
      background: "#ffffff",
      border: "1px solid #e3ebf7",
      borderRadius: 22,
      padding: "24px 22px",
      boxShadow: "0 16px 45px rgba(15, 23, 42, 0.08)",
      maxWidth: 880,
    },
    contactTitle: {
      margin: "0 0 8px",
      color: "#0b65d8",
      fontSize: 26,
      letterSpacing: "-0.02em",
    },
    contactText: {
      margin: "0 0 18px",
      color: "#475569",
      lineHeight: 1.6,
    },
  };

  return (
    <main style={styles.page}>
      <SEO
        title="Centro de ayuda — SpainRoom"
        description="Preguntas frecuentes para inquilinos, propietarios y franquiciados de SpainRoom."
      />

      <div style={styles.wrap}>
        <section style={styles.hero}>
          <div style={styles.eyebrow}>Ayuda SpainRoom</div>
          <h1 style={styles.title}>Centro de ayuda</h1>
          <p style={styles.subtitle}>
            Resuelve rápidamente tus dudas sobre habitaciones, reservas, propietarios, franquiciados,
            pagos y documentación. Si necesitas ayuda personalizada, puedes escribirnos al final de esta página.
          </p>
        </section>

        <section style={styles.searchCard} aria-label="Buscador de preguntas frecuentes">
          <input
            type="search"
            placeholder="Buscar en la ayuda: cédula, depósito, fotos, Stripe, documentos..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={styles.searchInput}
            aria-label="Buscar en el centro de ayuda"
          />
        </section>

        {filtered.length === 0 ? (
          <div style={styles.noResults}>
            No encontramos resultados para <strong>“{query}”</strong>. Prueba con otras palabras o escríbenos desde el formulario.
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((section) => (
              <section key={section.title} style={styles.sectionCard}>
                <h2 style={styles.sectionTitle}>{section.title}</h2>
                <p style={styles.sectionIntro}>{section.intro}</p>

                {section.items.map((item) => (
                  <details key={item.q} style={styles.detail}>
                    <summary style={styles.summary}>{item.q}</summary>
                    <div style={styles.answer}>{item.a}</div>
                  </details>
                ))}
              </section>
            ))}
          </div>
        )}

        

        <section style={styles.contact}>
          <h2 style={styles.contactTitle}>¿No encuentras lo que buscas?</h2>
          <p style={styles.contactText}>
            Escríbenos desde aquí y te responderemos lo antes posible. Cuanta más información nos des,
            más rápido podremos ayudarte.
          </p>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
