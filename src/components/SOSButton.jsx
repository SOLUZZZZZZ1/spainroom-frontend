// src/components/SOSButton.jsx
import { useEffect, useState } from "react";
import "./SOSButton.css";

const SUPPORT_EMAIL = "soporte@spainroom.es";
const SUPPORT_PHONE = "+34616232306";
const WHATSAPP_LINK =
  "https://wa.me/34616232306?text=" +
  encodeURIComponent("SOS SpainRoom. Necesito ayuda.");

export default function SOSButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  function sendEmail() {
    const subject = encodeURIComponent("SOS SpainRoom - Solicitud de ayuda");
    const body = encodeURIComponent(
      `Hola SpainRoom, necesito ayuda.\n\nPágina: ${window.location.href}\nFecha/Hora: ${new Date().toLocaleString()}\n`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }

  function openWhatsApp() {
    window.open(WHATSAPP_LINK, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="sr-sos-wrap">
        <button
          type="button"
          className="sr-sos-btn"
          onClick={() => setOpen(true)}
          aria-label="Abrir ayuda SOS SpainRoom"
        >
          <span className="ring" aria-hidden="true" />
          SOS
        </button>
      </div>

      {open && (
        <div className="sr-sos-modal" role="dialog" aria-modal="true" aria-label="Ayuda SOS SpainRoom">
          <div className="sr-sos-backdrop" onClick={() => setOpen(false)} />

          <div className="sr-sos-card">
            <h2>Ayuda / SOS</h2>
            <p className="sr-sos-note">
              Usa <strong>112</strong> solo para emergencias reales. Para ayuda de SpainRoom, puedes contactar por email, WhatsApp o teléfono.
            </p>

            <div className="sr-sos-actions">
              <a className="sr-sos-action sr-sos-red" href="tel:112">Llamar 112 emergencias</a>
              <button type="button" className="sr-sos-action sr-sos-blue" onClick={sendEmail}>Enviar SOS por email</button>
              <button type="button" className="sr-sos-action sr-sos-green" onClick={openWhatsApp}>Contactar por WhatsApp</button>
              <a className="sr-sos-action sr-sos-blue" href={`tel:${SUPPORT_PHONE}`}>Llamar SpainRoom</a>
            </div>

            <div className="sr-sos-footer">
              <button type="button" className="sr-sos-close" onClick={() => setOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
