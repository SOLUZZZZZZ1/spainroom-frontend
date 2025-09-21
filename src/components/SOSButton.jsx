// src/components/SOSButton.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./SOSButton.css";

const SUPPORT_EMAIL = "soporte@spainroom.es";
const WHATSAPP_LINK = "https://wa.me/34616232306?text=SOS%20SpainRoom%20Necesito%20ayuda";

export default function SOSButton() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const hiddenOn = useMemo(
    () => ["/propietarios", "/inquilinos", "/franquiciados", "/admin"],
    []
  );
  if (hiddenOn.some((p) => pathname.startsWith(p))) return null;

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  function sendEmail(){
    const subject = encodeURIComponent("SOS SpainRoom - Solicitud de ayuda");
    const body = encodeURIComponent(`Hola SpainRoom, necesito ayuda urgente.
    
Página: ${window.location.href}
Fecha/Hora: ${new Date().toLocaleString()}`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }
  function openWhatsApp(){
    window.open(WHATSAPP_LINK, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="sr-sos-wrap">
        <button className="sr-sos-btn" onClick={()=>setOpen(true)} aria-label="Abrir SOS">SOS</button>
      </div>

      {open && (
        <div className="sr-sos-modal" role="dialog" aria-modal="true">
          <div className="sr-sos-backdrop" onClick={()=>setOpen(false)} aria-hidden />
          <div className="sr-sos-card">
            <h2>Ayuda / SOS</h2>
            <p className="sr-sos-note">Usa <strong>112</strong> solo para emergencias reales.</p>
            <div className="sr-sos-actions">
              <a href="tel:112" className="sr-sos-action sr-sos-red">Llamar 112 (emergencias)</a>
              <button onClick={sendEmail} className="sr-sos-action sr-sos-blue">Enviar SOS por email</button>
              <button onClick={openWhatsApp} className="sr-sos-action sr-sos-green">Contactar por WhatsApp</button>
            </div>
            <div className="sr-sos-footer">
              <button onClick={()=>setOpen(false)} className="sr-sos-close">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
