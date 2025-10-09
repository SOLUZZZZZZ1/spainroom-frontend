// src/components/VerificacionCedula.jsx
import React, { useMemo, useState } from "react";

const API_BASE = (import.meta.env?.VITE_API_BASE?.trim?.() || "https://backend-spainroom.onrender.com").replace(/\/+$/,"");
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && (window.isSecureContext || location.hostname === "localhost")) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}

const badgeStyle = (cat) => {
  const map = {
    si:      { bg:"#ef4444", text:"Obligatorio" },
    depende: { bg:"#f59e0b", text:"Depende" },
    no:      { bg:"#16a34a", text:"No obligatorio" },
  };
  const it = map[(cat || "").toLowerCase()] || { bg:"#64748b", text:"—" };
  return { ...it, css: { background: it.bg, color:"#fff", padding:"6px 10px", borderRadius:10, fontWeight:800 } };
};

export default function VerificacionCedula() {
  // Contacto
  const [nombre, setNombre]       = useState("");
  const [telefono, setTelefono]   = useState("");

  // Dirección / refs
  const [direccion, setDireccion] = useState("Calle Mayor 1");
  const [refCat, setRefCat]       = useState("");
  const [cedulaNum, setCedulaNum] = useState(""); // Nº cédula (opcional)
  const [email, setEmail]         = useState("");
  const [municipio, setMunicipio] = useState("Madrid");
  const [provincia, setProvincia] = useState("Madrid");
  const [cp, setCP]               = useState("");

  // Adjuntos
  const [file, setFile]           = useState(null);

  // Estado UI
  const [busy, setBusy]           = useState(false);
  const [error, setError]         = useState("");
  const [ok, setOk]               = useState(null);

  // Resultados
  const [refcatFinal, setRefcatFinal] = useState(null);
  const [catastroInfo, setCatastroInfo] = useState(null);
  const [requirement, setRequirement] = useState(null);
  const [cedulaStatus, setCedulaStatus] = useState(null);

  const validoRef = useMemo(
    () => /^[A-Za-z0-9]{20}$/.test((refCat || "").trim()),
    [refCat]
  );

  const telDigits = () => (telefono || "").replace(/\s+/g, "");

  const postJSON = async (path, body) => {
    const r = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY },
      body: JSON.stringify(body || {})
    });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
    return j;
  };

  const uploadCopy = async (check_id, fileObj) => {
    const fd = new FormData();
    fd.append("check_id", String(check_id));
    fd.append("file", fileObj, fileObj.name);
    const r = await fetch(`${API_BASE}/api/owner/cedula/upload`, {
      method: "POST",
      headers: { "X-Admin-Key": ADMIN_KEY },
      body: fd
    });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
    return j;
  };

  const requireContact = () => {
    const n = (nombre || "").trim();
    const t = telDigits();
    if (n.split(" ").length < 2) { setError("Introduce tu nombre completo."); return false; }
    if (!/^\+?\d{9,15}$/.test(t)) { setError("Introduce un teléfono válido (9–15 dígitos, opcional +34
