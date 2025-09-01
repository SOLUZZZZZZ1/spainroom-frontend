import { useState, useEffect } from "react";
import UploadRoomForm from "../components/UploadRoomForm";
import { endpoints } from "../lib/api";

export default function Admin() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch(endpoints.health).then(r => r.json()).then(setHealth).catch(() => setHealth(null));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
        <div className={`rounded-xl px-3 py-1 text-sm ${health ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
          Backend: {health ? "OK" : "Desconectado"}
        </div>
      </div>

      <UploadRoomForm onCreated={() => {
        // tras crear una habitación puedes redirigir o mostrar toast
      }} />
    </div>
  );
}
