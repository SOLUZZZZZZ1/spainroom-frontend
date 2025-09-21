import CardSpainRoom from "./CardSpainRoom";

export default function CardSpainRoomDemo() {
  const demos = [
    { id: 1, title: "Habitación en Madrid", subtitle: "Salamanca", price: "400 €/mes", size: "12 m²" },
    { id: 2, title: "Habitación en Barcelona", subtitle: "Gràcia", price: "450 €/mes", size: "11 m²" },
    { id: 3, title: "Habitación en Valencia", subtitle: "Ruzafa", price: "380 €/mes", size: "13 m²" }
  ];
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {demos.map(d => (
        <CardSpainRoom key={d.id} title={d.title} subtitle={d.subtitle} footer={`Desde ${d.price} · ${d.size}`}>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>Cama 135x200</li>
            <li>Escritorio y armario</li>
            <li>Internet incluido</li>
          </ul>
        </CardSpainRoom>
      ))}
    </div>
  );
}
