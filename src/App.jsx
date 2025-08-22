import NavbarSR from "./components/NavbarSR";
import VerificacionViviendaSR from "./components/VerificacionViviendaSR";

console.log("SpainRoom redeploy test ✅");

export default function App() {
  const page = {
    minHeight: "100dvh",
    backgroundImage:
      "linear-gradient(rgba(0,0,0,.20), rgba(0,0,0,.20)), url('/casa-diseno.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div style={page}>
      <NavbarSR />
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"18px 16px" }}>
        <VerificacionViviendaSR />
      </div>
    </div>
  );
}
