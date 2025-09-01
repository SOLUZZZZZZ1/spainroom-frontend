// src/screens/Inicio.jsx
import logo from "../assets/logo.png";

export default function Inicio() {
  return (
    <main
      className="min-h-[calc(100vh-56px)] bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/casa-diseno.jpg')" }}
    >
      <div className="bg-black/35 rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center text-white shadow-xl">
        <img
          src={logo}
          alt="SpainRoom - Los que saben"
          className="mx-auto mb-6 w-52 md:w-64 lg:w-72 select-none pointer-events-none"
          draggable="false"
        />
        <h1 className="text-2xl md:text-3xl font-semibold mb-3">
          Bienvenido a SpainRoom
        </h1>
        <p className="text-base md:text-lg leading-relaxed">
          Encuentra habitaciones listas para entrar a vivir en las mejores zonas.
          SpainRoom conecta personas, viviendas y oportunidades. Confiable,
          moderno y cercano.
        </p>
      </div>
    </main>
  );
}
