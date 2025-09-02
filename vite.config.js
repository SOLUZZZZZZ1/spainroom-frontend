// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: { outDir: 'dist' },
  optimizeDeps: {
    entries: ['index.html', 'src/main.jsx'],
    // desactiva prebundling si quieres máxima robustez:
    // disabled: true,
  },
  server: {
    watch: { ignored: ['**/RECUP/**','**/RESCATES/**','**/android/**'] }
  }
})
