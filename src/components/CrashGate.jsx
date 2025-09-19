import React from "react";

/** ErrorBoundary global: si algo peta, se muestra un panel en vez de pantalla en blanco */
export default class CrashGate extends React.Component {
  constructor(p){ super(p); this.state = { err:null }; }
  static getDerivedStateFromError(err){ return { err }; }
  componentDidCatch(err, info){ console.error("APP ERROR:", err, info); }
  render(){
    if (this.state.err) {
      return (
        <div style={{padding:16, margin:16, borderRadius:12,
          background:"rgba(255,60,60,.12)", border:"1px solid rgba(255,60,60,.35)", color:"#fff"}}>
          <strong>⚠️ Se ha producido un error en la app</strong>
          <pre style={{whiteSpace:"pre-wrap", marginTop:8, fontFamily:"monospace"}}>
            {String(this.state.err?.message || this.state.err)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
