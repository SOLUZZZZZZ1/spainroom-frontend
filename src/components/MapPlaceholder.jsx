import "./mapPlaceholder.css";

/**
 * Mapa placeholder sin dependencias externas.
 * Muestra coordenadas y un recuadro estilo “mapa”.
 * Props:
 * - lat: number
 * - lng: number
 * - label?: string
 */
export default function MapPlaceholder({ lat, lng, label }) {
  return (
    <div className="sr-map">
      <div className="sr-map__header">
        <strong>Mapa</strong>
        {label ? <span className="sr-map__label">{label}</span> : null}
      </div>
      <div className="sr-map__canvas" role="img" aria-label="Mapa de ubicación">
        <div className="sr-map__crosshair" />
        <div className="sr-map__coords">
          <span>Lat: {lat?.toFixed?.(5) ?? "—"}</span>
          <span>Lng: {lng?.toFixed?.(5) ?? "—"}</span>
        </div>
      </div>
      <p className="sr-map__note">
        Próximamente: mapa real (Leaflet/Mapbox/Google). Este es un placeholder visual.
      </p>
    </div>
  );
}
