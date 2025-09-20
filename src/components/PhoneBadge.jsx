// src/components/PhoneBadge.jsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

const PHONE_LABEL = "+34 616 23 23 06";

export default function PhoneBadge() {
  const { pathname } = useLocation();

  // Oculto en páginas internas
  const hiddenOn = useMemo(
    () => ["/propietarios", "/inquilinos", "/franquiciados", "/admin"],
    []
  );
  const hide = hiddenOn.some((p) => pathname.startsWith(p));
  if (hide) return null;

  const wrap = {
    position:"fixed", right:18, top:72, zIndex:40
  };
  const label = {
    background:"rgba(10,88,166,.92)", color:"#fff",
    padding:"6px 10px", borderRadius:12, fontWeight:800, fontSize:12,
    border:"1px solid rgba(255,255,255,.25)", boxShadow:"0 6px 18px rgba(0,0,0,.22)"
  };

  return (
    <div style={wrap}>
      <a href="tel:+34616232306" style={label} aria-label="Llamar SpainRoom">
        {PHONE_LABEL}
      </a>
    </div>
  );
}
