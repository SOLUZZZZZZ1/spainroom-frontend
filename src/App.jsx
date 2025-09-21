// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* Core UI (sin imports opcionales para no romper nada) */
import Navbar from "./components/Navbar.jsx";
import PhoneBadge from "./components/PhoneBadge.jsx";
import TopbarHider from "./components/TopbarHider.jsx";
import SOSButton from "./components/SOSButton.jsx";

/* Páginas (importes directos, SIN lazy/Suspense) */
import Inicio from "./pages/Inicio.jsx";
import Propietarios from "./pages/Propietarios.jsx";
import Inquilinos from "./pages/Inquilinos.jsx";
import Habitaciones from "./pages/Habitaciones.jsx";
import Oportunidades from "./pages/Oportunidades.jsx";
import Franquiciados from "./pages/Franquiciados.jsx";
import Reservas from "./pages/Reservas.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Habitacion from "./pages/Habitacion.jsx"; // ficha dinámica: /habitacion/:roomId

/* Wrapper de página: scrollTop + capa base anti-“negro” */
function Page({ children }) {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    // fuerza repaint por si queda algo pendiente de pintar
    // eslint-disable-next-line no-unused-expressions
    document.body.offsetHeight;
  }, [pathname]);

  return (
    <div className="sr-page">
      <div className="sr-page-base" />
      <div className="sr-page-content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PhoneBadge />
      <TopbarHider />

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Page><Inicio /></Page>} />
        <Route path="/propietarios"  element={<Page><Propietarios /></Page>} />
        <Route path="/inquilinos"    element={<Page><Inquilinos /></Page>} />
        <Route path="/habitaciones"  element={<Page><Habitaciones /></Page>} />
        <Route path="/habitacion/:roomId" element={<Page><Habitacion /></Page>} />
        <Route path="/oportunidades" element={<Page><Oportunidades /></Page>} />
        <Route path="/franquiciados" element={<Page><Franquiciados /></Page>} />
        <Route path="/reservas"      element={<Page><Reservas /></Page>} />

        {/* Hub / login */}
        <Route path="/admin"         element={<Page><Admin /></Page>} />
        <Route path="/login"         element={<Page><Login /></Page>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Si NO tienes ContactWidget, no lo importes para evitar errores. */}
      <SOSButton />
    </div>
  );
}
