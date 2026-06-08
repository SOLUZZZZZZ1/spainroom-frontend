import React, { useCallback, useEffect, useState } from "react";

export default function GaleriaHabitacion({ photos = [], onReserve }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = photos.length;

  const go = useCallback((dir) => {
    setIndex((i) => (i + dir + total) % total);
  }, [total]);

  const openLightbox = () => setLightbox(true);
  const closeLightbox = () => setLightbox(false);

  useEffect(() => {
    const onKey = (e) => {
      if (!lightbox) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  const current = photos[index] || {};

  return (
    <div className="w-full">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        {current?.url ? (
          <img
            src={current.url}
            alt={current.alt || `Foto ${index + 1} de ${total}`}
            className="h-full w-full object-cover"
            onClick={openLightbox}
          />
        ) : (
          <div className="grid place-items-center h-full w-full text-slate-500">Sin fotos</div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute left-4 top-3 text-white/90 text-xs px-2 py-1 rounded-full bg-black/40">
          {index + 1} / {total || 0}
        </div>

        <button
          onClick={() => onReserve?.(current)}
          className="absolute right-4 bottom-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg"
        >
          Reservar
        </button>

        {total > 1 && (
          <>
            <button
              aria-label="Anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 backdrop-blur px-3 py-2 text-white hover:bg-black/45"
              onClick={() => go(-1)}
            >
              ‹
            </button>
            <button
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 backdrop-blur px-3 py-2 text-white hover:bg-black/45"
              onClick={() => go(1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {total > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={p.id || i}
              className={"relative flex-none w-28 aspect-[4/3] rounded-xl overflow-hidden border " + (i === index ? "border-blue-600" : "border-slate-200")}
              onClick={() => setIndex(i)}
            >
              <img src={p.thumb || p.url} alt={p.alt || ""} className="h-full w-full object-cover" />
              {i === index && <div className="absolute inset-0 ring-2 ring-blue-600/60 pointer-events-none"></div>}
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex items-center justify-between p-3 text-white">
            <div className="text-sm opacity-80">{index + 1} / {total}</div>
            <button className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20" onClick={closeLightbox}>Cerrar</button>
          </div>
          <div className="flex-1 grid place-items-center">
            <img src={current.url} alt={current.alt || ""} className="max-h-[85vh] max-w-[95vw] object-contain" />
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <button className="text-white text-4xl" onClick={() => go(-1)}>‹</button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button className="text-white text-4xl" onClick={() => go(1)}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}
