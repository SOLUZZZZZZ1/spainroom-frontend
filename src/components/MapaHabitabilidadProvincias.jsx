import React, { useEffect, useMemo, useRef, useState } from "react";
import REQUISITOS_CCAA from "../data/requisitosCCAA";
import PROV_A_CCAA from "../data/provinciaToCCAA";

// Normaliza ids: quita tildes/ñ y pasa a minúsculas
function norm(s) {
  return s.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/gi, "n")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function colorForCCAA(ccaa) {
  if (ccaa === "Cataluña" || ccaa === "Illes Balears") return "#1e3a8a"; // cédula obligatoria
  if (ccaa === "Comunidad Valenciana") return "#2563eb";                 // equivalente
  return "#9ca3af";                                                      // LPO resto
}

export default function MapaHabitabilidadProvincias() {
  const [svgText, setSvgText] = useState(null);
  const [hover, setHover] = useState(null); // {prov, ccaa}
  const boxRef = useRef(null);

  // Carga del SVG de provincias (colócalo en /public/maps/espana-provincias.svg)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/maps/espana-provincias.svg", { cache: "no-store" });
        if (!res.ok) throw new Error("No se encontró /maps/espana-provincias.svg");
        const txt = await res.text();
        setSvgText(txt);
      } catch (e) {
        setSvgText(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><text x="20" y="40" fill="#444" font-family="system-ui" font-size="16">No se encontró /maps/espana-provincias.svg</text></svg>`);
      }
    })();
  }, []);

  // Inyecta colores y eventos cuando el SVG esté insertado en el DOM
  useEffect(() => {
    if (!svgText || !boxRef.current) return;

    const root = boxRef.current.querySelector("svg");
    if (!root) return;

    // Por cada provincia conocida, intenta localizar la capa por id o data-prov
    Object.keys(PROV_A_CCAA).forEach((prov) => {
      const ccaa = PROV_A_CCAA[prov];
      const id = norm(prov); // ej: "la rioja" -> "la-rioja"
      let el = root.querySelector(`#${id}`) ||
               root.querySelector(`[data-prov="${prov}"]`) ||
               root.querySelector(`[data-name="${prov}"]`);

      if (el) {
        el.style.fill = colorForCCAA(ccaa);
        el.style.stroke = "#ffffff";
        el.style.strokeWidth = "0.8";
        el.style.cursor = "pointer";

        el.addEventListener("mouseenter", () => setHover({prov, ccaa}));
        el.addEventListener("mouseleave", () => setHover(null));
        el.addEventListener("touchstart", () => setHover({prov, ccaa}), {passive: true});
      }
    });

    // Cleanup listeners si se re-renderiza
    return () => {
      if (!root) return;
      Object.keys(PROV_A_CCAA).forEach((prov) => {
        const id = norm(prov);
        let el = root.querySelector(`#${id}`) ||
                 root.querySelector(`[data-prov="${prov}"]`) ||
                 root.querySelector(`[data-name="${prov}"]`);
        if (el) {
          el.onmouseenter = null;
          el.onmouseleave = null;
          el.ontouchstart = null;
        }
      });
    };
  }, [svgText]);

  const tooltip = useMemo(() => {
    if (!hover) return null;
    const req = REQUISITOS_CCAA[hover.ccaa];
    if (!req) return { title: `${hover.prov} · ${hover.ccaa}`, line: "Sin dato operativo" };
    return { title: `${hover.prov} · ${hover.ccaa}`, line: `${req.tipo}: ${req.msg}` };
  }, [hover]);

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      {/* Contenedor que inyecta el SVG */}
      <div
        ref={boxRef}
        dangerouslySetInnerHTML={{ __html: svgText || "" }}
        style={{ maxWidth: 900, margin: "0 auto" }}
      />

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "absolute",
          top: 8, left: "50%", transform: "translateX(-50%)",
          background: "#111", color: "#fff",
          padding: "8px 10px", borderRadius: 8, fontSize: 14,
          maxWidth: 480, boxShadow: "0 6px 16px rgba(0,0,0,.2)"
        }}>
          <div style={{ fontWeight: 700 }}>{tooltip.title}</div>
          <div style={{ opacity: .85 }}>{tooltip.line}</div>
        </div>
      )}
    </div>
  );
}
