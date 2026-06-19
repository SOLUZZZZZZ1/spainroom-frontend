// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
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
import ReservarHabitacion from "./pages/ReservarHabitacion.jsx";
import Habitacion from "./pages/Habitacion.jsx";
import FAQ from "./pages/FAQ.jsx";
import Contacto from "./pages/Contacto.jsx";
import Privacidad from "./pages/Privacidad.jsx";
import Cookies from "./pages/Cookies.jsx";
import AvisoLegal from "./pages/AvisoLegal.jsx";
import Admin from "./pages/Admin.jsx";
import DashboardPropietario from "./pages/dashboards/DashboardPropietario.jsx";
import DashboardFranquiciado from "./pages/dashboards/DashboardFranquiciado.jsx";
import DashboardInquilino from "./pages/dashboards/DashboardInquilino.jsx";

import LoginPassword from "./pages/LoginPassword.jsx";
import SetPassword from "./pages/SetPassword.jsx";
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
          <Route path="/" element={<Page><Inicio /></Page>} />
          <Route path="/propietarios" element={<Page><Propietarios /></Page>} />
          <Route path="/inquilinos" element={<Page><Inquilinos /></Page>} />

          <Route path="/habitaciones" element={<Page><Habitaciones /></Page>} />
          <Route path="/habitaciones/:roomId/reservar" element={<Page><ReservarHabitacion /></Page>} />
          <Route path="/habitaciones/:roomId/fotos" element={<Page><Habitacion /></Page>} />
          <Route path="/habitaciones/:roomId" element={<Page><Habitacion /></Page>} />

          <Route path="/habitacion/:roomId/reservar" element={<Page><ReservarHabitacion /></Page>} />
          <Route path="/habitacion/:roomId" element={<Page><Habitacion /></Page>} />

          <Route path="/oportunidades" element={<Page><Oportunidades /></Page>} />
          <Route path="/franquiciados" element={<Page><Franquiciados /></Page>} />
          <Route path="/reservas" element={<Page><Reservas /></Page>} />
          <Route path="/ayuda" element={<Page><FAQ /></Page>} />
          <Route path="/contacto" element={<Page><Contacto /></Page>} />
          <Route path="/privacidad" element={<Page><Privacidad /></Page>} />
          <Route path="/cookies" element={<Page><Cookies /></Page>} />
          <Route path="/aviso-legal" element={<Page><AvisoLegal /></Page>} />
          <Route path="/login" element={<Page><LoginPassword /></Page>} />
          <Route path="/set-password" element={<Page><SetPassword /></Page>} />
          <Route path="/admin" element={<Page><Admin /></Page>} />

          <Route
            path="/dashboard/propietario"
            element={
              <ProtectedRoute roles={["propietario", "admin", "equipo"]}>
                <Page><DashboardPropietario /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/franquiciado"
            element={
              <ProtectedRoute roles={["franquiciado", "admin", "equipo"]}>
                <Page><DashboardFranquiciado /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/inquilino"
            element={
              <ProtectedRoute roles={["inquilino", "admin", "equipo"]}>
                <Page><DashboardInquilino /></Page>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />

        {!hideSOS && <SOSButton />}
      </div>
    </AuthProvider>
  );
}
