// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',            // sirve desde la carpeta del proyecto (donde está index.html)
  base: '/',            // rutas absolutas para /public/*
  publicDir: 'public',  // carpeta de estáticos
  build: { outDir: 'dist', sourcemap: true },
  server: {
    strictPort: true,
    host: true,         // permite abrir desde 127.0.0.1 o la IP local
    port: 5176,
    open: false,        // si quieres que abra el navegador solo: true
    watch: {
      ignored: ['**/RECUP/**','**/RESCATES/**','**/android/**']
    }
  },
  optimizeDeps: {
    // entradas estándar; Vite 7 lo detecta solo,
    // pero lo dejamos explícito por claridad:
    entries: ['index.html', 'src/main.jsx']
    // si tuvieras problemas raros de pre-bundling:
    // disabled: true,
  }
})
