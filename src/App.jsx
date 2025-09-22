// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* Core UI mínimos */
import Navbar from "./components/Navbar.jsx";
import SOSButton from "./components/SOSButton.jsx";

/* Auth */
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* Pages (importes directos) */
import Inicio from "./pages/Inicio.jsx";
import Propietarios from "./pages/Propietarios.jsx";
import Inquilinos from "./pages/Inquilinos.jsx";
import Habitaciones from "./pages/Habitaciones.jsx";
import Oportunidades from "./pages/Oportunidades.jsx";
import Franquiciados from "./pages/Franquiciados.jsx";
import Reservas from "./pages/Reservas.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Habitacion from "./pages/Habitacion.jsx";
import FAQ from "./pages/FAQ.jsx";

/* Dashboards */
import DashboardPropietario from "./pages/dashboards/DashboardPropietario.jsx";
import DashboardFranquiciado from "./pages/dashboards/DashboardFranquiciado.jsx";

/* ---------- Loader visible en cambios de ruta ---------- */
function FallbackLoader() {
  return (
    <div style={{minHeight:"30vh", display:"grid", placeItems:"center"}}>
      <div style={{
        background:"#fff", color:"#0b1220", border:"1px solid #e2e8f0",
        padding:16, borderRadius:16, boxShadow:"0 8px 22px rgba(0,0,0,.12)", textAlign:"center"
      }}>
        <img src="/cabecera.png" alt="SpainRoom" style={{height:84, width:"auto", marginBottom:8}}/>
        <div style={{opacity:.85}}>Cargando…</div>
      </div>
    </div>
  );
}

/* ---------- Error boundary para que NO veas negro si algo peta ---------- */
class CrashGate extends React.Component {
  constructor(props){ super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error){ return { error }; }
  componentDidCatch(error, info){ console.error("[CrashGate]", error, info); }
  render(){
    if (!this.state.error) return this.props.children;
    return (
      <div style={{minHeight:"40vh", display:"grid", placeItems:"center"}}>
        <div style={{
          background:"#fff", color:"#0b1220", border:"1px solid #e2e8f0",
          borderRadius:16, padding:16, maxWidth:780, width:"92%"
        }}>
          <h3 style={{margin:"0 0 6px"}}>Algo falló al renderizar esta vista</h3>
          <div style={{color:"#b91c1c"}}>{String(this.state.error?.message || this.state.error)}</div>
          <div style={{marginTop:8, color:"#64748b"}}>Abre la consola para ver el archivo/línea exacta.</div>
        </div>
      </div>
    );
  }
}

/* ---------- Wrapper con fondo base + loader corto de transición ---------- */
function Page({ children }) {
  const { pathname } = useLocation();
  const [transitioning, setTransitioning] = React.useState(false);

  React.useEffect(() => {
    setTransitioning(true);
    // Fuerza repintado y quita loader en un suspiro
    // eslint-disable-next-line no-unused-expressions
    document.body.offsetHeight;
    const t = setTimeout(() => setTransitioning(false), 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className="sr-page">
      <div className="sr-page-base" />
      <div className="sr-page-content">
        {transitioning ? <FallbackLoader /> : children}
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  // Ocultar SOS donde molesta
  const hideSOS =
    location.pathname.startsWith("/oportunidades") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/franquiciados");

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />

        <CrashGate>
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

            {/* Login */}
            <Route path="/login" element={<Page><Login /></Page>} />

            {/* Privadas por rol */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Page><Admin /></Page>
                </ProtectedRoute>
              }
            />
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
                <ProtectedRoute roles={["franquiciado"]}>
                  <Page><DashboardFranquiciado /></Page>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CrashGate>

        {!hideSOS && <SOSButton />}
      </div>
    </AuthProvider>
  );
}
