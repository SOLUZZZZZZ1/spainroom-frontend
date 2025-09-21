import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-20 px-6 max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold">Página no encontrada</h1>
      <p className="mt-3 text-gray-700">La ruta que buscas no existe.</p>
      <Link to="/" className="inline-block mt-6 px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
        Volver al inicio
      </Link>
    </div>
  );
}
