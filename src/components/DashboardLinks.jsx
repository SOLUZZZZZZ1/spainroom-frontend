// src/components/DashboardLinks.jsx
import React from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function DashboardLinks() {
  const { user } = useAuth();
  if (!user) return null;

  const Btn = (p) => (
    <Link to={p.to} style={{
      display:"inline-block", margin:"6px 8px 0 0", padding:"8px 12px",
      borderRadius:10, border:"1px solid #cfd6e4", textDecoration:"none"
    }}>{p.children}</Link>
  );

  return (
    <div style={{marginTop:24, padding:"12px 0", borderTop:"1px solid #ddd"}}>
      <div style={{opacity:.7, marginBottom:6}}>Accesos rápidos a tu panel:</div>

      {user.role === "propietario" && <Btn to="/dashboard/propietario">Dashboard Propietario</Btn>}
      {user.role === "inquilino" && <Btn to="/dashboard/inquilino">Dashboard Inquilino</Btn>}
      {["franquiciado","admin"].includes(user.role) && <Btn to="/dashboard/franquiciado">Dashboard Franquiciado</Btn>}
      {user.role === "admin" && (
        <>
          <a
            href={(import.meta.env.VITE_BIG_ADMIN_URL || "#")}
            target="_blank" rel="noopener noreferrer"
            style={{display:"inline-block", margin:"6px 8px 0 0", padding:"8px 12px",
                    borderRadius:10, border:"1px solid #cfd6e4", textDecoration:"none"}}
          >
            Big Admin (nueva pestaña)
          </a>
          <Btn to="/dashboard/admin">Big Admin (iframe)</Btn>
        </>
      )}
    </div>
  );
}
