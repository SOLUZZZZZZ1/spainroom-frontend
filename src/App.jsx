<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./screens/Home";
import Listado from "./screens/Listado";
import Jobs from "./screens/Jobs";
import Reservas from "./screens/Reservas";
import Admin from "./screens/Admin";
import Oportunidades from "./screens/Oportunidades";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listado" element={<Listado />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/oportunidades" element={<Oportunidades />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
=======
import NavbarSR from "./components/NavbarSR";
import VerificacionViviendaSR from "./components/VerificacionViviendaSR";

export default function App() {
  const page = {
    minHeight: "100dvh",
    backgroundImage:
      "linear-gradient(rgba(0,0,0,.20), rgba(0,0,0,.20)), url('/casa-diseno.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const Wrap = ({ children, id }) => (
    <section id={id} style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 16px" }}>
      {children}
    </section>
  );

  const Card = ({ children }) => (
    <div style={{
      background: "white",
      border: "1px solid #eef2f7",
      borderRadius: 18,
      boxShadow: "0 10px 30px rgba(0,0,0,.06)",
      padding: 18,
    }}>
      {children}
    </div>
  );

  const H = {
    h2white: { color: "white", margin: "8px 0 12px", fontSize: 26, fontWeight: 900, letterSpacing: .2 },
    pwhite:  { color: "white", opacity: .95, margin: 0, lineHeight: 1.5 },
    h2:      { color: "#0f172a", margin: "0 0 8px", fontSize: 24, fontWeight: 900 },
    p:       { color: "#475569", margin: 0, lineHeight: 1.6 }
  };

  const Grid3 = ({ children }) => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 12
    }}>
      {children}
    </div>
  );

  const RoomCard = ({ titulo, zona, precio, img="/logo.png" }) => (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", background: "#fff"
    }}>
      <div style={{
        background: `url('${img}') center/cover no-repeat`,
        height: 140
      }} />
      <div style={{ padding: 12, display: "grid", gap: 4 }}>
        <div style={{ fontWeight: 800, color: "#0f172a" }}>{titulo}</div>
        <div style={{ color: "#64748b", fontSize: 14 }}>{zona}</div>
        <div style={{ fontWeight: 900, color: "#2563eb" }}>{precio} €/mes</div>
        <button style={{
          marginTop: 6, border: "1px solid #dbe2ea", borderRadius: 12,
          background: "white", padding: "8px 12px", fontWeight: 700, cursor: "pointer"
        }}>
          Ver detalle
        </button>
      </div>
    </div>
  );

  return (
    <div style={page}>
      <NavbarSR />

      {/* INICIO */}
      <Wrap id="inicio">
        <div style={{
          textAlign: "center",
          margin: "16px 0 8px"
        }}>
          <h2 style={H.h2white}>Bienvenido a SpainRoom</h2>
          <p style={H.pwhite}>
            Encuentra habitaciones listas para entrar a vivir en las mejores zonas.
            SpainRoom conecta personas, viviendas y oportunidades. Confiable, moderno y cercano.
          </p>
        </div>
      </Wrap>

      {/* VERIFICAR */}
      <Wrap id="verificar">
        <Card>
          <VerificacionViviendaSR />
        </Card>
      </Wrap>

      {/* LISTADO (demo) */}
      <Wrap id="listado">
        <div style={{ marginBottom: 10 }}>
          <h2 style={H.h2}>🏠 Habitaciones destacadas</h2>
          <p style={H.p}>Una muestra para ir abriendo boca. Pronto conectamos el listado real.</p>
        </div>
        <Grid3>
          <RoomCard titulo="Habitación luminosa" zona="Eixample, Barcelona" precio={420} />
          <RoomCard titulo="Centro céntrico y tranquilo" zona="Centro, Madrid" precio={450} />
          <RoomCard titulo="Junto al mar" zona="La Malagueta, Málaga" precio={400} />
        </Grid3>
      </Wrap>

      {/* OPORTUNIDADES (demo) */}
      <Wrap id="oportunidades">
        <Card>
          <h2 style={H.h2}>💼 Oportunidades para colaboradores</h2>
          <p style={{ ...H.p, marginBottom: 12 }}>
            Si eres inmobiliaria o propietario habitual, súmate como colaborador SpainRoom.
            Te ayudamos a rotar más rápido y con inquilinos validados.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="#publicar" style={{
              background: "#2563eb", color: "white", padding: "10px 14px",
              borderRadius: 12, fontWeight: 800, textDecoration: "none"
            }}>Quiero colaborar</a>
            <a href="#contacto" style={{
              border: "1px solid #dbe2ea", color: "#0f172a", padding: "10px 14px",
              borderRadius: 12, fontWeight: 700, textDecoration: "none", background: "white"
            }}>Más info</a>
          </div>
        </Card>
      </Wrap>

      {/* FOOTER */}
      <footer style={{ textAlign:"center", color:"white", opacity:.9, padding:"16px" }}>
        © {new Date().getFullYear()} SpainRoom — Los que saben
      </footer>
    </div>
  );
}
>>>>>>> 780c84d (SpainRoom: actualizar App.jsx y VerificacionViviendaSR.jsx)
