import React, { useEffect } from "react";
export default function AdminBridge() {
  useEffect(() => {
    const url = import.meta.env.VITE_BIG_ADMIN_URL || "";
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert("Falta configurar VITE_BIG_ADMIN_URL en variables de entorno.");
    }
    window.location.replace("/");
  }, []);
  return null;
}
