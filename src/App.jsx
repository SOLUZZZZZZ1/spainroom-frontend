import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Inicio from "./pages/Inicio.jsx";
import Listado from "./pages/Listado.jsx";
import Propietarios from "./pages/Propietarios.jsx";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/listado" element={<Listado />} />
        <Route path="/propietarios" element={<Propietarios />} />
        {/* Cualquier ruta desconocida redirige a Inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, padding: 16 }}>
        © {new Date().getFullYear()} SpainRoom
      </footer>
    </div>
  );
}
