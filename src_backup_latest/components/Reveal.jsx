import { useEffect, useRef } from "react";

/**
 * Reveal
 * Revela su contenido al entrar en el viewport (animación suave).
 * - delay (ms): retardo de la animación
 * - className: clases adicionales
 *
 * Usa ambas clases 'reveal' y 'sr-reveal' para ser compatible con tu CSS actual.
 */
export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si ya tiene is-visible (por hot reload), no observar
    if (el.classList.contains("is-visible")) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal sr-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
