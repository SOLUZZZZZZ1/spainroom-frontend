import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, error:null } }
  static getDerivedStateFromError(e){ return { hasError:true, error:e } }
  componentDidCatch(e, info){ console.error('ErrorBoundary:', e, info) }
  render(){
    if (this.state.hasError) {
      return (
        <div style={{padding:'20px',fontFamily:'system-ui'}}>
          <h2>Se produjo un error al cargar la página</h2>
          <pre style={{whiteSpace:'pre-wrap',background:'#fee',padding:'10px',borderRadius:'8px',border:'1px solid #f99'}}>
{String(this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
