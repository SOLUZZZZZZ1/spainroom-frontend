// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import PhoneBadge from "./components/PhoneBadge.jsx";
import TopbarHider from "./components/TopbarHider.jsx";
import SOSButton from "./components/SOSButton.jsx";
import ContactWidget from "./components/ContactWidget.jsx";

import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* Páginas principales (no lazy) para evitar “pantalla negra” */
import Inicio from "./pages/Inicio.jsx";
import Propietarios from "./pages/Propietarios.jsx";
import Inquilinos from "./pages/Inquilinos.jsx";
import Oportunidades from "./pages/Oportunidades.jsx";
import Franquiciados from "./pages/Franquiciados.jsx";
import Habitaciones from "./pages/Habitaciones.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Reservas from "./pages/Reservas.jsx";
import TramitarCedula from "./pages/TramitarCedula.jsx";

/* Dashboards en lazy */
const DashProp   = React.lazy(() => import("./pages/dashboards/DashboardPropietario.jsx"));
const DashInq    = React.lazy(() => import("./pages/dashboards/DashboardInquilino.jsx"));
const DashFranq  = React.lazy(() => import("./pages/dashboards/DashboardFranquiciado.jsx"));
const DashEquipo = React.lazy(() => import("./pages/dashboards/DashboardEquipo.jsx"));

const Fallback = () => (
  <div style={{ minHeight: "40vh", display: "grid", placeItems: "center", color: "#fff", opacity: 0.9 }}>
    <div
      style={{
        background: "rgba(255,255,255,.12)",
        border: "1px solid rgba(255,255,255,.25)",
        padding: "16px 20px",
        borderRadius: 12,
        fontWeight: 800,
      }}
    >
      Cargando panel…
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        <Navbar />
        <PhoneBadge />     {/* Teléfono arriba-derecha (oculto en internas) */}
        <TopbarHider />    {/* Oculta Nora/WhatsApp/Llamar si se cuelan del topbar antiguo */}

        {/* Rutas principales en caliente (sin suspense) */}
        <Routes>
          <Route path="/"               element={<Inicio />} />
          <Route path="/propietarios"   element={<Propietarios />} />
          <Route path="/inquilinos"     element={<Inquilinos />} />
          <Route path="/oportunidades"  element={<Oportunidades />} />
          <Route path="/franquiciados"  element={<Franquiciados />} />
          <Route path="/habitaciones"   element={<Habitaciones />} />
          <Route path="/reservas"       element={<Reservas />} />
          <Route path="/tramitar-cedula"element={<TramitarCedula />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboards bajo Suspense */}
          <Route
            path="/dashboard/propietario"
            element={
              <Suspense fallback={<Fallback />}>
                <ProtectedRoute roles={["propietario", "admin"]}>
                  <DashProp />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/dashboard/inquilino"
            element={
              <Suspense fallback={<Fallback />}>
                <ProtectedRoute roles={["inquilino", "admin"]}>
                  <DashInq />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/dashboard/franquiciado"
            element={
              <Suspense fallback={<Fallback />}>
                <ProtectedRoute roles={["franquiciado", "admin"]}>
                  <DashFranq />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <Suspense fallback={<Fallback />}>
                <ProtectedRoute roles={["admin", "equipo"]}>
                  <DashEquipo />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Widgets globales */}
        <ContactWidget />
        <SOSButton />
      </div>
    </AuthProvider>
  );
}
