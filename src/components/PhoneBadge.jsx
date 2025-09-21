// src/components/PhoneBadge.jsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function PhoneBadge() {
  const { pathname } = useLocation();
  const hiddenOn = useMemo(
    () => ["/propietarios", "/inquilinos", "/franquiciados", "/admin"],
    []
  );
  if (hiddenOn.some((p) => pathname.startsWith(p))) return null;
  return (
    <div className="sr-phone-badge">
      <a href="tel:+34616232306" aria-label="Llamar SpainRoom">+34 616 23 23 06</a>
    </div>
  );
}
