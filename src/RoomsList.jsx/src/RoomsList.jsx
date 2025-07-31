import React from 'react';

function RoomsList() {
  const rooms = [
    { id: 1, title: 'Habitación céntrica en Madrid', price: 450 },
    { id: 2, title: 'Habitación tranquila en Valencia', price: 390 },
    { id: 3, title: 'Habitación cerca de la playa en Barcelona', price: 520 },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Habitaciones disponibles</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <strong>{room.title}</strong> — {room.price}€/mes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomsList;
