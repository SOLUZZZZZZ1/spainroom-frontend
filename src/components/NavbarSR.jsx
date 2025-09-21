export default function NavbarSR() {
  const S = {
    bar: {
      position: "sticky", top: 0, zIndex: 50, width: "100%",
      background: "#2563eb",
      borderBottom: "1px solid rgba(255,255,255,.18)",
      boxShadow: "0 10px 20px rgba(37,99,235,.20)",
    },
    wrap: {
      maxWidth: 1200, margin: "0 auto",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 16px", gap: 12
    },
    left: { display: "flex", alignItems: "center", gap: 10 },
    logo: { height: 40, width: "auto", display: "block" },
    brand: { color: "white", fontWeight: 800, letterSpacing: .4, fontSize: 18 },
    nav: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
    link: {
      color: "white", textDecoration: "none",
      padding: "8px 10px", borderRadius: 10, fontWeight: 600, fontSize: 14,
      border: "1px solid transparent", transition: "all .2s"
    },
    cta: {
      background: "white", color: "#2563eb", border: "1px solid white",
      padding: "8px 12px", borderRadius: 12, fontWeight: 800, fontSize: 14
    }
  };

  return (
    <header style={S.bar}>
      <div style={S.wrap}>
        <div style={S.left}>
          {/* Asegúrate de tener /public/logo.png */}
          <img src="/logo.png" alt="SpainRoom" style={S.logo} />
          <span style={S.brand}>SPAINROOM</span>
        </div>

        <nav style={S.nav}>
          <a href="#inicio" style={S.link}>Inicio</a>
          <a href="#verificar" style={S.link}>Verificar vivienda</a>
          <a href="#listado" style={S.link}>Listado</a>
          <a href="#oportunidades" style={S.link}>Oportunidades</a>
          <a href="#publicar" style={S.cta}>Publicar</a>
        </nav>
      </div>
    </header>
  );
}
