// src/components/JobsSearchWidget.jsx
import React, { useState } from "react";

export default function JobsSearchWidget({ radiusKm = 20 }) {
  const [q, setQ] = useState("dependiente");
  const [city, setCity] = useState("Madrid");

  const queries = [
    { name: "Indeed",     url: `https://es.indeed.com/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent(city)}&radius=${radiusKm}` },
    { name: "Google Jobs",url: `https://www.google.com/search?q=${encodeURIComponent(q)}+empleo+${encodeURIComponent(city)}&ibp=htl;jobs` },
    { name: "LinkedIn",   url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&location=${encodeURIComponent(city)}` },
  ];

  return (
    <div style={{display:"grid", gap:12}}>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        <div>
          <label style={{display:"block", marginBottom:6, color:"#0b1220", fontWeight:600}}>Búsqueda</label>
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="camarero, dependiente, repartidor…"
            style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10}}
          />
        </div>
        <div>
          <label style={{display:"block", marginBottom:6, color:"#0b1220", fontWeight:600}}>Ciudad/Zona</label>
          <input
            value={city}
            onChange={(e)=>setCity(e.target.value)}
            placeholder="Madrid, Barcelona, Valencia…"
            style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10}}
          />
        </div>
      </div>

      <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
        {queries.map((a)=>(
          <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer"
             className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>
            {a.name} (radio ~{radiusKm} km)
          </a>
        ))}
      </div>

      <div style={{color:"#475569"}}>Abrimos buscadores conocidos con tu búsqueda cerca de tu zona.</div>
    </div>
  );
}
