// src/pages/Privacidad.jsx
import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

export default function Privacidad() {
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
        title="Política de Privacidad — SpainRoom"
        description="Política de privacidad de SpainRoom sobre datos personales, verificación de identidad, documentación, reservas y derechos RGPD."
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
            SpainRoom<sup>®</sup> · Privacidad y protección de datos
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
            Política de Privacidad
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
            SpainRoom protege la privacidad y la seguridad de los datos de propietarios,
            inquilinos y usuarios de la plataforma.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px 42px" }}>
        <div className="sr-privacy-grid">
          <aside style={{ display: "grid", gap: 14 }}>
            <div style={card}>
              <h2 style={{ ...sectionTitle, fontSize: 20 }}>Resumen</h2>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li style={li}>Tratamos datos para gestionar habitaciones, reservas y verificaciones.</li>
                <li style={li}>Podemos solicitar documentación identificativa y selfie de verificación.</li>
                <li style={li}>Usamos proveedores tecnológicos como alojamiento web y pasarelas de pago.</li>
                <li style={li}>Puedes ejercer tus derechos escribiendo a admin@spainroom.es.</li>
              </ul>
            </div>

            <div style={{ ...card, background: "linear-gradient(135deg, #eef6ff 0%, #ffffff 100%)" }}>
              <h2 style={{ ...sectionTitle, fontSize: 20 }}>Contacto privacidad</h2>
              <p style={p}>
                Para cualquier cuestión relativa a protección de datos puedes escribir a:
              </p>
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
              <h2 style={sectionTitle}>1. Responsable del tratamiento</h2>
              <p style={p}>
                El responsable del tratamiento de los datos personales tratados a través de la
                plataforma es:
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
                <div><strong>Email:</strong> admin@spainroom.es</div>
              </div>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>2. Datos personales que podemos tratar</h2>
              <p style={p}>
                En función del uso de la plataforma, SpainRoom puede tratar las siguientes
                categorías de datos:
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={li}>Nombre y apellidos.</li>
                <li style={li}>Correo electrónico y teléfono.</li>
                <li style={li}>Datos facilitados en formularios de contacto, reserva o alta.</li>
                <li style={li}>Datos de habitaciones, reservas, fechas, disponibilidad y comunicaciones.</li>
                <li style={li}>Documento de identidad, DNI, NIE, pasaporte o documentación equivalente.</li>
                <li style={li}>Factura o justificante del número de teléfono declarado, cuando sea necesario para la verificación.</li>
                <li style={li}>Selfie o evidencia de verificación de identidad, cuando el proceso lo requiera.</li>
                <li style={li}>Documentación aportada voluntariamente por propietarios, inquilinos o franquiciados.</li>
              </ul>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>3. Finalidades del tratamiento</h2>
              <p style={p}>
                Los datos se tratan para prestar los servicios propios de SpainRoom y gestionar
                la relación con propietarios, inquilinos y usuarios interesados.
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={li}>Gestionar solicitudes de información y contacto.</li>
                <li style={li}>Publicar, revisar y gestionar habitaciones.</li>
                <li style={li}>Gestionar reservas, depósitos y comunicaciones asociadas.</li>
                <li style={li}>Verificar la identidad de los usuarios cuando sea necesario.</li>
                <li style={li}>Revisar documentación aportada por propietarios o inquilinos.</li>
                <li style={li}>Prevenir fraude, suplantación de identidad o usos indebidos de la plataforma.</li>
                <li style={li}>Preparar contratos, firmas electrónicas o expedientes cuando el servicio lo requiera.</li>
                <li style={li}>Cumplir obligaciones legales, administrativas, fiscales o contractuales.</li>
              </ul>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>4. Base jurídica</h2>
              <p style={p}>
                El tratamiento de datos puede basarse en una o varias de las siguientes bases:
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={li}><strong>Consentimiento:</strong> cuando el usuario facilita sus datos voluntariamente.</li>
                <li style={li}><strong>Ejecución de medidas precontractuales o contractuales:</strong> para gestionar reservas, solicitudes y servicios.</li>
                <li style={li}><strong>Cumplimiento de obligaciones legales:</strong> cuando sea necesario conservar o comunicar información por obligación normativa.</li>
                <li style={li}><strong>Interés legítimo:</strong> para proteger la seguridad de la plataforma, prevenir fraude y atender consultas.</li>
              </ul>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>5. Proveedores y destinatarios</h2>
              <p style={p}>
                SpainRoom puede utilizar proveedores tecnológicos necesarios para operar la
                plataforma. Estos proveedores solo accederán a los datos cuando sea necesario
                para prestar sus servicios.
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={li}>Servicios de alojamiento web, infraestructura y bases de datos.</li>
                <li style={li}>Servicios de correo electrónico y comunicaciones.</li>
                <li style={li}>Pasarelas de pago, como Stripe, para gestionar depósitos o pagos seguros.</li>
                <li style={li}>Servicios de verificación documental o identidad, cuando estén integrados.</li>
                <li style={li}>Servicios de firma electrónica, como Logalty u otros equivalentes, cuando se incorporen al flujo contractual.</li>
                <li style={li}>Autoridades públicas, juzgados o administraciones cuando exista obligación legal.</li>
              </ul>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>6. Conservación de los datos</h2>
              <p style={p}>
                Los datos se conservarán durante el tiempo necesario para gestionar la relación
                con el usuario, prestar los servicios solicitados y cumplir las obligaciones legales
                aplicables.
              </p>
              <p style={p}>
                Cuando los datos dejen de ser necesarios, podrán mantenerse bloqueados durante
                los plazos legales de prescripción para atender posibles responsabilidades.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>7. Seguridad y verificación</h2>
              <p style={p}>
                SpainRoom puede aplicar medidas de verificación de identidad y revisión documental
                para proteger a propietarios, inquilinos y a la propia plataforma.
              </p>
              <p style={p}>
                Estas medidas pueden incluir la solicitud de documento identificativo, selfie,
                comprobación del número de teléfono declarado, revisión de documentación y
                conservación de evidencias asociadas al expediente.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>8. Derechos de los usuarios</h2>
              <p style={p}>
                Cualquier usuario puede ejercer, en los términos previstos por la normativa aplicable,
                los siguientes derechos:
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={li}>Acceso a sus datos personales.</li>
                <li style={li}>Rectificación de datos inexactos.</li>
                <li style={li}>Supresión de datos cuando proceda.</li>
                <li style={li}>Limitación del tratamiento.</li>
                <li style={li}>Oposición al tratamiento.</li>
                <li style={li}>Portabilidad de los datos.</li>
              </ul>
              <p style={p}>
                Para ejercer estos derechos, el usuario puede escribir a{" "}
                <a href="mailto:admin@spainroom.es" style={{ color: "#0A58CA", fontWeight: 900 }}>
                  admin@spainroom.es
                </a>
                , indicando el derecho que desea ejercer y aportando información suficiente para
                verificar su identidad.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>9. Actualizaciones</h2>
              <p style={p}>
                SpainRoom podrá actualizar esta Política de Privacidad para adaptarla a cambios
                normativos, técnicos o funcionales de la plataforma.
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
        .sr-privacy-grid {
          display: grid;
          grid-template-columns: .85fr 1.65fr;
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .sr-privacy-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
