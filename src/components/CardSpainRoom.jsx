import RoomImage from "./RoomImage";

/**
 * Tarjeta reutilizable SpainRoom
 * Props:
 * - title, subtitle, price, extra
 * - imageSrc: ruta de imagen (p.ej. "/fotos/hab1.jpg" o URL)
 * - children: contenido libre (lista de features, etc.)
 * - footer: zona inferior (botones, links)
 */
export default function CardSpainRoom({
  title,
  subtitle,
  price,
  extra,
  imageSrc,
  children,
  footer,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      {/* Imagen (opcional). Si no pasas imageSrc, usa fallback */}
      <div className="p-4 pb-0">
        <RoomImage src={imageSrc} alt={title || "Habitación SpainRoom"} />
      </div>

      {/* Contenido */}
      <div className="p-5">
        {(title || subtitle) && (
          <div className="mb-3">
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
        )}

        {price && <div className="text-blue-600 font-semibold">{price}</div>}
        {extra && <div className="text-sm text-gray-700 mt-1">{extra}</div>}

        {children && <div className="mt-3 text-gray-800">{children}</div>}

        {footer && (
          <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
