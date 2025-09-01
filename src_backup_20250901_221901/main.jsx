// ==============================
// FILE: src/main.jsx  (COMPLETO, por si acaso)
// ==============================
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/sr-web2-fix.css'   // ← IMPORTANTE: carga los estilos

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
