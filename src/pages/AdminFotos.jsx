// frontend/src/pages/AdminFotos.jsx
import { useState } from "react";
import { uploadRoomPhoto, setPortada, saveRoomPhotos } from "../api/photos";
import RoomImage from "../components/RoomImage";

export default function AdminFotos({ roomId, initialPhotos = [] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onUpload() {
    if (!file) return;
    setLoading(true); setErr("");
    try {
      const data = await uploadRoomPhoto(roomId, file);
      const next = [...photos, data];
      setPhotos(next);
      // persistir nuevo array opcionalmente:
      await saveRoomPhotos(roomId, next);
      setFile(null);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  async function makePortada(index) {
    setLoading(true); setErr("");
    try {
      // mueve en backend a índice 0
      await setPortada(roomId, index);
      // refleja en UI también:
      const arr = [...photos];
      const [foto] = arr.splice(index, 1);
      arr.unshift(foto);
      setPhotos(arr);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Fotos habitación #{roomId}</h2>

      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button onClick={onUpload} disabled={!file || loading}
        className="ml-2 px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50">
        {loading ? "Procesando…" : "Subir"}
      </button>
      {err && <p className="text-red-600 mt-2">{err}</p>}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {photos.map((p, idx) => (
          <div key={p.id || idx} className="relative">
            <RoomImage photo={p} />
            <button
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
              onClick={()=>makePortada(idx)}
            >
              {idx === 0 ? "Portada" : "Hacer portada"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
