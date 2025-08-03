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
