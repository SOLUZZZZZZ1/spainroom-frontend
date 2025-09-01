import { useEffect, useState } from "react";

/**
 * Configuración de la URL base del backend:
 * - En local, pon VITE_API_URL=http://127.0.0.1:5000 en tu .env
 * - En producción, pon VITE_API_URL=https://spainroom-backend.onrender.com en .env.production
 */
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const ROOMS_ENDPOINT = `${API_BASE}/api/rooms`;

// Fallback local con 12 imágenes de /public/images
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
 * Hook principal: carga habitaciones desde el backend (GET /api/rooms).
 * Si falla, usa mock local.
 */
export function useRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(ROOMS_ENDPOINT, {
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          if (!mounted) return;
          const list = Array.isArray(data) ? data : data?.items ?? [];
          setRooms(list);
          setLoading(false);
          return;
        }

        if (!mounted) return;
        setError(`Backend respondió ${res.status}`);
        setRooms(mockFromLocal());
        setLoading(false);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Error de red");
        setRooms(mockFromLocal());
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { rooms, loading, error };
}
