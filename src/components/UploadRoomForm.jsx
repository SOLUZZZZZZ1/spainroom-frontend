import { useState, useRef } from "react";
import { createRoom } from "../lib/api";

export default function UploadRoomForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("400");
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [featuresText, setFeaturesText] = useState("Cama 135x200, Llave en puerta, Wifi");
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString());
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const inputRef = useRef(null);

  function onPickFiles(e) {
    const f = Array.from(e.target.files || []);
    setFiles(f);
    setPreviews(f.map(file => URL.createObjectURL(file)));
  }

  function onDrop(e) {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files || []).filter(f => /^image\//.test(f.type));
    setFiles(f);
    setPreviews(f.map(file => URL.createObjectURL(file)));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    if (!title.trim()) return setMsg({ type: "error", text: "El título es obligatorio." });
    if (!files.length) return setMsg({ type: "error", text: "Sube al menos una foto." });

    setLoading(true);
    try {
      const features = featuresText
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const room = await createRoom({
        title: title.trim(),
        price_eur: Number(price) || 0,
        city: city.trim(),
        size_m2: Number(size) || undefined,
        features,
        availableFrom,
        files,
      });

      setMsg({ type: "ok", text: "Habitación creada correctamente." });
      setTitle("");
      setPrice("400");
      setCity("");
      setSize("");
      setFeaturesText("Cama 135x200, Llave en puerta, Wifi");
      setFiles([]);
      setPreviews([]);

      onCreated?.(room);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Error al crear la habitación." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Alta de habitación</h2>

      {msg && (
        <div className={`mb-4 rounded-xl p-3 text-sm ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Título *</span>
          <input
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            value={title} onChange={e => setTitle(e.target.value)} placeholder="Habitación en centro de Madrid"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Precio €/mes *</span>
          <input
            type="number"
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            value={price} onChange={e => setPrice(e.target.value)} min={0}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Ciudad</span>
          <input
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            value={city} onChange={e => setCity(e.target.value)} placeholder="Madrid"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Tamaño (m²)</span>
          <input
            type="number"
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            value={size} onChange={e => setSize(e.target.value)} min={0}
          />
        </label>

        <label className="md:col-span-2 flex flex-col gap-1">
          <span className="text-sm font-medium">Características (separadas por comas)</span>
          <input
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            value={featuresText} onChange={e => setFeaturesText(e.target.value)}
            placeholder="Cama 135x200, Llave en puerta, Wifi"
          />
        </label>
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium">Fotos *</span>
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop}
          className="mt-2 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center"
        >
          <p className="text-sm text-gray-600">Arrastra aquí tus fotos o</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Seleccionar archivos
          </button>
          <input
            ref={inputRef} type="file" multiple accept="image/*" onChange={onPickFiles} hidden
          />

          {!!previews.length && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
              {previews.map((src, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl border">
                  <img src={src} alt={`preview-${i}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          disabled={loading}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear habitación"}
        </button>
        <span className="text-xs text-gray-500">* Campos obligatorios</span>
      </div>
    </form>
  );
}
