// src/pages/Oportunidades.jsx
import React from "react";
function Card({ title, children }) {
  return (
    <div style={{
      background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16,
      display:"flex", flexDirection:"column", gap:8, height:"100%"
    }}>
      <h3 style={{margin:0}}>{title}</h3>
      <div style={{color:"#475569"}}>{children}</div>
    </div>
  );
}
export default function Oportunidades() {
  return (
    <div className="container" style={{padding:"24px 0", color:"#0b1220"}}>
      <header style={{textAlign:"center", margin:"0 0 16px"}}>
        <h2 style={{margin:"0 0 6px"}}>Oportunidades SpainRoom</h2>
        <p className="note">Colabora con nosotros: particulares, inmobiliarias, freelance y empresas.</p>
      </header>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16}}>
        <Card title="Inmobiliarias">
          <ul style={{margin:"0 0 0 18px"}}>
            <li>Integración como colaborador SpainRoom.</li>
            <li>Captación y gestión de habitaciones.</li>
            <li>Soporte central, material comercial y trazabilidad.</li>
          </ul>
        </Card>
        <Card title="Promociones destacadas">
          <ul style={{margin:"0 0 0 18px"}}>
            <li>Publicaciones premium en zonas objetivo.</li>
            <li>Validación de calidad SpainRoom.</li>
            <li>Métricas de conversión y seguimiento.</li>
          </ul>
        </Card>
        <Card title="Freelance / Autoempleo">
          <ul style={{margin:"0 0 0 18px"}}>
            <li>Comisiones competitivas por captación/gestión.</li>
            <li>Formación y herramientas internas.</li>
            <li>Posibilidad de evolución a franquicia.</li>
          </ul>
        </Card>
      </div>
      <div style={{marginTop:18, textAlign:"center"}}>
        <a href="mailto:oportunidades@spainroom.es?subject=Colaboración%20SpainRoom"
           className="sr-tab" style={{background:"#0b69c7", color:"#fff"}}>
          Escribir a SpainRoom
        </a>
      </div>
      <style>{`
        @media (max-width: 900px){
          .container > div[style*="grid"]{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
