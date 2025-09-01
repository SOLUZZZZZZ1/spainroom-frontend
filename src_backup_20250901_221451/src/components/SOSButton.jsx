import { useEffect, useState } from "react";

const SUPPORT_EMAIL = "soporte@spainroom.com";

export default function SOSButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onEsc(e) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  function sendEmail() {
    const subject = encodeURIComponent("SOS SpainRoom - Solicitud de ayuda");
    const body = encodeURIComponent(`Hola SpainRoom, necesito ayuda urgente.\n\nPÃ¡gina: ${window.location.href}\nFecha/Hora: ${new Date().toLocaleString()}\n`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }
  function openWhatsApp() { window.open(WHATSAPP_LINK, "_blank", "noopener,noreferrer"); }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir SOS"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)", right: "20px" }}
        className="fixed z-50 w-16 h-16 rounded-full bg-red-600 text-white font-bold shadow-lg flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-red-300"
      >
        <span className="relative inline-flex">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full w-16 h-16 items-center justify-center">SOS</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-white shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900">Ayuda / SOS</h2>
            <p className="text-sm text-gray-600 mt-1">Usa <strong>112</strong> solo para emergencias reales.</p>
            <div className="mt-5 grid gap-3">
              <a href="tel:112" className="w-full inline-flex items-center justify-center rounded-xl bg-red-600 text-white font-semibold py-3 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300">Llamar 112 (emergencias)</a>
              <button onClick={sendEmail} className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">Enviar SOS por email</button>
              <button onClick={openWhatsApp} className="w-full inline-flex items-center justify-center rounded-xl bg-green-600 text-white font-semibold py-3 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300">Contactar por WhatsApp</button>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}