// src/components/CrashGate.jsx
import React from "react";

export default class CrashGate extends React.Component {
  constructor(props){
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error){ return { hasError: true, error }; }
  componentDidCatch(error, info){ console.error("[CrashGate]", error, info); }

  render(){
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        minHeight:"40vh", display:"grid", placeItems:"center",
        color:"#fff", padding:24
      }}>
        <div style={{
          background:"rgba(255,255,255,.12)",
          border:"1px solid rgba(255,255,255,.25)",
          borderRadius:12, padding:"16px 20px", maxWidth:800
        }}>
          <h3 style={{margin:"0 0 8px"}}>Se ha producido un error en la página</h3>
          <div style={{opacity:.85, fontSize:14}}>
            Intenta recargar o vuelve a la página de inicio.
          </div>
        </div>
      </div>
    );
  }
}
