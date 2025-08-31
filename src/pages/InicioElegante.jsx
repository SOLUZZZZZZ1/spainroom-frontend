import React from 'react'
import SEO from '../components/SEO.jsx'

export default function InicioElegante(){
  return (
    <>
      <SEO
        title="SpainRoom — Alquiler de habitaciones fáciles"
        description="Encuentra habitaciones listas para entrar a vivir en las mejores zonas. SpainRoom conecta personas, viviendas y oportunidades."
      />
      <section className="sr-hero">
        <div className="sr-container">
          <div className="sr-hero-card">
            <img src="/logo.png" alt="SpainRoom" className="sr-hero-logo" />
            <h1 className="sr-hero-title">Bienvenido a SpainRoom</h1>

            {/* Texto con formato exacto */}
            <pre className="sr-hero-pre">{`Encuentra habitaciones listas para entrar a vivir en las mejores zonas.
       SpainRoom conecta personas, viviendas y oportunidades.
                    Confiable, moderno y cercano.`}</pre>
          </div>
        </div>
      </section>
    </>
  )
}
