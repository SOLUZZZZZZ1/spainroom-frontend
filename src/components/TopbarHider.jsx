// src/components/TopbarHider.jsx
import React, { useEffect } from "react";

/**
 * Oculta enlaces/botones heredados del topbar anterior
 * que muestren exactamente:
 *  - "Hablar con Nora"
 *  - "WhatsApp"
 *  - "Llamar +34 616 23 23 06"
 *
 * No rompe nada del nuevo PhoneBadge ni del SOS.
 */
export default function TopbarHider() {
  useEffect(() => {
    const targets = [
      "hablar con nora",
      "whatsapp",
      "llamar +34 616 23 23 06",
      "llamar +34616232306"
    ];

    function hideByText(root) {
      const nodes = root.querySelectorAll("a, button, span, div");
      nodes.forEach((el) => {
        const t = (el.textContent || "").trim().toLowerCase();
        if (targets.includes(t)) {
          el.style.display = "none";
        }
        // casos en los que el texto va dentro del <a> y el contenedor padre es el “botón”
        if (el.tagName === "A" || el.tagName === "BUTTON") {
          if (targets.includes(t)) {
            el.style.display = "none";
            const p = el.parentElement;
            if (p && p.children.length === 1) p.style.display = "none";
          }
        }
      });
    }

    hideByText(document);
    // Observa cambios por si el topbar se monta asíncrono
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 1) hideByText(n);
          });
        }
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    return () => obs.disconnect();
  }, []);

  return null;
}
