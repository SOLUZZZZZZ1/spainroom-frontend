import { Link } from "react-router-dom";
import "./cardSpainRoom.css";

/**
 * Props:
 * - id (string)  -> para el enlace de detalles
 * - title, location, price, features[], image, badge
 * - onReserve()  -> callback al pulsar Reservar
 */
export default function CardSpainRoom({
  id,
  title,
  location,
  price,
  features = [],
  image = "/casa-diseno.jpg",
  badge,
  onReserve,
}) {
  return (
    <article className="sr-card">
      <figure className="sr-card__figure">
        <img src={image} alt={title} className="sr-card__img" loading="lazy" />
        {badge ? <figcaption className="sr-card__badge">{badge}</figcaption> : null}
      </figure>

      <div className="sr-card__body">
        <header className="sr-card__header">
          <h3 className="sr-card__title" title={title}>{title}</h3>
          <div className="sr-card__price">
            {new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(price)}
            <span className="sr-card__period">/mes</span>
          </div>
        </header>

        <p className="sr-card__location">{location}</p>

        {features?.length > 0 && (
          <ul className="sr-card__features">
            {features.slice(0, 4).map((f, i) => (
              <li key={i} className="sr-chip">{f}</li>
            ))}
          </ul>
        )}

        <footer className="sr-card__footer">
          <button
            type="button"
            className="sr-btn-brand"
            onClick={onReserve}
          >
            Reservar
          </button>

          <Link
            to={`/habitaciones/${encodeURIComponent(id)}`}
            className="sr-btn-ghost"
          >
            Ver detalles
          </Link>
        </footer>
      </div>
    </article>
  );
}
