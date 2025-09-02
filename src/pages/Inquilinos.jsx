// src/pages/Inquilinos.jsx
import React, { useEffect, useState } from 'react'
import SEO from '../components/SEO.jsx'
import NoraHelp from '../components/NoraHelp.jsx'

export default function Inquilinos(){
  const [JobsComp, setJobsComp] = useState(null)   // componente Jobs si existe
  const [jobsReady, setJobsReady] = useState(false)

  // Carga dinámica de Jobs.jsx (si no existe, no rompe)
  useEffect(()=>{
    let mounted = true
    import('./Jobs.jsx')
      .then(mod => { if(mounted) setJobsComp(()=>mod.default) })
      .catch(()=> { /* sin Jobs.jsx: mostramos placeholder y no rompemos */ })
      .finally(()=> { if(mounted) setJobsReady(true) })
    return ()=>{ mounted = false }
  },[])

  return (
    <div className="container" style={{padding:'24px 0'}}>
      <SEO title="Inquilinos — SpainRoom" description="Recursos para inquilinos y empleo cerca de ti." />
      <h2 style={{margin:'0 0 8px'}}>Inquilinos</h2>
      <p className="note">Recursos y oportunidades. Debajo tienes el buscador de empleos cerca de ti.</p>

      {/* Banner de ayuda con Nora / WhatsApp / Teléfono */}
      <div style={{margin:'12px 0'}}>
        <NoraHelp
          title="¿Dudas sobre contratos, fianzas o convivencia? SpainRoom te ayuda"
          bullets={[
            'Revisión básica de contrato y fianzas',
            'Consejos de convivencia y seguridad',
            'Acompañamiento si surge una incidencia'
          ]}
        />
      </div>

      {/* Bloque de empleo (Jobs) — se carga si existe el archivo */}
      <section style={{marginTop:16}}>
        <h3 style={{margin:'0 0 8px'}}>Empleo cerca de ti</h3>
        {JobsComp
          ? <JobsComp />
          : (
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:16}}>
              {jobsReady
                ? <span className="note">Añadiremos aquí el buscador de empleo. De momento, pregúntale a Nora y te orienta. 😊</span>
                : <span className="note">Cargando…</span>}
            </div>
          )
        }
      </section>
    </div>
  )
}
