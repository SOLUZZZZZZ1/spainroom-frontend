const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export async function getJobsNearby({ lat, lng, radius_km = 2 }){
  const url = new URL(`${API_BASE}/jobs/nearby`);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lng", lng);
  url.searchParams.set("radius_km", radius_km);
  const res = await fetch(url);
  if(!res.ok) throw new Error("Error cargando ofertas cercanas");
  return res.json();
}

export async function searchJobs({ q, lat, lng, radius_km = 10 }){
  const url = new URL(`${API_BASE}/jobs/search`);
  url.searchParams.set("q", q || "");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lng", lng);
  url.searchParams.set("radius_km", radius_km);
  const res = await fetch(url);
  if(!res.ok) throw new Error("Error buscando ofertas");
  return res.json();
}
