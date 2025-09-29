// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import SOSButton from "./components/SOSButton.jsx";

import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Inicio from "./pages/Inicio.jsx";
import Propietarios from "./pages/Propietarios.jsx";
import Inquilinos from "./pages/Inquilinos.jsx";
import Habitaciones from "./pages/Habitaciones.jsx";
import Oportunidades from "./pages/Oportunidades.jsx";
import Franquiciados from "./pages/Franquiciados.jsx";
import Reservas from "./pages/Reservas.jsx";
import Habitacion from "./pages/Habitacion.jsx";
import FAQ from "./pages/FAQ.jsx";

// Dashboards
import DashboardPropietario from "./pages/dashboards/DashboardPropietario.jsx";
import DashboardFranquiciado from "./pages/dashboards/DashboardFranquiciado.jsx";
import DashboardInquilino from "./pages/dashboards/DashboardInquilino.jsx"; // si no existe, puedes comentar esta línea

// Login por móvil + contraseña (sin OTP)
import LoginPassword from "./pages/LoginPassword.jsx";

// Wrapper de página
import Page from "./components/Page.jsx";

export default function App() {
  const location = useLocation();

  const hideSOS =
    location.pathname.startsWith("/oportunidades") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/franquiciados") ||
    location.pathname.startsWith("/propietarios") ||
    location.pathname.startsWith("/inquilinos") ||
    location.pathname.startsWith("/habitaciones");

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />

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
          <Route path="/ayuda"         element={<Page><FAQ /></Page>} />

          {/* Login con móvil + contraseña */}
          <Route path="/login" element={<Page><LoginPassword /></Page>} />

          {/* Dashboards (protegidos por rol) */}
          <Route
            path="/dashboard/propietario"
            element={
              <ProtectedRoute roles={["propietario"]}>
                <Page><DashboardPropietario /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/franquiciado"
            element={
              <ProtectedRoute roles={["franquiciado","admin"]}>
                <Page><DashboardFranquiciado /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/inquilino"
            element={
              <ProtectedRoute roles={["inquilino"]}>
                <Page><DashboardInquilino /></Page>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {!hideSOS && <SOSButton />}
      </div>
    </AuthProvider>
  );
}
