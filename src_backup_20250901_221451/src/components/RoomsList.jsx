import { useEffect, useState } from "react";

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando habitaciones:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando habitaciones...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {rooms.map((room) => (
        <div key={room.id} className="border rounded-lg p-4 shadow bg-white">
          <img
            src={`/${room.images[0]}`} // primera imagen
            alt={room.title}
            className="w-full h-40 object-cover rounded"
          />
          <h2 className="font-bold text-lg mt-2">{room.title}</h2>
          <p className="text-gray-600">{room.city}</p>
          <p className="text-blue-600 font-semibold">{room.price_eur} € / mes</p>
          <p className="text-sm text-gray-500">{room.size_m2} m²</p>
        </div>
      ))}
    </div>
  );
}
