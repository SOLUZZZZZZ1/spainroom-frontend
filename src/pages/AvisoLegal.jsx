// src/pages/AvisoLegal.jsx
import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

export default function AvisoLegal() {
  const updated = "13 de junio de 2026";

  const card = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  };

  const sectionTitle = {
    margin: "0 0 10px",
    fontSize: 22,
    color: "#0b1220",
    fontWeight: 950,
  };

  const p = {
    margin: "0 0 10px",
    color: "#475569",
    lineHeight: 1.7,
  };

  const li = {
    marginBottom: 8,
    color: "#475569",
    lineHeight: 1.6,
  };

  return (
    <main style={{ background: "#f8fafc", minHeight: "100vh", color: "#0b1220" }}>
      <SEO
        title="Aviso Legal — SpainRoom"
        description="Aviso legal de SpainRoom: titularidad, condiciones de uso, propiedad intelectual, reservas, intermediación y responsabilidad."
      />

      <section
        style={{
          background: "linear-gradient(135deg, #0b65d8 0%, #084fa8 100%)",
          color: "#ffffff",
          padding: "54px 16px",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,.14)",
              border: "1px solid rgba(255,255,255,.24)",
              borderRadius: 999,
              padding: "7px 12px",
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            SpainRoom<sup>®</sup> · Información legal
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: 1.05,
              fontWeight: 950,
              letterSpacing: "-.03em",
            }}
          >
            Aviso Legal
          </h1>

          <p
            style={{
              margin: "14px 0 0",
              maxWidth: 820,
              color: "rgba(255,255,255,.9)",
              fontSize: 18,
              lineHeight: 1.6,
              fontWeight: 600,
            }}
          >
            Información sobre el titular del sitio web, condiciones de uso,
            intermediación, reservas y propiedad intelectual de SpainRoom.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px 42px" }}>
        <div className="sr-legal-grid">
          <aside style={{ display: "grid", gap: 14 }}>
            <div style={card}>
              <h2 style={{ ...sectionTitle, fontSize: 20 }}>Datos del titular</h2>
              <div style={{ color: "#475569", lineHeight: 1.8, fontWeight: 700 }}>
                <div><strong>Titular:</strong> Tecnología Habitacional, S.L.</div>
                <div><strong>Marca:</strong> SpainRoom<sup>®</sup></div>
                <div><strong>NIF:</strong> pendiente de asignación</div>
                <div><strong>Domicilio:</strong> pendiente de actualización</div>
                <div><strong>Email:</strong> admin@spainroom.es</div>
              </div>
            </div>

            <div style={{ ...card, background: "linear-gradient(135deg, #eef6ff 0%, #ffffff 100%)" }}>
              <h2 style={{ ...sectionTitle, fontSize: 20 }}>Contacto legal</h2>
              <p style={p}>Para cuestiones legales o corporativas puedes escribir a:</p>
              <a
                href="mailto:admin@spainroom.es"
                style={{ color: "#0A58CA", fontWeight: 950, textDecoration: "none" }}
              >
                admin@spainroom.es
              </a>
            </div>
          </aside>

          <div style={{ display: "grid", gap: 16 }}>
            <section style={card}>
              <h2 style={sectionTitle}>1. Información del titular</h2>
              <p style={p}>
                En cumplimiento de las obligaciones de información aplicables, se informa a los
                usuarios de que el presente sitio web opera bajo la marca SpainRoom<sup>®</sup>.
              </p>
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  color: "#334155",
                  lineHeight: 1.8,
                  fontWeight: 700,
                }}
              >
                <div><strong>Titular:</strong> Tecnología Habitacional, S.L.</div>
                <div><strong>Marca comercial:</strong> SpainRoom<sup>®</sup></div>
                <div><strong>NIF:</strong> pendiente de asignación</div>
                <div><strong>Domicilio social:</strong> pendiente de actualización</div>
                <div><strong>Correo electrónico:</strong> admin@spainroom.es</div>
              </div>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>2. Objeto del sitio web</h2>
              <p style={p}>
                SpainRoom es una plataforma tecnológica destinada a facilitar la publicación,
                búsqueda, gestión y reserva de habitaciones entre propietarios e inquilinos.
              </p>
              <p style={p}>
                La plataforma puede ofrecer herramientas de comunicación, verificación documental,
                reserva, gestión de habitaciones y otros servicios relacionados con la intermediación
                habitacional.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>3. Condiciones de uso</h2>
              <p style={p}>
                El acceso y uso de este sitio web atribuye la condición de usuario e implica la
                aceptación de este Aviso Legal y de las demás políticas publicadas en la plataforma.
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={li}>Utilizar la web de forma lícita, diligente y conforme a la buena fe.</li>
                <li style={li}>Facilitar información veraz, completa y actualizada.</li>
                <li style={li}>No utilizar la plataforma con fines fraudulentos, ilícitos o contrarios a la normativa.</li>
                <li style={li}>No dañar, bloquear, sobrecargar o alterar el funcionamiento del sitio web.</li>
                <li style={li}>No suplantar la identidad de terceros ni aportar documentación falsa.</li>
              </ul>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>4. Propietarios, habitaciones y documentación</h2>
              <p style={p}>
                Los propietarios o usuarios que publiquen información sobre habitaciones son
                responsables de la veracidad de los datos, fotografías, precios, disponibilidad,
                condiciones, licencias, cédulas, certificados o documentación aportada.
              </p>
              <p style={p}>
                SpainRoom podrá realizar revisiones, verificaciones documentales o controles internos,
                pero no garantiza la exactitud absoluta de toda la información facilitada por terceros.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>5. Reservas, pagos e intermediación</h2>
              <p style={p}>
                Las reservas realizadas a través de SpainRoom estarán sujetas a disponibilidad,
                validación y condiciones específicas aplicables en cada caso.
              </p>
              <p style={p}>
                SpainRoom actúa como plataforma tecnológica e intermediaria entre propietarios e
                inquilinos. Determinados pagos o depósitos podrán gestionarse mediante proveedores
                externos de pago, como Stripe u otros servicios equivalentes.
              </p>
              <p style={p}>
                La aceptación definitiva de una reserva podrá condicionarse a la verificación de datos,
                documentación, identidad, disponibilidad de la habitación y cumplimiento de los requisitos
                establecidos por la plataforma.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>6. Verificación de identidad y documentación</h2>
              <p style={p}>
                Con el fin de proteger a propietarios, inquilinos y usuarios, SpainRoom podrá solicitar
                procesos de verificación y documentación adicional.
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={li}>Documento de identidad, DNI, NIE, pasaporte o documento equivalente.</li>
                <li style={li}>Comprobante del número de teléfono declarado.</li>
                <li style={li}>Selfie o prueba de verificación de identidad.</li>
                <li style={li}>Documentación complementaria necesaria para el expediente.</li>
                <li style={li}>Firma electrónica o evidencias contractuales cuando se integren estos servicios.</li>
              </ul>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>7. Servicios de terceros</h2>
              <p style={p}>
                SpainRoom puede utilizar servicios prestados por terceros para el funcionamiento de la
                plataforma, incluyendo servicios de alojamiento, correo electrónico, pagos, verificación,
                analítica, firma electrónica o soporte técnico.
              </p>
              <p style={p}>
                Cada proveedor será responsable de sus propias condiciones, políticas y funcionamiento.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>8. Propiedad intelectual e industrial</h2>
              <p style={p}>
                Todos los contenidos del sitio web, incluyendo textos, diseño, logotipos, iconos, gráficos,
                software, código, estructura, bases de datos, documentación y demás elementos, están protegidos
                por la normativa de propiedad intelectual e industrial.
              </p>
              <p style={p}>
                SpainRoom<sup>®</sup> es una marca comercial protegida. Queda prohibida la reproducción,
                distribución, transformación, comunicación pública o uso no autorizado de los contenidos,
                signos distintivos o elementos de la plataforma.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>9. Limitación de responsabilidad</h2>
              <p style={p}>
                SpainRoom realiza esfuerzos razonables para mantener la plataforma disponible, segura y
                actualizada. No obstante, no garantiza la disponibilidad permanente del servicio ni la ausencia
                absoluta de errores técnicos.
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={li}>Información incorrecta o incompleta facilitada por usuarios o terceros.</li>
                <li style={li}>Incidencias técnicas, interrupciones, errores de conectividad o mantenimiento.</li>
                <li style={li}>Actuaciones de propietarios, inquilinos, franquiciados o terceros ajenos a la plataforma.</li>
                <li style={li}>Contenidos o servicios de páginas externas enlazadas desde la web.</li>
              </ul>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>10. Protección de datos</h2>
              <p style={p}>
                El tratamiento de datos personales se regula en la Política de Privacidad de SpainRoom,
                disponible en la sección correspondiente del sitio web.
              </p>
              <Link to="/privacidad" style={{ color: "#0A58CA", fontWeight: 950, textDecoration: "none" }}>
                Ver Política de Privacidad
              </Link>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>11. Legislación aplicable</h2>
              <p style={p}>
                Este Aviso Legal se rige por la legislación española. Las partes se someterán a los juzgados
                y tribunales que resulten competentes conforme a la normativa aplicable.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>12. Actualizaciones</h2>
              <p style={p}>
                SpainRoom podrá modificar este Aviso Legal para adaptarlo a cambios normativos, técnicos,
                operativos o de negocio.
              </p>
              <p style={{ ...p, marginBottom: 0 }}>
                Última actualización: <strong>{updated}</strong>.
              </p>
            </section>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                to="/contacto"
                style={{
                  background: "#0A58CA",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "11px 14px",
                  borderRadius: 12,
                  fontWeight: 900,
                }}
              >
                Contactar con SpainRoom
              </Link>
              <Link
                to="/cookies"
                style={{
                  background: "#fff",
                  color: "#0A58CA",
                  border: "1px solid #cfe0ff",
                  textDecoration: "none",
                  padding: "11px 14px",
                  borderRadius: 12,
                  fontWeight: 900,
                }}
              >
                Ver política de cookies
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .sr-legal-grid {
          display: grid;
          grid-template-columns: .85fr 1.65fr;
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .sr-legal-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
