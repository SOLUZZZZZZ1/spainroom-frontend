import { useParams, Link } from "react-router-dom";

export default function HabitacionDetalle() {
  const { id } = useParams();

  // Habitaciones ficticias con imágenes de /public/images
  const habitaciones = Array.from({ length: 12 }, (_, i) => ({
    id: (i + 1).toString(),
    titulo: `Habitación ${i + 1}`,
    descripcion:
      "Habitación luminosa, amueblada y lista para entrar a vivir. Incluye servicios básicos y se encuentra en una ubicación excelente.",
    precio: 350 + (i % 4) * 50,
    imagen: `/images/habitacion${i + 1}.jpg`,
    direccion: `Calle Ejemplo nº${10 + i}, Ciudad`,
    metros: 12 + (i % 5) * 2,
  }));

  const habitacion = habitaciones.find((h) => h.id === id);

  if (!habitacion) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          ❌ Habitación no encontrada
        </h2>
        <Link
          to="/listado"
          className="text-blue-700 underline hover:text-blue-900"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img
            src={habitacion.imagen}
            alt={habitacion.titulo}
            className="w-full h-72 object-cover bg-gray-200"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/casa-diseno.jpg")}
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {habitacion.titulo}
            </h2>
            <p className="text-gray-600 mb-4">{habitacion.descripcion}</p>

            <ul className="text-gray-700 mb-4 space-y-1">
              <li>
                <strong>📍 Dirección:</strong> {habitacion.direccion}
              </li>
              <li>
                <strong>📐 Metros cuadrados:</strong> {habitacion.metros} m²
              </li>
              <li>
                <strong>💶 Precio:</strong>{" "}
                <span className="text-blue-700 font-bold">
                  {habitacion.precio} €/mes
                </span>
              </li>
            </ul>

            <div className="flex justify-between mt-6">
              <Link
                to="/listado"
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Volver
              </Link>
              <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
                Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
