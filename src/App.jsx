import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SOSButton from "./components/SOSButton.jsx";

import Inicio from "./pages/Inicio.jsx";
import Listado from "./pages/Listado.jsx";
import Jobs from "./pages/Jobs.jsx";
import Reservas from "./pages/Reservas.jsx";
import Propietarios from "./pages/Propietarios.jsx";
import Admin from "./pages/Admin.jsx";
import Oportunidades from "./pages/Oportunidades.jsx";
import HabitacionDetalle from "./pages/HabitacionDetalle.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/listado" element={<Listado />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/propietarios" element={<Propietarios />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/oportunidades" element={<Oportunidades />} />
        <Route path="/habitaciones/:id" element={<HabitacionDetalle />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SOSButton />
    </>
  );
}
