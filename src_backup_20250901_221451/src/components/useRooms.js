import { useEffect, useState } from "react";

/**
 * Configuración de la URL base del backend:
 * - En local, pon VITE_API_URL=http://localhost:5000 en tu .env
 * - En producción, pon VITE_API_URL=https://spainroom-backend.onrender.com en .env.production
 * - Si usas rewrites en Vercel y quieres llamadas relativas, deja VITE_API_URL vacío.
 */
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const ROOMS_ENDPOINT = `${API_BASE}/api/rooms`;

/** Fallback local con 12 imágenes en /public/images/ */
const localImages = Array.from({ length: 12 }).map(
  (_, i) => `/images/habitacion${String(i + 1).padStart(2, "0")}.jpg`
);

function mockFromLocal() {
  const cities = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga"];
  const featuresBase = ["Cama 135x200", "Llave en puerta", "Luz natural", "Wifi", "Gastos incluidos"];

  return localImages.map((img, idx) => ({
    id: `local-${idx + 1}`,
    title: `Habitación ${idx + 1} lista para entrar`,
    price_eur: 400 + (idx % 4) * 25,
    city: cities[idx % cities.length],
    size_m2: 12 + (idx % 5) * 2,
    images: [
      {
        url: img,
        // Para la imagen inteligente (SmartImage) añadimos un srcset básico
        srcset: {
          400: img,
          800: img,
          1200: img,
          1600: img,
        },
      },
    ],
    features: featuresBase.slice(0, 3 + (idx % 3)),
    availableFrom: new Date().toISOString(),
  }));
}

/**
