import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) {
    // si no está logueado, envíalo a login con “next”
    const next = encodeURIComponent(loc.pathname + loc.search + loc.hash);
    const prefer = roles?.[0] || ""; // rol sugerido
    return <Navigate to={`/login?next=${next}&role=${prefer}`} replace />;
  }

  if (roles && roles.length && !roles.includes(user.role)) {
    // logged pero sin permiso → lo llevamos a su dashboard
    const dash = dashboardPathFor(user.role);
    return <Navigate to={dash} replace />;
  }

  return children;
}

function dashboardPathFor(role) {
  switch (role) {
    case "admin": return "/dashboard/admin";
    case "franquiciado": return "/dashboard/franquiciado";
    case "propietario": return "/dashboard/propietario";
    case "inquilino": return "/dashboard/inquilino";
    default: return "/";
  }
}
