import { useState } from "react";

/**
 * Imagen de habitación con fallback y corte correcto.
 * - src: ruta de la imagen (public o URL absoluta)
 * - alt: texto alternativo
 * - height: altura del contenedor (por defecto 10rem ~ 160px)
 */
export default function RoomImage({ src, alt = "Habitación", height = "h-40" }) {
  const [failed, setFailed] = useState(false);
  const fallback = "/casa-diseno.jpg"; // asegúrate de que existe en public/
  const url = !src || failed ? fallback : src;

  return (
    <div className={`w-full ${height} rounded-xl overflow-hidden bg-gray-100`}>
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
        loading="lazy"
      />
    </div>
  );
}
