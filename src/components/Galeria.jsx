// src/components/Galeria.jsx — compacta 720x540
import React, { useEffect, useState } from "react";

export default function Galeria({ photos = [], maxWidth = 720, maxHeight = 540 }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = photos.length;
  const current = photos[index] || null;

  const go = (dir) => { if (!total) return; setIndex((i) => (i + dir + total) % total); };

  useEffect(() => {
    const onKey = (e) => {
      if (!lightbox) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, total]);

  if (!total) return <div style={{ padding:8, color:"#475569" }}>Sin fotos</div>;

  const wrap = { maxWidth:`min(92vw, ${maxWidth}px)`, margin:"0 auto", background:"#0b1220", borderRadius:16, overflow:"hidden", position:"relative" };
  const box  = { width:"100%", height:"auto", aspectRatio:"4 / 3", display:"grid", placeItems:"center" };
  const img  = { width:"100%", height:"100%", maxHeight:`${maxHeight}px`, objectFit:"contain", display:"block" };

  return (
    <div>
      <div style={wrap}>
        <div style={box}>
          <img src={current.url} alt={current.alt || `Foto ${index+1}`} style={img} onClick={() => setLightbox(true)} loading="lazy" />
        </div>
        <div style={{ position:"absolute", top:10, left:10, background:"var(--sr-blue, #0b65d8)", color:"#fff", padding:"6px 10px", borderRadius:999, fontWeight:800 }}>
          {index + 1} / {total}
        </div>
        {total > 1 && (<>
          <button aria-label="Anterior" onClick={() => go(-1)} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,.45)", color:"#fff", border:0, borderRadius:12, padding:"8px 10px", cursor:"pointer" }}>‹</button>
          <button aria-label="Siguiente" onClick={() => go(1)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,.45)", color:"#fff", border:0, borderRadius:12, padding:"8px 10px", cursor:"pointer" }}>›</button>
        </>)}
      </div>

      {total > 1 && (
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingTop:8, maxWidth:`min(92vw, ${maxWidth}px)`, margin:"8px auto 0" }}>
          {photos.map((p, i) => (
            <button key={p.id || i} onClick={() => setIndex(i)} aria-label={`Ver foto ${i+1}`}
              style={{ flex:"0 0 auto", width:96, aspectRatio:"4/3", borderRadius:12, overflow:"hidden", border: i===index ? "2px solid var(--sr-blue, #0b65d8)" : "2px solid #e5e7eb", cursor:"pointer" }}>
              <img src={p.thumb || p.url} alt={p.alt || ""} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.92)", zIndex:60, display:"grid", placeItems:"center", padding:16 }} onClick={() => setLightbox(false)}>
          <img src={current.url} alt={current.alt || ""} style={{ maxWidth:"92vw", maxHeight:"85vh", objectFit:"contain" }} onClick={(e)=>e.stopPropagation()} />
          {total > 1 && (<>
            <button onClick={(e)=>{e.stopPropagation();go(-1);}} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", background:"transparent", border:0, color:"#fff", fontSize:42, cursor:"pointer" }}>‹</button>
            <button onClick={(e)=>{e.stopPropagation();go(1);}} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", background:"transparent", border:0, color:"#fff", fontSize:42, cursor:"pointer" }}>›</button>
          </>)}
          <button onClick={() => setLightbox(false)} style={{ position:"absolute", top:16, right:16, background:"#fff", border:0, borderRadius:10, padding:"8px 10px", fontWeight:900, cursor:"pointer" }}>✕</button>
        </div>
      )}
    </div>
  );
}
