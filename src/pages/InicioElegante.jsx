// ==================================
// FILE: src/pages/InicioElegante.jsx (COMPLETO)
// ==================================
import React from 'react'
import SEO from '../components/SEO.jsx'

export default function InicioElegante(){
  const LINES_WITH_INDENT = [
    'Encuentra habitaciones listas para entrar a vivir en las mejores zonas.',
    '       SpainRoom conecta personas, viviendas y oportunidades.'
  ]
  const LAST_LINE = 'Confiable, moderno y cercano.'

  return (
    <>
      <SEO
        title="SpainRoom — Alquiler de habitaciones fáciles"
        description="Encuentra habitaciones listas para entrar a vivir en las mejores zonas. SpainRoom conecta personas, viviendas y oportunidades."
      />
      <section className="sr-hero">
        <div className="sr-container">
          <div className="sr-hero-card">
            {/* LOGO DEL HÉROE (grande, controlado) */}
            <img src="/logo.png" alt="SpainRoom" className="sr-hero-logo" />
            <h1 className="sr-hero-title">Bienvenido a SpainRoom</h1>

            <div className="sr-hero-lines" aria-label="Mensaje de bienvenida">
              {LINES_WITH_INDENT.map((line, i) => (
                <div
                  key={i}
                  className="sr-hero-line"
                  dangerouslySetInnerHTML={{ __html: line.replace(/ /g, '&nbsp;') }}
                />
              ))}
              <div className="sr-hero-line-center">{LAST_LINE}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
