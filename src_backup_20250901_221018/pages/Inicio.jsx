export default function Inicio(){
  return (
    <main style={{padding:0}}>
      <section style={heroWrap}>
        <div style={heroOverlay}/>
        <div style={heroBox}>
          <img src="/logo.png" alt="SpainRoom" style={{width:120,height:"auto",marginBottom:12}}/>
          <h1 style={h1}>Bienvenido a SpainRoom</h1>
          <p style={p}>Encuentra habitaciones listas para entrar a vivir en las mejores zonas. SpainRoom conecta personas, viviendas y oportunidades. Confiable, moderno y cercano.</p>

          <div style={ctaRow}>
            <a href="tel:+34616232306" style={btnSOS}>SOS</a>
          </div>

          <div style={logosRow}>
            <img src="/logo.png" alt="Logo SpainRoom" style={{height:34}}/>
          </div>
        </div>
      </section>
    </main>
  );
}
const heroWrap={position:"relative",minHeight:"72vh",display:"grid",placeItems:"center",
  background:"url('/casa-diseno.jpg?v=3') center/cover no-repeat fixed"};
const heroOverlay={position:"absolute",inset:0,background:"rgba(15,23,42,.35)"};
const heroBox={position:"relative",width:"min(980px,92vw)",margin:"32px auto",
  background:"rgba(100,116,139,.22)",border:"1px solid rgba(226,232,240,.35)",
  borderRadius:18,padding:"22px 24px",color:"#fff",textAlign:"center",
  boxShadow:"0 12px 40px rgba(0,0,0,.28)"};
const h1={margin:"0 0 6px 0",fontSize:32,lineHeight:1.2,textShadow:"0 1px 16px rgba(0,0,0,.35)"};
const p ={margin:"6px 0 0 0",fontSize:16,lineHeight:1.6,color:"#e2e8f0"};
const ctaRow={display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginTop:14};
const baseBtn={display:"inline-block",padding:"10px 14px",borderRadius:10,textDecoration:"none",fontWeight:800};
const btnSOS={...baseBtn,background:"#ef4444",color:"#fff",boxShadow:"0 8px 22px rgba(239,68,68,.35)"};
const logosRow={display:"flex",gap:16,justifyContent:"center",alignItems:"center",marginTop:14,opacity:.95};
