// src/lib/api.js
export const API_BASE = "https://backend-spainroom.onrender.com";
// ADMIN_KEY real; si luego lo mueves a .env, cambia aquí
export const ADMIN_KEY = "ramon";

export async function apiGet(path, params) {
  const url = new URL(`${API_BASE}${path}`);
  if (params) Object.entries(params).forEach(([k,v]) => v!=null && url.searchParams.set(k, v));
  const res = await fetch(url, { headers: { "X-Admin-Key": ADMIN_KEY }});
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "X-Admin-Key": ADMIN_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
  const data = await res.json().catch(()=> ({}));
  if (!res.ok || data?.ok === false) throw new Error(data?.error || `POST ${path} -> ${res.status}`);
  return data;
}
