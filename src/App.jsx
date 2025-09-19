// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout / widgets
import Navbar from "./components/Navbar.jsx";
import SOSButton from "./components/SOSButton.jsx";
import ContactWidget from "./components/ContactWidget.jsx";
import CrashGate from "./components/CrashGate.jsx";

// Páginas no-lazy (si no existen, deja el import pero no se usan en la primera carga)
import TramitarCedula from "./pages/TramitarCedula.jsx";

// Auth + guardas
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// PAGES (lazy) — todas en ./pages/*
const Inicio        = React.lazy(() => import("./pages/Inicio.jsx"));
const Inquilinos    = React.lazy(() => import("./pages/Inquilinos.jsx"));
const Reservas      = React.lazy(() => import("./pages/Reservas.jsx"));
const Oportunidades = React.lazy(() => import("./pages/Oportunidades.jsx"));
const Franquiciados = React.lazy(() => import("./pages/Franquiciados.jsx"));
const Propietarios  = React.lazy(() => import("./pages/Propietarios.jsx"));
const Login         = React.lazy(() => import("./pages/Login.jsx"));
const Admin         = React.lazy(() => import("./pages/Admin.jsx"));

// Dashboards (por rol)
const DashProp   = React.lazy(() => import("./pages/dashboards/DashboardPropietario.jsx"));
const DashInq    = React.lazy(() => import("./pages/dashboards/DashboardInquilino.jsx"));
const DashFranq  = React.lazy(() => import("./pages/dashboards/DashboardFranquiciado.jsx"));
const DashEquipo = React.lazy(() => import("./pages/dashboards/DashboardEquipo.jsx"));

const Fallback = () => (
  <div style={{ padding: 16, color: "#fff", opacity: 0.85 }}>Cargando…</div>
);

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        <Navbar />

        {/* Gate global para evitar pantallas en blanco por errores hijos */}
        <CrashGate>
          <Suspense fallback={<Fallback />}>
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<Inicio />} />
              <Route path="/propietarios" element={<Propietarios />} />
              <Route path="/inquilinos" element={<Inquilinos />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/oportunidades" element={<Oportunidades />} />
              <Route path="/franquiciados" element={<Franquiciados />} />
              <Route path="/tramitar-cedula" element={<TramitarCedula />} />

              {/* Hub + login */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />

              {/* Dashboards privados */}
              <Route
                path="/dashboard/propietario"
                element={
                  <ProtectedRoute roles={["propietario","admin"]}>
                    <DashProp />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/inquilino"
                element={
                  <ProtectedRoute roles={["inquilino","admin"]}>
                    <DashInq />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/franquiciado"
                element={
                  <ProtectedRoute roles={["franquiciado","admin"]}>
                    <DashFranq />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute roles={["admin","equipo"]}>
                    <DashEquipo />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </CrashGate>

        {/* Widgets globales */}
        <ContactWidget />
        <SOSButton />
      </div>
    </AuthProvider>
  );
}
