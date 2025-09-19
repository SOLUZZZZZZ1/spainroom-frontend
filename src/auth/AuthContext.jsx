import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const ROLES = {
  ADMIN: "admin",
  FRANQUICIADO: "franquiciado",
  PROPIETARIO: "propietario",
  INQUILINO: "inquilino",
};

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {role, name, id}

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sr_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = (payload) => {
    const u = { ...payload };
    setUser(u);
    localStorage.setItem("sr_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sr_user");
  };

  const value = useMemo(() => ({ user, login, logout, ROLES }), [user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
