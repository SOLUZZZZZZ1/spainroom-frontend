# SpainRoom Frontend (React + Vite + Tailwind)

Frontend de SpainRoom con:
- React + Vite
- Tailwind CSS
- Rutas (React Router)
- Integración con backend Flask vía `VITE_API_URL` o rewrites de Vercel

---

## 🚀 Requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+ (o pnpm/yarn)

---

## ⚙️ Variables de entorno

El frontend lee la URL del backend desde `VITE_API_URL`.

- **Desarrollo:** crea `.env`
  ```env
  VITE_API_URL=http://localhost:5000
  VITE_PORT=5173
  VITE_DEBUG=true
